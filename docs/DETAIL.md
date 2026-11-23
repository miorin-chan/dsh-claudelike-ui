# Claude UI 皮肤

为 DSH Desktop / Web 提供一套 claude.ai 风格的视觉皮肤：暖米白纸面、炭黑文字、珊瑚橙强调色、Figtree / Source Serif 4 / JetBrains Mono 字体组合。

## 功能

- 用 DSH 官方 `ctx.theme.overrideTokens()` 覆盖浅色与深色两套语义 token。
- 覆盖背景、文字、边框、按钮、链接、消息气泡、输入卡片、代码块、侧边栏、菜单、滚动条等主要表面。
- 欢迎页标题使用衬线字体（Source Serif 4）；正文使用 Figtree；代码使用 JetBrains Mono。
- 字体栈优先使用本机安装的 Anthropic Sans / Serif / Mono（若存在），否则使用内置的开源字体。

## 使用

启用插件后立即生效。切换 DSH 的 Light / Dark / System 时自动跟随。

## 边界

- 不修改 DSH 安装文件，不替换宿主组件，不改变布局、交互、快捷键或焦点行为。
- 禁用或卸载插件后，DSH 恢复原始主题；插件不写入任何持久化设置。
- 元素级 CSS 只使用 `[class*="_..._"]` 这类宽松匹配做字体/圆角修饰，DSH 升级后即使失效也只会少一点装饰，不会破坏功能。
- 内置字体为 SIL OFL 授权：Figtree、Source Serif 4、JetBrains Mono。Anthropic 的专有字体不随插件分发。
