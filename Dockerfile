# Stage 1: 安装依赖
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: 构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: 生产运行
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 只复制需要的文件
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
