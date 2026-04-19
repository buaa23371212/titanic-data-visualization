# GitHub Pages 部署指南

## 部署概述
本项目完全适配 GitHub Pages 部署，采用静态网站架构，无需后端服务器支持。所有数据处理在构建时完成，最终生成纯静态文件。

## GitHub Pages 优势

### ✅ 完全适配的特性
- **静态文件部署** - 项目构建后生成纯 HTML/CSS/JS 文件
- **无需后端** - 所有数据处理在客户端完成
- **免费托管** - GitHub 提供免费静态网站托管
- **自动 HTTPS** - 自动启用 SSL 证书
- **CDN 加速** - 全球分布式内容分发

### 🔧 技术适配
- **Vite 构建优化** - 生成高度优化的静态资源
- **路由适配** - 支持单页应用 (SPA) 路由
- **资源路径优化** - 自动处理相对路径
- **缓存策略** - 合理的缓存配置

## 部署配置

### 1. 基础配置文件

#### package.json 构建脚本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### vite.config.ts 配置
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/titanic-data-visualization/', // GitHub Pages 仓库路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### 2. GitHub Pages 特定配置

#### .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run data preprocessing
      run: cd scripts && pip install -r requirements.txt && python data_preprocessing.py
      
    - name: Build project
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

#### 404.html (SPA 路由支持)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    sessionStorage.redirect = location.pathname;
  </script>
  <meta http-equiv="refresh" content="0;URL='/'">
</head>
<body></body>
</html>
```

## 部署流程

### 手动部署步骤
```bash
# 1. 安装依赖
npm install

# 2. 数据预处理
cd scripts
pip install -r requirements.txt
python data_preprocessing.py

# 3. 构建项目
npm run build

# 4. 部署到 GitHub Pages
npm run deploy
```

### 自动化部署流程
1. **代码推送到 main 分支**
2. **GitHub Actions 自动触发**
3. **安装依赖和预处理数据**
4. **构建生产版本**
5. **自动部署到 GitHub Pages**

## 项目结构优化

### 构建后文件结构
```
dist/
├── index.html              # 主页面
├── assets/
│   ├── index.[hash].js     # 主 JavaScript 文件
│   ├── index.[hash].css    # 样式文件
│   └── [其他资源文件]
└── data/
    ├── survivalData.json   # 处理后的数据
    └── summaryData.json    # 汇总数据
```

### 数据文件处理策略
- **构建时预处理**: 在 GitHub Actions 中运行 Python 脚本
- **JSON 格式输出**: 生成优化的 JSON 数据文件
- **按需加载**: 大型数据集分块加载

## 性能优化

### 构建优化
- **代码分割**: 按路由分割代码块
- **Tree Shaking**: 移除未使用代码
- **资源压缩**: CSS/JS/图片压缩
- **缓存策略**: 合理的文件哈希命名

### 运行时优化
- **懒加载**: 图表组件按需加载
- **虚拟化**: 大数据集虚拟滚动
- **缓存机制**: 本地数据缓存

## 访问地址

部署成功后，项目可通过以下地址访问：
- **主地址**: `https://[你的用户名].github.io/titanic-data-visualization/`
- **自定义域名** (可选): `https://titanic-dashboard.yourdomain.com`

## 故障排除

### 常见问题

#### 1. 页面空白
- 检查 base 路径配置
- 确认资源加载路径
- 查看浏览器控制台错误

#### 2. 路由失效
- 确保 404.html 配置正确
- 检查 SPA 路由配置
- 验证 History API 使用

#### 3. 数据加载失败
- 确认数据文件路径
- 检查 JSON 文件格式
- 验证 CORS 配置

### 调试工具
```javascript
// 部署环境检测
if (window.location.hostname.includes('github.io')) {
  console.log('运行在 GitHub Pages 环境');
}

// 路径调试
console.log('当前基础路径:', import.meta.env.BASE_URL);
```

## 最佳实践

### 1. 版本控制
- 使用语义化版本号
- 创建发布标签
- 维护 CHANGELOG.md

### 2. 监控分析
- 添加 Google Analytics
- 错误监控 (Sentry)
- 性能监控

### 3. 安全考虑
- 定期更新依赖
- 安全扫描
- HTTPS 强制

这个部署指南确保项目能够顺利部署到 GitHub Pages，并提供最佳的用户体验。