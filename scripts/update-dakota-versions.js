#!/usr/bin/env node

/**
 * Script to update dakota-versions.json with SBOM-driven package versions.
 *
 * Sources of truth (in priority order):
 * 1. docs.projectbluefin.io/data/sbom-attestations.json  — kernel, gnome, mesa,
 *    bootc, systemd, podman, pipewire, flatpak from the live SBOM pipeline
 * 2. projectbluefin/dakota raw freedesktop-sdk.bst       — freedesktop-sdk version
 *    (parsed from the `ref:` tag; not in SBOM because it's a build junction)
 * 3. Existing values in dakota-versions.json             — fallback / manual fields
 *    (nvidia — not in SBOM; baseline — fixed string)
 *
 * IMPORTANT: freedesktop-sdk must be read from projectbluefin/dakota upstream
 * main, NOT from any local fork or feature branch.
 */

import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/dakota-versions.json')
const GITHUB_API = 'https://api.github.com'
const SBOM_URL = 'https://docs.projectbluefin.io/data/sbom-attestations.json'
const FDSDK_BST_URL
  = `${GITHUB_API}/repos/projectbluefin/dakota/contents/elements/freedesktop-sdk.bst`

async function main() {
  const headers = {
    'User-Agent': 'bluefin-website-updater',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  }

  const current = JSON.parse(fs.readFileSync(OUT, 'utf8'))

  // --- 1. SBOM-driven versions ---
  try {
    const sbomRes = await fetch(SBOM_URL)
    if (sbomRes.ok) {
      const sbom = await sbomRes.json()
      const stream = sbom?.streams?.['dakota-latest']
      const releases = stream?.releases ?? {}
      const latest = Object.values(releases)[0]
      if (latest) {
        const pv = latest.packageVersions ?? {}
        const all = pv.allPackages ?? {}
        // Top-level packageVersions fields
        const assign = (key, val) => {
          if (val) {
            current.packages[key] = val
          }
        }
        assign('kernel', pv.kernel)
        assign('gnome', pv.gnome)
        assign('mesa', pv.mesa)
        assign('systemd', pv.systemd)
        assign('podman', pv.podman)
        assign('pipewire', pv.pipewire)
        assign('flatpak', pv.flatpak)
        // bootc lives in allPackages
        assign('bootc', all.bootc)
        current.generatedAt = new Date().toISOString()
        console.info('[dakota-versions] SBOM versions updated')

        // nvidia from dakota-nvidia-latest stream
        const nvStream = sbom?.streams?.['dakota-nvidia-latest']
        const nvReleases = nvStream?.releases ?? {}
        const nvLatest = Object.values(nvReleases)[0]
        if (nvLatest) {
          assign('nvidia', nvLatest.packageVersions?.nvidia)
          console.info(`[dakota-versions] nvidia → ${nvLatest.packageVersions?.nvidia}`)
        }
      }
    }
    else {
      console.warn(`[dakota-versions] SBOM fetch returned ${sbomRes.status}`)
    }
  }
  catch (e) {
    console.warn('[dakota-versions] SBOM fetch failed:', e.message)
  }

  // --- 2. freedesktop-sdk from upstream dakota .bst (not in SBOM) ---
  try {
    const bstRes = await fetch(FDSDK_BST_URL, { headers })
    if (bstRes.ok) {
      const { content, encoding } = await bstRes.json()
      const raw = encoding === 'base64'
        ? Buffer.from(content, 'base64').toString()
        : content
      // ref: freedesktop-sdk-25.08.10-0-g...
      const match = raw.match(/ref:\s*freedesktop-sdk-([\d.]+)/)
      if (match) {
        current.packages['freedesktop-sdk'] = match[1]
        console.info(`[dakota-versions] freedesktop-sdk → ${match[1]}`)
      }
    }
    else {
      console.warn(`[dakota-versions] freedesktop-sdk.bst fetch returned ${bstRes.status}`)
    }
  }
  catch (e) {
    console.warn('[dakota-versions] freedesktop-sdk.bst fetch failed:', e.message)
  }

  fs.writeFileSync(OUT, `${JSON.stringify(current, null, 2)}\n`)
  console.info('[dakota-versions] wrote', OUT)
}

main().catch((e) => {
  console.error('[dakota-versions] error:', e.message)
  process.exit(0)
})
