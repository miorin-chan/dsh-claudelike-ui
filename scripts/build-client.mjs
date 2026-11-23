import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const templatePath = join(root, 'client.template.js')
const outputPath = join(root, 'client.js')

const fonts = {
  __FIGTREE_B64__: join(root, 'assets/fonts/figtree-var-latin.woff2'),
  __SOURCESERIF_B64__: join(root, 'assets/fonts/source-serif-4-var-latin.woff2'),
  __JETBRAINS_B64__: join(root, 'assets/fonts/jetbrains-mono-400-latin.woff2'),
}

let source = readFileSync(templatePath, 'utf8')
for (const [placeholder, file] of Object.entries(fonts)) {
  source = source.replaceAll(placeholder, readFileSync(file).toString('base64'))
}

writeFileSync(outputPath, source)
console.log(`wrote ${outputPath} (${Buffer.byteLength(source)} bytes)`)
