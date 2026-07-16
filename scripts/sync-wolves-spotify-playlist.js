import { createHash, randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSpotifyCatalog } from '../src/data/wolves-playback.ts'
import { wolvesSpotifyCatalog } from '../src/data/wolves-spotify-catalog.ts'

const SCOPES = ['playlist-modify-public', 'user-read-private', 'user-read-email']
const REDIRECT_URI = 'http://127.0.0.1:5174/wolves-spotify-callback'
const MODULE_PATH = import.meta.url.startsWith('file:')
  ? fileURLToPath(import.meta.url)
  : null
const ROOT_DIR = MODULE_PATH ? resolve(dirname(MODULE_PATH), '..') : process.cwd()
const PLAYLIST_NAME = 'Bluefin: Seven Days to the Wolves'

function arraysMatch(first, second) {
  return first.length === second.length && first.every((item, index) => item === second[index])
}

export function assertExactPlaylistItems(actualUris, expectedUris) {
  if (actualUris.length !== expectedUris.length) {
    throw new Error(`Spotify playlist item count mismatch: expected ${expectedUris.length}, received ${actualUris.length}`)
  }

  for (const [index, expectedUri] of expectedUris.entries()) {
    if (actualUris[index] !== expectedUri) {
      throw new Error(`Spotify playlist item mismatch at index ${index}: expected "${expectedUri}", received "${actualUris[index]}"`)
    }
  }
}

export function assertCatalogEntry(track, catalogEntry) {
  if (!catalogEntry?.spotifyUri) {
    throw new Error(`YouTube video "${track.youtubeVideoId}" requires an approved Spotify track URI`)
  }

  return catalogEntry
}

export async function reconcilePlaylist({
  accessToken,
  playlistId,
  uris,
  getItems,
  replaceItems,
}) {
  const actualUris = await getItems(accessToken, playlistId)

  if (!arraysMatch(actualUris, uris)) {
    await replaceItems(accessToken, playlistId, uris)
  }
}

export async function syncWolvesSpotifyPlaylist({
  manifest,
  catalog,
  clientId,
  playlistId,
  authorize,
  getCurrentUser,
  createPlaylist,
  getItems,
  replaceItems,
}) {
  validateSpotifyCatalog(manifest.tracks, catalog)
  const uris = manifest.tracks.map((track, index) => assertCatalogEntry(track, catalog[index]).spotifyUri)

  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID is required for the local Spotify PKCE authorization flow')
  }

  const accessToken = await authorize(clientId)
  let resolvedPlaylistId = playlistId
  let playlistUrl = playlistId
    ? `https://open.spotify.com/playlist/${encodeURIComponent(playlistId)}`
    : undefined

  if (!resolvedPlaylistId) {
    const user = await getCurrentUser(accessToken)
    const playlist = await createPlaylist(accessToken, user.id)
    resolvedPlaylistId = playlist.id
    playlistUrl = playlist.url
  }

  await reconcilePlaylist({
    accessToken,
    playlistId: resolvedPlaylistId,
    uris,
    getItems,
    replaceItems,
  })

  return { playlistId: resolvedPlaylistId, playlistUrl }
}

function generatePkce() {
  const verifier = randomBytes(64).toString('base64url')

  return {
    verifier,
    challenge: createHash('sha256').update(verifier).digest('base64url'),
    state: randomBytes(32).toString('base64url'),
  }
}

function waitForAuthorizationCode(state) {
  return new Promise((resolveCode, rejectCode) => {
    const server = createServer((request, response) => {
      const callbackUrl = new URL(request.url ?? '/', REDIRECT_URI)

      if (callbackUrl.pathname !== '/wolves-spotify-callback') {
        response.writeHead(404).end()
        return
      }

      const finish = (error, code) => {
        server.close()
        if (error) {
          rejectCode(error)
        }
        else {
          resolveCode(code)
        }
      }

      const authorizationError = callbackUrl.searchParams.get('error')
      if (authorizationError) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Spotify authorization was denied. You can close this window.')
        finish(new Error(`Spotify authorization was denied: ${authorizationError}`))
        return
      }

      if (callbackUrl.searchParams.get('state') !== state) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Spotify authorization state did not match. You can close this window.')
        finish(new Error('Spotify authorization state did not match'))
        return
      }

      const code = callbackUrl.searchParams.get('code')
      if (!code) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Spotify did not return an authorization code. You can close this window.')
        finish(new Error('Spotify authorization did not return a code'))
        return
      }

      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
      response.end('Spotify authorization complete. You can close this window.')
      finish(undefined, code)
    })

    server.once('error', (error) => {
      rejectCode(new Error(`Could not start the Spotify callback listener: ${error.message}`))
    })
    server.listen(5174, '127.0.0.1')
  })
}

