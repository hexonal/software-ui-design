# 构建与部署指南

## 概述

本项目是一个基于 Next.js 的分布式融合数据库与存储管理系统前端应用。构建后将生成静态文件到 `dist` 目录，可直接部署到任何静态文件服务器。

## 构建脚本

### 可用的构建命令

```bash
# 标准构建（推荐）
npm run build

# 简单构建（使用 shell 命令）
npm run build:simple

# 清理构建（清理所有缓存后重新构建）
npm run build:clean

# 部署准备（检查并准备部署）
npm run deploy
```

### 构建输出

- **输出目录**: `dist/`
- **文件类型**: 静态 HTML、CSS、JavaScript 文件
- **支持**: SPA 单页应用路由

### 构建流程

1. 清理旧的构建文件（`dist`, `out` 目录）
2. 执行 Next.js 静态导出构建
3. 将 `out` 目录重命名为 `dist`
4. 输出构建统计信息

## 部署方式

### 1. 静态文件服务器部署

```bash
# 构建项目
npm run build

# 将 dist 目录上传到服务器
scp -r dist/ user@server:/var/www/html/
```

### 2. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html/dist;
    index index.html;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. 容器化部署

使用项目根目录的 `Dockerfile`:

```bash
# 构建镜像
docker build -t fusion-db-ui .

# 运行容器
docker run -p 3000:3000 fusion-db-ui
```

## 项目结构

```
dist/
├── _next/              # Next.js 静态资源
│   ├── static/         # CSS、JS 文件
│   └── ...
├── dashboard/          # 仪表盘页面
├── index.html          # 首页
├── login.html          # 登录页
├── 404.html           # 404 错误页
└── ...                # 其他静态资源
```

## 环境配置

### 生产环境变量

在 `.env.production` 文件中配置：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=分布式融合数据库管理系统
```

### 构建时配置

在 `next.config.mjs` 中的关键配置：

```javascript
const nextConfig = {
  output: 'export',        // 启用静态导出
  images: {
    unoptimized: true,     // 禁用图片优化（静态导出需要）
  },
}
```

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存重试
   npm run build:clean
   ```

2. **页面路由 404**
   - 确保服务器配置了 SPA 路由回退
   - 检查 `try_files` 配置

3. **静态资源加载失败**
   - 检查服务器路径配置
   - 确认 `_next` 目录权限

### 调试模式

```bash
# 开发模式（热重载）
npm run dev

# 本地预览构建结果
npx serve dist
```

## 性能优化

- 启用了 Gzip 压缩
- 静态资源缓存策略
- 代码分割和懒加载
- 图片优化（开发时）

## 技术栈

- **框架**: Next.js 15.2.4
- **UI 库**: Radix UI + Tailwind CSS
- **图表**: Recharts
- **构建**: 静态导出模式 