# 贡献指南

感谢您对 LibreTV 项目的关注！我们欢迎所有形式的贡献，包括但不限于代码提交、问题报告、功能建议、文档改进等。

## 🚀 快速开始

### 开发环境要求

- Node.js 16.0 或更高版本
- Git
- 支持 ES6 的现代浏览器

### 本地开发设置

1. **Fork 项目**
   ```bash
   # 通过 GitHub 网页 Fork 本项目到您的账户
   ```

2. **克隆仓库**
   ```bash
   git clone https://github.com/YOUR_USERNAME/LibreTV.git
   cd LibreTV
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境变量**
   ```bash
   cp .env.example .env
   # 根据需要修改 .env 文件中的配置
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   ```
   打开浏览器访问 http://localhost:8080
   ```

## 🤝 如何贡献

### 报告问题

如果您发现了 bug 或希望建议新功能：

1. 首先查看 [Issues](https://github.com/LibreSpark/LibreTV/issues) 确保问题尚未被报告
2. 创建新的 Issue，请包含：
   - 清晰的标题和描述
   - 重现步骤（如果是 bug）
   - 预期行为和实际行为
   - 环境信息（浏览器、操作系统等）
   - 截图或错误日志（如果适用）

### 提交代码

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

2. **进行开发**
   - 保持代码风格一致
   - 添加必要的注释
   - 确保功能正常工作

3. **测试更改**
   ```bash
   # 确保应用正常启动
   npm run dev
   
   # 测试各项功能
   # - 视频搜索
   # - 视频播放
   # - 响应式设计
   # - 各种部署方式
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "类型: 简洁的提交信息"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 填写详细的 PR 描述
   - 等待代码审查

### 提交信息格式

请使用以下格式提交代码：

```
类型: 简洁的描述

详细描述（可选）

相关 Issue: #123
```

**提交类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**
```
feat: 添加自定义播放器控制栏

- 增加播放速度调节功能
- 优化进度条拖拽体验
- 添加音量记忆功能

相关 Issue: #45
```

## 📋 代码规范

### JavaScript 规范

- 使用 ES6+ 语法
- 优先使用 `const`，需要重新赋值时使用 `let`
- 使用有意义的变量和函数名
- 函数名使用驼峰命名
- 常量使用大写字母和下划线

```javascript
// ✅ 推荐
const API_BASE_URL = 'https://api.example.com';
const searchVideos = async (keyword) => {
    // 函数实现
};

// ❌ 不推荐
var url = 'https://api.example.com';
function search(k) {
    // 函数实现
}
```

### CSS 规范

- 使用 BEM 命名方式或语义化类名
- 优先使用 CSS 变量
- 移动端优先的响应式设计
- 避免使用 `!important`

```css
/* ✅ 推荐 */
.video-player {
    --primary-color: #00ccff;
    background-color: var(--primary-color);
}

.video-player__controls {
    display: flex;
    gap: 1rem;
}

/* ❌ 不推荐 */
.player {
    background-color: #00ccff !important;
}
```

### HTML 规范

- 使用语义化标签
- 确保可访问性（添加适当的 aria 属性）
- 保持良好的缩进格式

```html
<!-- ✅ 推荐 -->
<main class="video-search">
    <section class="search-form" role="search">
        <input type="search" aria-label="搜索视频" placeholder="输入关键词">
        <button type="submit" aria-label="搜索">搜索</button>
    </section>
</main>

<!-- ❌ 不推荐 -->
<div class="search">
    <input type="text" placeholder="搜索">
    <div onclick="search()">搜索</div>
</div>
```

## 🎯 贡献重点领域

我们特别欢迎以下方面的贡献：

### 核心功能
- **搜索优化**: 改进搜索算法和用户体验
- **播放器增强**: 新的播放器功能和控制选项
- **API 集成**: 添加新的视频源 API 支持
- **性能优化**: 加载速度和播放性能改进

### 用户体验
- **界面设计**: UI/UX 改进和现代化
- **响应式设计**: 移动端体验优化
- **无障碍功能**: 提高可访问性
- **国际化**: 多语言支持

### 技术架构
- **代码重构**: 提高代码质量和可维护性
- **安全性**: 安全漏洞修复和防护
- **部署优化**: 改进各平台部署流程
- **监控日志**: 添加错误监控和日志系统

### 文档和社区
- **文档完善**: API 文档、部署指南等
- **示例项目**: 集成示例和最佳实践
- **社区建设**: 问题回答和新手指导

## 🔍 代码审查流程

1. **自动检查**: PR 会触发自动化测试
2. **代码审查**: 维护者会审查代码质量和功能
3. **反馈修改**: 根据审查意见修改代码
4. **合并**: 审查通过后合并到主分支

### 审查标准

- **功能完整**: 功能按预期工作
- **代码质量**: 遵循项目编码规范
- **性能影响**: 不显著影响应用性能
- **兼容性**: 与现有功能兼容
- **文档更新**: 必要时更新相关文档

## 🚫 注意事项

### 不接受的贡献

- **侵权内容**: 包含版权争议的代码或资源
- **恶意代码**: 包含病毒、后门或其他恶意功能
- **商业推广**: 纯粹的商业宣传或广告
- **不相关功能**: 与项目核心功能无关的特性

### 法律要求

- 确保您的贡献不侵犯他人版权
- 提交的代码必须是您原创或有合法使用权
- 同意以项目相同的 MIT 许可证分发您的贡献

## 📞 联系方式

如果您有任何问题或需要帮助：

- **GitHub Issues**: [报告问题或建议](https://github.com/LibreSpark/LibreTV/issues)
- **GitHub Discussions**: [参与社区讨论](https://github.com/LibreSpark/LibreTV/discussions)
- **Email**: 通过 GitHub 联系项目维护者

## 🙏 致谢

感谢所有为 LibreTV 项目做出贡献的开发者！您的每一份贡献都让这个项目变得更好。

### 贡献者列表

我们会在项目 README 中展示所有贡献者。您的贡献被合并后，您的 GitHub 头像将出现在贡献者列表中。

---

**再次感谢您的贡献！** 🎉

让我们一起构建一个更好的 LibreTV！
