#!/bin/bash

# 检查是否提供了 VPS 地址
if [ -z "$1" ]; then
    echo "错误：请提供 VPS 的 IP 地址或域名"
    echo "用法： ./deploy.sh your-vps-ip"
    exit 1
 fi

VPS_HOST=$1

# 构建 Docker 镜像
echo "正在构建 Docker 镜像..."
docker build -t birthday-landing .

# 保存镜像
echo "正在保存 Docker 镜像..."
docker save birthday-landing > birthday-landing.tar

# 压缩部署文件
echo "正在创建部署包..."
tar -czf deploy.tar.gz \
    birthday-landing.tar \
    .env.local \
    docker-compose.yml

# 清理临时文件
rm birthday-landing.tar

echo "部署包已创建： deploy.tar.gz"

echo "
部署步骤：

1. 将部署包上传到 VPS：
   scp deploy.tar.gz root@$VPS_HOST:/root/birthday-landing/

2. SSH 登录到 VPS 并执行以下命令：
   # 进入应用目录
   cd /root/birthday-landing
   
   # 解压文件
   tar -xzf deploy.tar.gz
   
   # 加载 Docker 镜像
   docker load < birthday-landing.tar
   
   # 停止并删除旧容器
   docker-compose down
   
   # 启动新容器
   docker-compose up -d

3. 访问你的网站：
   http://$VPS_HOST
"
