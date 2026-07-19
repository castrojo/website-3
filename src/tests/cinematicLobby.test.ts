import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import qrStore from '@/assets/svg/qr-store.svg'
import CinematicLobby from '@/components/wolves/cinematic/CinematicLobby.vue'

describe('cinematicLobby.vue', () => {
  it('keeps the store QR CTA visible and focusable before entering the cinematic', async () => {
    const wrapper = mount(CinematicLobby, { attachTo: document.body })

    try {
      const storeLink = wrapper.get('a[href="https://store.projectbluefin.io"]')
      const storeQr = wrapper.get('img[alt="QR code for the Project Bluefin store"]')
      const enterButton = wrapper.get('button[type="button"]')

      expect(storeQr.attributes('src')).toBe(qrStore)
      expect(storeLink.attributes('target')).toBe('_blank')
      // The QR block now closes the lobby frame, after the enter CTA and the quote.
      expect(storeLink.element.compareDocumentPosition(enterButton.element)).toBe(Node.DOCUMENT_POSITION_PRECEDING)

      ;(storeLink.element as HTMLAnchorElement).focus()
      expect(document.activeElement).toBe(storeLink.element)

      await enterButton.trigger('click')
      expect(wrapper.emitted('enter')).toEqual([[]])
    }
    finally {
      wrapper.unmount()
    }
  })

  it('keeps the store QR link in tab order and emits enter for native keyboard CTA activation', async () => {
    const wrapper = mount(CinematicLobby, { attachTo: document.body })

    try {
      const storeLink = wrapper.get('a[href="https://store.projectbluefin.io"]')
      const enterButton = wrapper.get('button[type="button"]')
      const storeLinkElement = storeLink.element as HTMLAnchorElement
      const enterButtonElement = enterButton.element as HTMLButtonElement
      const tabStops = Array.from((wrapper.element as HTMLElement).querySelectorAll('a[href], button:not(:disabled)'))
        .filter((element): element is HTMLElement => element instanceof HTMLElement && element.tabIndex >= 0)

      expect(tabStops).toContain(storeLinkElement)
      expect(tabStops.indexOf(storeLinkElement)).toBeGreaterThan(tabStops.indexOf(enterButtonElement))
      expect(storeLinkElement.tabIndex).toBe(0)
      expect(enterButtonElement.tagName).toBe('BUTTON')

      // Happy DOM does not run browser-native button activation. Browsers dispatch
      // click on Enter keydown and Space keyup, so reproduce those default actions.
      for (const key of ['Enter', ' ']) {
        enterButtonElement.focus()
        await enterButton.trigger('keydown', { key })
        if (key === ' ') {
          await enterButton.trigger('keyup', { key })
        }
        enterButtonElement.click()
      }

      expect(wrapper.emitted('enter')).toEqual([[], []])
    }
    finally {
      wrapper.unmount()
    }
  })
})
