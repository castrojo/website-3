import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const playlistId = 'PLA78oiE-RGAE'
const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`
const outputPath = path.resolve('src/data/wolves-playlist.json')

function readPlaylistWithYtDlp() {
  const raw = execFileSync('yt-dlp', ['--dump-single-json', '--flat-playlist', playlistUrl], { encoding: 'utf8' })
  const parsed = JSON.parse(raw)
  return parsed
}

function fallbackManifest() {
  return {
    provider: {
      id: 'youtube',
      playlistId,
      playlistUrl,
      musicUrl: `https://music.youtube.com/playlist?list=${playlistId}`,
      spotifyUri: '',
    },
    tracks: [],
  }
}

function main() {
  let manifest = fallbackManifest()

  try {
    const playlist = readPlaylistWithYtDlp()
    manifest = {
      provider: manifest.provider,
      tracks: (playlist.entries || []).map(entry => ({
        title: entry.title || 'Unknown Title',
        artist: entry.uploader || entry.channel || 'Unknown Artist',
        videoId: entry.id || '',
        artwork: entry.thumbnail || '',
      })),
    }
  }
  catch (error) {
    console.warn('Could not refresh playlist with yt-dlp. Keeping fallback manifest.', error)
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.info(`Wrote wolves playlist manifest to ${outputPath}`)
}

main()
