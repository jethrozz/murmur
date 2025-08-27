use sqlx::{MySqlPool, Row};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use anyhow::Result;

/// 圈子数据库模型
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Circle {
    pub id: String,
    pub name: String,
    pub creator: String,
    pub created_at: DateTime<Utc>,
    pub block_height: u64,
    pub transaction_digest: String,
}

/// 数据库操作结构体
pub struct Database {
    pool: MySqlPool,
}

impl Database {
    /// 创建新的数据库实例
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = MySqlPool::connect(database_url).await?;
        
        // 创建表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS circles (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                creator VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL,
                block_height BIGINT NOT NULL,
                transaction_digest VARCHAR(255) NOT NULL,
                INDEX idx_circles_name (name),
                INDEX idx_circles_creator (creator)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            "#,
        )
        .execute(&pool)
        .await?;

        Ok(Database { pool })
    }

    /// 插入新的圈子记录
    pub async fn insert_circle(&self, circle: &Circle) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO circles (id, name, creator, created_at, block_height, transaction_digest)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                creator = VALUES(creator),
                created_at = VALUES(created_at),
                block_height = VALUES(block_height),
                transaction_digest = VALUES(transaction_digest)
            "#,
        )
        .bind(&circle.id)
        .bind(&circle.name)
        .bind(&circle.creator)
        .bind(circle.created_at)
        .bind(circle.block_height)
        .bind(&circle.transaction_digest)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    /// 根据名称搜索圈子
    pub async fn search_circles_by_name(&self, name: &str, limit: i64) -> Result<Vec<Circle>> {
        let rows = sqlx::query(
            r#"
            SELECT id, name, creator, created_at, block_height, transaction_digest
            FROM circles
            WHERE name LIKE ?
            ORDER BY created_at DESC
            LIMIT ?
            "#,
        )
        .bind(format!("%{}%", name))
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        let circles = rows
            .into_iter()
            .map(|row| Circle {
                id: row.get("id"),
                name: row.get("name"),
                creator: row.get("creator"),
                created_at: row.get("created_at"),
                block_height: row.get("block_height"),
                transaction_digest: row.get("transaction_digest"),
            })
            .collect();

        Ok(circles)
    }

    /// 获取所有圈子
    pub async fn get_all_circles(&self, limit: i64, offset: i64) -> Result<Vec<Circle>> {
        let rows = sqlx::query(
            r#"
            SELECT id, name, creator, created_at, block_height, transaction_digest
            FROM circles
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        let circles = rows
            .into_iter()
            .map(|row| Circle {
                id: row.get("id"),
                name: row.get("name"),
                creator: row.get("creator"),
                created_at: row.get("created_at"),
                block_height: row.get("block_height"),
                transaction_digest: row.get("transaction_digest"),
            })
            .collect();

        Ok(circles)
    }

    /// 根据ID获取圈子
    pub async fn get_circle_by_id(&self, id: &str) -> Result<Option<Circle>> {
        let row = sqlx::query(
            r#"
            SELECT id, name, creator, created_at, block_height, transaction_digest
            FROM circles
            WHERE id = ?
            "#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        if let Some(row) = row {
            Ok(Some(Circle {
                id: row.get("id"),
                name: row.get("name"),
                creator: row.get("creator"),
                created_at: row.get("created_at"),
                block_height: row.get("block_height"),
                transaction_digest: row.get("transaction_digest"),
            }))
        } else {
            Ok(None)
        }
    }

    /// 获取圈子总数
    pub async fn get_circles_count(&self) -> Result<i64> {
        let row = sqlx::query("SELECT COUNT(*) as count FROM circles")
            .fetch_one(&self.pool)
            .await?;
        
        Ok(row.get("count"))
    }
}
