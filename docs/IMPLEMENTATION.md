# Claude 风格皮肤实现说明

产品定位与成功标准见[产品设计](DESIGN.md)。

## 参考基准

- Claude 官方设计指南（色板、字体、圆角、阴影、间距）：
  https://claude.com/docs/connectors/building/mcp-apps/design-guidelines
- DSH 官方 Web UI 样式规范（token 所有权与组件规则）：
  https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/web-styling.md
- DSH 官方 UI 设计审查原则：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/ui-design-review-cases.md

## 插件形态与生命周期

`dsh-claudelike-ui` 通过单个 bundle 的 Client 入口实现视觉层，声明 `inject: ['theme', 'slots', 'locale']`：

- **Token 层用 `overrideTokens` 而非 `register`**：`ctx.theme.register()` 注册单一 `colorScheme` 主题，
  无法随 DSH 的 `light / dark / system` 偏好自动切换；
  `ctx.theme.overrideTokens('dsh-claudelike-ui', TOKENS)` 接受成对 `{ light, dark }` 值并叠加在内置主题上，
  由皮肤开关与 `ctx.effect` 共同托管挂载与卸载。
- **设置项开关**：在 `settings.general.item`（`order: 13`）注册 `SkinToggleRow` 开关，持久化在 `localStorage`，
  开关变更直接调用同一套 `mount` / `unmount` 状态转换。

## 颜色 token 映射

完整映射以 [src/client/index.ts](../src/client/index.ts) 为准；
主按钮与开启态开关均使用白字/白滑块（`#FFFFFF`）配陶土填充。

### 背景与纸面

| DSH token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--dsw-alias-bg-base` | `#FAF9F5` | `#262624` | 主画布 |
| `--dsw-alias-bg-layer-1` | `#FFFFFF` | `#30302E` | 一级浮层 |
| `--dsw-alias-bg-layer-2` | `#F5F4ED` | `#3A3A37` | 二级表面 |
| `--dsw-alias-bg-layer-3` | `#F0EEE6` | `#3F3F3B` | 三级表面 |
| `--dsw-alias-bg-overlay` | `#FFFFFF` | `#30302E` | 弹层 |
| `--dsw-alias-bg-module-platform` | `#F5F4ED` | `#30302E` | 平台模块底色 |
| `--dsw-alias-bg-multi-select` | `#F0EEE6` | `#30302E` | 多选区域 |
| `--dsw-alias-bg-document-preview` | `#F5F4ED` | `#1F1E1D` | 文档预览底 |
| `--dsw-alias-bg-skeleton` | `rgba(20,20,19,0.05)` | `rgba(250,249,245,0.08)` | 骨架屏 |

### 文字

| DSH token | Light | Dark |
| --- | --- | --- |
| `--dsw-alias-label-primary` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-secondary` | `#3D3D3A` | `#C2C0B6` |
| `--dsw-alias-label-tertiary` | `#6D6B64` | `#9C9A92` |
| `--dsw-alias-label-caption` | `#6D6B64` | `#A19E94` |
| `--dsw-alias-label-dimmed` | `#C2C0B6` | `#5C5A55` |
| `--dsw-alias-label-primary-dimmed` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-primary-inverted` | `#FFFFFF` | `#141413` |
| `--dsw-alias-label-primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--dsw-alias-label-on-color` | `#FFFFFF` | `#FFFFFF` |
| `--dsw-alias-label-primary-bluish` | `#141413` | `#FAF9F5` |
| `--dsw-alias-label-document-preview` | `#3D3D3A` | `#C2C0B6` |
| `--dsw-alias-label-deep-diving` | `#AD4E32` | `#E8926E` |
| `--dsw-alias-label-deep-diving-shimmer` | `#B45538` | `#F0C7B8` |

### 边框、交互与强调

