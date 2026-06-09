#!/bin/bash

# blog 目录打包脚本 - 生成干净的代码包
# 用法: ./package.sh [输出文件名]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROJECT_DIR=$(basename "$(pwd)")
OUTPUT_NAME=${1:-"label-${PROJECT_DIR}.zip"}

echo "📦 开始打包 blog..."
echo "📁 项目目录: $PROJECT_DIR"
echo "💾 输出文件: $OUTPUT_NAME"
echo ""

TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/$PROJECT_DIR"

echo "📋 复制项目文件..."
mkdir -p "$PACKAGE_DIR"
rsync -a --progress \
  --exclude='.gitignore' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='build' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  --exclude='.cache' \
  --exclude='*.swp' \
  --exclude='*.swo' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='*.zip' \
  --exclude='.github' \
  . "$PACKAGE_DIR/"

echo ""
echo "🗜️  压缩文件..."
CURRENT_DIR=$(pwd)
cd "$TEMP_DIR" || { echo "❌ 无法进入临时目录"; rm -rf "$TEMP_DIR"; exit 1; }
zip -r -q "$CURRENT_DIR/$OUTPUT_NAME" "$PROJECT_DIR" || { echo "❌ 压缩失败"; rm -rf "$TEMP_DIR"; exit 1; }
cd "$CURRENT_DIR"
rm -rf "$TEMP_DIR"

SIZE=$(du -h "$OUTPUT_NAME" | cut -f1)
echo ""
echo "✅ 打包完成！"
echo "📦 文件: $OUTPUT_NAME"
echo "📊 大小: $SIZE"
echo ""
echo "💡 提示: unzip $OUTPUT_NAME"

