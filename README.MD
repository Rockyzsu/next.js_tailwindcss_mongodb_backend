使用next.js 框架，mongodb数据库查询

部署：
 docker-compose.yml — 已配置：
  - 外部端口 8002 映射到容器 3000
  - MONGODB_URI 和 MONGODB_DB 直接写入 docker-compose.yml（使用你的外部 MongoDB）

  构建和启动命令：
  docker compose build
  docker compose up -d
