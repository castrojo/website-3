import { describe, expect, it, vi } from 'vitest'
// @ts-expect-error script module is intentionally plain Node ESM
import {
  assertCatalogEntry,
  assertExactPlaylistItems,
  reconcilePlaylist,
  syncWolvesSpotifyPlaylist,
} from '../sync-wolves-spotify-playlist.js'

const manifest = {
  source: {
    provider: 'youtube',
    playlistId: 'youtube-playlist',
    playlistUrl: 'https://www.youtube.com/playlist?list=youtube-playlist',
    musicUrl: 'https://music.youtube.com/playlist?list=youtube-playlist',
    spotifyUri: null,
  },
  tracks: [{
    id: 'video',
    title: 'Track',
    artist: 'Artist',
    artwork: 'wolves-artwork/video.jpg',
    youtubeVideoId: 'video',
  }],
}

describe('Wolves Spotify playlist reconciliation', () => {
  it('replaces a playlist only when its ordered item URI list differs', async () => {
    const replaceItems = vi.fn().mockResolvedValue(undefined)

    await reconcilePlaylist({
      accessToken: 'token',
      playlistId: 'playlist',
      uris: ['spotify:track:first', 'spotify:track:second'],
      getItems: vi.fn().mockResolvedValue(['spotify:track:second', 'spotify:track:first']),
      replaceItems,
    })

    expect(replaceItems).toHaveBeenCalledWith(
      'token',
      'playlist',
      ['spotify:track:first', 'spotify:track:second'],
    )
  })

  it('leaves a playlist with matching ordered item URIs untouched', async () => {
    const replaceItems = vi.fn()

    await reconcilePlaylist({
      accessToken: 'token',
      playlistId: 'playlist',
      uris: ['spotify:track:first', 'spotify:track:second'],
      getItems: vi.fn().mockResolvedValue(['spotify:track:first', 'spotify:track:second']),
      replaceItems,
    })

    expect(replaceItems).not.toHaveBeenCalled()
  })

  it('reports the first different playlist item', () => {
    expect(() => assertExactPlaylistItems(
      ['spotify:track:first', 'spotify:track:other'],
      ['spotify:track:first', 'spotify:track:second'],
    )).toThrow('Spotify playlist item mismatch at index 1')
  })

  it('rejects search results until a human-approved exact URI exists in the catalog', () => {
    expect(() => assertCatalogEntry({ youtubeVideoId: 'video' }, undefined))
      .toThrow('requires an approved Spotify track URI')
  })

  it('fails before authorization when the owner-approved catalog is absent', async () => {
    const authorize = vi.fn()

    await expect(syncWolvesSpotifyPlaylist({
      manifest,
      catalog: [],
      clientId: 'public-client-id',
      authorize,
    })).rejects.toThrow('Spotify catalog is missing mapping for YouTube video "video" at playlist index 0')

    expect(authorize).not.toHaveBeenCalled()
  })

  it('returns the owner playlist URL after reconciling its approved catalog', async () => {
    await expect(syncWolvesSpotifyPlaylist({
      manifest,
      catalog: [{
        youtubeVideoId: 'video',
        spotifyUri: 'spotify:track:approved',
        title: 'Track',
        artist: 'Artist',
      }],
      clientId: 'public-client-id',
      playlistId: 'owner-playlist',
      authorize: vi.fn().mockResolvedValue('token'),
      getCurrentUser: vi.fn(),
      createPlaylist: vi.fn(),
      getItems: vi.fn().mockResolvedValue(['spotify:track:approved']),
      replaceItems: vi.fn(),
    })).resolves.toEqual({
      playlistId: 'owner-playlist',
      playlistUrl: 'https://open.spotify.com/playlist/owner-playlist',
    })
  })
})
