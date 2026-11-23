# DSH Claude UI 皮肤插件设计

日期：2026-11-23
状态：待确认

## 1. 意图

让 DSH Desktop / Web 的界面在视觉上接近 claude.ai：暖米白纸面、深炭黑文字、珊瑚橙强调色、衬线展示字体、克制的圆角和阴影。

目标不是复制 Claude 的功能或布局，而是做一个**可随时启停、卸载后完全恢复原样**的视觉皮肤插件。

## 2. 目标与非目标

### 目标

- 浅色与深色两套主题都映射到 Claude 官方设计指南的色板。
- 用 DSH 官方 `ctx.theme.overrideTokens()` 扩展点覆盖语义 token，不修改 DSH 安装目录里的任何文件。
- 用少量全局 CSS 调整字体、圆角和少数关键元素（欢迎页标题、消息气泡、输入卡片），不做结构性布局改动。
- 通过插件管理器安装/启用；禁用或卸载后，DSH 恢复原主题。
- 提供插件管理器所需的标题、描述、图标和详情页。

### 非目标

- 不替换 DSH 的侧边栏、对话流、输入框等宿主组件，不新增页面。
- 不改变交互、快捷键、焦点行为、菜单层级和可访问性语义。
- 不打包或分发 Anthropic 的商用字体（Anthropic Sans / Anthropic Serif）。字体栈优先使用本机已安装字体，缺失时回退到系统字体。
- 不使用 Anthropic / Claude 的商标 Logo 或官方图标；图标为原创的暖色星芒/对话气泡。

## 3. 参考文档

- Claude 官方设计指南（色板、字体、圆角、阴影、间距）：
  https://claude.com/docs/connectors/building/mcp-apps/design-guidelines
- DSH 官方 Web UI 样式规范（token 所有权与组件规则）：
  https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/web-styling.md
- DSH 官方 UI 设计审查原则：
  https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/ui-design-review-cases.md

## 4. 插件形态

一个本地 bundle 包：`dsh-claudelike-ui`

```text
claude-ui/
  package.json          # dsh.bundle.patch + dsh.client
  cordis.patch.yml      # 插入 claude-ui 行
  index.js              # Host 半边，空实现
  client.js             # Client 半边：注册 token 覆盖 + 注入皮肤 CSS
  locale/en.json
  locale/zh.json
  docs/DETAIL.md
  icon.svg
```

### 为什么用 `overrideTokens` 而不是 `register`

`ctx.theme.register()` 注册的是单一 `colorScheme` 的独立主题，无法随 DSH 的 `light / dark / system` 偏好自动切换。`ctx.theme.overrideTokens(source, tokens)` 接受 `{ light, dark }` 成对值，叠加在内置主题之上，用户切换明暗或系统主题时自动取对应值，最适合做“皮肤层”。

### 客户端生命周期

```js
// 伪代码
apply(ctx) {
  // token 层：自动随 light/dark 切换
  ctx.effect(() => ctx.theme.overrideTokens('dsh-claudelike-ui', TOKENS))

  // 样式层：仅字体/圆角/少量元素 polish
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.claudeUi = ''
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  })
}
```

`client.js` 声明 `inject: ['theme']`，在主题服务可用后激活。

## 5. 颜色 token 映射

以下所有值均为 `{ light, dark }` 成对。完整实现以此表为准，未列出的状态色保持 DSH 默认，避免误伤。

### 5.1 背景与纸面

