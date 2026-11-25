import { execFileSync, spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, copyFile, mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const project = fileURLToPath(new URL('../', import.meta.url))
const [toolsArgument, ...extraArguments] = process.argv.slice(2)
if (toolsArgument === '--help' || extraArguments.length > 0) {
  console.log('Usage: node scripts/capture-screenshots.mts [default-workspace/tools]')
  process.exit(extraArguments.length > 0 ? 1 : 0)
}
const tools = resolve(toolsArgument ?? join(project, '../../tools'))
const files = {
  prepare: join(tools, 'dsh-web-dev.mts'),
  model: join(tools, 'dsh-mock-llm.mts'),
  page: join(tools, 'dsh-web-drive/lib/page.mts'),
  cdp: join(tools, 'dsh-web-drive/lib/cdp.mts'),
}
try {
  await Promise.all(Object.values(files).map(file => access(file)))
} catch {
  console.error(`DSH test tools not found in ${tools}. Pass the default-workspace tools directory as an argument.`)
  process.exit(1)
}

const runDir = await realpath(await mkdtemp(join(tmpdir(), 'dsh-claudelike-preview-')))
const fixture = join(runDir, 'Theme preview')
const profileDir = join(runDir, 'dsh')
const outputDir = join(project, 'docs', 'images')
const services = []
const redact = text => text.replace(/([?&]token=)[^\s]+/g, '$1[redacted]')
let page
let cleanupTask

function startService(command, args, options, ready, description) {
  const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] })
  const closed = new Promise(done => child.once('close', done))
  services.push({ child, closed })
  return new Promise((done, reject) => {
    let output = ''
    const timeout = setTimeout(() => {
      reject(new Error(`${description} did not start within 30 seconds.\n${redact(output)}`))
    }, 30_000)
    const receive = chunk => {
      output = (output + chunk).slice(-6000)
      const address = output.match(ready)?.[0]
      if (address !== undefined) {
        clearTimeout(timeout)
        done(address)
      }
    }
    for (const stream of [child.stdout, child.stderr]) {
      stream.setEncoding('utf8')
      stream.on('data', receive)
    }
    child.once('error', error => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('close', code => {
      clearTimeout(timeout)
      reject(new Error(`${description} exited (${code}).\n${redact(output)}`))
    })
  })
}

function cleanup() {
  cleanupTask ??= (async () => {
    try {
      await page?.close()
    } finally {
      for (const { child, closed } of services.reverse()) {
        child.kill('SIGTERM')
        const exited = await Promise.race([closed.then(() => true), delay(2000, false, { ref: false })])
        if (!exited) child.kill('SIGKILL')
        await closed
      }
      await rm(runDir, { recursive: true, force: true })
    }
  })()
  return cleanupTask
}

for (const [signal, code] of [['SIGINT', 130], ['SIGTERM', 143]]) {
  process.once(signal, () => cleanup().finally(() => process.exit(code)))
}

const prompt = 'Show me how semantic color tokens support both themes.'
const reply = [
  '## Theme tokens',
  '',
  'A semantic token gives the same UI role a suitable color in both modes. The canvas uses a warm paper tone in light mode and charcoal in dark mode.',
  '',
  '```css',
  '.canvas {',
  '  background: var(--dsw-alias-bg-base);',
  '  color: var(--dsw-alias-label-primary);',
  '}',
  '```',
].join('\n')

