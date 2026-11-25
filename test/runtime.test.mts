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
  const MockSwitch = () => null
  const client = registration.factory(specifier => {
    if (specifier === 'react') {
      return {
        createElement: (type, props, ...children) => ({ type, props, children }),
        useEffect: () => undefined,
        useState: value => [typeof value === 'function' ? value() : value, () => undefined],
      }
    }
    assert.equal(specifier, '@deepseek-ai/dsh-client-ui-primitives')
    return { Switch: MockSwitch }
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
  const tree = slotRegistration.component({ ...face })
  const findSwitch = (node) => {
    if (!node || typeof node !== 'object') return undefined
    if (node.type === MockSwitch) return node
    for (const child of node.children ?? []) {
      const match = findSwitch(child)
      if (match) return match
    }
    return undefined
  }
  const switchEl = findSwitch(tree)
  assert.ok(switchEl)
  assert.equal(switchEl.props.checked, true)
  assert.equal(switchEl.props.label, 'Claude-like UI')
  switchEl.props.onChange(false)
  assert.equal(activeTokens, undefined)
  assert.equal(styles.size, 1)
  face.setEnabled(true)
  assert.ok(activeTokens)
  assert.equal(styles.size, 2)

  const rowStyle = [...styles].find(item => item.dataset.pluginCss === `${id}/settings-row.css`)
  assert.ok(rowStyle)
  assert.equal(rowStyle.textContent.includes('.dsh-claude-skin-switch'), false)
  assert.equal(rowStyle.textContent.includes('.dsh-claude-skin-knob'), false)

  assert.equal(disposers.length, 3)
  const palette = {
    '--dsw-alias-bg-base': { light: '#FAF9F5', dark: '#262624' },
    '--dsw-specific-sidebar-fill': { light: '#F5F4ED', dark: '#1F1E1D' },
    '--dsw-alias-brand-primary': { light: '#AD4E32', dark: '#C6613F' },
    '--dsw-alias-button-primary-fill': { light: '#AD4E32', dark: '#B85636' },
    '--dsw-alias-button-primary-hover': { light: '#923E28', dark: '#C6613F' },
    '--dsw-alias-button-info-fill': { light: '#AD4E32', dark: '#C6613F' },
    '--dsw-alias-button-info-hover': { light: '#923E28', dark: '#D97757' },
    '--dsw-alias-label-primary-foreground': { light: '#FFFFFF', dark: '#FFFFFF' },
    '--dsw-alias-switch-thumb': { light: '#FFFFFF', dark: '#C2C0B6' },
    '--dsw-specific-sidebar-tint': {
      light: 'color-mix(in srgb, var(--dsw-specific-sidebar-fill) 45%, transparent)',
      dark: 'color-mix(in srgb, var(--dsw-specific-sidebar-fill) 55%, transparent)',
    },
    '--dsw-specific-sidebar-wash-top': { light: 'rgb(217 119 87 / 0.05)', dark: 'rgb(217 119 87 / 0.05)' },
    '--dsw-specific-sidebar-wash-bottom': { light: 'rgb(176 174 165 / 0.07)', dark: 'rgb(20 20 19 / 0.14)' },
  }
  for (const [token, modes] of Object.entries(palette)) {
    assert.deepEqual({ ...activeTokens[token] }, modes, token)
  }
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a, b) => {
    const [la, lb] = [lum(a), lum(b)]
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  }
  for (const mode of ['light', 'dark']) {
    assert.ok(contrast(activeTokens['--dsw-alias-label-primary-foreground'][mode], activeTokens['--dsw-alias-brand-primary'][mode]) >= 3)
    assert.ok(contrast(activeTokens['--dsw-alias-label-primary-foreground'][mode], activeTokens['--dsw-alias-button-primary-fill'][mode]) >= 4.5)
    assert.ok(contrast(activeTokens['--dsw-alias-label-on-color'][mode], activeTokens['--dsw-alias-button-info-fill'][mode]) >= 3)
    assert.ok(contrast(activeTokens['--dsw-alias-label-on-color'][mode], activeTokens['--dsw-alias-button-info-hover'][mode]) >= 3)
  }
  assert.ok(contrast(activeTokens['--dsw-alias-switch-thumb'].dark, activeTokens['--dsw-alias-border-l3'].dark) >= 3)
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