| DSH token | Light | Dark | 用途 |
|---|---|---|---|
| `--dsw-alias-bg-base` | `#FAF9F5` | `#262624` | 主画布 |
| `--dsw-alias-bg-layer-1` | `#FFFFFF` | `#30302E` | 一级浮层 |
| `--dsw-alias-bg-layer-2` | `#F5F4ED` | `#3A3A37` | 二级表面 |
| `--dsw-alias-bg-layer-3` | `#FFFFFF` | `#3F3F3B` | 三级表面 |
| `--dsw-alias-bg-overlay` | `#FFFFFF` | `#30302E` | 弹层 |
| `--dsw-alias-bg-module-platform` | `#F0EEE6` | `#30302E` | 平台模块底色 |
| `--dsw-alias-bg-multi-select` | `#F0EEE6` | `#30302E` | 多选区域 |
| `--dsw-alias-bg-document-preview` | `#F0EEE6` | `#1F1E1D` | 文档预览底 |
| `--dsw-alias-bg-skeleton` | `rgba(20,20,19,0.05)` | `rgba(250,249,245,0.08)` | 骨架屏 |

### 5.2 文字

| DSH token | Light | Dark |
|---|---|---|
| `--dsw-alias-label-primary` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-secondary` | `#3D3D3A` | `#C2C0B6` |
| `--dsw-alias-label-tertiary` | `#73726C` | `#9C9A92` |
| `--dsw-alias-label-caption` | `#9C9A92` | `#807D74` |
| `--dsw-alias-label-dimmed` | `#C2C0B6` | `#5C5A55` |
| `--dsw-alias-label-primary-dimmed` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-primary-inverted` | `#FFFFFF` | `#141413` |
| `--dsw-alias-label-primary-foreground` | `#FFFFFF` | `#141413` |
| `--dsw-alias-label-on-color` | `#FFFFFF` | `#FFFFFF` |
| `--dsw-alias-label-primary-bluish` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-document-preview` | `#3D3D3A` | `#C2C0B6` |
| `--dsw-alias-label-deep-diving` | `#B85C3E` | `#E8926E` |
| `--dsw-alias-label-deep-diving-shimmer` | `#F0C7B8` | `#F0C7B8` |

### 5.3 边框、交互与强调

| DSH token | Light | Dark |
|---|---|---|
| `--dsw-alias-border-l1` | `#E8E6DC` | `#3A3A37` |
| `--dsw-alias-border-l2` | `#CCCBC8` | `#4A4843` |
| `--dsw-alias-border-l3` | `#CCCBC8` | `#4A4843` |
| `--dsw-alias-border-l4` | `#B0AEA5` | `#5C5A55` |
| `--dsw-alias-border-selected` | `#D97757` | `#D97757` |
| `--dsw-alias-interactive-bg-hover` | `rgba(20,20,19,0.045)` | `rgba(250,249,245,0.06)` |
| `--dsw-alias-interactive-bg-hover-solid` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-interactive-bg-active` | `rgba(20,20,19,0.08)` | `rgba(250,249,245,0.10)` |
| `--dsw-alias-interactive-bg-hover-accent` | `rgba(217,119,87,0.12)` | `rgba(217,119,87,0.16)` |
| `--dsw-alias-interactive-bg-hover-danger` | `rgba(167,61,57,0.08)` | `rgba(238,136,132,0.12)` |
| `--dsw-alias-brand-primary` | `#141413` | `#FAF9F5` |
| `--dsw-alias-brand-primary-invert` | `#FAF9F5` | `#141413` |
| `--dsw-alias-brand-text` | `#141413` | `#FAF9F5` |
| `--dsw-alias-button-primary-fill` | `#141413` | `#FAF9F5` |
| `--dsw-alias-button-primary-hover` | `#3D3D3A` | `#C2C0B6` |
| `--dsw-alias-button-primary-dimmed` | `#E8E6DC` | `#3A3A37` |
| `--dsw-alias-button-info-fill` | `#D97757` | `#D97757` |
| `--dsw-alias-button-info-hover` | `#C6613F` | `#E8926E` |
| `--dsw-alias-button-floating-fill` | `#FFFFFF` | `#30302E` |
| `--dsw-alias-button-floating-hover` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-button-elevated-fill` | `#FFFFFF` | `#3A3A37` |
| `--dsw-alias-button-contrast-fill` | `#3D3D3A` | `#FAF9F5` |
| `--dsw-alias-state-business-primary` | `#D97757` | `#D97757` |
| `--dsw-alias-state-business-tertiary` | `#F5E3C7` | `#4A2E23` |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | `#D97757` | `#D97757` |
| `--dsw-alias-link` | `#3266AD` | `#80AADD` |
| `--dsw-alias-trajectory-accent` | `#D97757` | `#D97757` |
| `--dsw-specific-sidebar-right-flash` | `#D97757` | `#D97757` |

