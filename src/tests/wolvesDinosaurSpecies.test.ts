import { describe, expect, it } from 'vitest'
import { dinosaurSpecies } from '../data/wolves-dinosaur-species'

describe('wolves dinosaur species', () => {
  it('uses an explicit cited artwork for every registry species', () => {
    for (const species of dinosaurSpecies) {
      expect(species.documentationUrl).toMatch(/^https:\/\/docs\.projectbluefin\.io\//)
      expect(species.artwork).toMatch(/^\.\/characters\/.+\.webp$/)
    }
  })
})
