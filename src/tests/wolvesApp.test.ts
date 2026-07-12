import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WolvesApp from '../WolvesApp.vue'

vi.mock('../components/TopNavbar.vue', () => ({
  default: { template: '<div>TopNavbar</div>' },
}))

vi.mock('../components/wolves/WolvesComicReader.vue', () => ({
  default: {
    props: ['chapters', 'autoplay'],
    emits: ['update:page'],
    template: '<button class="comic-reader" @click="$emit(`update:page`, 6)">WolvesComicReader</button>',
  },
}))

vi.mock('../components/wolves/WolvesSoundtrack.vue', () => ({
  default: {
    props: ['playing', 'chapter'],
    template: '<div class="soundtrack-chapter">{{ chapter?.id ?? `none` }}</div>',
  },
}))

vi.mock('../components/wolves/WolvesLoreColumn.vue', () => ({
  default: {
    props: ['chapter'],
    template: '<div class="lore-chapter">{{ chapter?.id ?? `none` }}</div>',
  },
}))

describe('wolvesApp.vue', () => {
  it('renders the page title, lore column, and discord mesh link', () => {
    const wrapper = mount(WolvesApp)

    expect(wrapper.text()).toContain('Seven Days to the Wolves')
    expect(wrapper.text()).toContain('JOIN THE MESH (DISCORD)')
    expect(wrapper.find('.lore-chapter').text()).toBe('prologue')
  })

  it('passes the active chapter to soundtrack and lore when the comic page changes', async () => {
    const wrapper = mount(WolvesApp)

    await wrapper.find('.comic-reader').trigger('click')

    expect(wrapper.find('.soundtrack-chapter').text()).toBe('pursuit')
    expect(wrapper.find('.lore-chapter').text()).toBe('pursuit')
  })

  it('handles email submission in the terminal console card', async () => {
    const wrapper = mount(WolvesApp)

    const input = wrapper.find('.console-input')
    await input.setValue('operative@projectbluefin.io')
    await wrapper.find('.console-form').trigger('submit')

    expect(wrapper.find('.console-feedback').text()).toContain('kubectl rollout status')
  })
})
