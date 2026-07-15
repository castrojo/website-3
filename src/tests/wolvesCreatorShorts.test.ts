import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetYoutubeIframeApiCacheForTests } from '../composables/useYoutubeIframeApi'
import { wolvesCreatorShorts } from '../data/wolves-creator-shorts'

const { default: WolvesCreatorShorts } = await import('../components/wolves/WolvesCreatorShorts.vue')

const iframeApiSrc = 'https://www.youtube.com/iframe_api'

interface MockPlayerRecord {
  config: any
  videoId: string
  destroy: ReturnType<typeof vi.fn>
  triggerEnded: () => void
  triggerError: () => void
}

let players: MockPlayerRecord[] = []

function installMockIframeApi() {
  class MockPlayer {
    config: any
    videoId: string
    destroy = vi.fn()

    constructor(element: Element, config: any) {
      this.config = config
      this.videoId = config.videoId
      const mountNode = element as HTMLElement
      if (!mountNode.parentElement) {
        throw new Error('MockPlayer target must stay attached')
      }
      players.push(this as unknown as MockPlayerRecord)
    }

    triggerEnded() {
      this.config.events?.onStateChange?.({ data: (window as any).YT.PlayerState.ENDED, target: this })
    }

    triggerError() {
      this.config.events?.onError?.({ target: this })
    }
  }

  ;(window as any).YT = {
    Player: MockPlayer,
    PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
  }
}

function resolveIframeApi() {
  installMockIframeApi()
  ;(window as any).onYouTubeIframeAPIReady?.()
}

beforeEach(() => {
  players = []
  ;(window as any).happyDOM.settings.handleDisabledFileLoadingAsSuccess = true
  document.head.querySelectorAll(`script[src="${iframeApiSrc}"]`).forEach(script => script.remove())
  delete (window as any).YT
  delete (window as any).onYouTubeIframeAPIReady
  resetYoutubeIframeApiCacheForTests()
})

afterEach(() => {
  document.head.querySelectorAll(`script[src="${iframeApiSrc}"]`).forEach(script => script.remove())
  delete (window as any).YT
  delete (window as any).onYouTubeIframeAPIReady
  resetYoutubeIframeApiCacheForTests()
  vi.clearAllMocks()
})

describe('wolves-creator-shorts data', () => {
  it('has twelve entries strictly alternating, starting with Lindsay Nikole', () => {
    expect(wolvesCreatorShorts).toHaveLength(12)
    expect(wolvesCreatorShorts[0].creatorName).toBe('Lindsay Nikole')

    wolvesCreatorShorts.forEach((short, index) => {
      const expectedCreator = index % 2 === 0 ? 'Lindsay Nikole' : 'Cassidy Williams'
      expect(short.creatorName).toBe(expectedCreator)
    })
  })
})

describe('wolvesCreatorShorts player', () => {
  it('embeds the first short (Lindsay Nikole) and credits her by name and link', async () => {
    const wrapper = mount(WolvesCreatorShorts)
    await flushPromises()
    resolveIframeApi()
    await flushPromises()

    expect(players).toHaveLength(1)
    expect(players[0].videoId).toBe(wolvesCreatorShorts[0].videoId)
    expect(wrapper.text()).toContain('Lindsay Nikole')
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe(wolvesCreatorShorts[0].channelUrl)
  })

  it('advances to the next (alternating) short when the current one ends', async () => {
    const wrapper = mount(WolvesCreatorShorts)
    await flushPromises()
    resolveIframeApi()
    await flushPromises()

    players[0].triggerEnded()
    await flushPromises()

    expect(players).toHaveLength(2)
    expect(players[1].videoId).toBe(wolvesCreatorShorts[1].videoId)
    expect(wrapper.text()).toContain('Cassidy Williams')
  })

  it('loops back to the first short after the last one ends', async () => {
    const wrapper = mount(WolvesCreatorShorts)
    await flushPromises()
    resolveIframeApi()
    await flushPromises()

    for (let i = 0; i < wolvesCreatorShorts.length; i++) {
      players[players.length - 1].triggerEnded()
      await flushPromises()
    }

    expect(players).toHaveLength(wolvesCreatorShorts.length + 1)
    expect(players[players.length - 1].videoId).toBe(wolvesCreatorShorts[0].videoId)
    expect(wrapper.text()).toContain('Lindsay Nikole')
  })

  it('never blocks the feed when a short errors', async () => {
    const wrapper = mount(WolvesCreatorShorts)
    await flushPromises()
    resolveIframeApi()
    await flushPromises()

    players[0].triggerError()
    await flushPromises()

    expect(players).toHaveLength(2)
    expect(wrapper.text()).toContain('Cassidy Williams')
  })
})
