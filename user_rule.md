# 使用说明（blog）

- `docker-compose.yml` 已移动至 `blog/docker-compose.yml` 并更新构建上下文为 `./backend` 和 `./frontend`。
- 启动/重启容器：`./run.sh`
- 打包当前 blog 目录：`./package.sh`
- 后端默认端口映射：`12487 -> backend:8000`
- 前端默认端口映射：`32487 -> nginx:80`
- 数据库默认端口映射：`33306 -> mysql:3306`（root/root）

接口健康检查：
- 后端健康检查（容器内/宿主机皆可）：`GET http://localhost:12487/health`

Prisma:
- Prisma 7 采用 `prisma.config.ts` 管理 `datasource.url`，`schema.prisma` 中已移除 `url` 字段。
- 容器内安装了 `openssl` 以确保 Prisma 正确检测 libssl 版本并生成客户端。

登录与权限（管理后台）
- 管理后台入口：`/admin`，未登录会自动跳到 `/login`
- 默认账号密码：`admin / 123456`
- 登录接口：`POST /api/auth/login`，返回 `token`
- 前端已在请求头携带 `Authorization: Bearer <token>` 调用受保护接口
- 受保护接口：创建/更新/删除文章、创建分类
