import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WolvesLoreColumn from '../components/wolves/WolvesLoreColumn.vue'
import quoteData from '../data/bazzite-quotes.json'
import { wolvesRelease } from '../data/wolves-story'

interface BazziteQuote {
  quote: string
  attribution: string
  context?: string
  date?: string
}

const quotes = quoteData as BazziteQuote[]

describe('wolvesLoreColumn', () => {
  it('uses only the final quote schema and renders attribution', () => {
    expect(quotes.length).toBeGreaterThan(0)
    expect(quotes[0]).toMatchObject({
      quote: expect.any(String),
      attribution: expect.any(String),
    })

    for (const entry of quotes) {
      expect(entry).not.toHaveProperty('person')
      expect(entry).not.toHaveProperty('sourceType')
      expect(entry).not.toHaveProperty('sourceTitle')
      expect(entry).not.toHaveProperty('sourceDetail')
    }

    const wrapper = mount(WolvesLoreColumn, {
      props: {
        chapter: wolvesRelease.chapters[1],
      },
    })
    expect(wrapper.findAll('article').length).toBeGreaterThan(0)
    expect(quotes.some(entry => wrapper.text().includes(entry.attribution))).toBe(true)
  })
})
