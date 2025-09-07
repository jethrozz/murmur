# 吐槽圈前端应用

这是一个基于 React + Vite + Radix UI + Sui 区块链的吐槽圈产品前端应用。

## 功能特性

- 🏠 **首页**: 浏览已加入的圈子，搜索和加入新圈子
- 💬 **圈子详情**: 查看圈子内的吐槽动态，发布新吐槽
- 👍 **互动功能**: 对吐槽和评论进行点赞/点踩
- 💭 **评论系统**: 对吐槽进行评论和回复
- 🔗 **钱包连接**: 支持 Sui 钱包连接

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Radix UI Themes
- **区块链**: Sui (使用 @mysten/dapp-kit)
- **状态管理**: React Query
- **样式**: CSS-in-JS (Radix UI)

## 项目结构

```
src/
├── components/          # React组件
│   ├── HomePage.tsx    # 首页组件
│   ├── CircleDetailPage.tsx  # 圈子详情页
│   ├── MurmurCard.tsx  # 吐槽卡片组件
│   └── CommentList.tsx # 评论列表组件
├── types/              # TypeScript类型定义
│   └── index.ts
├── data/               # 模拟数据
│   └── mockData.ts
├── services/           # API服务层
│   └── api.ts
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── networkConfig.ts   # 网络配置
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## API接口对接

项目已经预留了完整的API接口对接位置，位于 `src/services/api.ts` 文件中。当需要对接真实后端接口时，只需要：

1. 取消注释相关的 `request` 函数调用
2. 配置正确的 `API_BASE_URL`
3. 根据后端接口调整请求参数和响应处理

### 主要API接口

- `circleApi.getJoinedCircles()` - 获取已加入的圈子
- `circleApi.searchCircles()` - 搜索圈子
- `circleApi.joinCircle()` - 加入圈子
- `murmurApi.getMurmursByCircleId()` - 获取圈子吐槽列表
- `murmurApi.createMurmur()` - 发布吐槽
- `commentApi.createComment()` - 发布评论
- `reactionApi.setReaction()` - 点赞/点踩

## 环境变量

创建 `.env` 文件并配置：

```env
VITE_API_URL=http://localhost:8080/api
```

## 模拟数据

项目使用模拟数据进行开发，包含：
- 5个示例圈子
- 多个吐槽和评论
- 用户数据

模拟数据位于 `src/data/mockData.ts` 文件中，可以根据需要修改。

## 部署

项目构建后可以部署到任何静态文件服务器，如：
- Vercel
- Netlify
- GitHub Pages
- 自建服务器

## 注意事项

1. 确保钱包已连接到 Sui 网络
2. 当前使用模拟数据，生产环境需要对接真实API
3. 所有用户交互都会显示在控制台中，便于调试