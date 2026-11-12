import { describe, expect, test } from 'vitest'
import { coverSize, placeBox, pointAlong } from './geometry'

const IMAGE = { w: 941, h: 1672 }

describe('coverSize', () => {
  test('fills a tall phone by height and a wide frame by width', () => {
    const tall = coverSize({ w: 390, h: 844 }, IMAGE)
    expect(tall.h).toBeCloseTo(844)
    expect(tall.w).toBeGreaterThan(390)
    const wide = coverSize({ w: 480, h: 700 }, IMAGE)
    expect(wide.w).toBeCloseTo(480)
    expect(wide.h).toBeGreaterThan(700)
  })
})

describe('pointAlong', () => {
  const path = [{ x: 0, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 0 }]
  test('hits the ends and interpolates between points', () => {
    expect(pointAlong(path, 0)).toEqual({ x: 0, y: 100 })
    expect(pointAlong(path, 1)).toEqual({ x: 100, y: 0 })
    expect(pointAlong(path, 0.25)).toEqual({ x: 25, y: 75 })
    expect(pointAlong(path, 2)).toEqual({ x: 100, y: 0 })
  })
})

describe('placeBox', () => {
  const frame = { w: 390, h: 844 }

  test('never exposes the sides or the top', () => {
    for (const focal of [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 50, y: 50 }]) {
      const box = placeBox(frame, IMAGE, focal, { x: 0.5, y: 0.5 }, false)
      expect(box.x).toBeLessThanOrEqual(0)
      expect(box.x + box.w).toBeGreaterThanOrEqual(frame.w - 0.001)
      expect(box.y).toBeLessThanOrEqual(0)
      expect(box.y + box.h).toBeGreaterThanOrEqual(frame.h - 0.001)
    }
  })

  test('journey mode can lift a low focal point (the train) into the top window', () => {
    const box = placeBox(frame, IMAGE, { x: 70, y: 66 }, { x: 0.5, y: 0.15 }, true)
    const trainY = box.y + 0.66 * box.h
    expect(trainY).toBeCloseTo(0.15 * frame.h)
  })

  test('the last stage keeps the castle and moon at the top', () => {
    const box = placeBox(frame, IMAGE, { x: 58, y: 11 }, { x: 0.5, y: 0.15 }, true)
    expect(box.y).toBe(0)
    const moonX = box.x + 0.802 * box.w
    expect(moonX).toBeGreaterThan(0)
    expect(moonX).toBeLessThan(frame.w)
  })
})
