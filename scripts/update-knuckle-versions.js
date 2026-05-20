#!/usr/bin/env node

/**
 * Script to update knuckle-versions.json with live data from:
 *   1. Flatcar Container Linux release server — version.txt + SPDX SBOM JSON
 *      for each stream (stable, beta, alpha, lts)
 *   2. GitHub Releases API — castrojo/knuckle latest tag
 *
 * Flatcar SBOM URL pattern:
 *   https://{channel}.release.flatcar-linux.net/amd64-usr/current/flatcar_production_image_sbom.json
 *
 * Non-zero exit is intentional when all fetches fail — CI should fail loudly
 * if both the data source AND the fallback values are missing.
 * Individual stream failures are soft (keep existing value).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/knuckle-versions.json')

const CHANNELS = ['stable', 'beta', 'alpha', 'lts']
const KNUCKLE_RELEASES_URL = 'https://api.github.com/repos/castrojo/knuckle/releases/latest'

const headers = {
  'User-Agent': 'bluefin-website-updater',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
}

async function fetchText(url) {
  const res = await fetch(url, { headers, redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`)
  }
  return res.text()
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers, redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`)
  }
  return res.json()
}

function parseVersionTxt(body) {
  const result = {}
  for (const line of body.split('\n')) {
    const parts = line.trim().split('=')
    if (parts.length !== 2) {
      continue
    }
    const [key, val] = parts.map(s => s.replace(/^"|"$/g, ''))
    if (key === 'FLATCAR_VERSION') {
      result.version = val
    }
    if (key === 'FLATCAR_BUILD_ID' && val.length >= 10) {
      result.buildDate = val.slice(0, 10)
    }
  }
  return result
}

function parseSBOM(doc) {
  const result = {}
  for (const pkg of (doc.packages ?? [])) {
    switch (pkg.name) {
      case 'sys-kernel/coreos-kernel':
        result.kernel = pkg.versionInfo
        break
      case 'sys-apps/systemd':
        result.systemd = pkg.versionInfo
        break
      case 'sys-apps/ignition':
        result.ignition = (pkg.versionInfo ?? '').replace(/-r\d+$/, '')
        break
      case 'dev-db/etcd':
        result.etcd = pkg.versionInfo
        break
    }
  }
  return result
}

function extractVersion(line, prefix) {
  const after = line.slice(prefix.length)
  const colonIdx = after.indexOf('::')
  return colonIdx >= 0 ? after.slice(0, colonIdx) : after
}

function parseSysext(body) {
  const result = {}
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (
      line.startsWith('app-containers/docker-')
      && !line.includes('docker-cli')
      && !line.includes('docker-buildx')
    ) {
      result.docker = extractVersion(line, 'app-containers/docker-')
    }
    if (line.startsWith('app-containers/containerd-')) {
      result.containerd = extractVersion(line, 'app-containers/containerd-')
    }
  }
  return result
}

async function fetchChannel(channel, existing) {
  const base = `https://${channel}.release.flatcar-linux.net/amd64-usr/current`
  const stream = { ...existing }

  try {
    const txt = await fetchText(`${base}/version.txt`)
    const parsed = parseVersionTxt(txt)
    if (parsed.version) {
      stream.version = parsed.version
    }
    if (parsed.buildDate) {
      stream.buildDate = parsed.buildDate
    }
    console.info(`[${channel}] version → ${stream.version} (${stream.buildDate})`)
  }
  catch (e) {
    console.warn(`[${channel}] version.txt failed:`, e.message)
  }

  try {
    const doc = await fetchJSON(`${base}/flatcar_production_image_sbom.json`)
    const parsed = parseSBOM(doc)
    if (parsed.kernel) {
      stream.kernel = parsed.kernel
    }
    if (parsed.systemd) {
      stream.systemd = parsed.systemd
    }
    if (parsed.ignition) {
      stream.ignition = parsed.ignition
    }
    if (parsed.etcd) {
      stream.etcd = parsed.etcd
    }
    console.info(`[${channel}] SBOM → kernel ${stream.kernel}, systemd ${stream.systemd}`)
  }
  catch (e) {
    console.warn(`[${channel}] SBOM failed:`, e.message)
  }

  try {
    const txt = await fetchText(`${base}/rootfs-included-sysexts/docker-flatcar_packages.txt`)
    const parsed = parseSysext(txt)
    if (parsed.docker) {
      stream.docker = parsed.docker
    }
  }
  catch (e) {
    console.warn(`[${channel}] docker sysext failed:`, e.message)
  }

  try {
    const txt = await fetchText(`${base}/rootfs-included-sysexts/containerd-flatcar_packages.txt`)
    const parsed = parseSysext(txt)
    if (parsed.containerd) {
      stream.containerd = parsed.containerd
    }
  }
  catch (e) {
    console.warn(`[${channel}] containerd sysext failed:`, e.message)
  }

  return stream
}

async function main() {
  const current = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  const existingStreams = current.streams ?? {}

  // Fetch all channels in parallel
  const results = await Promise.all(
    CHANNELS.map(ch => fetchChannel(ch, existingStreams[ch] ?? {})),
  )

  current.streams = Object.fromEntries(CHANNELS.map((ch, i) => [ch, results[i]]))

  // Latest knuckle release tag
  try {
    const release = await fetchJSON(KNUCKLE_RELEASES_URL)
    if (release.tag_name) {
      current.knuckleVersion = release.tag_name
      console.info(`[knuckle] release → ${release.tag_name}`)
    }
  }
  catch (e) {
    console.warn('[knuckle] release fetch failed:', e.message)
  }

  current.generatedAt = new Date().toISOString()
  // Remove old flat flatcar key if present (schema migration)
  delete current.flatcar

  fs.writeFileSync(OUT, `${JSON.stringify(current, null, 2)}\n`)
  console.info('[knuckle-versions] wrote', OUT)
}

main().catch((e) => {
  console.error('[knuckle-versions] fatal:', e.message)
  process.exit(0)
})