async function authorizeWithPkce(clientId) {
  const { challenge, state, verifier } = generatePkce()
  const authorizationUrl = new URL('https://accounts.spotify.com/authorize')
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
  }).toString()

  const codePromise = waitForAuthorizationCode(state)
  console.info(`Open this URL in a browser to authorize the Wolves playlist sync:\n${authorizationUrl}`)
  const code = await codePromise
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  })
  const token = await readJsonResponse(response, 'Spotify token exchange')

  if (typeof token.access_token !== 'string' || token.access_token.length === 0) {
    throw new Error('Spotify token exchange returned a malformed access token')
  }

  return token.access_token
}

async function readJsonResponse(response, operation) {
  if (!response.ok) {
    throw new Error(`${operation} failed: ${response.status}`)
  }

  try {
    return await response.json()
  }
  catch {
    throw new Error(`${operation} returned malformed JSON`)
  }
}

async function spotifyRequest(accessToken, url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  })

  return readJsonResponse(response, 'Spotify API request')
}

async function getCurrentUser(accessToken) {
  const user = await spotifyRequest(accessToken, 'https://api.spotify.com/v1/me')
  if (typeof user.id !== 'string' || user.id.length === 0) {
    throw new Error('Spotify profile response was malformed')
  }

  return user
}

async function createPlaylist(accessToken, userId) {
  const playlist = await spotifyRequest(
    accessToken,
    `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: PLAYLIST_NAME,
        public: true,
      }),
    },
  )

  if (
    typeof playlist.id !== 'string'
    || playlist.id.length === 0
    || typeof playlist.external_urls?.spotify !== 'string'
  ) {
    throw new Error('Spotify playlist creation response was malformed')
  }

  return { id: playlist.id, url: playlist.external_urls.spotify }
}

async function getPlaylistItems(accessToken, playlistId) {
  const uris = []
  let nextUrl = new URL(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/items`)
  nextUrl.searchParams.set('limit', '100')

  while (nextUrl) {
    const page = await spotifyRequest(accessToken, nextUrl)
    if (!Array.isArray(page.items) || (page.next !== null && typeof page.next !== 'string')) {
      throw new Error('Spotify playlist items response was malformed')
    }

    for (const playlistItem of page.items) {
      const uri = playlistItem?.item?.uri
      if (typeof uri !== 'string' || !uri.startsWith('spotify:track:')) {
        throw new Error('Spotify playlist items response contained a malformed track URI')
      }
      uris.push(uri)
    }

    nextUrl = page.next ? new URL(page.next) : null
  }

  return uris
}

async function replacePlaylistItems(accessToken, playlistId, uris) {
  const playlistUrl = `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/items`
  const [firstBatch, ...remainingBatches] = splitIntoBatches(uris, 100)
  await spotifyRequest(accessToken, playlistUrl, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ uris: firstBatch }),
  })

  for (const batch of remainingBatches) {
    await spotifyRequest(accessToken, playlistUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uris: batch }),
    })
  }
}

function splitIntoBatches(items, size) {
  const batches = []
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size))
  }
  return batches
}

async function readManifest() {
  let manifest

  try {
    manifest = JSON.parse(await readFile(resolve(ROOT_DIR, 'public/wolves-playlist.json'), 'utf8'))
  }
  catch (error) {
    throw new Error(`Could not read Wolves playlist manifest: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (!Array.isArray(manifest?.tracks)) {
    throw new TypeError('Wolves playlist manifest is malformed')
  }

  return manifest
}

export async function main() {
  const existingPlaylistId = process.env.SPOTIFY_WOLVES_PLAYLIST_ID
  const result = await syncWolvesSpotifyPlaylist({
    manifest: await readManifest(),
    catalog: wolvesSpotifyCatalog,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    playlistId: existingPlaylistId,
    authorize: authorizeWithPkce,
    getCurrentUser,
    createPlaylist,
    getItems: getPlaylistItems,
    replaceItems: replacePlaylistItems,
  })

  if (!existingPlaylistId) {
    console.info(`Created public Spotify playlist: ${result.playlistUrl}`)
    console.info(`Set SPOTIFY_WOLVES_PLAYLIST_ID=${result.playlistId} before the next sync.`)
  }
  else {
    console.info(`Reconciled Spotify playlist: ${result.playlistUrl}`)
  }
}

if (MODULE_PATH && process.argv[1] && MODULE_PATH === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
