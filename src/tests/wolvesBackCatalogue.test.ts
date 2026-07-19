import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WolvesBackCatalogue from '@/components/wolves/WolvesBackCatalogue.vue'
import { parseBackCatalogue } from '@/config/experience-manifest'
import { resolveOverallRatioTarget, useCinematicStore, WOLVES_EXPERIENCE } from '@/stores/cinematic'
// @ts-expect-error script module is intentionally plain Node ESM
import { buildExperience, buildSegments } from '../../scripts/update-back-catalogue.js'

const ALBUM = {
  id: 'test-album',
  title: 'Test Album',
  artwork: 'experiences/test-album.jpg',
  segments: [
    { id: 'v1', kind: 'youtube' as const, youtubeId: 'v1', chapter: 'TRACK 1', title: 'One', artist: 'A', artwork: 'x.jpg', durationSeconds: 100 },
    { id: 'v2', kind: 'youtube' as const, youtubeId: 'v2', chapter: 'TRACK 2', title: 'Two', artist: 'B', artwork: 'y.jpg', durationSeconds: 200 },
  ],
}

describe('back catalogue experiences', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    // Module-level timeline state persists across tests; restore the default.
    useCinematicStore().loadExperience(WOLVES_EXPERIENCE)
    vi.unstubAllGlobals()
  })

  it('loads an album manifest into the shared cinematic runtime', () => {
    const store = useCinematicStore()
    store.loadExperience(ALBUM)

    expect(store.phase).toBe('lobby')
    expect(store.segmentCount).toBe(2)
    expect(store.segment.youtubeId).toBe('v1')

    store.enterCinematic()
    expect(store.segmentDuration).toBe(100)
    expect(store.overallDuration).toBe(300)

    // No authored intro for albums: ratio seeks map straight into the segments.
    expect(resolveOverallRatioTarget(0)).toEqual(expect.objectContaining({
      phase: 'cinematic',
      segmentIndex: 0,
    }))
    expect(resolveOverallRatioTarget(150 / 300)).toEqual(expect.objectContaining({
      phase: 'cinematic',
      segmentIndex: 1,
      segmentElapsed: 50,
    }))
  })

  it('restores the wolves experience with its intro timeline', () => {
    const store = useCinematicStore()
    store.loadExperience(ALBUM)
    store.loadExperience(WOLVES_EXPERIENCE)
    expect(store.segmentCount).toBe(6)
    expect(resolveOverallRatioTarget(0).phase).toBe('intro')
  })

  it('validates catalogue JSON at the fetch boundary', () => {
    expect(() => parseBackCatalogue({})).toThrow('experiences array')
    expect(() => parseBackCatalogue({ experiences: [{ id: 'x' }] })).toThrow('bad experience entry')
    expect(parseBackCatalogue({ experiences: [ALBUM] }).experiences).toHaveLength(1)
  })

  it('maps yt-dlp entries to manifest segments', () => {
    const segments = buildSegments([
      { id: 'abc', title: 'Nightwish - Storytime', duration: 323.4, thumbnails: [{ url: 'https://i.ytimg.com/vi/abc/maxresdefault.jpg?sqp=1' }] },
      { id: 'def', title: 'Untitled', uploader: 'Channel', duration: null },
    ])
    expect(segments[0]).toEqual(expect.objectContaining({
      youtubeId: 'abc',
      chapter: 'TRACK 1',
      title: 'Storytime',
      artist: 'Nightwish',
      artwork: 'https://i.ytimg.com/vi/abc/maxresdefault.jpg',
      durationSeconds: 323,
    }))
    expect(segments[1].artist).toBe('Channel')

    const experience = buildExperience(
      { id: 'PL123', title: 'Album', description: 'Sub', playlistUrl: 'u' },
      [{ id: 'abc', title: 'A - B', duration: 10 }],
    )
    expect(experience.artwork).toBe('experiences/PL123.jpg')
    expect(experience.segments).toHaveLength(1)
  })

  it('renders the grid from the catalogue and emits launch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ experiences: [ALBUM] }),
    })))

    const wrapper = mount(WolvesBackCatalogue)
    await flushPromises()

    const cards = wrapper.findAll('.wc-back-catalogue-card')
    expect(cards).toHaveLength(1)
    expect(wrapper.text()).toContain('BACK CATALOGUE')
    expect(wrapper.get('.wc-back-catalogue-art').attributes('src')).toContain('experiences/test-album.jpg')

    await cards[0].trigger('click')
    expect(wrapper.emitted('launch')?.[0]?.[0]).toEqual(expect.objectContaining({ id: 'test-album' }))
  })
})
