import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const targetVersions = { dsh: '0.2.2-rc.5', cordis: '4.1.0' }

function installedVersions(installDir) {
  const manifest = resolve(installDir, 'package.json')
  if (existsSync(manifest)) {
    const load = createRequire(manifest)
    return { dsh: load('./package.json').version, cordis: load('@deepseek-ai/cordis/package.json').version }
  }

  // A stock Node process cannot read the Desktop ASAR. Use the installed Electron runtime.
  const electron = process.env.DSH_NODE_EXECUTABLE
  if (!electron) throw new Error(`DSH package manifest is unavailable at ${manifest}`)
  const output = execFileSync(electron, ['-e', `
    const load = require('node:module').createRequire(process.argv[1])
    console.log(JSON.stringify({
      dsh: load('./package.json').version,
      cordis: load('@deepseek-ai/cordis/package.json').version,
    }))
  `, manifest], {
    encoding: 'utf8',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  })
  return JSON.parse(output)
}

const installDir = process.env.DSH_INSTALL_DIR
const versions = installDir ? installedVersions(installDir) : targetVersions
const pins = [
  ['@deepseek-ai/cordis', versions.cordis],
  ['@deepseek-ai/dsh-client-ui-theme', versions.dsh],
]
const installCommand = `npm install -D --save-exact ${pins.map(([name, version]) => `${name}@${version}`).join(' ')}`

if (process.argv.includes('--check')) {
  const { devDependencies } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  for (const [name, version] of pins) {
    if (devDependencies[name] === version) continue
    console.error(`${name} is pinned to ${devDependencies[name] ?? '(missing)'}. Expected ${version}.`)
    process.exitCode = 1
  }
  if (process.exitCode) console.error(`Run: ${installCommand}`)
  else console.log(`Type packages match DSH ${versions.dsh} and Cordis ${versions.cordis}`)
} else {
  console.log(installCommand)
}
