import type { Context } from '@deepseek-ai/cordis'
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'

const CLAY = { light: '#AD4E32', dark: '#D97757' }
const CLAY_TEXT = { light: CLAY.light, dark: '#E8926E' }
const CLAY_HOVER = { light: '#923E28', dark: CLAY_TEXT.dark }

const TOKENS = {
  '--dsw-alias-bg-base': { light: '#FAF9F5', dark: '#262624' },
  '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-alias-bg-layer-2': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-alias-bg-layer-3': { light: '#F0EEE6', dark: '#3F3F3B' },
  '--dsw-alias-bg-overlay': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-alias-bg-module-platform': { light: '#F5F4ED', dark: '#30302E' },
  '--dsw-alias-bg-multi-select': { light: '#F0EEE6', dark: '#30302E' },
  '--dsw-alias-bg-document-preview': { light: '#F5F4ED', dark: '#1F1E1D' },
  '--dsw-alias-bg-document-selection': { light: 'rgba(173, 78, 50, 0.18)', dark: 'rgba(217, 119, 87, 0.28)' },
  '--dsw-alias-bg-skeleton': { light: 'rgba(20, 20, 19, 0.05)', dark: 'rgba(250, 249, 245, 0.08)' },

  '--dsw-alias-label-primary': { light: '#141413', dark: '#FAF9F5' },
  '--dsw-alias-label-secondary': { light: '#3D3D3A', dark: '#C2C0B6' },
  '--dsw-alias-label-tertiary': { light: '#6D6B64', dark: '#9C9A92' },
  '--dsw-alias-label-caption': { light: '#6D6B64', dark: '#A19E94' },
  '--dsw-alias-label-dimmed': { light: '#C2C0B6', dark: '#5C5A55' },
  '--dsw-alias-label-primary-dimmed': { light: '#141413', dark: '#FAF9F5' },
  '--dsw-alias-label-primary-inverted': { light: '#FFFFFF', dark: '#141413' },
  '--dsw-alias-label-primary-foreground': { light: '#FFFFFF', dark: '#141413' },
  '--dsw-alias-label-on-color': { light: '#FFFFFF', dark: '#FFFFFF' },
  '--dsw-alias-label-primary-bluish': { light: '#141413', dark: '#FAF9F5' },
  '--dsw-alias-label-document-preview': { light: '#3D3D3A', dark: '#C2C0B6' },
  '--dsw-alias-label-deep-diving': CLAY_TEXT,
  '--dsw-alias-label-deep-diving-shimmer': { light: '#B45538', dark: '#F0C7B8' },
  '--dsw-alias-label-shimmer': { light: 'rgba(20, 20, 19, 0.28)', dark: 'rgba(250, 249, 245, 0.40)' },

  '--dsw-alias-border-l1': { light: '#E8E6DC', dark: '#3A3A37' },
  '--dsw-alias-border-l2': { light: '#CCCBC8', dark: '#4A4843' },
  '--dsw-alias-border-l3': { light: '#CCCBC8', dark: '#4A4843' },
  '--dsw-alias-border-l4': { light: '#B0AEA5', dark: '#5C5A55' },
  '--dsw-alias-border-selected': CLAY,
  '--dsw-alias-border-inverted': { light: 'rgba(0, 0, 0, 0)', dark: 'rgba(255, 255, 255, 0.06)' },
  '--dsw-alias-border-inverted2': { light: 'rgba(0, 0, 0, 0)', dark: 'rgba(255, 255, 255, 0.08)' },

  '--dsw-alias-interactive-bg-hover': { light: 'rgba(20, 20, 19, 0.045)', dark: 'rgba(250, 249, 245, 0.06)' },
  '--dsw-alias-interactive-bg-hover-solid': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-alias-interactive-bg-active': { light: 'rgba(20, 20, 19, 0.08)', dark: 'rgba(250, 249, 245, 0.10)' },
  '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(173, 78, 50, 0.10)', dark: 'rgba(217, 119, 87, 0.18)' },
  '--dsw-alias-interactive-bg-hover-danger': { light: 'rgba(167, 61, 57, 0.08)', dark: 'rgba(238, 136, 132, 0.12)' },

  '--dsw-alias-brand-primary': CLAY_TEXT,
  '--dsw-alias-brand-primary-invert': { light: '#FAF9F5', dark: '#141413' },
  '--dsw-alias-brand-text': CLAY_TEXT,
  '--dsw-alias-button-primary-fill': CLAY,
  '--dsw-alias-button-primary-hover': CLAY_HOVER,
  '--dsw-alias-button-primary-dimmed': { light: '#E8E6DC', dark: '#3A3A37' },
  '--dsw-alias-button-info-fill': CLAY,
  '--dsw-alias-button-info-hover': { light: CLAY_HOVER.light, dark: '#C56849' },
  '--dsw-alias-button-floating-fill': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-alias-button-floating-hover': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-alias-button-elevated-fill': { light: '#FFFFFF', dark: '#3A3A37' },
  '--dsw-alias-button-contrast-fill': { light: '#3D3D3A', dark: '#FAF9F5' },
  '--dsw-alias-button-ghost-active-border': { light: '#B0AEA5', dark: '#5C5A55' },
  '--dsw-alias-button-ghost-active-fill': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-alias-button-ghost-active-hover': { light: '#F0EEE6', dark: '#444440' },

  '--dsw-alias-state-business-primary': CLAY_TEXT,
  '--dsw-alias-state-business-tertiary': { light: '#F4E1D7', dark: '#4A2E23' },
  '--dsw-alias-brand-primary-new-colorprimary-new-color': CLAY_TEXT,
  '--dsw-alias-link': { light: '#3266AD', dark: '#80AADD' },
  '--dsw-alias-trajectory-accent': CLAY_TEXT,
  '--dsw-specific-sidebar-right-flash': CLAY,
  '--dsw-alias-state-error-primary': { light: '#7F2C28', dark: '#EE8884' },
  '--dsw-alias-state-error-secondary': { light: '#A73D39', dark: '#CD5C58' },
  '--dsw-alias-state-success-primary': { light: '#265B19', dark: '#7AB948' },
  '--dsw-alias-state-success-secondary': { light: '#437426', dark: '#599130' },
  '--dsw-alias-state-success-tertiary': { light: '#E9F1DC', dark: '#1B4614' },
  '--dsw-alias-state-warn-primary': { light: '#805C1F', dark: '#D1A041' },
  '--dsw-alias-state-warn-secondary': { light: '#A87829', dark: '#A87829' },
  '--dsw-alias-state-warn-tertiary': { light: '#F6EEDF', dark: '#483A0F' },
  '--dsw-alias-state-warn-label': { light: '#5A4815', dark: '#D1A041' },
  '--dsw-alias-state-idle-primary': { light: '#D4D1C7', dark: '#5C5A55' },
  '--dsw-alias-state-done-primary': { light: '#265B19', dark: '#7AB948' },
  '--dsw-alias-chart-messages': CLAY,
  '--dsw-alias-chart-tools': { light: '#788C5D', dark: '#9BB07A' },
  '--dsw-alias-chart-system': { light: '#B0AEA5', dark: '#807D74' },

  '--dsw-specific-bubble': { light: '#F0EEE6', dark: '#30302E' },
  '--dsw-specific-bubble-highlight': { light: '#E8E6DC', dark: '#3A3A37' },
  '--dsw-specific-input-major': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-specific-selector': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-specific-sidebar-fill': { light: '#F5F4ED', dark: '#1F1E1D' },
  '--dsw-specific-sidebar-nav-item-active': { light: '#E8E6DC', dark: '#30302E' },
  '--dsw-specific-sidebar-nav-item-active-accent': { light: '#F4E1D7', dark: '#4A2E23' },
  '--dsw-specific-tip': { light: '#F0EEE6', dark: '#30302E' },
  '--dsw-specific-login-input': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-menu-surface-fill': { light: 'rgba(255, 255, 255, 0.96)', dark: 'rgba(48, 48, 46, 0.96)' },
  '--dsw-alias-menu-group-header-fill': { light: '#F5F4ED', dark: '#262624' },
  '--dsw-alias-menu-icon': { light: '#3D3D3A', dark: '#FAF9F5' },

  '--dsw-alias-markdown-code-block': { light: '#F5F4ED', dark: '#141413' },
  '--dsw-alias-markdown-code-block-banner': { light: '#F0EEE6', dark: '#1F1E1D' },
  '--dsw-alias-markdown-inline-code': { light: '#F5F4ED', dark: '#30302E' },
  '--dsw-alias-markdown-code-segment-selected': { light: '#FFFFFF', dark: '#3A3A37' },
  '--dsw-alias-markdown-code-segment-unselected': { light: '#F5F4ED', dark: '#141413' },
  '--dsw-alias-markdown-placeholder': { light: '#F0EEE6', dark: '#3A3A37' },
  '--dsw-alias-markdown-tag': { light: '#F0EEE6', dark: '#3A3A37' },
  '--dsw-alias-markdown-citation': { light: '#F0EEE6', dark: '#30302E' },
  '--dsw-alias-card-fill': { light: '#FFFFFF', dark: '#30302E' },
  '--dsw-alias-card-fill-hover': { light: '#F5F4ED', dark: '#3A3A37' },
  '--dsw-alias-card-tile-fill': { light: 'rgba(255, 255, 255, 0.55)', dark: 'rgba(255, 255, 255, 0.05)' },

  '--dsw-alias-hovercard-bg': { light: '#141413', dark: '#141413' },
  '--dsw-alias-hovercard-label-primary': { light: '#FAF9F5', dark: '#FAF9F5' },
  '--dsw-alias-hovercard-label-secondary': { light: '#C2C0B6', dark: '#C2C0B6' },
  '--dsw-alias-hovercard-label-tertiary': { light: '#9C9A92', dark: '#9C9A92' },
  '--dsw-alias-hovercard-state-done': { light: '#9BB07A', dark: '#9BB07A' },
  '--dsw-alias-hovercard-state-error': { light: '#EE8884', dark: '#EE8884' },
  '--dsw-alias-toast-bg': { light: '#141413', dark: '#30302E' },
  '--dsw-alias-toast-label': { light: '#FAF9F5', dark: '#FAF9F5' },
  '--dsw-alias-toast-action': { light: '#D97757', dark: '#E8926E' },
  '--dsw-alias-tooltip-bg': { light: '#141413', dark: '#141413' },
  '--dsw-alias-tooltip-label': { light: '#FAF9F5', dark: '#FAF9F5' },
  '--dsw-alias-tooltip-key-bg': { light: '#3D3D3A', dark: '#3D3D3A' },
  '--dsw-alias-scrollbar-bg-l1': { light: '#D9D5C9', dark: '#4A4843' },
  '--dsw-alias-scrollbar-bg-l2': { light: '#D9D5C9', dark: '#5C5A55' },
  '--dsw-alias-scrollbar-hover-l1': { light: '#C2BEB2', dark: '#5C5A55' },
  '--dsw-alias-scrollbar-hover-l2': { light: '#C2BEB2', dark: '#6E6B64' },

  '--dsw-alias-illustration-background': { light: '#F0EEE6', dark: '#30302E' },
  '--dsw-alias-illustration-backing': { light: '#D9D5C9', dark: '#4A4843' },
  '--dsw-alias-illustration-detail': { light: '#B0AEA5', dark: '#5C5A55' },
  '--dsw-alias-illustration-surface': { light: '#E8E6DC', dark: '#3A3A37' },
  '--dsw-specific-guide-hero': { light: '#F0EEE6', dark: '#3A3A37' },

  '--dsw-alias-onboarding-accent': { light: '#D97757', dark: '#D97757' },
  '--dsw-alias-onboarding-card-fill': { light: 'rgba(255, 253, 249, 0.86)', dark: 'rgba(58, 58, 55, 0.86)' },
  '--dsw-alias-onboarding-secondary-fill': { light: '#FFFDF9', dark: '#3A3A37' },
  '--dsw-gradient-onboarding-blue-stops': { light: '#E8926E 18.75%, #D97757 51.78%, #F0C7B8 86.252%, #E8926E', dark: '#B85C3E 18.75%, #D97757 51.78%, #E8B59E 86.252%, #B85C3E' },
  '--dsw-gradient-onboarding-violet-stops': { light: '#E8926E 18.75%, #D97757 51.78%, #F0C7B8 86.252%, #E8926E', dark: '#B85C3E 18.75%, #D97757 51.78%, #E8B59E 86.252%, #B85C3E' },
  '--dsw-gradient-onboarding-cyan-stops': { light: '#E8926E 18.75%, #D97757 51.78%, #F0C7B8 86.252%, #E8926E', dark: '#B85C3E 18.75%, #D97757 51.78%, #E8B59E 86.252%, #B85C3E' },
  '--dsw-specific-menu': { light: 'rgba(250, 249, 245, 0.92)', dark: 'rgba(38, 38, 36, 0.90)' },
  '--dsw-alias-bg-mask-drop': { light: 'rgba(250, 249, 245, 0.72)', dark: 'rgba(38, 38, 36, 0.72)' },
  '--dsw-alias-file-diff-added-bg': { light: '#EEF3E2', dark: '#26301F' },
  '--dsw-alias-file-diff-added-gutter': { light: '#F4F7EC', dark: '#1D2618' },
  '--dsw-alias-file-diff-added-marker': { light: '#5E7F3A', dark: '#8FBF67' },
  '--dsw-alias-file-diff-deleted-bg': { light: '#F9E8E3', dark: '#3A2420' },
  '--dsw-alias-file-diff-deleted-gutter': { light: '#FCF0EC', dark: '#2A1916' },
  '--dsw-alias-file-diff-deleted-marker': { light: '#B0523F', dark: '#E08573' },

  '--dsw-font-family-brand': {
    light: '"Anthropic Serif", "Source Serif 4", "Tiempos Text", Georgia, "Songti SC", "SimSun", serif',
    dark: '"Anthropic Serif", "Source Serif 4", "Tiempos Text", Georgia, "Songti SC", "SimSun", serif',
  },

  '--dsw-radius-xs': { light: '4px', dark: '4px' },
  '--dsw-radius-sm': { light: '6px', dark: '6px' },
  '--dsw-radius-md': { light: '8px', dark: '8px' },
  '--dsw-radius-lg': { light: '10px', dark: '10px' },
  '--dsw-radius-xl': { light: '12px', dark: '12px' },
  '--dsw-radius-panel': { light: '20px', dark: '20px' },
} satisfies ThemeTokenOverrides

