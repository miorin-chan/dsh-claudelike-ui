# AGENTS.local

Project rules for `dsh-claudelike-ui`.
This file supplements [AGENTS.md](AGENTS.md); read that file first.

## Scope

`dsh-claudelike-ui` is a private, non-destructive claude.ai-inspired visual skin for DeepSeek Harness.
It keeps DSH's layout and behavior intact and overrides theme tokens, typography, and surface styling.

## Minimal workspace skeleton exceptions

- **Build pipeline**: keeps the custom [scripts/build.mts](scripts/build.mts) using TypeScript `transpileModule`
  so bundled WOFF2 fonts under `assets/fonts/` are embedded as base64 data URIs in `client.js`.
- **Locales**: maintains `en` and `zh` locales (`locale/en.json`, `locale/zh.json`).
- **Lockfile & engines**: uses `pnpm-lock.yaml` (`pnpm install --frozen-lockfile`)
  and declares `engines.dsh: ">=0.2.2-rc.5"`.

## Documentation & verification

- `README.md` is for users (`README.zh.md` is its Chinese version).
- [docs/DESIGN.md](docs/DESIGN.md) is the product design entry point.
  Read it before changing product behavior.
  It explains the user problem, intended experience, scope, and observable success criteria.
- Keep implementation details (token palette, font embedding, CSS rules) separate
  in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md), indexed by [docs/README.md](docs/README.md).
- Keep progress, schedules, and debugging notes in task records.
  Before closing a task, update the product design with approved decisions and link back to it.
- Run `python3 docs/scripts/reflow md <path>` (or `PREK_HOME="${TMPDIR:?}/prek-dsh" git commit`) when editing Markdown.
- Run `npm test` and `npm run check` (with `DSH_INSTALL_DIR` and `DSH_NODE_EXECUTABLE`
  when verifying Desktop type pins).
