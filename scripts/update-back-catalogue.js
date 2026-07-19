/**
 * Generates public/experiences/catalogue.json: one experience manifest per
 * album published on music.projectbluefin.io (which serves the documentation
 * repo's music page).
 *
 * Source-of-truth mapping (documentation repo -> manifest):
 * - static/data/playlist-metadata.json, published at
 *   https://docs.projectbluefin.io/data/playlist-metadata.json, is the album
 *   index: { id (YouTube playlist id), title, description, thumbnailUrl,
 *   playlistUrl }.
 * - Album cover: https://docs.projectbluefin.io/img/playlists/<id>.jpg,
 *   downloaded byte-for-byte (no re-encode) to public/experiences/<id>.jpg.
 * - Per-album tracks come from yt-dlp --flat-playlist against playlistUrl:
 *   entry.id -> youtubeId, entry.title -> "Artist - Title" split (uploader
 *   fallback), entry.duration -> durationSeconds, best entry thumbnail ->
 *   original-resolution track artwork URL (never downscaled).
 *
 * Follows the scripts/update-wolves-playlist.js convention. Idempotent:
 * re-running rewrites the catalogue from current source data, picking up new
 * albums automatically. Run: npm run update:back-catalogue
 */

import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const METADATA_URL = 'https://docs.projectbluefin.io/data/playlist-metadata.json'
const COVER_URL = id => `https://docs.projectbluefin.io/img/playlists/${id}.jpg`
const MODULE_PATH = import.meta.url.startsWith('file:')
  ? fileURLToPath(import.meta.url)
  : null
const ROOT_DIR = MODULE_PATH ? resolve(dirname(MODULE_PATH), '..') : process.cwd()
const EXPERIENCES_DIR = join(ROOT_DIR, 'public', 'experiences')

function bestThumbnail(entry) {
  if (Array.isArray(entry.thumbnails) && entry.thumbnails.length > 0) {
    const last = entry.thumbnails[entry.thumbnails.length - 1]
    if (last && typeof last.url === 'string' && last.url.length > 0) {
      return last.url.split('?')[0]
    }
  }
  return `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`
}

export function buildSegments(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError('Malformed yt-dlp output: expected an entries array')
  }
  return entries.map((entry, index) => {
    if (!entry || typeof entry.id !== 'string' || typeof entry.title !== 'string') {
      throw new TypeError(`Malformed yt-dlp entry at index ${index}`)
    }
    const [artistPrefix, ...titleParts] = entry.title.split(' - ')
    const hasArtistPrefix = titleParts.length > 0
    return {
      id: entry.id,
      kind: 'youtube',
      youtubeId: entry.id,
      chapter: `TRACK ${index + 1}`,
      title: hasArtistPrefix ? titleParts.join(' - ').trim() : entry.title,
      artist: hasArtistPrefix ? artistPrefix.trim() : (entry.uploader ?? entry.channel ?? ''),
      artwork: bestThumbnail(entry),
      // ponytail: 240s fallback only shapes the seek-bar mapping; the player
      // reports the real duration once the video loads.
      durationSeconds: Math.round(entry.duration ?? 240),
    }
  })
}

export function buildExperience(album, entries) {
  return {
    id: album.id,
    title: album.title,
    subtitle: album.description,
    artwork: `experiences/${album.id}.jpg`,
    segments: buildSegments(entries),
  }
}

function readPlaylistEntries(playlistUrl) {
  const output = execFileSync('yt-dlp', ['--flat-playlist', '--dump-single-json', playlistUrl], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  return JSON.parse(output).entries
}

async function download(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download failed for ${url}: ${response.status}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

export async function main() {
  const albums = await (await fetch(METADATA_URL)).json()
  if (!Array.isArray(albums)) {
    throw new TypeError('Malformed playlist metadata: expected an array')
  }

  await mkdir(EXPERIENCES_DIR, { recursive: true })
  const experiences = []
  for (const album of albums) {
    console.info(`Reading ${album.title} (${album.id})`)
    const entries = readPlaylistEntries(album.playlistUrl)
    experiences.push(buildExperience(album, entries))
    await writeFile(join(EXPERIENCES_DIR, `${album.id}.jpg`), await download(COVER_URL(album.id)))
  }

  await writeFile(
    join(EXPERIENCES_DIR, 'catalogue.json'),
    `${JSON.stringify({ experiences }, null, 2)}\n`,
  )
  console.info(`Wrote ${experiences.length} experiences to public/experiences/catalogue.json`)
}

if (MODULE_PATH && process.argv[1] && MODULE_PATH === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
