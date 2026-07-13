import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WolvesComicReader from '../components/wolves/WolvesComicReader.vue'

const source = {
  provider: 'youtube',
  playlistId: '123',
  playlistUrl: 'https://www.youtube.com/playlist?list=123',
  musicUrl: 'https://music.youtube.com/playlist?list=123',
  spotifyUri: null,
}

const coverTrack = {
  id: 'track0',
  title: 'Cover Track',
  artist: 'Artist 0',
  artwork: 'wolves-artwork/track0.jpg',
  youtubeVideoId: '0',
}

const galleryPhotos = [
  { id: 'photo-a', server: '1', secret: 'a', title: 'Photo A' },
  { id: 'photo-b', server: '2', secret: 'b', title: 'Photo B' },
  { id: 'photo-c', server: '3', secret: 'c', title: 'Photo C' },
]

function mockGalleryData(tracks = [coverTrack], flickrResponse = new Response(JSON.stringify(galleryPhotos))) {
  vi.stubGlobal('fetch', vi.fn((url: string) => {
    if (url.includes('wolves-playlist.json')) {
      return Promise.resolve(new Response(JSON.stringify({ source, tracks })))
    }
    if (url.includes('flickr-photos.json')) {
      return Promise.resolve(flickrResponse)
    }
    return Promise.resolve(new Response(JSON.stringify({})))
  }))
}

function galleryCaption(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('.flickr-caption').text()
}

