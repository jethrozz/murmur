use sui_sdk::SuiClient;
use sui_types::base_types::{ObjectID, TransactionDigest};
use sui_types::event::Event;
use sui_types::event::EventEnvelope;
use sui_types::query::EventFilter;
use crate::database::{Database, Circle};
use anyhow::Result;
use tracing::{info, error, warn};
use std::sync::Arc;
use tokio::time::{sleep, Duration};

/// Sui事件索引器
pub struct Indexer {
    sui_client: SuiClient,
    database: Arc<Database>,
    package_id: ObjectID,
    last_processed_checkpoint: Option<u64>,
}

impl Indexer {
    /// 创建新的索引器实例
    pub async fn new(
        sui_rpc_url: &str,
        package_id: &str,
        database: Arc<Database>,
    ) -> Result<Self> {
        let sui_client = SuiClient::new(sui_rpc_url)?;
        let package_id = ObjectID::from_hex_literal(package_id)?;

        Ok(Indexer {
            sui_client,
            database,
            package_id,
            last_processed_checkpoint: None,
        })
    }

    /// 开始监听事件
    pub async fn start(&mut self) -> Result<()> {
        info!("开始启动murmur事件索引器...");

        loop {
            match self.process_events().await {
                Ok(_) => {
                    // 等待一段时间后继续处理
                    sleep(Duration::from_secs(5)).await;
                }
                Err(e) => {
                    error!("处理事件时出错: {}", e);
                    // 出错时等待更长时间再重试
                    sleep(Duration::from_secs(30)).await;
                }
            }
        }
    }

    /// 处理事件
    async fn process_events(&mut self) -> Result<()> {
        // 获取当前检查点
        let current_checkpoint = self.sui_client
            .read_api()
            .get_latest_checkpoint_sequence_number()
            .await?;

        // 确定要处理的检查点范围
        let start_checkpoint = self.last_processed_checkpoint
            .map(|last| last + 1)
            .unwrap_or(current_checkpoint.saturating_sub(100)); // 从最近100个检查点开始

        if start_checkpoint > current_checkpoint {
            return Ok(());
        }

        info!("处理检查点范围: {} - {}", start_checkpoint, current_checkpoint);

        // 获取事件
        let events = self.get_events(start_checkpoint, current_checkpoint).await?;

        for event in events {
            self.process_single_event(event).await?;
        }

        self.last_processed_checkpoint = Some(current_checkpoint);
        Ok(())
    }

    /// 获取指定范围内的事件
    async fn get_events(&self, start: u64, end: u64) -> Result<Vec<EventEnvelope>> {
        let mut all_events = Vec::new();

        for checkpoint in start..=end {
            let checkpoint_events = self.sui_client
                .read_api()
                .get_events(
                    EventFilter::Package(self.package_id),
                    Some(checkpoint),
                    Some(checkpoint),
                    1000, // 每页最多1000个事件
                )
                .await?;

            all_events.extend(checkpoint_events.data);
        }

        Ok(all_events)
    }

    /// 处理单个事件
    async fn process_single_event(&self, event_envelope: EventEnvelope) -> Result<()> {
        let event = &event_envelope.event;

        match event {
            Event::MoveEvent(move_event) => {
                // 检查是否是CircleCreatedEvent
                if self.is_circle_created_event(move_event) {
                    self.handle_circle_created_event(event_envelope).await?;
                }
            }
            _ => {
                // 忽略其他类型的事件
            }
        }

        Ok(())
    }

    /// 检查是否是CircleCreatedEvent
    fn is_circle_created_event(&self, move_event: &sui_types::event::MoveEvent) -> bool {
        // 检查事件类型是否匹配CircleCreatedEvent
        // 格式: package_id::module::struct_name
        let expected_type = format!("{}::murmur::CircleCreatedEvent", self.package_id);
        move_event.type_.to_string() == expected_type
    }

    /// 处理CircleCreatedEvent事件
    async fn handle_circle_created_event(&self, event_envelope: EventEnvelope) -> Result<()> {
        let move_event = match &event_envelope.event {
            Event::MoveEvent(me) => me,
            _ => return Ok(()),
        };

        // 解析事件数据
        let fields = &move_event.fields;
        
        // 从事件字段中提取数据
        let circle_id = fields.get("circle_id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("缺少circle_id字段"))?;

        let name = fields.get("name")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("缺少name字段"))?;

        let creator = fields.get("creator")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("缺少creator字段"))?;

        let created_at = fields.get("created_at")
            .and_then(|v| v.as_u64())
            .ok_or_else(|| anyhow::anyhow!("缺少created_at字段"))?;

        // 创建圈子记录
        let circle = Circle {
            id: circle_id.to_string(),
            name: name.to_string(),
            creator: creator.to_string(),
            created_at: chrono::DateTime::from_timestamp(created_at as i64, 0)
                .unwrap_or_else(|| chrono::Utc::now()),
            block_height: event_envelope.timestamp_ms / 1000, // 使用时间戳作为块高度
            transaction_digest: event_envelope.tx_digest.to_string(),
        };

        // 保存到数据库
        self.database.insert_circle(&circle).await?;

        info!(
            "成功索引圈子创建事件: id={}, name={}, creator={}",
            circle_id, name, creator
        );

        Ok(())
    }
}
