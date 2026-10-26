#!/usr/bin/env node

// Vendors @holdmybill/claims into the website repo, which consumes a
// copy instead of an npm package. Copies packages/claims/src/**/*.js to
// <web>/lib/claims/core/ (same folder layout) with a "generated" header.
//
//   node scripts/sync-web.mjs [--web ../ourbits_hmb_web] [--check]
//
// --check writes nothing and exits 1 if the vendored copy has drifted.

import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const root = resolve(import.meta.dirname, '..')
const srcDir = join(root, 'packages/claims/src')

const { values } = parseArgs({
  options: {
    web: {
      type: 'string',
      default: process.env.HMB_WEB_DIR || '../ourbits_hmb_web'
    },
    check: { type: 'boolean', default: false }
  }
})

const webDir = resolve(root, values.web)
const outDir = join(webDir, 'lib/claims/core')

if (!existsSync(join(webDir, 'package.json'))) {
  console.error(`Website repo not found at ${webDir} (pass --web <path>)`)
  process.exit(2)
}

const pkg = JSON.parse(
  await readFile(join(root, 'packages/claims/package.json'), 'utf8')
)

function header(file) {
  return [
    `// GENERATED from ${pkg.name}@${pkg.version} (warranty_claim_plugin/packages/claims/src/${file}).`,
    '// Do not edit here: change the package, then run `pnpm sync:web` in warranty_claim_plugin.',
    ''
  ].join('\n')
}

// Relative paths with forward slashes, e.g. "letters/en.js"
async function jsFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { recursive: true })
  return entries
    .map(entry => entry.split('\\').join('/'))
    .filter(entry => entry.endsWith('.js'))
    .sort()
}

const files = await jsFiles(srcDir)
const expected = new Map()
for (const file of files) {
  expected.set(
    file,
    header(file) + (await readFile(join(srcDir, file), 'utf8'))
  )
}

const present = await jsFiles(outDir)

const drift = []
for (const [file, content] of expected) {
  const current = present.includes(file)
    ? await readFile(join(outDir, file), 'utf8')
    : null
  if (current !== content)
    drift.push(current === null ? `missing ${file}` : `changed ${file}`)
}
for (const file of present) {
  if (!expected.has(file)) drift.push(`stale ${file}`)
}

if (values.check) {
  if (drift.length) {
    console.error(
      `Vendored claims in ${outDir} are out of date:\n  ${drift.join('\n  ')}`
    )
    console.error('Run `pnpm sync:web` to update them.')
    process.exit(1)
  }
  console.log(`Vendored claims in ${outDir} match ${pkg.name}@${pkg.version}.`)
  process.exit(0)
}

await mkdir(outDir, { recursive: true })
for (const [file, content] of expected) {
  await mkdir(dirname(join(outDir, file)), { recursive: true })
  await writeFile(join(outDir, file), content)
}
for (const file of present) {
  if (!expected.has(file)) await rm(join(outDir, file))
}
console.log(
  drift.length
    ? `Updated ${outDir}:\n  ${drift.join('\n  ')}`
    : `${outDir} already up to date.`
)
