## 🎉 DecoTV v0.2.0 - 界面优化重大更新

### 🔥 主要更新

#### 🎨 界面优化
- ✅ **修复按钮重叠问题** - 彻底解决右上角设置和主题切换按钮重叠
- 🔍 **搜索框扩展** - 宽度从 600px 提升至 900px，完整显示提示文字
- 🌓 **明亮模式完善** - 修复白色文字在明亮背景下看不清的问题

#### ⚡ 功能增强  
- 🔗 **版本号链接** - 点击版本号直接跳转 GitHub 仓库
- 🐳 **Docker 支持** - 完整的容器化部署方案
- 🗑️ **界面清理** - 移除不必要的捐赠链接

#### 🛠️ 技术改进
- 🏗️ **代码重构** - 清理 CSS 冲突，优化布局系统
- 📱 **响应式优化** - 改善移动端显示效果
- 🎯 **定位系统** - 使用 Flexbox 替代冲突的固定定位

### 🚀 部署方式

#### Docker 部署 (推荐)
```bash
# 使用预构建镜像 (最快)
docker run -p 3000:3000 ghcr.io/katelya77/decotv:v0.2.0

# 或使用最新版本
docker run -p 3000:3000 ghcr.io/katelya77/decotv:latest
```

#### 本地构建
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
npm run docker:build && npm run docker:run
```

#### 传统部署  
```bash
git clone https://github.com/katelya77/DecoTV.git
cd DecoTV
npm install && npm start
```

### 📋 详细文档
- 📖 [完整更新日志](./RELEASE_NOTES_v0.2.0.md)
- 🚀 [部署指南](./DEPLOYMENT.md)
- 📚 [项目文档](./README.md)

### 🐛 Bug 修复
- 右上角按钮重叠
- 搜索框文字显示不全  
- 明亮模式文字可见性
- CSS 定位冲突

**从 v0.1.0 升级**: 下载最新代码并清理浏览器缓存即可

---
**基于 LibreTV 二次创作 • 致敬原作者**
