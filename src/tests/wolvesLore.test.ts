import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WolvesLoreColumn from '../components/wolves/WolvesLoreColumn.vue'
import quoteData from '../data/bazzite-quotes.json'

interface BazziteQuote {
  quote: string
  attribution: string
  context?: string
  date?: string
}

const quotes = quoteData as BazziteQuote[]

describe('wolvesLoreColumn', () => {
  it('uses only the final quote schema and renders attribution', () => {
    expect(quotes).toHaveLength(5)
    expect(quotes[0]).toMatchObject({
      quote: expect.stringContaining('Lorem ipsum'),
      attribution: 'Bazzite Discord placeholder',
    })

    for (const entry of quotes) {
      expect(entry).not.toHaveProperty('person')
      expect(entry).not.toHaveProperty('sourceType')
      expect(entry).not.toHaveProperty('sourceTitle')
      expect(entry).not.toHaveProperty('sourceDetail')
    }

    const wrapper = mount(WolvesLoreColumn)
    expect(wrapper.findAll('article')).toHaveLength(5)
    expect(wrapper.text()).toContain('Bazzite Discord placeholder')
  })
})
