# DecoTV - 免费在线视频搜索与观看平台（基于 LibreTV 二次创作）

<div align="center">
  <img src="image/logo.png" alt="DecoTV Logo" width="120">
  <br>
  <p><strong>🎬 自由观影 • 畅享精彩 • 无限可能 🎬</strong></p>
  <p>基于 <strong>LibreTV</strong> 二次创作 • 致敬原作者</p>
  
  ![GitHub release](https://img.shields.io/github/v/release/katelya77/DecoTV)
  ![GitHub stars](https://img.shields.io/github/stars/katelya77/DecoTV)
  ![GitHub forks](https://img.shields.io/github/forks/katelya77/DecoTV)
  ![Docker Pulls](https://img.shields.io/docker/pulls/katelya77/decotv)
</div>

## ✨ 项目特色

### 🎨 视觉升级
- **霓虹灯特效**：酷炫的霓虹光晕效果和渐变动画
- **玻璃磨砂设计**：现代化的玻璃质感界面
- **卡片化布局**：优雅的内容展示方式
- **响应式设计**：完美适配各种设备屏幕

### 🚀 功能增强
- **20+ 视频源**：整合多个优质视频接口
- **折叠式侧边栏**：便捷的历史记录和设置面板
- **智能搜索**：快速精准的内容查找
- **多部署方式**：支持 Docker、Vercel、Cloudflare Pages 等

## 📺 项目简介

DecoTV 是一个轻量级、免费的在线视频搜索与观看平台，提供来自多个视频源的内容搜索与播放服务。无需注册，即开即用，支持多种设备访问。项目结合了前端技术和后端代理功能，可部署在支持服务端功能的各类网站托管服务上。

本项目为对 LibreTV 的二次创作，向原作者致敬，并在 UI、品牌与交互体验上进行全面增强。

<details>
  <summary>🖼️ 点击查看项目截图</summary>
  <img src="https://github.com/user-attachments/assets/df485345-e83b-4564-adf7-0680be92d3c7" alt="项目截图" style="max-width:600px">
</details>

## 🚀 快速部署

### 🐳 Docker 部署 (推荐)
```bash
# 方式一：使用预构建镜像 (最快)
docker run -p 3000:3000 ghcr.io/katelya77/decotv:latest

# 方式二：本地构建
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
npm run docker:build && npm run docker:run
```

### ☁️ 云平台一键部署
选择以下任一平台，点击一键部署按钮，即可快速创建自己的 DecoTV 实例：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkatelya77%2FDecoTV)  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/katelya77/DecoTV)  
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/katelya77/DecoTV)

### 💻 本地部署
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
npm install
npm start
```

📋 **详细部署指南**: [查看 DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 密码保护设置

为了保护您的部署实例，**强烈建议**设置 `PASSWORD` 环境变量：

```bash
PASSWORD=your_secure_password_here
```

## 🚨 重要声明

- 本项目仅供学习和个人使用，为避免版权纠纷，必须设置PASSWORD环境变量
- 请勿将部署的实例用于商业用途或公开服务
- 如因公开分享导致的任何法律问题，用户需自行承担责任
- 项目开发者不对用户的使用行为承担任何法律责任

## 🔄 同步与升级

Pull Bot 会反复触发无效的 PR 和垃圾邮件，严重干扰项目维护。作者可能会直接拉黑所有 Pull Bot 自动发起的同步请求的仓库所有者。

**推荐做法：**

建议在 fork 的仓库中启用本仓库自带的 GitHub Actions 自动同步功能（见 `.github/workflows/sync.yml`）。 

如需手动同步主仓库更新，也可以使用 GitHub 官方的 [Sync fork](https://docs.github.com/cn/github/collaborating-with-issues-and-pull-requests/syncing-a-fork) 功能。

对于更新后可能会出现的错误和异常，在设置中备份配置后，首先清除页面Cookie，然后 Ctrl + F5 刷新页面。再次访问网页检查是否解决问题。


## 📋 详细部署指南

### 🐳 Docker 部署（推荐）

#### 方式1：Docker Compose（推荐）

1. 克隆仓库：
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
```

2. 复制环境变量文件：
```bash
cp .env.example .env
```

3. 编辑 `.env` 文件，设置您的密码：
```bash
PASSWORD=your_secure_password_here
```

4. 启动服务：
```bash
# 开发环境（本地构建）
docker-compose up -d

# 生产环境（使用预构建镜像）
docker-compose --profile prod up -d
```

5. 访问 `http://localhost:8080`

#### 方式2：直接运行 Docker 容器

```bash
# 使用本地构建
docker build -t decotv .
docker run -d \
  --name decotv \
  -p 8080:8080 \
  -e PASSWORD=your_secure_password_here \
  decotv

# 或使用预构建镜像
docker run -d \
  --name decotv \
  -p 8080:8080 \
  -e PASSWORD=your_secure_password_here \
  katelya77/decotv:latest
```

### ☁️ Cloudflare Pages

1. Fork 或克隆本仓库到您的 GitHub 账户
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 Pages 服务
3. 点击"创建项目"，连接您的 GitHub 仓库
4. 使用以下设置：
   - 构建命令：留空（无需构建）
   - 输出目录：留空（默认为根目录）
5. **⚠️ 重要：在"设置" > "环境变量"中添加 `PASSWORD` 变量（必须设置）**
6. 点击"保存并部署"

### ▲ Vercel

1. Fork 或克隆本仓库到您的 GitHub/GitLab 账户
2. 登录 [Vercel](https://vercel.com/)，点击"New Project"
3. 导入您的仓库，使用默认设置
4. **⚠️ 重要：在"Settings" > "Environment Variables"中添加 `PASSWORD` 变量（必须设置）**
5. 点击"Deploy"

### 🌐 Netlify

1. Fork 本仓库到您的 GitHub 账户
2. 登录 [Netlify](https://netlify.com)，点击"New site from Git"
3. 选择您的仓库，使用默认设置
4. **⚠️ 重要：在"Site settings" > "Environment variables"中添加 `PASSWORD` 变量**

### 🎯 Render

1. Fork 本仓库到您的 GitHub 账户  
2. 登录 [Render](https://render.com)，点击"New" > "Web Service"
3. 连接您的仓库，使用默认设置
4. **⚠️ 重要：在"Environment"部分添加 `PASSWORD` 变量**

## 🔧 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
```

2. 安装依赖：
```bash
npm install
```

3. 设置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，添加 PASSWORD=your_password
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 访问 `http://localhost:8080`

## 🔑 环境变量配置

在部署时，请确保设置以下环境变量：

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `PASSWORD` | ✅ | - | 访问密码（强烈建议设置） |
| `PORT` | ❌ | 8080 | 服务器端口 |
| `CORS_ORIGIN` | ❌ | * | CORS 允许源 |
| `DEBUG` | ❌ | false | 调试模式 |
## 📱 功能特色

### 🎨 视觉效果
- **霓虹灯特效**：动感十足的霓虹光晕和渐变效果
- **玻璃磨砂质感**：现代化的毛玻璃界面设计
- **流畅动画**：丝滑的过渡效果和交互反馈
- **响应式布局**：完美适配手机、平板、电脑

### 🔧 实用功能
- **智能搜索**：支持模糊搜索和快速筛选
- **观看历史**：自动记录观看记录，便于快速回看
- **多源整合**：整合20+优质视频资源接口
- **设置面板**：丰富的个性化配置选项

### 🛠️ 技术特点
- **无需注册**：开箱即用，保护用户隐私
- **轻量级**：精简代码，快速加载
- **多端支持**：跨平台部署，灵活便捷
- **开源免费**：MIT 协议，自由使用和修改

## 🔍 使用指南

1. **首次访问**：如设置了密码保护，请输入密码进行验证
2. **搜索内容**：在搜索框中输入想观看的影片名称
3. **选择资源**：点击搜索结果中的影片，选择播放源
4. **开始观看**：选择清晰度和播放线路，享受观影体验
5. **设置配置**：点击右上角设置按钮，自定义API源和功能选项

## 🔐 安全说明

- 项目强制要求设置 `PASSWORD` 环境变量以保护部署实例
- 建议使用强密码，避免简单易猜的密码组合
- 请勿在公共场所或社交媒体分享部署链接和密码
- 定期更换访问密码以确保安全性

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型
- 🐛 Bug 修复
- ✨ 新功能开发  
- 📝 文档改进
- 🎨 UI/UX 优化
- 🔧 代码重构
- 🌐 多语言支持

## 📞 联系方式

- **作者邮箱**：[katelya77@gmail.com](mailto:katelya77@gmail.com)
- **项目主页**：[GitHub Repository](https://github.com/katelya77/DecoTV)
- **问题反馈**：[Issues](https://github.com/katelya77/DecoTV/issues)
- **功能建议**：[Discussions](https://github.com/katelya77/DecoTV/discussions)

## ⭐ Star History

如果本项目对您有帮助，请给个 Star ⭐ 支持一下！

[![Star History Chart](https://api.star-history.com/svg?repos=katelya77/DecoTV&type=Date)](https://star-history.com/#katelya77/DecoTV&Date)

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 鸣谢

- 感谢 [LibreTV](https://github.com/LibreSpark/LibreTV) 原项目提供的基础框架
- 感谢所有为项目贡献代码和建议的开发者们
- 感谢开源社区提供的优秀工具和库

---

<div align="center">
  <p>⚡ 由 <strong>katelya77</strong> 用 ❤️ 制作</p>
  <p>🎬 <strong>DecoTV - 自由观影，畅享精彩</strong> 🎬</p>
</div>

```yaml
services:
  libretv:
    image: bestzwei/libretv:latest
    container_name: libretv
    ports:
      - "8899:8080" # 将内部 8080 端口映射到主机的 8899 端口
    environment:
      - PASSWORD=${PASSWORD:-111111} # 可将 111111 修改为你想要的密码，默认为 your_password
    restart: unless-stopped
```
启动 DecoTV：

```bash
docker compose up -d
```
访问 `http://localhost:8899` 即可使用。

### 本地开发环境

项目包含后端代理功能，需要支持服务器端功能的环境：

```bash
# 首先，通过复制示例来设置 .env 文件（可选）
cp .env.example .env

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:8080` 即可使用（端口可在.env文件中通过PORT变量修改）。

> ⚠️ 注意：使用简单静态服务器（如 `python -m http.server` 或 `npx http-server`）时，视频代理功能将不可用，视频无法正常播放。完整功能测试请使用 Node.js 开发服务器。

## 🔧 自定义配置

### 密码保护

**重要提示**: 为确保安全，所有部署都必须设置 PASSWORD 环境变量，否则用户将看到设置密码的提示。


### API兼容性

DecoTV 支持标准的苹果 CMS V10 API 格式（与上游兼容）。添加自定义 API 时需遵循以下格式：
- 搜索接口: `https://example.com/api.php/provide/vod/?ac=videolist&wd=关键词`
- 详情接口: `https://example.com/api.php/provide/vod/?ac=detail&ids=视频ID`

**添加 CMS 源**:
1. 在设置面板中选择"自定义接口"
2. 接口地址: `https://example.com/api.php/provide/vod`

## ⌨️ 键盘快捷键

播放器支持以下键盘快捷键：

- **空格键**: 播放/暂停
- **左右箭头**: 快退/快进
- **上下箭头**: 音量增加/减小
- **M 键**: 静音/取消静音
- **F 键**: 全屏/退出全屏
- **Esc 键**: 退出全屏

## 🛠️ 技术栈

- HTML5 + CSS3 + JavaScript (ES6+)
- Tailwind CSS
- HLS.js 用于 HLS 流处理
- DPlayer 视频播放器核心
- Cloudflare/Vercel/Netlify Serverless Functions
- 服务端 HLS 代理和处理技术
- localStorage 本地存储

## ⚠️ 免责声明

DecoTV 仅作为视频搜索工具，不存储、上传或分发任何视频内容。所有视频均来自第三方 API 接口提供的搜索结果。如有侵权内容，请联系相应的内容提供方。

本项目开发者不对使用本项目产生的任何后果负责。使用本项目时，您必须遵守当地的法律法规。

## 📝 致谢与说明

- 本项目基于 LibreTV 二次创作，原项目地址：`https://github.com/LibreSpark/LibreTV`
- 感谢原作者与贡献者的卓越工作，本项目对 UI/交互进行增强与美化，保留原有许可与贡献说明。

## 🤝 衍生项目

它们提供了更多丰富的自定义功能，欢迎体验~

- **[MoonTV](https://github.com/senshinya/MoonTV)**  
- **[OrionTV](https://github.com/zimplexing/OrionTV)**  

## 🥇 感谢支持

- **[Sharon](https://sharon.io)**
- **[ZMTO](https://zmto.com)**
- **[YXVM](https://yxvm.com)**  