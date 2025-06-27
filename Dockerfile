# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && \
    npm install --save-dev @types/node typescript

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 安装nginx
RUN apk add --no-cache nginx

# 从构建阶段复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./

# 只安装生产依赖
RUN npm ci --only=production

# 创建nginx配置目录
RUN mkdir -p /etc/nginx/conf.d

# 暴露端口
EXPOSE 3000 80

# 创建启动脚本
RUN echo '#!/bin/sh\n\
# 启动Next.js应用\n\
npm start &\n\
# 启动nginx\n\
nginx -g "daemon off;"' > /start.sh && \
chmod +x /start.sh

CMD ["/start.sh"] 