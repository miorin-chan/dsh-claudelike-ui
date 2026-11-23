# dsh-claudelike-ui

A non-destructive claude.ai-inspired visual skin for **DeepSeek Harness (DSH)**.

It keeps DSH's layout and behavior intact and only changes the visual layer:

- warm parchment palette (`#FAF9F5` / `#F0EEE6` / `#F5F4ED`)
- charcoal text (`#141413`) and clay accent (`#D97757`)
- Claude-style dark palette (`#262624` / `#1F1E1D` / `#30302E`)
- Figtree for UI text, Source Serif 4 for display titles, JetBrains Mono for code
- softened radii, code blocks, bubbles, menus, scrollbars and diff colors

## Install

### From the DSH plugin manager

1. Open **Plugins** in DSH.
2. Choose **Add plugin** and point it at this directory (or the cloned repository directory).
3. Enable **Claude-like UI skin**.

### From the CLI

The package can be added to a profile, then enabled as a bundle in **Plugins**:

```sh
dsh plugin --profile desktop add github:miorin-chan/dsh-claudelike-ui
```

Alternatively clone the repository and use **Plugins** > **Add plugin** with the cloned directory. Restart DSH or reload the Web surface after enabling the bundle.

Tested on DSH `0.2.2-rc.5` (Windows Desktop).

## What it changes

The plugin uses the official `ctx.theme.overrideTokens()` extension point to supply a `{ light, dark }` pair for every semantic token it owns. It also injects a tiny stylesheet for typography and three stable selectors:

```css
[data-phase="hero"] [class*="_headline"]  /* welcome title */
[data-message-bubble]                     /* user message bubble */
[data-slot="conversation.composer.bar"] [data-composer-card]
```

No layout dimensions, display/position, z-index, overflow, keyboard behavior, or focus behavior are touched.

## Fonts

The plugin prefers locally installed `Anthropic Sans`, `Anthropic Serif`, and `Anthropic Mono`; those are proprietary and are **not** bundled. When absent, it falls back to the bundled SIL OFL fonts:

- **Figtree** — UI/body text
- **Source Serif 4** — display titles
- **JetBrains Mono** — code

The license texts live in `assets/fonts/OFL-*.txt`.

## Development

`client.js` is generated from `client.template.js` with the WOFF2 files embedded as base64 `data:` URIs:

```sh
node scripts/build-client.mjs
```

Then reinstall the directory bundle (or use DSH's client HMR while developing).

Design notes: [docs/DESIGN.md](docs/DESIGN.md).

## License

Code: MIT. Bundled fonts: SIL Open Font License 1.1 (see the files in `assets/fonts/`).
