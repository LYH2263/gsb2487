# 个人智能化博客系统 (Personal AI Blog System)

这是一个基于 Vue 3 和 Node.js 开发的现代化、智能化博客系统。系统集成了 GPT AI 助手，能够根据标题自动生成高质量的博文内容。

## 🌟 核心亮点

-   **智能创作**: 集成个性化 GPT AI，一键根据标题生成博文正文。
-   **现代美学**: 采用 Tailwind CSS 设计，具备毛玻璃特效、平滑过渡动画及响应式布局。
-   **交互体验**: 全系统杜绝原生弹窗，使用自研 `BaseModal` 与 `BaseToast` 提供高级感交互。
-   **全栈架构**: 前端 Vue 3 + Pinia，后端 Node.js + Express + Prisma (MySQL 8.0)。
-   **安全架构**: 敏感信息（数据库密码、API Key）通过环境变量严格隔离，支持 `.env` 配置。
-   **零配置启动**: 核心业务 100% 容器化，支持 `docker-compose` 一键部署，内置中文种子数据。

## 🚀 快速启动

1.  **环境要求**: 确保已安装 Docker 和 Docker Compose。
2.  **配置文件**: 配置文件 `.env` 已预设以下关键配置（必须确保 API 配置生效）：
    ```env
    # 数据库配置
    MYSQL_ROOT_PASSWORD=root
    
    # AI 配置 (GPT API)
    AI_BASE_URL=https://api.ywzxkj.com
    AI_API_KEY=sk-IdMtusB1laSIKy6RGqtzh8QRmW7EMlbXFif19rqpTTBjzWPF
    ```
3.  **启动命令**:
    在项目根目录下执行：
    ```bash
    sh run.sh
    ```
4.  **访问地址**:
    -   **前端页面**: [http://localhost:32487](http://localhost:32487)
    -   **管理后台**: [http://localhost:32487/admin](http://localhost:32487/admin)
    -   **后端监控**: [http://localhost:12487/health](http://localhost:12487/health)

## 🛠️ 技术栈

-   **前端**: Vue 3 (Composition API), Vite, Tailwind CSS, Pinia, Vue Router, Lucide Icons.
-   **后端**: Node.js, Express, Prisma ORM, Winston (日志系统).
-   **数据库**: MySQL 8.0 (强制 utf8mb4 字符集).
-   **部署**: Docker, Docker Compose.

## 🤖 AI 功能使用

1.  进入 **管理后台** -> **新增文章**。
2.  输入 **文章标题**。
3.  点击内容框上方的 “**AI 自动生成**” 按钮。
4.  AI 将根据标题创作内容并自动填充。

## 🔒 安全说明

项目已将敏感凭证抽离至辅助配置文件。请勿将生成的 `.env` 文件提交至公开仓库。在生产环境中，请修改 `MYSQL_ROOT_PASSWORD` 并使用您私有的 `AI_API_KEY`。

## 📄 自测报告
详细自测项请参阅根目录下的 `blog/自测报告.txt`。
