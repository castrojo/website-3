import { describe, expect, it } from 'vitest'
import {
  getNarrativeSlotForTime,
  lockedNarrativeSlots,
  wolvesNarrativeTimeline,
} from '../data/wolves-narrative-timeline'
import { wolvesRelease } from '../data/wolves-story'

describe('wolves narrative timeline', () => {
  it('contains every release artifact exactly once', () => {
    expect(wolvesNarrativeTimeline).toHaveLength(wolvesRelease.artifacts.length)
    expect(new Set(wolvesNarrativeTimeline.map(slot => slot.artifactId))).toHaveLength(wolvesNarrativeTimeline.length)
    expect(new Set(wolvesNarrativeTimeline.map(slot => slot.artifactId)))
      .toEqual(new Set(wolvesRelease.artifacts.map(artifact => artifact.id)))
  })

  it('preserves the approved first, middle, and final anchors', () => {
    expect(getNarrativeSlotForTime(0)).toMatchObject({
      artifactId: 'arthur-c-clarke-4',
      startTime: 0,
    })
    expect(getNarrativeSlotForTime(180)).toMatchObject({
      artifactId: 'lorem-pursuit-1',
      startTime: 150,
      endTime: 220,
    })
    expect(getNarrativeSlotForTime(398)).toMatchObject({
      artifactId: 'blue-universal-acquires-wayland-yutani',
      startTime: 398,
      endTime: 425,
    })
  })

  it('keeps every registered narrative lock at its declared time', () => {
    for (const lock of lockedNarrativeSlots) {
      const slot = wolvesNarrativeTimeline.find(slot => slot.artifactId === lock.artifactId)

      expect(slot?.startTime).toBe(lock.startTime)
      if (lock.endTime !== undefined) {
        expect(slot?.endTime).toBe(lock.endTime)
      }
    }
  })

  it('orders the non-anchor lore pool by metadata date', () => {
    const lockedArtifactIds = new Set(lockedNarrativeSlots.map(slot => slot.artifactId))
    const manifestIndexes = new Map(wolvesRelease.artifacts.map((artifact, index) => [artifact.id, index]))
    const pool = wolvesNarrativeTimeline
      .map(slot => wolvesRelease.artifacts.find(artifact => artifact.id === slot.artifactId)!)
      .filter(artifact => !lockedArtifactIds.has(artifact.id))

    for (let index = 1; index < pool.length; index++) {
      const previous = pool[index - 1]
      const current = pool[index]

      expect(previous.publishedAt <= current.publishedAt).toBe(true)
      if (previous.publishedAt === current.publishedAt) {
        expect(manifestIndexes.get(previous.id)).toBeLessThan(manifestIndexes.get(current.id)!)
      }
    }
  })

  it('uses the next slot at exact boundaries and holds the final entry afterward', () => {
    expect(getNarrativeSlotForTime(150)?.artifactId).toBe('lorem-pursuit-1')
    expect(getNarrativeSlotForTime(220)?.artifactId)
      .toBe(wolvesNarrativeTimeline.find(slot => slot.startTime === 220)?.artifactId)
    expect(getNarrativeSlotForTime(425)?.artifactId).toBe('blue-universal-acquires-wayland-yutani')
    expect(getNarrativeSlotForTime(1_000)?.artifactId).toBe('blue-universal-acquires-wayland-yutani')
  })

  it('gives longer lore entries longer non-anchor slots', () => {
    const short = wolvesNarrativeTimeline.find(slot => slot.artifactId === 'quote-natasha-woods')!
    const long = wolvesNarrativeTimeline.find(slot => slot.artifactId === 'john-seager')!

    expect(long.endTime - long.startTime).toBeGreaterThan(short.endTime - short.startTime)
  })
})
