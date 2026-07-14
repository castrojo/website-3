import { describe, expect, it } from 'vitest'
import { createSignalDisplay } from '../data/wolves-signal-display'

describe('wolves signal display', () => {
  it('separates a colon-delimited signal and marks its first B and F', () => {
    const display = createSignalDisplay('Bazzite Mk6 Units: Prepare for Titanfall.')

    expect(display.title.map(character => character.value).join('')).toBe('Bazzite Mk6 Units')
    expect(display.subtitle?.map(character => character.value).join('')).toBe('Prepare for Titanfall.')
    expect(display.title.filter(character => character.highlighted).map(character => character.value)).toEqual(['B'])
    expect(display.subtitle?.filter(character => character.highlighted).map(character => character.value)).toEqual(['f'])
  })

  it('omits a trailing colon without creating a subtitle', () => {
    const display = createSignalDisplay('INCOMING SIGNAL:')

    expect(display.title.map(character => character.value).join('')).toBe('INCOMING SIGNAL')
    expect(display.subtitle).toBeNull()
  })

  it('marks only the first case-insensitive B and F across a signal', () => {
    const display = createSignalDisplay('Baffle: Before the final form')
    const characters = [...display.title, ...(display.subtitle ?? [])]

    expect(characters.filter(character => character.highlighted).map(character => character.value)).toEqual(['B', 'f'])
  })
})
