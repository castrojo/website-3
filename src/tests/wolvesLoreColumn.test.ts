import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import qrDonate from '@/assets/svg/qr-donate.svg'
import qrStore from '@/assets/svg/qr-store.svg'
import { bazziteQuotes } from '../components/wolves/lore'
import WolvesLoreColumn from '../components/wolves/WolvesLoreColumn.vue'
import { wolvesRelease } from '../data/wolves-story'

vi.mock('../utils/loreRotation', () => ({
  shuffleLoreEntries: <T>(entries: T[]) => entries,
}))

describe('wolvesLoreColumn.vue', () => {
  it('renders final-schema quotes without legacy source fields', async () => {
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        chapter: wolvesRelease.chapters[1],
      },
    })

    await wrapper.find('.quote-viewport').trigger('click')

    expect(wrapper.text()).toContain(bazziteQuotes[0].quote)
    expect(wrapper.text()).toContain(bazziteQuotes[0].attribution)
    expect(wrapper.text()).toContain(bazziteQuotes[0].context as string)
    expect('person' in bazziteQuotes[0]).toBe(false)
    expect('sourceTitle' in bazziteQuotes[0]).toBe(false)
  })

  it('renders QR images from Vite imports', () => {
    const wrapper = mount(WolvesLoreColumn, {
      props: {
        chapter: wolvesRelease.chapters[1],
      },
    })

    const qrImages = wrapper.findAll('.qr-image-box img')

    expect(qrImages).toHaveLength(2)
    expect(qrImages[0].attributes('src')).toBe(qrStore)
    expect(qrImages[1].attributes('src')).toBe(qrDonate)
  })
})
