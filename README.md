# dsh-claudelike-ui

A non-destructive claude.ai-inspired visual skin for **DeepSeek Harness (DSH)**.

![Light mode with warm paper surfaces, a sample chat, and a code block](docs/images/preview-light.png)

![Dark mode showing the same chat on charcoal surfaces](docs/images/preview-dark.png)

It keeps DSH's layout and behavior intact and only changes the visual layer:

- warm parchment palette (`#FAF9F5` / `#F0EEE6` / `#F5F4ED`)
- charcoal text (`#141413`) and clay accent (`#D97757`)
- Claude-style dark palette (`#262624` / `#1F1E1D` / `#30302E`)
- Figtree for UI text, Source Serif 4 for display titles, JetBrains Mono for code
- softened radii, code blocks, bubbles, menus, scrollbars and diff colors

## Install

### From the DSH plugin manager

1. Clone this repository and run `npm ci` in the clone to build the Host and Client entries.
2. In DSH, open **Plugins**, choose **Add plugin**, and select the prepared clone directory.
3. Enable **Claude-like UI skin**. Restart DSH or reload the Web surface if prompted.

### From GitHub

```sh
dsh plugin --profile desktop add github:miorin-chan/dsh-claudelike-ui
```

The GitHub install builds both entries from source. When pnpm reports a pending Git build, explicitly allow the
exact key it prints under `allowBuilds` in the profile's `pnpm-workspace.yaml`, then rerun the command.

### From a tarball

This private package can be distributed as a `.tgz`. From the clone, run `npm ci` and `npm pack` to build the
entries and create the tarball, then install it into the profile with its absolute path.

```sh
dsh plugin --profile desktop add /absolute/path/dsh-claudelike-ui-1.0.0.tgz
```

Tested with DSH `0.2.2-rc.5` on Windows Desktop and in Chrome on macOS.

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

The [Host entry](src/host/index.ts) builds to `index.js`. The [Client entry](src/client/index.ts) builds to
`client.js` and embeds the bundled WOFF2 files as base64 `data:` URIs. Both entries are generated locally.

Run `npm test` to rebuild and test both entries. Run `npm run check` to check types, generated files, the DSH
version pins, and the runtime contract. After editing the Client source, rebuild and reload the bundle to see the changes.

### Refresh the screenshots

With Node.js 24, Chrome, and `dsh` on `PATH`, run:

```sh
node scripts/capture-screenshots.mjs
```

The script uses the `default-workspace` test tools to start a disposable DSH Web profile, install the local skin,
and capture the same conversation in both modes using a local fixture model. It saves the PNGs in `docs/images/`.
If the checkout is outside `default-workspace/plugins/`, pass the workspace's `tools` directory as the first argument.

Design notes: [docs/DESIGN.md](docs/DESIGN.md).

## License

Code: MIT. Bundled fonts: SIL Open Font License 1.1 (see the files in `assets/fonts/`).
