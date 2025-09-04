# Murmur Indexer

这是一个用于监听murmur.move合约的CircleCreatedEvent事件并存储到本地数据库的索引器服务。

## 功能特性

- 🔍 监听Sui链上的CircleCreatedEvent事件
- 💾 将事件数据存储到SQLite数据库
- 🌐 提供RESTful API接口
- 🔎 支持按名称搜索圈子
- 📊 提供圈子列表和详情查询

## API接口

### 1. 按名称搜索圈子
```
GET /api/circles/search?name={圈子名称}&limit={限制数量}&offset={偏移量}
```

示例：
```bash
curl "http://localhost:3000/api/circles/search?name=测试&limit=10"
```

### 2. 获取所有圈子
```
GET /api/circles?limit={限制数量}&offset={偏移量}
```

示例：
```bash
curl "http://localhost:3000/api/circles?limit=20&offset=0"
```

### 3. 根据ID获取圈子详情
```
GET /api/circles/{圈子ID}
```

示例：
```bash
curl "http://localhost:3000/api/circles/0x123..."
```

### 4. 健康检查
```
GET /api/health
```

## 环境变量配置

在运行服务前，需要设置以下环境变量：

```bash
# Sui合约包ID（必须设置）
export SUI_PACKAGE_ID="0x你的合约包ID"

# Sui RPC URL（可选，默认为主网）
export SUI_RPC_URL="https://fullnode.mainnet.sui.io:443"

# 数据库URL（可选，默认为本地MySQL）
export DATABASE_URL="mysql://username:password@localhost:3306/murmur_db"

# 服务器配置（可选）
export SERVER_HOST="0.0.0.0"
export SERVER_PORT="3000"
```

## 运行服务

### 1. 安装依赖
```bash
cd server/murmur-server
cargo build
```

### 2. 设置环境变量
```bash
export SUI_PACKAGE_ID="0x你的murmur合约包ID"
```

### 3. 启动服务
```bash
cargo run
```

服务启动后，索引器将开始监听Sui链上的事件，HTTP服务器将在指定端口启动。

## 数据库结构

索引器使用MySQL数据库存储圈子信息，表结构如下：

```sql
CREATE TABLE circles (
    id VARCHAR(255) PRIMARY KEY,           -- 圈子ID
    name VARCHAR(255) NOT NULL,            -- 圈子名称
    creator VARCHAR(255) NOT NULL,         -- 创建者地址
    created_at DATETIME NOT NULL,          -- 创建时间
    block_height BIGINT NOT NULL,          -- 区块高度
    transaction_digest VARCHAR(255) NOT NULL, -- 交易摘要
    INDEX idx_circles_name (name),         -- 名称索引
    INDEX idx_circles_creator (creator)    -- 创建者索引
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 响应格式

所有API接口都返回统一的JSON格式：

```json
{
    "success": true,
    "data": {
        "circles": [...],
        "total": 100,
        "limit": 20,
        "offset": 0
    },
    "message": null
}
```

## 错误处理

- 如果请求失败，`success`字段为`false`
- 错误信息在`message`字段中
- HTTP状态码表示具体的错误类型

## 注意事项

1. 确保Sui合约包ID正确设置
2. 确保MySQL数据库已安装并运行，且数据库已创建
3. 索引器会从最近的100个检查点开始同步，首次运行可能需要一些时间
4. 数据库表会在首次运行时自动创建
5. 服务支持热重启，重启后会从上次处理的位置继续

## MySQL数据库设置

### 1. 安装MySQL
```bash
# Ubuntu/Debian
sudo apt-get install mysql-server

# macOS (使用Homebrew)
brew install mysql
brew services start mysql

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
```

### 2. 创建数据库和用户
```sql
-- 登录MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE murmur_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选）
CREATE USER 'murmur_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON murmur_db.* TO 'murmur_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 配置连接字符串
```bash
export DATABASE_URL="mysql://murmur_user:your_password@localhost:3306/murmur_db"
```
