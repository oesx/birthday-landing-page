#!/bin/bash

# 检查是否提供了 VPS 地址
if [ -z "$1" ]; then
    echo "错误：请提供 VPS 的 IP 地址或域名"
    echo "用法： ./deploy-from-git.sh your-vps-ip"
    exit 1
fi

VPS_HOST=$1
REPO_URL="https://github.com/oesx/birthday-landing-page.git"
APP_DIR="/root/birthday-landing"

echo "
在 VPS 上执行以下命令：

# 1. 安装 Docker 和 Docker Compose（如果尚未安装）
curl -fsSL https://get.docker.com | sh
curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 2. 克隆项目
git clone $REPO_URL $APP_DIR
cd $APP_DIR

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入正确的环境变量
nano .env.local

# 4. 构建和启动服务
docker-compose up -d --build

# 5. 查看服务状态
docker-compose ps

# 6. 查看应用日志
docker-compose logs -f app

# 其他有用的命令：
# 重启服务：docker-compose restart
# 停止服务：docker-compose down
# 查看 Nginx 日志：docker-compose logs nginx
# 更新代码：
#   git pull
#   docker-compose up -d --build
"