### 5.4 消息、输入、侧边栏与菜单

| DSH token | Light | Dark |
|---|---|---|
| `--dsw-specific-bubble` | `#F5F4ED` | `#30302E` |
| `--dsw-specific-bubble-highlight` | `#E8E6DC` | `#3A3A37` |
| `--dsw-specific-input-major` | `#FFFFFF` | `#30302E` |
| `--dsw-specific-selector` | `#F5F4ED` | `#3A3A37` |
| `--dsw-specific-sidebar-fill` | `#F0EEE6` | `#1F1E1D` |
| `--dsw-specific-sidebar-nav-item-active` | `#E8E6DC` | `#30302E` |
| `--dsw-specific-sidebar-nav-item-active-accent` | `#E8E6DC` | `#3A3A37` |
| `--dsw-specific-tip` | `#F0EEE6` | `#30302E` |
| `--dsw-specific-login-input` | `#FFFFFF` | `#30302E` |
| `--dsw-menu-surface-fill` | `rgba(250,249,245,0.88)` | `rgba(38,38,36,0.72)` |
| `--dsw-alias-menu-group-header-fill` | `rgba(245,244,237,0.94)` | `rgba(38,38,36,0.94)` |
| `--dsw-alias-menu-icon` | `#3D3D3A` | `#FAF9F5` |

### 5.5 代码、卡片与状态

| DSH token | Light | Dark |
|---|---|---|
| `--dsw-alias-markdown-code-block` | `#F5F4ED` | `#1F1D1B` |
| `--dsw-alias-markdown-code-block-banner` | `#F0EEE6` | `#2A2826` |
| `--dsw-alias-markdown-inline-code` | `#F5F4ED` | `#30302E` |
| `--dsw-alias-markdown-code-segment-selected` | `#FFFFFF` | `#3A3A37` |
| `--dsw-alias-markdown-code-segment-unselected` | `#F5F4ED` | `#1F1D1B` |
| `--dsw-alias-markdown-placeholder` | `#F0EEE6` | `#3A3A37` |
| `--dsw-alias-markdown-tag` | `#F0EEE6` | `#3A3A37` |
| `--dsw-alias-markdown-citation` | `#F0EEE6` | `#30302E` |
| `--dsw-alias-card-fill` | `#FFFFFF` | `#30302E` |
| `--dsw-alias-card-fill-hover` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-card-tile-fill` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.05)` |
| `--dsw-alias-state-error-primary` | `#A73D39` | `#EE8884` |
| `--dsw-alias-state-error-secondary` | `#CD5C58` | `#CD5C58` |
| `--dsw-alias-state-success-primary` | `#437426` | `#7AB948` |
| `--dsw-alias-state-success-secondary` | `#599130` | `#599130` |
| `--dsw-alias-state-success-tertiary` | `#E9F1DC` | `#1B4614` |
| `--dsw-alias-state-warn-primary` | `#805C1F` | `#D1A041` |
| `--dsw-alias-state-warn-secondary` | `#A87829` | `#A87829` |
| `--dsw-alias-state-warn-tertiary` | `#F6EEDF` | `#483A0F` |
| `--dsw-alias-state-warn-label` | `#805C1F` | `#D1A041` |
| `--dsw-alias-state-idle-primary` | `#D4D1C7` | `#5C5A55` |
| `--dsw-alias-state-done-primary` | `#437426` | `#7AB948` |
| `--dsw-alias-chart-messages` | `#D97757` | `#D97757` |
| `--dsw-alias-chart-tools` | `#788C5D` | `#9BB07A` |
| `--dsw-alias-chart-system` | `#B0AEA5` | `#807D74` |

