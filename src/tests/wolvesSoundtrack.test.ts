import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WolvesSoundtrack from '../components/wolves/WolvesSoundtrack.vue'

const originalMatchMedia = window.matchMedia

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '(max-width: 767px)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

afterEach(() => {
  document.body.classList.remove('wolves-player-active')
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: originalMatchMedia,
  })
})

describe('wolves soundtrack (nowPlayingBar design)', () => {
  it('renders playlist title and metadata when standby', () => {
    const wrapper = mount(WolvesSoundtrack, {
      props: {
        chapter: undefined,
        playing: false,
      },
    })

    expect(wrapper.text()).toContain('RELEASE SOUNDTRACK TO HUNT BY')
    expect(wrapper.text()).toContain('7 Days to the Wolves')
    expect(wrapper.text()).toContain('Nightwish')
    expect(wrapper.find('iframe').exists()).toBe(false)
  })

  it('renders YouTube Music sign-in guidance and deep link', () => {
    const wrapper = mount(WolvesSoundtrack, {
      props: {
        chapter: undefined,
        playing: false,
      },
    })

    expect(wrapper.text()).toContain('Sign in to YouTube Music')
    const ytmLink = wrapper.find('a.youtube-music-link')
    expect(ytmLink.exists()).toBe(true)
    expect(ytmLink.attributes('href')).toContain('music.youtube.com')
  })

  it('renders player container when playing is true', () => {
    const wrapper = mount(WolvesSoundtrack, {
      props: {
        chapter: undefined,
        playing: true,
      },
    })

    expect(wrapper.find('.hidden-player-container').exists()).toBe(true)
    expect(wrapper.find('#wolves-yt-player').exists()).toBe(true)
  })

  it('emits update:playing event when clicking the play button', async () => {
    const wrapper = mount(WolvesSoundtrack, {
      props: {
        chapter: undefined,
        playing: false,
      },
    })

    await wrapper.find('.play-button').trigger('click')
    expect(wrapper.emitted('update:playing')).toBeTruthy()
    expect(wrapper.emitted('update:playing')?.[0]).toEqual([true])
  })

  it('switches to the compact fixed bar on mobile without duplicating controls', async () => {
    mockMatchMedia(true)

    const wrapper = mount(WolvesSoundtrack, {
      props: {
        chapter: undefined,
        playing: true,
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('is-mobile-compact')
    expect(document.body.classList.contains('wolves-player-active')).toBe(true)
    expect(wrapper.findAll('.play-button')).toHaveLength(1)
    expect(wrapper.get('.play-button').attributes('aria-label')).toBe('Pause soundtrack')
    expect(wrapper.find('#wolves-yt-player').exists()).toBe(true)

    wrapper.unmount()
    expect(document.body.classList.contains('wolves-player-active')).toBe(false)
  })
})
