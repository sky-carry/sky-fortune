# 通用构建镜像：ARG APP 选择 cn / global，BASE_PATH 设置子路径前缀
FROM node:22-alpine AS builder
ARG APP
ARG BASE_PATH=""
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com \
    NODE_OPTIONS=--max-old-space-size=1536 \
    NEXT_TELEMETRY_DISABLED=1 \
    BASE_PATH=$BASE_PATH \
    NEXT_PUBLIC_BASE_PATH=$BASE_PATH
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com
RUN pnpm --filter @sky-fortune/${APP} build

FROM node:22-alpine AS runner
ARG APP
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000 NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=builder /repo/apps/${APP}/.next/standalone ./
COPY --from=builder /repo/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder /repo/apps/${APP}/public ./apps/${APP}/public
ENV APP_DIR=apps/${APP}
EXPOSE 3000
CMD node ${APP_DIR}/server.js
