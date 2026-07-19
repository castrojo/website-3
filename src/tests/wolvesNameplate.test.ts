import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Nameplate from '@/components/wolves/cinematic/Nameplate.vue'

describe('wolves nameplate label rendering', () => {
  it('renders quoted technical tokens in monospace with the quotes stripped', () => {
    const wrapper = mount(Nameplate, {
      props: {
        detail: '7 Days to the Wolves',
        label: 'Falling back to "humans/trying-their-best:v1" slowly',
      },
    })

    const label = wrapper.get('.wc-nameplate-label')
    expect(label.text()).not.toContain('"')
    const mono = label.get('.wc-nameplate-label-mono')
    expect(mono.text()).toBe('humans/trying-their-best:v1')
    expect(label.text()).toBe('Falling back to humans/trying-their-best:v1 slowly')
  })

  it('leaves unquoted labels untouched', () => {
    const wrapper = mount(Nameplate, {
      props: { detail: 'status', label: 'The Blue Delivers' },
    })

    expect(wrapper.get('.wc-nameplate-label').text()).toBe('The Blue Delivers')
    expect(wrapper.find('.wc-nameplate-label-mono').exists()).toBe(false)
  })
})
