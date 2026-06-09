#!/usr/bin/env bash
set -e

echo "🧹 停掉旧容器并重启（blog/compose）"
docker compose -f "$(dirname "$0")/docker-compose.yml" down -v || true
docker compose -f "$(dirname "$0")/docker-compose.yml" up --build -d

