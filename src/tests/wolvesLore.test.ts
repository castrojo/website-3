import { describe, expect, it } from 'vitest'
import { getChatlogLore, loreRecords } from '../components/wolves/lore'
import { wolvesRelease } from '../data/wolves-story'

describe('wolves Lore Parser', () => {
  it('should parse legacy single-newline speaker blocks correctly (The Garden Before Time)', () => {
    const record = loreRecords.find(record => record.id === 'ishtar-gardener-and-winnower')

    expect(record?.kind).toBe('source')
    if (record) {
      const ishtar = getChatlogLore(record)
      // It should have multiple messages, not just 1 monolithic block
      expect(ishtar.messages.length).toBeGreaterThan(1)
      expect(ishtar.messages[0].speaker).toBe('THE GARDENER')
      expect(ishtar.messages[0].text).toBe('I plant possibilities and watch what they become.')
      expect(ishtar.messages[1].speaker).toBe('THE WINNOWER')
      expect(ishtar.messages[1].text).toBe('I separate what can endure from what cannot.')
    }
  })

  it('should correctly parse <SFX> single-newline blocks', () => {
    const record = loreRecords.find(record => record.id === 'lorem-prologue-2')

    expect(record?.kind).toBe('chatlog')
    if (record) {
      const theChildren = getChatlogLore(record)
      // Check that SFX are present somewhere
      const hasSfx = theChildren.messages.some(m => m.isSfx)
      expect(hasSfx).toBe(true)
    }
  })

  it('keeps LoreRecord bodies byte-for-byte while adapting transcripts', () => {
    const record = loreRecords.find(record => record.id === 'lorem-prologue-1')
    const artifact = wolvesRelease.artifacts.find(artifact => artifact.id === 'lorem-prologue-1')

    expect(record?.body).toBe(artifact?.body)
  })
})