const FONT_CSS = `
@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: url(data:font/woff2;base64,__FIGTREE_B64__) format('woff2');
}
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 200 900;
  font-display: swap;
  src: url(data:font/woff2;base64,__SOURCESERIF_B64__) format('woff2');
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,__JETBRAINS_B64__) format('woff2');
}
`

const CSS = `${FONT_CSS}
body:not([style*="--dsh-font-family-text"]) {
  --dsw-font-family: "Anthropic Sans", "Figtree", "Instrument Sans", "Inter", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
body:not([style*="--dsh-font-family-code"]) {
  --ds-font-family-code: "Anthropic Mono", "JetBrains Mono", "SF Mono", "Fira Code", Consolas, "PingFang SC", "Microsoft YaHei", monospace;
}
body {
  accent-color: var(--dsw-alias-state-business-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
:where([data-phase="hero"]) [class*="_headline"]:has(> [class*="_titleGroup"]) {
  font-family: var(--dsw-font-family-brand);
  font-weight: 300;
  letter-spacing: -0.02em;
}
[data-slot="conversation.chat.node"] [data-message-bubble] {
  border-radius: 18px;
}
:where([data-slot="conversation.composer.bar"] [data-composer-card]) {
  border-radius: var(--dsw-radius-panel);
  box-shadow: 0 6px 24px light-dark(rgb(20 20 19 / 6%), rgb(0 0 0 / 24%));
}
::selection {
  background-color: var(--dsw-alias-bg-document-selection);
}
`

export const inject = ['theme']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.theme.overrideTokens('dsh-claudelike-ui', TOKENS), 'dsh-claudelike-ui: claude token layer')
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-claudelike-ui'
    style.dataset.pluginCss = 'dsh-claudelike-ui/claude-ui.css'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'dsh-claudelike-ui: claude stylesheet')
}
