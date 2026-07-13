import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loreEntries } from '../components/wolves/lore'
import WolvesLoreColumn from '../components/wolves/WolvesLoreColumn.vue'

describe('wolvesLoreColumn Logic', () => {
  it('renders the artifact selected by the soundtrack timeline', async () => {
    vi.useFakeTimers()
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        artifactId: 'arthur-c-clarke-3',
        duration: 20,
      },
    })

    vi.advanceTimersByTime(5_000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('It is a bitter thought, but you must face it.')
  })

  it('types quote source characters without generated glyphs', async () => {
    vi.useFakeTimers()
    const entry = loreEntries.find(entry => entry.id === 'arthur-c-clarke-3')
    if (!entry || entry.type !== 'quote') {
      throw new Error('Expected a quote fixture')
    }

    const wrapper = mount(WolvesLoreColumn, {
      props: {
        artifactId: entry.id,
        duration: 1,
      },
    })

    vi.advanceTimersByTime(50)
    await wrapper.vm.$nextTick()

    const renderedQuote = wrapper.find('.lore-quote-text').text()
    expect(renderedQuote).not.toBe('')
    expect(entry.data.quote.startsWith(renderedQuote)).toBe(true)
  })

  it('types transmission source characters without generated glyphs', async () => {
    vi.useFakeTimers()
    const entry = loreEntries.find(entry => entry.id === 'lorem-prologue-1')
    if (!entry || entry.type !== 'conversation') {
      throw new Error('Expected a transmission fixture')
    }

    const wrapper = mount(WolvesLoreColumn, {
      props: {
        artifactId: entry.id,
        duration: 0.01,
      },
    })

    vi.advanceTimersByTime(50)
    await wrapper.vm.$nextTick()

    const renderedMessage = wrapper.find('.conversation-message p').text()
    expect(renderedMessage).not.toBe('')
    expect(entry.data.messages[0].text.startsWith(renderedMessage)).toBe(true)
  })

  it('keeps two mascot layers mounted during rotation', async () => {
    vi.useFakeTimers()
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        artifactId: 'arthur-c-clarke-3',
        duration: 20,
      },
    })

    expect(wrapper.findAll('.mascot-avatar')).toHaveLength(2)

    await vi.advanceTimersByTimeAsync(15_000)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.mascot-avatar-current').classes()).toContain('is-fading-out')
    expect(wrapper.find('.mascot-avatar-next').classes()).toContain('is-fading-in')
  })

  it('smoothly advances long quotes at reading beats', async () => {
    vi.useFakeTimers()
    const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo')
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        artifactId: 'arthur-c-clarke-3',
        duration: 0.01,
      },
    })

    vi.advanceTimersByTime(1_000)
    await wrapper.vm.$nextTick()

    expect(scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })
})
