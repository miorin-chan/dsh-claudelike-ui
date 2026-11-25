import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import * as host from '@miorin/dsh-claudelike-ui'

const pkgName = '@miorin/dsh-claudelike-ui'
const id = 'dsh-claudelike-ui'

test('the Host export is the bundle entry', () => {
  assert.deepEqual(Object.keys(host), ['apply'])
  assert.equal(host.apply(), undefined)
})

test('the Client loads lazily, installs the skin, and disposes both effects', async () => {
  const source = await readFile(new URL(import.meta.resolve(`${pkgName}/client`)), 'utf8')
  const registrations = []
  const sandbox = { window: { __ModuleLoader__: { load: entry => registrations.push(entry) } } }
  runInNewContext(source, sandbox)
  assert.equal(registrations.length, 1)
  const [registration] = registrations
  assert.equal(registration.id, pkgName)
  const client = registration.factory(specifier => {
    assert.equal(specifier, 'react')
    return {
      createElement: () => null,
      useEffect: () => undefined,
      useState: value => [typeof value === 'function' ? value() : value, () => undefined],
    }
  })
  assert.deepEqual(Object.keys(client).sort(), ['apply', 'inject'])
  assert.deepEqual([...client.inject], ['theme', 'slots', 'locale'])

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
  let localeRegistration
  let slotRegistration
  let slotInject
  const slots = {
    inject(owner, callback) {
      assert.equal(owner, 'settings.general.item')
      slotInject = callback
    },
    register(options, component) {
      slotRegistration = { options, component }
      return () => undefined
    },
  }
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
    locale: {
      register(namespace, dictionaries) {
        localeRegistration = { namespace, dictionaries }
        return () => undefined
      },
    },
    slots,
  })

  assert.equal(localeRegistration.namespace, 'settings.claudeSkin')
  assert.equal(localeRegistration.dictionaries.en.title, 'Claude-like UI')
  assert.equal(styles.size, 2)
  assert.equal(typeof slotInject, 'function')
  slotInject()
  assert.equal(slotRegistration.options.name, 'settings.general.item')
  assert.equal(slotRegistration.options.id, 'claude-skin')
  assert.equal(slotRegistration.options.order, 13)
  assert.equal(slotRegistration.options.locale, 'settings.claudeSkin')
  assert.equal(typeof slotRegistration.component, 'function')
  const face = slotRegistration.options.inject()
  assert.equal(face.getEnabled(), true)
  face.setEnabled(false)
  assert.equal(activeTokens, undefined)
  assert.equal(styles.size, 1)
  face.setEnabled(true)
  assert.ok(activeTokens)
  assert.equal(styles.size, 2)

  assert.equal(disposers.length, 3)
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
  assert.equal(styles.size, 2)
  const style = [...styles].find(item => item.dataset.pluginCss === `${id}/claude-ui.css`)
  assert.ok(style)
  assert.equal(style.dataset.plugin, id)
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
