-- Murmur Indexer MySQL数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS murmur_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE murmur_db;

-- 创建用户（可选，如果不想使用root用户）
-- CREATE USER IF NOT EXISTS 'murmur_user'@'localhost' IDENTIFIED BY 'murmur_password';
-- GRANT ALL PRIVILEGES ON murmur_db.* TO 'murmur_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 创建圈子表
CREATE TABLE IF NOT EXISTS circles (
    id VARCHAR(255) PRIMARY KEY COMMENT '圈子ID',
    name VARCHAR(255) NOT NULL COMMENT '圈子名称',
    creator VARCHAR(255) NOT NULL COMMENT '创建者地址',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    block_height BIGINT NOT NULL COMMENT '区块高度',
    transaction_digest VARCHAR(255) NOT NULL COMMENT '交易摘要',
    INDEX idx_circles_name (name) COMMENT '名称索引',
    INDEX idx_circles_creator (creator) COMMENT '创建者索引',
    INDEX idx_circles_created_at (created_at) COMMENT '创建时间索引'
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='圈子信息表';

-- 显示表结构
DESCRIBE circles;

-- 显示索引信息
SHOW INDEX FROM circles;
