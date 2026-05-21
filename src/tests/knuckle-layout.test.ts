import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = readFileSync(resolve(__dirname, '../../src/KnuckleApp.vue'), 'utf8')

const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/)
const template = templateMatch?.[1] ?? ''

const styleMatch = src.match(/<style[^>]*>([\s\S]*?)<\/style>/)
const style = styleMatch?.[1] ?? ''

describe('KnuckleApp layout — right column must stay bottom-aligned so the dino head shows above it', () => {
  it('col-left-stack and col-right-stack are siblings inside knuckle-layout', () => {
    const leftStart = template.indexOf('col-left-stack')
    const rightStart = template.indexOf('col-right-stack')
    expect(leftStart).toBeGreaterThan(0)
    expect(rightStart).toBeGreaterThan(leftStart)
  })

  it('col-right contains KnuckleVersionChips and KnuckleDownloadCard', () => {
    const rightBlock = template.slice(template.indexOf('col-right'))
    expect(rightBlock).toContain('KnuckleVersionChips')
    expect(rightBlock).toContain('KnuckleDownloadCard')
  })

  it('col-left contains KnuckleScene and KnuckleHighlights', () => {
    const leftStart = template.indexOf('"col-left"')
    const featuresStart = template.indexOf('col-features')
    const left = template.slice(leftStart, featuresStart)
    expect(left).toContain('KnuckleScene')
    expect(left).toContain('KnuckleHighlights')
  })

  it('col-features contains KnuckleFeatures', () => {
    const featuresStart = template.indexOf('col-features')
    const rightStart = template.indexOf('col-right')
    const features = template.slice(featuresStart, rightStart)
    expect(features).toContain('KnuckleFeatures')
  })

  it('knuckle-layout uses flex-direction: row on desktop', () => {
    expect(style).toContain('flex-direction: row')
  })

  // CRITICAL: col-right-stack owns the sticky + margin-top values that create the dino head effect.
  // Karl is at top:64px (below the 60px navbar). margin-top is calc(35vh + 60px)
  // so the glass box stays at the same spot on Karl's body.
  // Do NOT change these values without updating this test — this took a long time to get right.
  it('col-right-stack uses position: sticky so it stays visible while left column scrolls', () => {
    const stackBlock = style.slice(style.indexOf('.col-right-stack'))
    expect(stackBlock).toContain('position: sticky')
  })

  it('col-right-stack uses margin-top: calc(35vh + 60px) to create the dino-head-above-column effect', () => {
    const stackBlock = style.slice(style.indexOf('.col-right-stack'))
    expect(stackBlock).toContain('margin-top: calc(35vh + 60px)')
  })

  it('karl uses top: 64px to clear the navbar so the horns are visible', () => {
    const karlBlock = style.slice(style.indexOf('.karl'))
    expect(karlBlock).toContain('top: 64px')
  })
})
