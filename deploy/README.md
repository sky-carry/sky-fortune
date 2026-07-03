# 部署（myserver）

工作流与其他项目一致：**本地改 → 推 GitHub → 服务器拉取重建**。

```bash
# 服务器（仓库在 /home/code/sky-fortune）
cd /home/code/sky-fortune
git pull
docker compose -f deploy/docker-compose.yml up -d --build
```

- 出海站 AURELO：容器 3502 → Caddy `/fortune/*`（basePath=/fortune）
- 境内站 天时历：容器 3501 → Caddy `/fortune-cn/*`（basePath=/fortune-cn）
- Caddy 配置在 sky-personal 仓库 `deploy/Caddyfile`，改动后同步 `/etc/caddy/Caddyfile` 并 `systemctl reload caddy`

## 密钥

**任何 key 都不入库。** AI 报告需要的 `ANTHROPIC_API_KEY` 放在服务器上的
`/home/code/sky-fortune/.env.deploy`（已被 .gitignore 忽略），compose 会自动注入
fortune-global 容器；没有该文件时 /reading 自动显示 coming soon，不影响其他功能。
