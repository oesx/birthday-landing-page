#!/bin/bash

# 压缩需要部署的文件
echo "Creating deployment archive..."
tar -czf deploy.tar.gz \
    .next \
    package.json \
    package-lock.json \
    public \
    .env.local \
    next.config.js \
    tailwind.config.ts \
    postcss.config.js \
    tsconfig.json

echo "Archive created: deploy.tar.gz"

# 提示用户如何在 VPS 上部署
echo "
部署步骤：

1. 使用 Termius 将 deploy.tar.gz 上传到 VPS
   scp deploy.tar.gz user@your-vps:/path/to/app

2. 在 VPS 上执行以下命令：
   # 进入应用目录
   cd /path/to/app
   
   # 解压文件
   tar -xzf deploy.tar.gz
   
   # 安装依赖
   npm install
   
   # 如果还没有安装 PM2，全局安装它
   npm install -g pm2
   
   # 使用 PM2 启动应用
   pm2 start npm --name \"birthday-landing\" -- start
   
   # 设置开机自启
   pm2 save
   pm2 startup

3. 访问你的网站
   http://your-vps-ip:3000
"