### 5.6 浮层、提示与滚动条

| DSH token | Light | Dark |
|---|---|---|
| `--dsw-alias-hovercard-bg` | `#141413` | `#141413` |
| `--dsw-alias-hovercard-label-primary` | `#FAF9F5` | `#FAF9F5` |
| `--dsw-alias-hovercard-label-secondary` | `#C2C0B6` | `#C2C0B6` |
| `--dsw-alias-hovercard-label-tertiary` | `#9C9A92` | `#9C9A92` |
| `--dsw-alias-toast-bg` | `#141413` | `#30302E` |
| `--dsw-alias-toast-label` | `#FAF9F5` | `#FAF9F5` |
| `--dsw-alias-toast-action` | `#D97757` | `#E8926E` |
| `--dsw-alias-tooltip-bg` | `#141413` | `#141413` |
| `--dsw-alias-tooltip-label` | `#FAF9F5` | `#FAF9F5` |
| `--dsw-alias-tooltip-key-bg` | `#3D3D3A` | `#3D3D3A` |
| `--dsw-alias-scrollbar-bg-l1` | `#D9D5C9` | `#4A4843` |
| `--dsw-alias-scrollbar-bg-l2` | `#D9D5C9` | `#5C5A55` |
| `--dsw-alias-scrollbar-hover-l1` | `#C2BEB2` | `#5C5A55` |
| `--dsw-alias-scrollbar-hover-l2` | `#C2BEB2` | `#6E6B64` |

## 6. 字体与圆角

### 字体

