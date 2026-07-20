import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CinematicTransition from '@/components/wolves/cinematic/CinematicTransition.vue'
import { useCinematicStore } from '@/stores/cinematic'

describe('cinematicTransition overlay duration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('holds the transition overlay for 11 seconds then hides it', async () => {
    const store = useCinematicStore()
    store.phase = 'cinematic'
    store.showTransitionOverlay = true
    store.segmentIndex = 0

    const wrapper = mount(CinematicTransition)
    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)

    // Trigger transition by changing segmentIndex (segment 2 carries a title slide)
    store.segmentIndex = 2
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(true)

    // Advance 10.9 seconds
    await vi.advanceTimersByTimeAsync(10900)
    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(true)

    // Complete the 11 seconds
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)
  })

  it('does not trigger the transition overlay if phase is not cinematic', async () => {
    const store = useCinematicStore()
    store.phase = 'intro'
    store.segmentIndex = 0

    const wrapper = mount(CinematicTransition)
    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)

    store.segmentIndex = 1
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)
  })

  it('does not show a transition when returning to 7 Days to the Wolves', async () => {
    const store = useCinematicStore()
    store.phase = 'cinematic'
    store.showTransitionOverlay = true
    store.segmentIndex = 1

    const wrapper = mount(CinematicTransition)
    store.segmentIndex = 0
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)
  })

  it('skips the transition overlay for back-catalogue albums', async () => {
    const store = useCinematicStore()
    store.phase = 'cinematic'
    store.showTransitionOverlay = false
    store.segmentIndex = 0

    const wrapper = mount(CinematicTransition)
    store.segmentIndex = 2
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)
  })

  it('does not show a title slide for the Ghosts In The Mist handoff', async () => {
    const store = useCinematicStore()
    store.phase = 'cinematic'
    store.showTransitionOverlay = true
    store.segmentIndex = 0

    const wrapper = mount(CinematicTransition)
    // Segment 1 is ghosts-in-the-mist; its opening guardian plate must stay clear.
    store.segmentIndex = 1
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.wc-transition-overlay').exists()).toBe(false)
  })
})
