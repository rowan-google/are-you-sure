# Are you sure · 七情六欲决策助手

> 🧘 纯本地运行的 Telegram Mini App，以东方“七情六欲”哲学为镜，助你在做重要决定前观照内心、破除迷障、戒绝冲动。

---

## 🌟 核心理念与功能

人的决策动摇往往非理智不及，而是被情绪与感官欲望所遮蔽。当你面临关键抉择时（如冲动消费、情感摊牌、跳槽离职、跟风投资等），打开 **Are you sure**：

1. **七情逐问**：喜（过度乐观）、怒（赌气反击）、哀（消极补偿）、惧（FOMO焦虑）、爱（情面偏袒）、恶（偏见对立）、欲（投机贪婪）。
2. **六欲观照**：见欲（视觉外观/打折包装）、听欲（口头甜言/舆论洗脑）、香欲（空间香氛氛围）、味欲（口腹馋念/低血糖急躁）、触欲（贪图安逸/身体疲惫妥协）、意欲（脑补妄想/侥幸执念）。
3. **东方心境轮盘（Mandala Wheel）**：
   - 13 个卦象扇区环绕排列，7 种情绪与 6 种欲望分色标识。
   - 扰动等级越高，扇区向外延展生长并发出呼吸光晕；
   - 核心动态显示“心境澄澈度（0~100%）”与心境断语（心如明镜 / 微澜暗涌 / 迷障深重）。
4. **实用醒脑工具**：
   - **醒脑对策**：针对每个被点亮的维度提供精准心理学反制箴言与破局问题。
   - **1分钟正念深呼吸（Box Breathing）**：引导吸气、屏息、深呼，让前额叶皮层接管冲动的杏仁核。
   - **生成精美定心卡片**：一键导出高清 PNG 长图，方便在相册复盘或分享到 Telegram。
   - **24小时法则**：非紧急生命事项，延迟 24 小时验证初衷。
   - **100% 纯本地隐私安全**：无任何后端或数据收集，决策足迹完全保存在设备本地 `localStorage`。
5. **Telegram 原生体验**：
   - 接入 Telegram WebApp SDK，支持触觉震动反馈（Haptic Feedback）、沉浸式暗色主题自适应、Native 导航返回键等。

---

## 🚀 本地开发与预览

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. 生产打包构建
npm run build
```

打包产物位于 `dist/` 目录，所有静态资源路径均配置为相对路径（`base: './'`），可直接在任何静态服务器或本地预览。

---

## 📦 部署到 GitHub Pages

仓库已内置自动化 GitHub Actions 工作流（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）：

1. 将本代码推送到你的 GitHub 仓库（`main` 或 `master` 分支）。
2. 打开 GitHub 仓库页面，点击 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下的 **Source** 中，选择 **GitHub Actions**。
4. 推送后 GitHub Actions 将自动构建并发布，你将获得一个 HTTPS 地址：
   `https://<你的GitHub用户名>.github.io/<仓库名>/`

---

## 🤖 接入 Telegram Mini App

1. 打开 Telegram，搜索并进入官方机器人 **[@BotFather](https://t.me/BotFather)**。
2. 发送命令 `/newapp`。
3. 选择你的 Bot（如果没有 Bot，先发送 `/newbot` 创建一个）。
4. 按提示输入 Mini App 的标题（如 `Are you sure`）和描述。
5. 上传 Mini App 头像（640x640）和简介图。
6. 在提示输入 Web App URL 时，粘贴你刚刚获得的 **GitHub Pages HTTPS 链接**（例如 `https://username.github.io/are-you-sure/`）。
7. 为 Mini App 设置一个短别名（short name，如 `sure`）。
8. 完成！你将获得链接：`https://t.me/<你的Bot名>/<short_name>`，随时可在 Telegram 群聊、私聊或个人资料中一键呼出使用！

---

## 🛠️ 技术栈

- **框架**：React 19 + TypeScript + Vite
- **样式**：Tailwind CSS + 东方典雅字体配色
- **图表交互**：定制化原生 SVG 13 卦心境轮盘（Mandala / Rose Chart）
- **动效与反馈**：Canvas Confetti + Telegram WebApp Haptic Feedback
- **分享导出**：html-to-image 高清卡片渲染
- **存储**：LocalStorage 纯离线持久化
