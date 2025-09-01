FROM node:lts-alpine

LABEL maintainer="katelya77"
LABEL org.opencontainers.image.title="DecoTV"
LABEL org.opencontainers.image.description="DecoTV - 免费在线视频搜索与观看平台（基于LibreTV二创）"
LABEL org.opencontainers.image.url="https://github.com/katelya77/DecoTV"
LABEL org.opencontainers.image.source="https://github.com/katelya77/DecoTV"
LABEL org.opencontainers.image.version="0.2.0"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# 设置环境变量
ENV PORT=8080
ENV CORS_ORIGIN=*
ENV DEBUG=false
ENV REQUEST_TIMEOUT=5000
ENV MAX_RETRIES=2
ENV CACHE_MAX_AGE=1d
ENV PASSWORD=""

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制应用文件
COPY . .

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# 启动应用
CMD ["npm", "start"]