try {
  await mkdir(fixture)
  process.env.TMPDIR = runDir
  if (process.platform === 'darwin') {
    const chrome = resolve(process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    await access(chrome, constants.X_OK)
    const launcher = join(runDir, 'chrome')
    await writeFile(launcher, '#!/bin/sh\nexec "$DSH_PREVIEW_CHROME" --use-mock-keychain --disable-background-networking "$@"\n', { mode: 0o700 })
    process.env.DSH_PREVIEW_CHROME = chrome
    process.env.CHROME_BIN = launcher
  }
  const { freePort } = await import(pathToFileURL(files.cdp))
  const { open, byLabel, byText } = await import(pathToFileURL(files.page))
  const env = {
    ...process.env,
    XDG_CACHE_HOME: join(runDir, 'cache'),
    XDG_CONFIG_HOME: join(runDir, 'config'),
    XDG_STATE_HOME: join(runDir, 'state'),
    npm_config_cache: join(runDir, 'npm'),
  }
  execFileSync(process.execPath, [files.prepare, 'prepare', '--workspace', fixture,
    '--home', profileDir, '--plugin', project], { cwd: fixture, env, stdio: 'inherit', timeout: 60_000 })

  const modelPort = await freePort()
  const modelUrl = await startService(process.execPath, [files.model, '--port', String(modelPort),
    '--reply', reply, '--title', 'Theme tokens'], { cwd: fixture, env }, /http:\/\/127\.0\.0\.1:\d+\/v1/, 'Preview model')
  const patch = join(runDir, 'preview.json')
  await writeFile(patch, JSON.stringify([
    {
      id: 'llm-pi-ai',
      config: {
        providers: {
          mock: {
            displayName: 'Preview', apiKeyEnv: 'DSH_PREVIEW_API_KEY', api: 'openai-completions', baseURL: modelUrl,
            models: [{ id: 'mock/fixture', name: 'Preview model', contextWindow: 128000, maxTokens: 4096, input: ['text'] }],
          },
        },
      },
    },
    { id: 'agent-default-model', config: { provider: 'mock', model: 'mock/fixture' } },
  ]))
  const address = await startService('dsh', ['--profile', 'web', '--patch', patch, '--no-open', '--host', '127.0.0.1', '--port', '0'], {
    cwd: fixture,
    env: { ...env, DSH_HOME: profileDir, DSH_PREVIEW_API_KEY: 'fixture' },
  }, /http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_.~%=-]+(?=\s)/, 'DSH Web')
  console.log(`Preview running at ${new URL(address).origin}`)

  page = await open(address, { scheme: 'light', viewport: { width: 1280, height: 760, mobile: false } })
  const input = '[data-composer-input="true"]'
  const title = '[data-phase="hero"] [class*="_headline"] > [class*="_titleGroup"] > :first-child'
  const send = `(${byLabel('Send message')}) ?? (${byLabel('发送消息')})`
  const consent = `(${byText('Continue', '[role="dialog"] button')}) ?? (${byText('继续', '[role="dialog"] button')})`
  await page.waitFor(`document.querySelector('${input}') && Boolean(document.querySelector('style[data-plugin="dsh-claudelike-ui"]'))`, 30_000)
  await page.click(consent)
  await page.waitFor(`document.querySelector('[role="dialog"]') === null`, 10_000)
  await page.waitFor(`Boolean(document.querySelector('${title}'))`, 8000)

  async function setScheme(scheme) {
    const dark = scheme === 'dark'
    await page.session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] })
    await page.waitFor(`document.body.hasAttribute('data-ds-dark-theme') === ${dark}`, 8000)
  }

  const titleWeights = {}
  for (const scheme of ['light', 'dark']) {
    await setScheme(scheme)
    const weight = await page.eval(`getComputedStyle(document.querySelector('${title}')).fontWeight`)
    if (weight !== '300') throw new Error(`${scheme} welcome title has font weight ${weight}, expected 300`)
    titleWeights[scheme] = weight
  }

  await setScheme('light')
  await page.typeInto(input, prompt)
  await page.waitFor(`(${send})?.disabled === false`, 8000)
  const sendColors = {
    light: { fill: 'rgb(173, 78, 50)', hover: 'rgb(146, 62, 40)' },
    dark: { fill: 'rgb(217, 119, 87)', hover: 'rgb(197, 104, 73)' },
  }
  for (const [scheme, { fill, hover }] of Object.entries(sendColors)) {
    await setScheme(scheme)
    await page.waitFor(`getComputedStyle(${send}).backgroundColor === '${fill}'`, 8000)
    await page.hover(send)
    await page.waitFor(`getComputedStyle(${send}).backgroundColor === '${hover}'`, 8000)
    await page.session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 })
  }
  await setScheme('light')
  await page.click(send)
  await page.waitFor(`document.querySelector('[data-code-wrap] pre')?.textContent.includes('--dsw-alias-bg-base')`, 25_000)
  await page.waitFor(`(${send}) !== null`, 15_000)
  await page.eval('document.activeElement?.blur()')
  await page.session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 })

  async function capture(scheme) {
    await setScheme(scheme)
    await page.eval('document.fonts.ready.then(() => true)')
    const styles = await page.eval(`(() => {
      const css = getComputedStyle(document.body)
      const bubble = getComputedStyle(document.querySelector('[data-message-bubble]'))
      return {
        canvas: css.getPropertyValue('--dsw-alias-bg-base').trim(),
        sidebar: css.getPropertyValue('--dsw-specific-sidebar-fill').trim(),
        message: bubble.backgroundColor,
        messageRadius: bubble.borderRadius,
        code: getComputedStyle(document.querySelector('[data-code-wrap]')).backgroundColor,
        composer: getComputedStyle(document.querySelector('[data-composer-card]')).backgroundColor,
      }
    })()`)
    if (styles.messageRadius !== '18px') throw new Error(`${scheme} message bubble has radius ${styles.messageRadius}, expected 18px`)
    await page.shot(join(runDir, `preview-${scheme}.png`))
    return { ...styles, welcomeTitleWeight: titleWeights[scheme] }
  }

  const light = await capture('light')
  const dark = await capture('dark')
  if (!light.canvas || !dark.canvas || light.canvas === dark.canvas) throw new Error('The canvas color did not switch')

  await page.click(`(${byText('Plugins')}) ?? (${byText('插件')})`)
  const card = '[data-plugin-package="@miorin/dsh-claudelike-ui"]'
  const detail = '[data-plugin-detail="@miorin/dsh-claudelike-ui"]'
  const row = `${detail} [data-plugin-row$=":dsh-claudelike-ui"]`
  const whaleColors = {
    light: [[198, 97, 63], [77, 107, 254]],
    dark: [[217, 119, 87], [77, 107, 254]],
  }
  const imageReady = (container, scheme) => `(() => {
    const image = document.querySelector(${JSON.stringify(`${container} img`)})
    if (image?.naturalWidth !== 36 || image.naturalHeight !== 36 || !image.width || !image.height) return false
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * devicePixelRatio)
    canvas.height = Math.round(image.height * devicePixelRatio)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    return ${JSON.stringify(whaleColors[scheme])}.every(([red, green, blue]) =>
      pixels.some((channel, i) =>
        i % 4 === 0 && channel === red && pixels[i + 1] === green && pixels[i + 2] === blue && pixels[i + 3] === 255
      )
    )
  })()`
  for (const scheme of ['light', 'dark']) {
    await setScheme(scheme)
    await page.waitFor(imageReady(card, scheme), 8000)
  }
  await page.eval(`document.querySelector('${card}')?.scrollIntoView({ block: 'center' })`)
  await page.click(`document.querySelector('${card} button')`)
  for (const scheme of ['light', 'dark']) {
    await setScheme(scheme)
    await page.waitFor(`(${imageReady(detail, scheme)}) && (${imageReady(row, scheme)})`, 8000)
  }

  const { consoleErrors, exceptions, logErrors } = page.errors()
  const errors = [...exceptions, ...logErrors, ...consoleErrors.filter(message => message.startsWith('error:'))]
  if (errors.length > 0) throw new Error(`Browser errors:\n${errors.join('\n')}`)

  await mkdir(outputDir, { recursive: true })
  for (const file of ['preview-light.png', 'preview-dark.png']) {
    await copyFile(join(runDir, file), join(outputDir, file))
    console.log(join(outputDir, file))
  }
  console.log(JSON.stringify({ light, dark, send: sendColors, pluginIcon: { light: whaleColors.light, dark: whaleColors.dark } }, null, 2))
} catch (error) {
  console.error(redact(error.message))
  process.exitCode = 1
} finally {
  await cleanup()
}
