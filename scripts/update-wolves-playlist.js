import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PLAYLIST_ID = 'PLA78oiE-RGAE'
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`
const MUSIC_URL = `https://music.youtube.com/playlist?list=${PLAYLIST_ID}`
const MODULE_PATH = import.meta.url.startsWith('file:')
  ? fileURLToPath(import.meta.url)
  : null
const ROOT_DIR = MODULE_PATH ? resolve(dirname(MODULE_PATH), '..') : process.cwd()
const PUBLIC_DIR = join(ROOT_DIR, 'public')

const TEMPO_CONFIGS = {
  'amKIngGUvCk': { bpm: 100, phraseBeats: 32, fadeDuration: 1500 },
  '9skBT5TUqzo': { bpm: 168, phraseBeats: 48, fadeDuration: 1000 },
  'Z--vLaXdlgk': { bpm: 86, phraseBeats: 24, fadeDuration: 2000 },
  '5OFLFVC11Cg': { bpm: 95, phraseBeats: 16, fadeDuration: 800 },
  'san94Q93IcY': { bpm: 124, phraseBeats: 32, fadeDuration: 1200 },
  'rYkYLIYvI18': { bpm: 174, phraseBeats: 64, fadeDuration: 2500 },
}

const ARTIST_OVERRIDES = {
  '9skBT5TUqzo': 'Avatar',
}

function requireString(value, fieldName, index) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`Malformed yt-dlp entry at index ${index}: expected non-empty ${fieldName}`)
  }

  return value
}

function readThumbnailUrl(entry, index) {
  let thumbnailUrl = null

  if (typeof entry.thumbnail === 'string' && entry.thumbnail.length > 0) {
    thumbnailUrl = entry.thumbnail
  }
  else if (Array.isArray(entry.thumbnails)) {
    for (const thumbnail of entry.thumbnails) {
      if (thumbnail && typeof thumbnail === 'object' && typeof thumbnail.url === 'string' && thumbnail.url.length > 0) {
        thumbnailUrl = thumbnail.url
        break
      }
    }
  }

  if (!thumbnailUrl) {
    throw new TypeError(`Malformed yt-dlp entry at index ${index}: expected non-empty thumbnail`)
  }

  try {
    const url = new URL(thumbnailUrl)
    if (url.hostname === 'i.ytimg.com' && url.pathname.endsWith('.jpg')) {
      return `${url.origin}${url.pathname}`
    }
  }
  catch {}

  return thumbnailUrl
}

export function normalizePlaylistEntries(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError('Malformed yt-dlp output: expected an entries array')
  }

  return entries.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new TypeError(`Malformed yt-dlp entry at index ${index}: expected an object`)
    }

    const id = requireString(entry.id, 'id', index)
    const title = requireString(entry.title, 'title', index)
    const uploader = requireString(entry.uploader, 'uploader', index)
    const thumbnail = readThumbnailUrl(entry, index)
    const [artistPrefix, ...titleParts] = title.split(' - ')
    const hasArtistPrefix = titleParts.length > 0

    return {
      id,
      title: hasArtistPrefix ? titleParts.join(' - ').trim() : title,
      artist: ARTIST_OVERRIDES[id] ?? (hasArtistPrefix ? artistPrefix.trim() : uploader),
      youtubeVideoId: id,
      artwork: `wolves-artwork/${id}.jpg`,
      thumbnailUrl: thumbnail,
    }
  })
}

export function createManifest(tracks, existingManifest = null) {
  const existingSpotifyPlaylistUri = typeof existingManifest?.source?.spotifyUri === 'string'
    ? existingManifest.source.spotifyUri
    : null
  const existingSpotifyByVideoId = new Map(
    (existingManifest?.tracks ?? [])
      .filter(track => typeof track.spotifyUri === 'string')
      .map(track => [track.youtubeVideoId, track.spotifyUri]),
  )
  const hasApprovedSpotifyMappings = existingSpotifyByVideoId.size > 0

  return {
    source: {
      provider: 'youtube',
      playlistId: PLAYLIST_ID,
      playlistUrl: PLAYLIST_URL,
      musicUrl: MUSIC_URL,
      spotifyUri: existingSpotifyPlaylistUri,
    },
    tracks: tracks.map((track) => {
      if (hasApprovedSpotifyMappings && !existingSpotifyByVideoId.has(track.youtubeVideoId)) {
        throw new Error(`No approved Spotify URI for ${track.youtubeVideoId}`)
      }

      const { thumbnailUrl: _thumbnailUrl, ...manifestTrack } = track
      const tempo = TEMPO_CONFIGS[track.id]
      const spotifyUri = existingSpotifyByVideoId.get(track.youtubeVideoId)

      return {
        ...manifestTrack,
        ...tempo,
        ...(spotifyUri ? { spotifyUri } : {}),
      }
    }),
  }
}

function readPlaylistEntries() {
  let output

  try {
    output = execFileSync('yt-dlp', ['--flat-playlist', '--dump-single-json', PLAYLIST_URL], {
      encoding: 'utf8',
    })
  }
  catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('yt-dlp is required to generate wolves playlist metadata')
    }

    const stderr = error && typeof error === 'object' && 'stderr' in error && typeof error.stderr === 'string'
      ? error.stderr.trim()
      : ''

    throw new Error(stderr
      ? `yt-dlp failed to read the Wolves playlist: ${stderr}`
      : 'yt-dlp failed to read the Wolves playlist')
  }

  let parsed

  try {
    parsed = JSON.parse(output)
  }
  catch {
    throw new Error('Malformed yt-dlp output: expected valid JSON')
  }

  return normalizePlaylistEntries(parsed.entries)
}

async function downloadArtwork(track) {
  const response = await fetch(track.thumbnailUrl)
  if (!response.ok) {
    throw new Error(`Artwork download failed for ${track.id}: ${response.status}`)
  }

  return {
    path: join(PUBLIC_DIR, track.artwork),
    body: Buffer.from(await response.arrayBuffer()),
  }
}

export async function main() {
  const tracks = readPlaylistEntries()
  const downloads = await Promise.all(tracks.map(downloadArtwork))
  const existingManifest = await readExistingManifest()

  await mkdir(join(PUBLIC_DIR, 'wolves-artwork'), { recursive: true })
  await Promise.all(downloads.map(download => writeFile(download.path, download.body)))
  await writeFile(
    join(PUBLIC_DIR, 'wolves-playlist.json'),
    `${JSON.stringify(createManifest(tracks, existingManifest), null, 2)}\n`,
  )
}

async function readExistingManifest() {
  try {
    return JSON.parse(await readFile(join(PUBLIC_DIR, 'wolves-playlist.json'), 'utf8'))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw new Error(`Could not read existing Wolves playlist manifest: ${error instanceof Error ? error.message : String(error)}`)
  }
}

if (MODULE_PATH && process.argv[1] && MODULE_PATH === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