describe('wolvesComicReader', () => {
  beforeEach(() => {
    mockGalleryData()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the static cover before the soundtrack starts', () => {
    const wrapper = mount(WolvesComicReader)

    expect(wrapper.find('.cover-container img').attributes('src')).toContain('color-with-bluefin-cover.webp')
  })

  it('does not render manual page navigation', () => {
    const wrapper = mount(WolvesComicReader, {
      props: {
        trackIndex: 0,
        playlistCurrentTime: 180,
      },
    })

    expect(wrapper.find('button[aria-label="Previous page"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Next page"]').exists()).toBe(false)
  })

  it('enforces and codifies the alignment of jorge and bketelsen images during the thesis sequence', async () => {
    const wrapper = mount(WolvesComicReader, {
      props: {
        trackIndex: 0,
        playlistCurrentTime: 346, // "We've got your back." phase (Jorge Castro)
      },
    })

    // At 346s, the active slide should correspond to Jorge Castro (kubecon-54927705495.webp)
    expect(wrapper.find('.flickr-img').attributes('src')).toContain('kubecon-54927705495.webp')

    // Set time to 351s, the active slide should correspond to bketelsen.webp
    await wrapper.setProps({ playlistCurrentTime: 351 }) // "We are Universal Blue." phase

    // Check that one of the buffered/visible layers contains bketelsen.webp
    const srcs = wrapper.findAll('.flickr-img').map(el => el.attributes('src') || '')
    expect(srcs.some(src => src.includes('bketelsen.webp'))).toBe(true)
  })

  it('enforces and codifies the alignment of the heart picture at 5:19', async () => {
    const wrapper = mount(WolvesComicReader, {
      props: {
        trackIndex: 0,
        playlistCurrentTime: 319, // Exactly 5:19 on Track 0
      },
    })

    // At 319s (5:19), the active slide should correspond to the heart picture (kubecon-55168460993.webp)
    const srcs = wrapper.findAll('.flickr-img').map(el => el.attributes('src') || '')
    expect(srcs.some(src => src.includes('kubecon-55168460993.webp'))).toBe(true)
  })

  it('keeps each later-track Flickr sequence stable and refreshes it for the next track', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    mockGalleryData([
      coverTrack,
      {
        id: 'later-track-one',
        title: 'Later Track One',
        artist: 'Artist 1',
        artwork: 'wolves-artwork/later-track-one.jpg',
        youtubeVideoId: '1',
        bpm: 120,
        phraseBeats: 8,
      },
      {
        id: 'later-track-two',
        title: 'Later Track Two',
        artist: 'Artist 2',
        artwork: 'wolves-artwork/later-track-two.jpg',
        youtubeVideoId: '2',
        bpm: 120,
        phraseBeats: 8,
      },
    ])
    const wrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    const firstTrackStart = galleryCaption(wrapper)
    expect(firstTrackStart).toContain('CNCF STREAM //')

    await wrapper.setProps({ playlistCurrentTime: 10 })
    await wrapper.setProps({ playlistCurrentTime: 0 })
    expect(galleryCaption(wrapper)).toBe(firstTrackStart)

    await wrapper.setProps({ trackIndex: 2, playlistCurrentTime: 0 })
    await flushPromises()
    expect(galleryCaption(wrapper)).toContain('CNCF STREAM //')
    expect(galleryCaption(wrapper)).not.toBe(firstTrackStart)
  })

  it('uses local images for later tracks only when the Flickr feed is unavailable', async () => {
    mockGalleryData(
      [
        coverTrack,
        {
          id: 'later-track',
          title: 'Later Track',
          artist: 'Artist',
          artwork: 'wolves-artwork/later-track.jpg',
          youtubeVideoId: '1',
          bpm: 120,
          phraseBeats: 8,
        },
      ],
      new Response('Flickr unavailable', { status: 503 }),
    )
    const wrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    expect(galleryCaption(wrapper)).toContain('BLUEFIN SHOWCASE //')
  })

  it('keeps BPM-aligned slide holds above the approved minimum', async () => {
    mockGalleryData([
      coverTrack,
      {
        id: 'fast-phrases',
        title: 'Fast Phrases',
        artist: 'Artist',
        artwork: 'wolves-artwork/fast-phrases.jpg',
        youtubeVideoId: '1',
        bpm: 120,
        phraseBeats: 5,
        fadeDuration: 1500,
      },
    ])
    const wrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    const firstCaption = galleryCaption(wrapper)
    expect(firstCaption).toContain('CNCF STREAM //')
    await wrapper.setProps({ playlistCurrentTime: 5.49 })
    expect(galleryCaption(wrapper)).toBe(firstCaption)
    await wrapper.setProps({ playlistCurrentTime: 5.5 })
    expect(galleryCaption(wrapper)).not.toBe(firstCaption)
  })

  it('limits BPM-aligned slide holds to the approved maximum', async () => {
    mockGalleryData([
      coverTrack,
      {
        id: 'slow-phrases',
        title: 'Slow Phrases',
        artist: 'Artist',
        artwork: 'wolves-artwork/slow-phrases.jpg',
        youtubeVideoId: '2',
        bpm: 120,
        phraseBeats: 48,
        fadeDuration: 3000,
      },
    ])
    const slowWrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    const firstCaption = galleryCaption(slowWrapper)
    expect(firstCaption).toContain('CNCF STREAM //')
    await slowWrapper.setProps({ playlistCurrentTime: 11.49 })
    expect(galleryCaption(slowWrapper)).toBe(firstCaption)
    await slowWrapper.setProps({ playlistCurrentTime: 11.5 })
    expect(galleryCaption(slowWrapper)).not.toBe(firstCaption)
  })

  it('changes slides at the non-clamped boundary derived from BPM metadata', async () => {
    mockGalleryData([
      coverTrack,
      {
        id: 'metadata-paced',
        title: 'Metadata Paced',
        artist: 'Artist',
        artwork: 'wolves-artwork/metadata-paced.jpg',
        youtubeVideoId: '3',
        bpm: 100,
        phraseBeats: 12,
      },
    ])
    const wrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    const firstCaption = galleryCaption(wrapper)
    expect(firstCaption).toContain('CNCF STREAM //')
    await wrapper.setProps({ playlistCurrentTime: 7.19 })
    expect(galleryCaption(wrapper)).toBe(firstCaption)
    await wrapper.setProps({ playlistCurrentTime: 7.2 })
    expect(galleryCaption(wrapper)).not.toBe(firstCaption)
  })

  it('uses a deterministic permitted fallback hold without BPM metadata', async () => {
    mockGalleryData([
      coverTrack,
      {
        id: 'fallback-tempo',
        title: 'Fallback Tempo',
        artist: 'Artist',
        artwork: 'wolves-artwork/fallback-tempo.jpg',
        youtubeVideoId: '1',
      },
    ])
    const wrapper = mount(WolvesComicReader, {
      props: { trackIndex: 1, playlistCurrentTime: 0 },
    })
    await flushPromises()

    const firstCaption = galleryCaption(wrapper)
    expect(firstCaption).toContain('CNCF STREAM //')

    let selectedHold: number | undefined
    for (const hold of [7, 8, 10]) {
      await wrapper.setProps({ playlistCurrentTime: hold - 0.01 })
      const captionBeforeBoundary = galleryCaption(wrapper)
      await wrapper.setProps({ playlistCurrentTime: hold })

      if (captionBeforeBoundary === firstCaption && galleryCaption(wrapper) !== firstCaption) {
        selectedHold = hold
        break
      }
    }

    expect(selectedHold).toBeDefined()
    expect([7, 8, 10]).toContain(selectedHold)

    await wrapper.setProps({ playlistCurrentTime: selectedHold! - 0.01 })
    expect(galleryCaption(wrapper)).toBe(firstCaption)
    await wrapper.setProps({ playlistCurrentTime: selectedHold! })
    expect(galleryCaption(wrapper)).not.toBe(firstCaption)
  })
})
