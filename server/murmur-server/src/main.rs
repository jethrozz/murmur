mod api;
mod config;
mod database;
mod indexer;

use anyhow::Result;
use std::sync::Arc;
use tokio::task;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;
use tracing::{info, error};

#[tokio::main]
async fn main() -> Result<()> {
    // 初始化日志
    tracing_subscriber::fmt::init();

    // 加载配置
    let config = config::Config::from_env()?;
    info!("配置加载完成: {:?}", config);

    // 初始化数据库
    let database = Arc::new(database::Database::new(&config.database.url).await?);
    info!("数据库初始化完成");

    // 启动索引器
    let mut indexer = indexer::Indexer::new(
        &config.sui.rpc_url,
        &config.sui.package_id,
        database.clone(),
    ).await?;

    // 在后台任务中运行索引器
    let indexer_task = task::spawn(async move {
        if let Err(e) = indexer.start().await {
            error!("索引器运行出错: {}", e);
        }
    });

    // 创建API路由
    let app = api::create_router(database)
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
        );

    // 启动HTTP服务器
    let server_addr = config.server_addr();
    info!("启动HTTP服务器，地址: {}", server_addr);

    let server_task = task::spawn(async move {
        let listener = tokio::net::TcpListener::bind(&server_addr).await?;
        axum::serve(listener, app).await?;
        Ok::<(), anyhow::Error>(())
    });

    // 等待任务完成
    tokio::select! {
        result = indexer_task => {
            error!("索引器任务结束: {:?}", result);
        }
        result = server_task => {
            if let Err(e) = result {
                error!("HTTP服务器任务结束: {}", e);
            }
        }
    }

    Ok(())
}
