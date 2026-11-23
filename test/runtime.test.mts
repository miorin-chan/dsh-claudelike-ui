import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import * as host from 'dsh-claudelike-ui'

const id = 'dsh-claudelike-ui'

test('the Host export is the bundle entry', () => {
  assert.deepEqual(Object.keys(host), ['apply'])
  assert.equal(host.apply(), undefined)
})

test('the Client loads lazily, installs the skin, and disposes both effects', async () => {
  const source = await readFile(new URL(import.meta.resolve(`${id}/client`)), 'utf8')
  const registrations = []
  const sandbox = { window: { __ModuleLoader__: { load: entry => registrations.push(entry) } } }
  runInNewContext(source, sandbox)
  assert.equal(registrations.length, 1)
  const [registration] = registrations
  assert.equal(registration.id, id)
  const client = registration.factory(specifier => assert.fail(`Unexpected browser import: ${specifier}`))
  assert.deepEqual(Object.keys(client).sort(), ['apply', 'inject'])
  assert.deepEqual([...client.inject], ['theme'])

  const styles = new Set()
  sandbox.document = {
    createElement(tag) {
      assert.equal(tag, 'style')
      return { dataset: {}, remove() { styles.delete(this) } }
    },
    head: { appendChild: style => styles.add(style) },
  }
  const disposers = []
  let activeTokens
  client.apply({
    effect: initialize => disposers.push(initialize()),
    theme: {
      overrideTokens(source, tokens) {
        assert.equal(source, id)
        assert.equal(activeTokens, undefined)
        activeTokens = tokens
        return () => { activeTokens = undefined }
      },
    },
  })

  assert.equal(disposers.length, 2)
  const palette = {
    '--dsw-alias-bg-base': { light: '#FAF9F5', dark: '#262624' },
    '--dsw-specific-sidebar-fill': { light: '#F5F4ED', dark: '#1F1E1D' },
    '--dsw-alias-button-primary-fill': { light: '#AD4E32', dark: '#D97757' },
    '--dsw-alias-label-primary-foreground': { light: '#FFFFFF', dark: '#141413' },
  }
  for (const [token, modes] of Object.entries(palette)) {
    assert.deepEqual({ ...activeTokens[token] }, modes, token)
  }
  for (const { light, dark } of Object.values(activeTokens)) {
    assert.equal(typeof light, 'string')
    assert.equal(typeof dark, 'string')
  }
  assert.equal(styles.size, 1)
  const [style] = styles
  assert.equal(style.dataset.plugin, id)
  assert.equal(style.dataset.pluginCss, `${id}/claude-ui.css`)
  const fonts = ['figtree-var-latin.woff2', 'source-serif-4-var-latin.woff2', 'jetbrains-mono-400-latin.woff2']
  const embeddedFonts = [...style.textContent.matchAll(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/g)]
  assert.equal(embeddedFonts.length, fonts.length)
  for (const [index, filename] of fonts.entries()) {
    const font = await readFile(new URL(`../assets/fonts/${filename}`, import.meta.url))
    assert.deepEqual(Buffer.from(embeddedFonts[index][1], 'base64'), font)
  }

  for (const dispose of disposers.reverse()) dispose()
  assert.equal(styles.size, 0)
  assert.equal(activeTokens, undefined)
})
