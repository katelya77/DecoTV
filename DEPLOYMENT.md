# 🚀 DecoTV 部署指南

## 📋 环境要求

- Node.js 16+ 
- npm 或 yarn
- Docker (可选，用于容器化部署)

## 🔧 部署方式

### 方式一：传统部署

#### 1️⃣ 克隆项目
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
```

#### 2️⃣ 安装依赖
```bash
npm install
```

#### 3️⃣ 环境配置
复制并编辑环境变量文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要参数：
```env
# 服务端口
PORT=3000

# 密码保护 (可选)
PASSWORD=your_password_here

# API 配置
API_BASE_URL=your_api_url
```

#### 4️⃣ 启动服务

**开发模式** (热重载)：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

访问 `http://localhost:3000` 即可使用！

### 方式二：Docker 部署 🐳

#### 选项 A：从 GitHub Packages 拉取 (推荐)
```bash
# 直接运行预构建镜像
docker run -p 3000:3000 ghcr.io/katelya77/decotv:latest

# 后台运行
docker run -d -p 3000:3000 --name decotv-app ghcr.io/katelya77/decotv:latest
```

#### 选项 B：本地构建镜像
```bash
# 1️⃣ 克隆项目
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV

# 2️⃣ 构建镜像
npm run docker:build
# 或直接使用 Docker 命令
docker build -t decotv .

# 3️⃣ 运行容器
npm run docker:run
# 或直接使用 Docker 命令
docker run -p 3000:3000 decotv
```

#### 4️⃣ 环境变量配置
如需自定义配置，可通过环境变量传入：
```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e PASSWORD=your_password \
  decotv
```

### 方式三：Docker Compose 部署

创建 `docker-compose.override.yml` 文件：

**选项 A：使用预构建镜像**
```yaml
version: '3.8'
services:
  decotv:
    image: ghcr.io/katelya77/decotv:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - PASSWORD=your_password
    restart: unless-stopped
```

**选项 B：本地构建**
```yaml
version: '3.8'
services:
  decotv:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - PASSWORD=your_password
    restart: unless-stopped
```

启动服务：
```bash
docker-compose up -d
```

## 🌐 反向代理配置

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache 配置示例
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    ProxyPreserveHost On
</VirtualHost>
```

## 🔒 安全建议

1. **密码保护**: 设置 `PASSWORD` 环境变量启用访问密码
2. **HTTPS**: 生产环境建议配置 SSL 证书
3. **防火墙**: 仅开放必要端口
4. **定期更新**: 保持代码和依赖项最新

## 📊 性能优化

### 1️⃣ 启用 Gzip 压缩
项目已内置 gzip 中间件，自动压缩静态资源。

### 2️⃣ CDN 加速
可将静态资源托管到 CDN，修改相关路径。

### 3️⃣ 缓存配置
```nginx
# Nginx 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔍 故障排除

### 端口冲突
```bash
# 查看端口占用
netstat -tulpn | grep :3000

# 修改端口
export PORT=8080
npm start
```

### 权限问题
```bash
# Linux/Mac 权限修复
sudo chown -R $USER:$USER .
chmod +x scripts/*
```

### Docker 相关
```bash
# 查看容器日志
docker logs decotv-app

# 进入容器调试
docker exec -it decotv-app sh

# 清理无用镜像
docker system prune -a
```

## 📱 移动端适配

项目已完全适配移动端，支持：
- 响应式布局
- 触摸操作
- PWA 渐进式应用

## 🆙 更新升级

### 手动更新
```bash
git pull origin main
npm install
npm start
```

### Docker 更新
```bash
git pull origin main
docker build -t decotv .
docker stop decotv-app
docker rm decotv-app
docker run -d -p 3000:3000 --name decotv-app decotv
```

## 💬 技术支持

- **GitHub Issues**: [提交问题](https://github.com/katelya77/DecoTV/issues)
- **项目文档**: [查看 README](https://github.com/katelya77/DecoTV)
- **更新日志**: [Release Notes](https://github.com/katelya77/DecoTV/releases)

---

**快速开始**: `git clone https://github.com/katelya77/DecoTV.git && cd DecoTV && npm install && npm start`
