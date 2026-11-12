import { describe, expect, test } from 'vitest'
import { STOPPED, elapsed, pauseClock, remainingMs, startClock } from './timer'

describe('clock', () => {
  test('counts only while running', () => {
    let c = startClock(STOPPED, 1000)
    expect(elapsed(c, 4000)).toBe(3000)
    c = pauseClock(c, 4000)
    expect(elapsed(c, 9000)).toBe(3000) // frozen
    c = startClock(c, 9000)
    expect(elapsed(c, 10000)).toBe(4000)
  })

  test('remaining never goes below zero', () => {
    const c = startClock(STOPPED, 0)
    expect(remainingMs(c, 5000, 20000)).toBe(15000)
    expect(remainingMs(c, 25000, 20000)).toBe(0)
  })

  test('start and pause are idempotent', () => {
    const c = startClock(STOPPED, 100)
    expect(startClock(c, 500)).toBe(c)
    expect(pauseClock(STOPPED, 500)).toBe(STOPPED)
  })
})
