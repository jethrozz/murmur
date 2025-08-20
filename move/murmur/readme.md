# Murmur - 基于Sui链的匿名吐槽墙

## 项目简介

Murmur是一个基于Sui区块链的匿名吐槽墙项目，主要玩法是通过用户搜索查询为其分配合适的吐槽圈子或者自动创建一个吐槽圈子。所有的吐槽圈子和用户吐槽都存储在区块链上，确保数据的透明性和不可篡改性。

## 主要功能

### 1. 权限控制系统
- **超管权限**: 合约发布者拥有超管cap，可以创建圈子和发放访问门票
- **门票访问控制**: 用户必须持有对应的圈子访问门票才能进入圈子和发布吐槽
- **智能权限分配**: Web2服务根据用户搜索查询智能分配圈子访问权限

### 2. 吐槽圈子管理
- **创建吐槽圈子**: 超管可以创建新的吐槽圈子，设置名称
- **圈子状态管理**: 支持激活/停用圈子 (待支持为链上投票)
- **名称匹配**: 根据圈子名称和描述进行智能匹配

### 3. 匿名吐槽发布
- **权限验证**: 发布吐槽前验证用户是否持有对应的访问门票
- **内容验证**: 自动验证吐槽内容的长度和有效性
- **点赞点踩**: 支持对吐槽进行点赞和点踩操作

### 4. Web2服务集成
- **搜索功能**: 由Web2服务实现，支持基于名称和描述的模糊匹配搜索
- **智能分配**: 根据用户查询自动分配合适的圈子或创建新圈子
- **事件监听**: 通过区块链事件实时同步数据状态

## 技术架构

### 区块链层 (Sui)
- **数据存储**: 圈子、吐槽、门票等核心数据
- **权限控制**: 通过capability和门票实现访问控制
- **事件系统**: 为Web2服务提供数据同步接口

### Web2服务层
- **搜索引擎**: 实现基于名称和描述的模糊匹配搜索
- **智能分配**: 根据用户需求自动分配或创建圈子
- **数据索引**: 维护用户、圈子的索引关系

### 前端应用层
- **用户界面**: 搜索、浏览、发布吐槽的交互界面
- **钱包集成**: 连接Sui钱包，管理门票和权限
- **实时更新**: 通过Web2服务获取最新数据

## 数据结构

### AdminCap (超管权限)
```move
public struct AdminCap has key, store {
    id: object::UID,
    admin: address,
}
```

### MurmurCircle (吐槽圈子)
```move
public struct MurmurCircle has key, store {
    id: object::UID,
    name: string::String,                    // 圈子名称
    description: string::String,             // 圈子描述
    keywords: vector<string::String>,        // 关联关键词
    created_at: u64,                        // 创建时间
    creator: address,                        // 创建者地址
    murmur_count: u64,                      // 吐槽数量
    is_active: bool,                         // 是否活跃
    total_members: u64,                     // 总成员数
}
```

### Murmur (用户吐槽)
```move
public struct Murmur has key, store {
    id: object::UID,
    circle_id: address,                      // 所属圈子ID
    content: string::String,                 // 吐槽内容
    created_at: u64,                        // 发布时间
    author: address,                         // 发布者地址（匿名）
    likes: u64,                             // 点赞数
    dislikes: u64,                          // 点踩数
}
```

### MurmurCircleTicket (圈子访问门票)
```move
public struct MurmurCircleTicket has key, store {
    id: object::UID,
    circle_id: address,                     // 对应的圈子ID
    owner: address,                         // 门票持有者
    issued_at: u64,                        // 发放时间
    expires_at: Option<u64>,                // 过期时间（可选）
}
```

## 核心功能

### 创建圈子（需要超管权限）
```move
public fun create_circle(
    admin_cap: &mut AdminCap,
    name: vector<u8>,
    description: vector<u8>,
    keywords: vector<vector<u8>>,
    ctx: &mut tx_context::TxContext
): address
```

### 发放圈子访问门票
```move
public fun grant_circle_ticket(
    admin_cap: &mut AdminCap,
    circle_id: address,
    user: address,
    expires_at: Option<u64>,
    ctx: &mut tx_context::TxContext
): address
```

### 发布吐槽（需要访问门票）
```move
public fun publish_murmur(
    circle_id: address,
    content: vector<u8>,
    access_ticket: &MurmurCircleTicket,
    ctx: &mut tx_context::TxContext
): address
```