| DSH token | Light | Dark |
| --- | --- | --- |
| `--dsw-alias-border-l1` | `#E8E6DC` | `#3A3A37` |
| `--dsw-alias-border-l2` | `#CCCBC8` | `#4A4843` |
| `--dsw-alias-border-l3` | `#CCCBC8` | `#4A4843` |
| `--dsw-alias-border-l4` | `#B0AEA5` | `#5C5A55` |
| `--dsw-alias-border-selected` | `#AD4E32` | `#D97757` |
| `--dsw-alias-interactive-bg-hover` | `rgba(20,20,19,0.045)` | `rgba(250,249,245,0.06)` |
| `--dsw-alias-interactive-bg-hover-solid` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-interactive-bg-active` | `rgba(20,20,19,0.08)` | `rgba(250,249,245,0.10)` |
| `--dsw-alias-interactive-bg-hover-accent` | `rgba(173,78,50,0.10)` | `rgba(217,119,87,0.18)` |
| `--dsw-alias-interactive-bg-hover-danger` | `rgba(167,61,57,0.08)` | `rgba(238,136,132,0.12)` |
| `--dsw-alias-brand-primary` | `#AD4E32` | `#C6613F` |
| `--dsw-alias-brand-primary-invert` | `#FAF9F5` | `#141413` |
| `--dsw-alias-brand-text` | `#AD4E32` | `#E8926E` |
| `--dsw-alias-button-primary-fill` | `#AD4E32` | `#B85636` |
| `--dsw-alias-button-primary-hover` | `#923E28` | `#C6613F` |
| `--dsw-alias-button-primary-dimmed` | `#E8E6DC` | `#3A3A37` |
| `--dsw-alias-button-info-fill` | `#AD4E32` | `#C6613F` |
| `--dsw-alias-button-info-hover` | `#923E28` | `#D97757` |
| `--dsw-alias-button-floating-fill` | `#FFFFFF` | `#30302E` |
| `--dsw-alias-button-floating-hover` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-button-elevated-fill` | `#FFFFFF` | `#3A3A37` |
| `--dsw-alias-button-contrast-fill` | `#3D3D3A` | `#FAF9F5` |
| `--dsw-alias-state-business-primary` | `#AD4E32` | `#E8926E` |
| `--dsw-alias-state-business-tertiary` | `#F4E1D7` | `#4A2E23` |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | `#AD4E32` | `#E8926E` |
| `--dsw-alias-link` | `#3266AD` | `#80AADD` |
| `--dsw-alias-trajectory-accent` | `#AD4E32` | `#E8926E` |
| `--dsw-specific-sidebar-right-flash` | `#AD4E32` | `#D97757` |

### 消息、输入、侧边栏与菜单

| DSH token | Light | Dark |
| --- | --- | --- |
| `--dsw-specific-bubble` | `#F0EEE6` | `#30302E` |
| `--dsw-specific-bubble-highlight` | `#E8E6DC` | `#3A3A37` |
| `--dsw-specific-input-major` | `#FFFFFF` | `#30302E` |
| `--dsw-specific-selector` | `#F5F4ED` | `#3A3A37` |
| `--dsw-specific-sidebar-fill` | `#F5F4ED` | `#1F1E1D` |
| `--dsw-specific-sidebar-nav-item-active` | `#E8E6DC` | `#30302E` |
| `--dsw-specific-sidebar-nav-item-active-accent` | `#F4E1D7` | `#4A2E23` |
| `--dsw-specific-sidebar-tint` | `color-mix(in srgb, var(--dsw-specific-sidebar-fill) 45%, transparent)` | `color-mix(in srgb, var(--dsw-specific-sidebar-fill) 55%, transparent)` |
| `--dsw-specific-sidebar-wash-top` | `rgb(217 119 87 / 0.05)` | `rgb(217 119 87 / 0.05)` |
| `--dsw-specific-sidebar-wash-top-clear` | `rgb(217 119 87 / 0)` | `rgb(217 119 87 / 0)` |
| `--dsw-specific-sidebar-wash-bottom` | `rgb(176 174 165 / 0.07)` | `rgb(20 20 19 / 0.14)` |
| `--dsw-specific-sidebar-wash-bottom-clear` | `rgb(176 174 165 / 0)` | `rgb(20 20 19 / 0)` |
| `--dsw-specific-tip` | `#F0EEE6` | `#30302E` |
| `--dsw-specific-login-input` | `#FFFFFF` | `#30302E` |
| `--dsw-menu-surface-fill` | `rgba(255,255,255,0.96)` | `rgba(48,48,46,0.96)` |
| `--dsw-alias-menu-group-header-fill` | `#F5F4ED` | `#262624` |
| `--dsw-alias-menu-icon` | `#3D3D3A` | `#FAF9F5` |

