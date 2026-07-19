import { describe, expect, it } from 'vitest'
import {
  TRACK_ZERO_BEAT_TIMES,
  TRACK_ZERO_SECTIONS,
  trackZeroBeatCuts,
} from '@/data/wolves-track-zero-beats'

describe('track zero measured beat grid', () => {
  it('holds the measured 1050-beat grid in strictly increasing order', () => {
    expect(TRACK_ZERO_BEAT_TIMES.length).toBe(1050)
    expect(TRACK_ZERO_BEAT_TIMES[0]).toBeCloseTo(0.139, 3)
    expect(TRACK_ZERO_BEAT_TIMES[TRACK_ZERO_BEAT_TIMES.length - 1]).toBeCloseTo(422.301, 3)
    for (let i = 1; i < TRACK_ZERO_BEAT_TIMES.length; i++) {
      expect(TRACK_ZERO_BEAT_TIMES[i]).toBeGreaterThan(TRACK_ZERO_BEAT_TIMES[i - 1])
    }
  })

  it('snaps every section boundary to a measured beat', () => {
    for (const boundary of Object.values(TRACK_ZERO_SECTIONS)) {
      const onGrid = TRACK_ZERO_BEAT_TIMES.some(beat => Math.abs(beat - boundary) < 0.0005)
      expect(onGrid).toBe(true)
    }
  })

  it('keeps section boundaries compatible with the locked anchors', () => {
    // Hero locks (167.8-196.36) live between the chorus and bridge boundaries.
    expect(TRACK_ZERO_SECTIONS.chorusStart).toBeLessThan(167.8)
    expect(TRACK_ZERO_SECTIONS.bridgeStart).toBeGreaterThan(196.36)
    // Freezes cover the 346s and 351s thesis anchors.
    expect(TRACK_ZERO_SECTIONS.pivotalStart).toBeLessThanOrEqual(346)
    expect(TRACK_ZERO_SECTIONS.pivotalEnd).toBeGreaterThan(346)
    expect(TRACK_ZERO_SECTIONS.pivotalEnd).toBeLessThanOrEqual(351)
    expect(TRACK_ZERO_SECTIONS.bkEnd).toBeGreaterThan(351)
    // Barrage stays inside the reserved finale window [359, 408).
    expect(TRACK_ZERO_SECTIONS.bkEnd).toBeGreaterThanOrEqual(359)
    expect(TRACK_ZERO_SECTIONS.finaleStart).toBeLessThan(408)
  })

  it('returns no cuts for an empty pool', () => {
    expect(trackZeroBeatCuts(0, 42, 0, [16, 8])).toEqual([])
  })

  it('produces strictly increasing beat-aligned cuts ending exactly at the boundary', () => {
    const cuts = trackZeroBeatCuts(
      TRACK_ZERO_SECTIONS.verseStart,
      TRACK_ZERO_SECTIONS.chorusStart,
      22,
      [16, 8],
    )
    expect(cuts.length).toBe(22)
    let previous: number = TRACK_ZERO_SECTIONS.verseStart
    for (const cut of cuts) {
      expect(cut).toBeGreaterThan(previous)
      previous = cut
    }
    expect(cuts[cuts.length - 1]).toBe(TRACK_ZERO_SECTIONS.chorusStart)
    for (const cut of cuts.slice(0, -1)) {
      const onGrid = TRACK_ZERO_BEAT_TIMES.some(beat => Math.abs(beat - cut) < 0.0005)
      expect(onGrid).toBe(true)
    }
  })

  it('front-loads longer holds so pacing tightens toward the section end', () => {
    const cuts = trackZeroBeatCuts(0, TRACK_ZERO_SECTIONS.verseStart, 4, [32, 24])
    const durations = cuts.map((cut, index) => cut - (index === 0 ? 0 : cuts[index - 1]))
    expect(durations[0]).toBeGreaterThanOrEqual(durations[durations.length - 1])
    // First hold covers the 8.4s prey anchor; second covers 14.99-19.99s.
    expect(cuts[0]).toBeGreaterThan(8.4)
    expect(cuts[0]).toBeLessThanOrEqual(14.99)
    expect(cuts[1]).toBeGreaterThan(19.99)
  })

  it('assigns one cut per measured beat through the barrage', () => {
    const cuts = trackZeroBeatCuts(
      TRACK_ZERO_SECTIONS.bkEnd,
      TRACK_ZERO_SECTIONS.finaleStart,
      116,
      [2, 1],
    )
    expect(cuts.length).toBe(116)
    const durations = cuts.map((cut, index) =>
      cut - (index === 0 ? TRACK_ZERO_SECTIONS.bkEnd : cuts[index - 1]))
    for (const duration of durations) {
      expect(duration).toBeGreaterThan(0.3)
      expect(duration).toBeLessThan(1.0)
    }
  })

  it('falls back to a uniform split when the pool exceeds the beat budget', () => {
    const cuts = trackZeroBeatCuts(0, 4, 100, [2, 1])
    expect(cuts.length).toBe(100)
    expect(cuts[cuts.length - 1]).toBe(4)
    expect(cuts[0]).toBeCloseTo(0.04, 6)
  })
})
