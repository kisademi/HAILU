# 海露钟 — 校园护眼小程序

「海露钟」是一款清新极简蓝白风格的校园护眼打卡与番茄钟自习 Web 应用。

## 本地运行与构建

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run build    # 构建生产包到 dist/
npm run preview  # 本地预览构建后的 dist/
```

## GitHub Pages 部署说明（避免打开空白页）

本仓库已内置以下适配配置，确保部署到 `https://<用户名>.github.io/<仓库名>/` 后资源路径与图片正常加载：

1. `vite.config.ts` 已配置 `base: './'` 相对路径，不会因为子目录路径导致 JS/CSS 404 白屏。
2. 所有本地图片均通过 ES 模块导入（`src/data/campaignData.ts`），构建时会自动打包进 `dist/assets/`。
3. 仓库已包含 `.github/workflows/deploy.yml` 自动部署工作流。

### 在 GitHub 仓库中开启预览步骤
1. 将代码推送到 GitHub 仓库的 `main`（或 `master`）分支。
2. 打开仓库页面，进入 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**（不要直接选根目录静态分支，因为源码 `.tsx` 需要经过 `npm run build` 编译）。
4. 等待 Actions 运行完成后，点击生成的 GitHub Pages 链接即可正常访问。
