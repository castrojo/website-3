import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = readFileSync(resolve(__dirname, '../../src/KnuckleApp.vue'), 'utf8')

// Strip everything outside the <template> block for structural checks
const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/)
const template = templateMatch?.[1] ?? ''

// Strip everything outside the <style> block for CSS checks
const styleMatch = src.match(/<style[^>]*>([\s\S]*?)<\/style>/)
const style = styleMatch?.[1] ?? ''

describe('KnuckleApp layout — right column must stay bottom-aligned so the dino head shows above it', () => {
  it('col-right is a direct sibling of col-left-stack, not nested inside it', () => {
    // col-left-stack should close before col-right opens
    const stackEnd = template.indexOf('</div>', template.indexOf('col-left-stack'))
    const rightStart = template.indexOf('col-right')
    expect(rightStart).toBeGreaterThan(stackEnd)
  })

  it('col-right contains KnuckleVersionChips and KnuckleDownloadCard', () => {
    const rightBlock = template.slice(template.indexOf('col-right'))
    expect(rightBlock).toContain('KnuckleVersionChips')
    expect(rightBlock).toContain('KnuckleDownloadCard')
  })

  it('col-left and col-features appear inside col-left-stack, before col-right', () => {
    const stackStart = template.indexOf('col-left-stack')
    const rightStart = template.indexOf('col-right')
    // both must appear after col-left-stack opens and before col-right
    const colLeftPos = template.indexOf('"col-left"', stackStart)
    const featuresPos = template.indexOf('col-features', stackStart)
    expect(colLeftPos).toBeGreaterThan(stackStart)
    expect(colLeftPos).toBeLessThan(rightStart)
    expect(featuresPos).toBeGreaterThan(stackStart)
    expect(featuresPos).toBeLessThan(rightStart)
  })

  it('knuckle-layout uses align-items: flex-end so col-right is bottom-aligned', () => {
    expect(style).toContain('align-items: flex-end')
  })

  it('knuckle-layout uses flex-direction: row on desktop', () => {
    expect(style).toContain('flex-direction: row')
  })
})
