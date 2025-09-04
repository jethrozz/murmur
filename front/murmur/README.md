# Murmur 前端应用

基于 Next.js 和 Sui SDK 的匿名吐槽墙前端应用。

## 功能特性

- 🔗 **钱包连接**: 支持 Sui 钱包连接
- 🏘️ **圈子管理**: 查看已加入的圈子，搜索和创建新圈子
- 💬 **匿名吐槽**: 在圈子中发布和查看吐槽
- 🎫 **NFT 权限**: 通过 NFT 门票控制圈子访问权限
- 📱 **响应式设计**: 支持桌面端和移动端

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **区块链**: Sui SDK (@mysten/sui, @mysten/dapp-kit)
- **图标**: Lucide React
- **状态管理**: React Hooks

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── circles/           # 圈子相关页面
│   │   ├── page.tsx      # 圈子列表页面
│   │   └── [id]/         # 圈子详情页面
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   │   ├── Layout.tsx    # 主布局
│   │   └── Navbar.tsx    # 导航栏
│   ├── providers/        # 上下文提供者
│   │   └── WalletProvider.tsx  # 钱包提供者
│   └── ui/               # UI 组件
│       ├── Button.tsx    # 按钮组件
│       ├── Card.tsx      # 卡片组件
│       ├── Input.tsx     # 输入框组件
│       ├── Modal.tsx     # 模态框组件
│       └── Textarea.tsx  # 文本域组件
└── services/             # 服务层
    └── api.ts           # API 服务（模拟数据）
```

## 安装和运行

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
npm start
```

## 主要功能说明

### 1. 钱包连接

- 使用 Sui 官方钱包连接
- 支持自动连接和手动连接
- 显示钱包地址和断开连接功能

### 2. 圈子管理

#### 我的圈子页面 (`/circles`)
- 显示用户已加入的圈子
- 随机进入功能（搜索框）
- 点击圈子弹出确认对话框

#### 圈子详情页面 (`/circles/[id]`)
- 显示圈子信息和统计
- 发布吐槽功能
- 查看吐槽列表
- 点赞/点踩功能

### 3. 搜索和创建

- 搜索现有圈子
- 如果没有找到匹配的圈子，提供创建选项
- 后端自动匹配和创建逻辑

## API 接口设计

项目使用模拟数据，但预留了完整的 API 接口设计：

### 圈子相关接口

```typescript
// 获取用户已加入的圈子
GET /api/user/circles

// 搜索圈子
GET /api/circles/search?name={keyword}

// 创建圈子
POST /api/circles
{
  "name": "圈子名称",
  "description": "圈子描述"
}

// 获取圈子详情
GET /api/circles/{id}

// 获取圈子吐槽列表
GET /api/circles/{id}/murmurs?limit=20&offset=0
```

### 吐槽相关接口

```typescript
// 发布吐槽
POST /api/circles/{id}/murmurs
{
  "content": "吐槽内容"
}

// 点赞/点踩
POST /api/murmurs/{id}/like
POST /api/murmurs/{id}/dislike
```

## 智能合约集成

项目设计为与 Sui 智能合约集成：

### 主要合约功能

1. **圈子创建**: `create_circle()`
2. **门票发放**: `grant_circle_ticket()`
3. **发布吐槽**: `publish_murmur()`
4. **权限验证**: `has_circle_access()`

### 合约地址配置

在 `src/services/api.ts` 中配置合约地址：

```typescript
const CONTRACT_ADDRESS = '0x...'; // 部署后的合约地址
const PACKAGE_ID = '0x...';       // 合约包 ID
```

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量（如需要）
3. 自动部署

### 其他平台

```bash
npm run build
npm start
```

## 开发说明

### 添加新功能

1. 在 `src/services/api.ts` 中添加新的 API 方法
2. 创建相应的 React 组件
3. 更新页面路由

### 样式定制

项目使用 Tailwind CSS，可以通过修改 `tailwind.config.js` 进行定制。

### 钱包集成

如需支持更多钱包，可以在 `src/components/providers/WalletProvider.tsx` 中配置。

## 注意事项

1. 当前使用模拟数据，实际部署时需要连接真实的后端 API
2. 智能合约功能需要根据实际部署的合约地址进行配置
3. 钱包连接功能需要在实际的 Sui 网络环境中测试

## 许可证

MIT License