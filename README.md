# Birthday Landing Page

这是一个使用 Next.js 和 Clerk 认证的生日祝福网站。用户可以在这里留下生日祝福，分享音乐和照片，创造独特的生日祝福体验。

## 主要功能

- 💝 留言板：支持发送和查看生日祝福消息
- 🔐 用户认证：使用 Clerk 进行安全的用户认证
- 🎨 响应式设计：完美适配各种设备尺寸
- 🌈 动态背景：精美的相册墙背景效果

## 技术栈

- **前端框架**：Next.js 14
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **认证**：Clerk
- **容器化**：Docker
- **反向代理**：Nginx

## 部署方式

### 使用 Docker Compose 部署（推荐）

1. 在 VPS 上安装 Docker 和 Docker Compose：
```bash
curl -fsSL https://get.docker.com | sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

2. 克隆项目并进入目录：
```bash
git clone https://github.com/oesx/birthday-landing-page.git
cd birthday-landing-page
```

3. 配置环境变量：
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入正确的环境变量
nano .env.local
```

4. 启动服务：
```bash
docker-compose up -d --build
```

5. 查看服务状态：
```bash
docker-compose ps
docker-compose logs -f app
```

### 使用部署脚本

我们提供了一个部署脚本来简化部署过程：

```bash
./deploy-from-git.sh your-vps-ip
```

脚本会输出详细的部署步骤和命令。

## 环境要求

- Node.js 18+
- npm 或 yarn

## 开发设置

1. 克隆项目：
```bash
git clone <repository-url>
cd birthday-landing-react
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
```

3. 配置环境变量：
   - 复制 `.env.example` 到 `.env.local`
   - 在 [Clerk Dashboard](https://dashboard.clerk.dev/) 注册并创建应用
   - 将 Clerk 的 API 密钥填入 `.env.local`

4. 启动开发服务器：
```bash
npm run dev
```

## 部署到 VPS

1. 在 VPS 上安装 Node.js 和 npm

2. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd birthday-landing-react
npm install
```

3. 配置环境变量：
   - 复制 `.env.example` 到 `.env.local`
   - 从 Clerk Dashboard 获取生产环境的 API 密钥
   - 将密钥填入 `.env.local`

4. 构建应用：
```bash
npm run build
```

5. 启动生产服务器：
```bash
npm start
```

6. 使用 PM2 进行进程管理（推荐）：
```bash
npm install -g pm2
pm2 start npm --name "birthday-landing" -- start
```

## 安全注意事项

- 确保 `.env.local` 文件不会被提交到 Git 仓库
- 在生产环境中使用 HTTPS
- 定期更新依赖包以修复安全漏洞

## 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Clerk 文档](https://clerk.com/docs)
