import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import qrcode from 'qrcode'
import { describe, expect, it } from 'vitest'
import WolvesQrCodes from '../components/wolves/WolvesQrCodes.vue'

const qrRenderOptions = {
  type: 'svg' as const,
  color: {
    dark: '#ffffff',
    light: '#00000000',
  },
  margin: 1,
}

describe('wolvesQrCodes', () => {
  it('renders Store and placeholder Donate QR targets', () => {
    const wrapper = mount(WolvesQrCodes)
    expect(wrapper.get('a[aria-label="Store"]').attributes('href')).toBe('https://store.projectbluefin.io')
    expect(wrapper.get('a[aria-label="Donate to Project Bluefin"]').attributes('href')).toBe('#')
    expect(wrapper.get('img[alt="Store QR code"]').attributes('src')).toBe(`${import.meta.env.BASE_URL}assets/svg/qr-store.svg`)
    expect(wrapper.get('img[alt="Donate to Project Bluefin QR code"]').attributes('src')).toBe(`${import.meta.env.BASE_URL}assets/svg/qr-donate.svg`)
  })

  it('keeps the generated QR assets aligned with the declared destinations', async () => {
    const [storeSvg, donateSvg] = await Promise.all([
      readFile(resolve(process.cwd(), 'src/assets/svg/qr-store.svg'), 'utf8'),
      readFile(resolve(process.cwd(), 'src/assets/svg/qr-donate.svg'), 'utf8'),
    ])

    await expect(qrcode.toString('https://store.projectbluefin.io', qrRenderOptions)).resolves.toBe(storeSvg)
    await expect(qrcode.toString('#', qrRenderOptions)).resolves.toBe(donateSvg)
  })
})
