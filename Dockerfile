# 基础镜像
FROM node:18-alpine AS base
WORKDIR /app

# deps 阶段：安装所有依赖（包括 devDependencies）
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ gcc

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（不设置 NODE_ENV=production，以便安装 devDependencies）
RUN npm install --legacy-peer-deps --force && npm install -D tailwindcss autoprefixer postcss --legacy-peer-deps

# builder 阶段：构建应用
FROM base AS builder
WORKDIR /app

# 复制依赖和源代码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置构建环境变量
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN npm run build

# runner 阶段：生产环境
FROM base AS runner
WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非特权用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建结果和必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
