import { describe, expect, test } from 'vitest'
import {
  computeResult,
  isDarkSide,
  isSecret,
  knowledgePercent,
  matchPercent,
  tierFor,
  traitTotals,
  winningTrait,
  type ScenarioOutcome,
} from './scoring'
import { makeFixturePack } from './fixture.test-helper'

const T = { skilled: 40, legend: 75 }
const ORDER = ['brave', 'clever', 'loyal']
const s = (stage: number, weights: Record<string, number>, dark = false): ScenarioOutcome => ({ stage, weights, dark })
const k = (correct: boolean) => ({ correct })

describe('knowledgePercent', () => {
  test('returns 0 when there are no knowledge answers', () => {
    expect(knowledgePercent([])).toBe(0)
  })
  test('rounds to a whole percentage', () => {
    expect(knowledgePercent([k(true), k(false), k(false)])).toBe(33)
    expect(knowledgePercent([k(true), k(true), k(false)])).toBe(67)
  })
})

describe('tierFor', () => {
  test('below 40 is beginner', () => {
    expect(tierFor(0, T)).toBe('beginner')
    expect(tierFor(39, T)).toBe('beginner')
  })
  test('40 to 74 is skilled', () => {
    expect(tierFor(40, T)).toBe('skilled')
    expect(tierFor(74, T)).toBe('skilled')
  })
  test('75 and up is legend', () => {
    expect(tierFor(75, T)).toBe('legend')
    expect(tierFor(100, T)).toBe('legend')
  })
})

describe('winningTrait', () => {
  test('highest total wins', () => {
    const answers = [s(1, { brave: 2 }), s(2, { clever: 2, brave: 1 }), s(3, { brave: 2 })]
    expect(winningTrait(answers, ORDER)).toBe('brave')
  })

  test('on a tie, the answer from the latest stage wins', () => {
    const answers = [s(1, { brave: 2 }), s(2, { clever: 2 })]
    expect(winningTrait(answers, ORDER)).toBe('clever')
    expect(winningTrait([...answers].reverse(), ORDER)).toBe('clever')
  })

  test('tie-break skips later answers that do not touch the tied traits', () => {
    const answers = [s(1, { brave: 2 }), s(2, { clever: 2 }), s(3, { loyal: 1 })]
    expect(winningTrait(answers, ORDER)).toBe('clever')
  })

  test('tie-break uses the weight inside the latest answer', () => {
    const answers = [s(1, { brave: 1, clever: 2 }), s(2, { brave: 2, clever: 1 })]
    expect(winningTrait(answers, ORDER)).toBe('brave')
  })

  test('falls back to pack order when nothing separates the tie', () => {
    expect(winningTrait([], ORDER)).toBe('brave')
    expect(winningTrait([s(1, { clever: 1, loyal: 1 })], ORDER)).toBe('clever')
  })

  test('ignores unknown trait keys', () => {
    expect(traitTotals([s(1, { brave: 1, ghost: 9 })], ORDER)).toEqual({ brave: 1, clever: 0, loyal: 0 })
  })
})

describe('isDarkSide', () => {
  test('needs at least 40% dark answers', () => {
    expect(isDarkSide([s(1, {}, true), s(2, {}), s(3, {})])).toBe(false) // 33%
    expect(isDarkSide([s(1, {}, true), s(2, {}, true), s(3, {})])).toBe(true) // 67%
    expect(isDarkSide([s(1, {}, true), s(2, {}), s(3, {}), s(4, {}), s(5, {})])).toBe(false) // 20%
    expect(isDarkSide([s(1, {}, true), s(2, {}, true), s(3, {}), s(4, {}), s(5, {})])).toBe(true) // 40%
  })
  test('no scenario answers is not dark', () => {
    expect(isDarkSide([])).toBe(false)
  })
})

describe('isSecret', () => {
  test('only a perfect score in the full journey', () => {
    expect(isSecret('full', 100, 14)).toBe(true)
    expect(isSecret('quick', 100, 6)).toBe(false)
    expect(isSecret('full', 93, 14)).toBe(false)
    expect(isSecret('full', 100, 0)).toBe(false)
  })
})

describe('matchPercent', () => {
  test('a single dominant trait gives 99', () => {
    expect(matchPercent({ brave: 6, clever: 0, loyal: 0 }, 'brave')).toBe(99)
  })
  test('an even spread gives 60', () => {
    expect(matchPercent({ brave: 2, clever: 2, loyal: 2 }, 'brave')).toBe(60)
    expect(matchPercent({ brave: 0, clever: 0, loyal: 0 }, 'brave')).toBe(60)
  })
  test('stays within 60-99 and rises with dominance', () => {
    const low = matchPercent({ brave: 3, clever: 2, loyal: 2 }, 'brave')
    const high = matchPercent({ brave: 5, clever: 1, loyal: 1 }, 'brave')
    expect(low).toBeGreaterThanOrEqual(60)
    expect(high).toBeLessThanOrEqual(99)
    expect(high).toBeGreaterThan(low)
  })
})

describe('computeResult', () => {
  const pack = makeFixturePack()

  test('character = tier x trait', () => {
    const r = computeResult(pack, 'quick', [k(true), k(true), k(false)], [s(1, { clever: 2 }), s(2, { clever: 2 }), s(3, { brave: 1 })])
    expect(r.tier).toBe('skilled')
    expect(r.trait).toBe('clever')
    expect(r.characterId).toBe('skilled-clever')
    expect(r.rarity).toBe('skilled')
  })

  test('dark side replaces the character with the dark one for that tier', () => {
    const r = computeResult(pack, 'quick', [k(false), k(false)], [s(1, { clever: 1 }, true), s(2, { clever: 1 }, true), s(3, { brave: 2 })])
    expect(r.characterId).toBe('beginner-dark')
    expect(r.dark).toBe(true)
    expect(r.rarity).toBe('dark')
  })

  test('secret character for 100% in the full journey, even over dark', () => {
    const scen = [s(1, { brave: 1 }, true), s(2, { brave: 1 }, true)]
    const full = computeResult(pack, 'full', [k(true), k(true)], scen)
    expect(full.characterId).toBe('secret')
    expect(full.rarity).toBe('secret')
    const quick = computeResult(pack, 'quick', [k(true), k(true)], scen)
    expect(quick.characterId).toBe('legend-dark')
  })

  test('match % is between 60 and 99', () => {
    const r = computeResult(pack, 'quick', [k(true)], [s(1, { brave: 2 }), s(2, { brave: 1, clever: 1 })])
    expect(r.matchPercent).toBeGreaterThanOrEqual(60)
    expect(r.matchPercent).toBeLessThanOrEqual(99)
  })
})
