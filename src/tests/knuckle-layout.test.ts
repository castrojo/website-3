import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = readFileSync(resolve(__dirname, '../../src/KnuckleApp.vue'), 'utf8')

const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/)
const template = templateMatch?.[1] ?? ''

const styleMatch = src.match(/<style[^>]*>([\s\S]*?)<\/style>/)
const style = styleMatch?.[1] ?? ''

describe('KnuckleApp layout — right column must stay bottom-aligned so the dino head shows above it', () => {
  it('col-left-stack and col-right are siblings inside knuckle-layout', () => {
    const stackStart = template.indexOf('col-left-stack')
    const rightStart = template.indexOf('col-right')
    expect(stackStart).toBeGreaterThan(0)
    expect(rightStart).toBeGreaterThan(stackStart)
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

  it('col-right uses position: sticky so it stays visible while left column scrolls', () => {
    const rightBlock = style.slice(style.indexOf('.col-right'))
    expect(rightBlock).toContain('position: sticky')
  })

  // CRITICAL: margin-top: 35vh on col-right is what creates the dino head effect.
  // Karl's head is visible above the right column because it starts 35vh from the top.
  // Do NOT change this value without updating it here too — this took a long time to get right.
  it('col-right uses margin-top: 35vh to create the dino-head-above-column effect', () => {
    const rightBlock = style.slice(style.indexOf('.col-right'))
    expect(rightBlock).toContain('margin-top: 35vh')
  })
})
