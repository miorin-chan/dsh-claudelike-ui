# dsh-claudelike-ui

[English](README.md)

为 **DeepSeek Harness (DSH)** 提供的非破坏性 claude.ai 风格视觉皮肤。
不改变 DSH 的布局与交互行为，仅替换视觉层：

- 浅色羊皮纸与深色炭黑表面色板及适配对比度的陶土色强调
- 插件管理页中的陶土橙配色 DeepSeek 鲸鱼图标
- 界面使用 Figtree、展示标题使用 Source Serif 4、代码使用 JetBrains Mono
- 柔和圆角、代码块、气泡、菜单、滚动条与 diff 配色

## 安装

### 从 DSH 插件页安装本地源码

1. 克隆本仓库并在目录内运行 `pnpm install --frozen-lockfile` 构建 Host 与 Client 入口。
2. 在 DSH 中打开 **插件** > **添加插件**，选择该仓库目录。
3. 启用 **Claude 风格 / Claude-like UI**，按提示重启或刷新页面。

### 从 GitHub 安装

```sh
dsh plugin --profile desktop add github:miorin-chan/dsh-claudelike-ui
```

## 开发与校验

源码使用 TypeScript（[Host 入口](src/host/index.ts)、[Client 入口](src/client/index.ts)）。
运行 `npm test` 构建并执行单元测试，运行 `npm run check` 校验类型、产物、DSH 类型版本与运行时契约。

[项目文档索引](docs/README.md) · [设计笔记](docs/DESIGN.md)