Anthropic Sans / Serif / Mono 是 Anthropic 的专有字体，没有公开下载或再分发授权；[品牌页](https://brand.anthropic.com/typography) 只有规范说明。因此第一版采用「本机优先 + 开源近似字体兜底」：

- 字体栈把 `"Anthropic Sans"` / `"Anthropic Serif"` / `"Anthropic Mono"` 放在最前面：用户如果自行安装了这些字体（例如从 Claude 桌面应用资源中取得，需自行确认授权），会自动使用。
- 插件内打包三款 SIL OFL 开源字体，作为未安装 Anthropic 字体时的近似：
  - 正文/界面：**Figtree**（几何无衬线，接近 Anthropic Sans 的感觉）
  - 标题：**Source Serif 4**（300/400 字重，接近 Anthropic Serif 的编辑感）
  - 代码：**JetBrains Mono**
- 字体文件以 base64 `data:` URI 内嵌在 `client.js` 的 `@font-face` 样式里，避免动态插件的资源 URL 解析问题；只取 Latin 子集，控制包体。

字体栈由皮肤 CSS 层写入，而不是 token 覆盖层，这样用户如果在 Settings 里显式设置过字体，皮肤会尊重用户设置：

```css
body:not([style*="--dsh-font-family-text"]) {
  --dsw-font-family:
    "Anthropic Sans", "Figtree", "Inter", "Segoe UI",
    "PingFang SC", "Microsoft YaHei", sans-serif;
}

body:not([style*="--dsh-font-family-code"]) {
  --ds-font-family-code:
    "Anthropic Mono", "JetBrains Mono", "SF Mono", "Fira Code",
    Consolas, "PingFang SC", "Microsoft YaHei", monospace;
}
```

`--dsw-font-family-brand`（品牌文字专用）通过 `ctx.theme.overrideTokens()` 写入以下值（两套模式同值）：

```css
--dsw-font-family-brand:
  "Anthropic Serif", "Source Serif 4", "Tiempos Text", Georgia,
  "Songti SC", "SimSun", serif;
```

- 欢迎页标题使用品牌衬线字体：
  ```css
  :where([data-phase="hero"]) [class*="_headline"]:has(> [class*="_titleGroup"]) {
    font-family: var(--dsw-font-family-brand);
    font-weight: 300;
    letter-spacing: -0.02em;
  }
  ```
- 正文保持无衬线；Claude 的“衬线感”只出现在大标题和品牌文字，避免整页变成营销站。

### 圆角

| Token | 原值 | Claude 皮肤 |
|---|---:|---:|
| `--dsw-radius-xs` | 4px | 4px |
| `--dsw-radius-sm` | 8px | 6px |
| `--dsw-radius-md` | 12px | 8px |
| `--dsw-radius-lg` | 16px | 10px |
| `--dsw-radius-xl` | 20px | 12px |
| `--dsw-radius-panel` | 28px | 20px |

## 7. 少量元素级 CSS

除了 token 覆盖，只增加以下低风险规则：

1. **欢迎页标题**：上文的衬线字体规则。
2. **消息气泡**：聊天节点内的用户气泡使用 18px 圆角，底色沿用主题 token。
   ```css
   [data-slot="conversation.chat.node"] [data-message-bubble] { border-radius: 18px; }
   ```
3. **输入卡片**：只在 composer 区域内部生效，避免影响其他卡片：
   ```css
   [data-slot="conversation.composer.bar"] [class*="_card_"] {
     border-radius: var(--dsw-radius-panel);
     box-shadow: 0 6px 24px rgba(20, 20, 19, 0.06);
   }
   ```
4. **文本选中**：
   ```css
   ::selection { background: rgba(217, 119, 87, 0.22); }
   ```
5. **滚动条**：由 `--dsw-alias-scrollbar-*` token 覆盖，不新增选择器。

欢迎标题与消息气泡的选择器分别限定在欢迎区域和 `conversation.chat.node` 插槽内，优先级高于宿主的单类选择器。
输入卡片使用 `:where()`。这些规则遵守常规 CSS 层叠，声明限定在字体、颜色、圆角和阴影等视觉属性。

## 8. 验收标准

1. 浅色下：主背景暖米白 `#FAF9F5`、侧边栏 `#F0EEE6`、用户气泡 `#F5F4ED`、输入卡片白色、发送按钮珊瑚橙。
2. 深色下：主背景 `#262624`、侧边栏 `#1F1E1D`、用户气泡 `#30302E`、代码块 `#1F1D1B`。
3. 欢迎页标题呈衬线字体；正文呈 Anthropic Sans 风格无衬线字体。
4. 切换 DSH 的 Light / Dark / System 时颜色立即正确切换。
5. 菜单、弹窗、工具卡片、终端、快捷键、焦点环和键盘操作与安装前一致。
6. 禁用/卸载插件后，所有 token 与样式恢复 DSH 默认，无残留。
7. 插件管理器显示正确的中英文标题、描述、图标和详情页。

## 9. 风险与边界

- **CSS Module 类名可能随 DSH 升级变化**：元素级规则使用 `[class*="_bubble_"]` 这类包含本地名的宽松匹配；即使失效，只会少一点圆角/字体修饰，不会破坏布局。token 覆盖不受影响。
- **Anthropic 字体不可分发**：不打包专有字体；使用 Figtree + Source Serif 4 + JetBrains Mono 兜底，本机若安装 Anthropic 字体则优先。
- **不复制 Claude 商标**：插件图标为原创图形；DSH 的鱼形品牌 mark 保留，不复制 Claude 官方 Logo。
- **只做皮肤层**：侧边栏宽度、聊天栏宽度、消息顺序等布局保持 DSH 原生，避免升级冲突和交互回归。
- **包体增大**：内嵌三款 Latin 子集字体，预计增加约 150–300 KB；可接受，后续可改为外置资源。

## 10. 已确认

1. 字体：本机 Anthropic 字体优先，插件打包开源近似字体兜底。
2. 品牌图形：保留 DSH 鱼形，不替换品牌 mark。
3. 深色模式：完整 Claude 深色调，与浅色同步支持。
