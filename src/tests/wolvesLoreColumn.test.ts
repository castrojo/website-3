import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { loreEntries } from '../components/wolves/lore'
import WolvesLoreColumn from '../components/wolves/WolvesLoreColumn.vue'

vi.mock('../utils/loreRotation', () => ({
  shuffleLoreEntries: <T>(entries: T[]) => entries,
}))

describe('wolvesLoreColumn.vue', () => {
  it('renders quote-schema entries from bazzite quotes data', async () => {
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        chapter: undefined,
      },
    })

    await wrapper.find('.quote-viewport').trigger('click')

    const activeEntry = loreEntries[0]
    expect(activeEntry.type).toBe('quote')
    const activeQuote = activeEntry.data as any

    expect(wrapper.text()).toContain(activeQuote.quote)
    expect(wrapper.text()).toContain(activeQuote.attribution)
    expect('person' in activeQuote).toBe(false)
    expect('sourceTitle' in activeQuote).toBe(false)
  })

  it('does not render QR codes inside the lore column', () => {
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        chapter: undefined,
      },
    })

    expect(wrapper.findComponent({ name: 'WolvesQrCodes' }).exists()).toBe(false)
  })
})