### 智能圈子分配
```move
public fun smart_circle_assignment(
    admin_cap: &mut AdminCap,
    user_query: vector<u8>,
    user: address,
    ctx: &mut tx_context::TxContext
): (address, address)
```

## Web2服务集成

### 事件监听
Web2服务需要监听以下区块链事件来保持数据同步：

#### CircleCreatedEvent
```move
public struct CircleCreatedEvent has copy, drop {
    circle_id: address,
    name: string::String,
    creator: address,
    created_at: u64,
    keywords: vector<string::String>,
}
```

#### CircleTicketGrantedEvent
```move
public struct CircleTicketGrantedEvent has copy, drop {
    ticket_id: address,
    circle_id: address,
    user: address,
    issued_at: u64,
}
```

#### MurmurPublishedEvent
```move
public struct MurmurPublishedEvent has copy, drop {
    murmur_id: address,
    circle_id: address,
    author: address,
    created_at: u64,
    content: string::String,
}
```

### 搜索和分配流程
1. **用户搜索**: 用户在前端输入搜索查询
2. **Web2搜索**: Web2服务根据圈子名称和描述进行模糊匹配搜索
3. **智能分配**: 
   - 如果找到匹配圈子，调用`grant_circle_ticket`发放门票
   - 如果没有找到，调用`create_circle`创建新圈子，然后发放门票
4. **权限验证**: 用户使用门票访问圈子和发布吐槽

## 安装和部署

### 环境要求
- Sui CLI (最新版本)
- Move 2024.beta 编译器
- Web2服务 (Node.js/Python/Go等)

### 构建项目
```bash
# 克隆项目
git clone <repository-url>
cd murmur

# 构建合约
sui move build

# 运行测试
sui move test
```

### 部署到测试网
```bash
# 部署到Sui测试网
sui client publish --gas-budget 10000000
```

### 部署到主网
```bash
# 部署到Sui主网
sui client publish --gas-budget 10000000 --network mainnet
```

## 使用方法

### 1. 初始化超管权限
合约部署后，部署者自动获得`AdminCap`，用于管理整个系统。

### 2. 创建吐槽圈子
```typescript
// 使用Sui SDK调用合约
const txb = new TransactionBlock();
txb.moveCall({
    target: `${packageId}::murmur::create_circle`,
    arguments: [
        txb.object(adminCapId),           // 超管cap
        txb.pure("我的圈子"),
        txb.pure("这是一个有趣的圈子")
    ]
});
```

### 3. 发放访问权限
```typescript
const txb = new TransactionBlock();
txb.moveCall({
            target: `${packageId}::murmur::grant_circle_ticket`,
    arguments: [
        txb.object(adminCapId),           // 超管cap
        txb.pure(circleId),               // 圈子ID
        txb.pure(userAddress),            // 用户地址
        txb.pure(null)                    // 无过期时间
    ]
});
```

### 4. 发布吐槽
```typescript
const txb = new TransactionBlock();
txb.moveCall({
    target: `${packageId}::murmur::publish_murmur`,
    arguments: [
        txb.pure(circleId),               // 圈子ID
        txb.pure("这是一条吐槽内容"),
        txb.object(accessTicketId)        // 访问门票
    ]
});
```

## 安全特性

1. **权限控制**: 只有超管可以创建圈子和发放NFT
2. **NFT验证**: 用户必须持有有效的访问NFT才能使用圈子功能
3. **输入验证**: 所有用户输入都经过严格验证
4. **内容限制**: 吐槽内容长度限制在1000字符以内
5. **不可篡改**: 所有数据存储在区块链上，确保透明性

## 扩展功能

### 计划中的功能
- 支持seal加密圈子内的吐槽
- 支持图片，音频，视频等内容
- 用户声誉系统
- 高级名称匹配算法

## 贡献指南

欢迎贡献代码和想法！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件


## 更新日志

### v1.0.0 (当前版本)
- 门票权限控制系统
- 超管capability管理
- Web2服务集成接口
- 完整的事件系统
- 基于名称的智能圈子分配框架
- 基础吐槽圈子功能
- 匿名吐槽发布
- 名称搜索系统
- 点赞点踩功能

---

**注意**: 这是一个实验性项目，在生产环境中使用前请充分测试。Web2服务需要单独开发和部署。