### 代码、卡片、状态与浮层

| DSH token | Light | Dark |
| --- | --- | --- |
| `--dsw-alias-markdown-code-block` | `#F5F4ED` | `#141413` |
| `--dsw-alias-markdown-code-block-banner` | `#F0EEE6` | `#1F1E1D` |
| `--dsw-alias-markdown-inline-code` | `#F5F4ED` | `#30302E` |
| `--dsw-alias-markdown-code-segment-selected` | `#FFFFFF` | `#3A3A37` |
| `--dsw-alias-markdown-code-segment-unselected` | `#F5F4ED` | `#141413` |
| `--dsw-alias-markdown-placeholder` | `#F0EEE6` | `#3A3A37` |
| `--dsw-alias-markdown-tag` | `#F0EEE6` | `#3A3A37` |
| `--dsw-alias-markdown-citation` | `#F0EEE6` | `#30302E` |
| `--dsw-alias-card-fill` | `#FFFFFF` | `#30302E` |
| `--dsw-alias-card-fill-hover` | `#F5F4ED` | `#3A3A37` |
| `--dsw-alias-card-tile-fill` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.05)` |
| `--dsw-alias-state-error-primary` | `#7F2C28` | `#EE8884` |
| `--dsw-alias-state-error-secondary` | `#A73D39` | `#CD5C58` |
| `--dsw-alias-state-success-primary` | `#265B19` | `#7AB948` |
| `--dsw-alias-state-success-secondary` | `#437426` | `#599130` |
| `--dsw-alias-state-success-tertiary` | `#E9F1DC` | `#1B4614` |
| `--dsw-alias-state-warn-primary` | `#805C1F` | `#D1A041` |
| `--dsw-alias-state-warn-secondary` | `#A87829` | `#A87829` |
| `--dsw-alias-state-warn-tertiary` | `#F6EEDF` | `#483A0F` |
| `--dsw-alias-state-warn-label` | `#5A4815` | `#D1A041` |
| `--dsw-alias-state-idle-primary` | `#D4D1C7` | `#5C5A55` |
| `--dsw-alias-state-done-primary` | `#265B19` | `#7AB948` |
| `--dsw-alias-switch-thumb` | `#FFFFFF` | `#C2C0B6` |
| `--dsw-alias-chart-messages` | `#AD4E32` | `#D97757` |
| `--dsw-alias-chart-tools` | `#788C5D` | `#9BB07A` |
| `--dsw-alias-chart-system` | `#B0AEA5` | `#807D74` |
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

## 字体、圆角与元素级 CSS

- **字体栈**：内嵌三款 SIL OFL 开源字体（Figtree、Source Serif 4、JetBrains Mono）Latin 子集为 base64 `data:` URI；
  皮肤 CSS 通过 `body:not([style*="--dsh-font-family-text"])` 与 `body:not([style*="--dsh-font-family-code"])` 注
  入无衬线和等宽字体栈，避免覆盖用户在 Settings 显式选择的字体；`--dsw-font-family-brand` 由 `overrideTokens` 写入。
- **圆角收缩**：`--dsw-radius-xs/sm/md/lg/xl/panel` 分别设为 `4px / 6px / 8px / 10px / 12px / 20px`。
- **元素级规则**：仅在欢迎页标题（`[data-phase="hero"]`）、
  聊天节点用户气泡（`[data-slot="conversation.chat.node"] [data-message-bubble]`，`18px` 圆角）、
  输入卡片（`:where([data-slot="conversation.composer.bar"] [data-composer-card])`）与 `::selection` 添加低优先级修饰；
  图标沿用 DeepSeek 鲸鱼轮廓（浅色 `#C6613F`、深色 `#D97757`、眼部 `#4D6BFE`）。
