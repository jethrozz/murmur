#!/bin/bash

# Murmur Indexer 启动脚本

echo "🚀 启动 Murmur Indexer..."

# 检查是否设置了必要的环境变量
if [ -z "$SUI_PACKAGE_ID" ]; then
    echo "❌ 错误: 请设置 SUI_PACKAGE_ID 环境变量"
    echo "例如: export SUI_PACKAGE_ID=\"0x你的合约包ID\""
    exit 1
fi

echo "✅ 环境变量检查通过"
echo "📦 合约包ID: $SUI_PACKAGE_ID"
echo "🌐 RPC URL: ${SUI_RPC_URL:-https://fullnode.mainnet.sui.io:443}"
echo "💾 数据库: ${DATABASE_URL:-mysql://root:password@localhost:3306/murmur_db}"
echo "🔧 服务器: ${SERVER_HOST:-0.0.0.0}:${SERVER_PORT:-3000}"

# 构建项目
echo "🔨 构建项目..."
cargo build --release

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 启动服务
echo "🎯 启动服务..."
cargo run --release
