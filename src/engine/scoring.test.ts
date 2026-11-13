import { describe, expect, test } from 'vitest'
import {
  computeResult,
  isDarkSide,
  isSecret,
  knowledgePercent,
  matchPercent,
  tierFor,
  fallbackTiers,
  traitTotals,
  winningTrait,
  type ScenarioOutcome,
} from './scoring'
import { makeFixturePack } from './fixture.test-helper'
import { PackSchema } from './schema'

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

describe('small rosters fall back to the nearest filled slot', () => {
  // Partial roster: legend-brave, beginner-clever, one skilled dark, and two secrets tied to traits.
  const base = makeFixturePack(4)
  const keep = new Set(['legend-brave', 'beginner-clever', 'skilled-dark'])
  const pack = PackSchema.parse({
    ...base,
    roster: 'partial',
    characters: [
      ...base.characters.filter((c) => keep.has(c.id)),
      { ...base.characters.find((c) => c.kind === 'secret')!, id: 'secret-brave', trait: 'brave' },
      { ...base.characters.find((c) => c.kind === 'secret')!, id: 'secret-clever', trait: 'clever' },
    ],
  })
  const answers = (right: number, total: number) => Array.from({ length: total }, (_, i) => ({ correct: i < right }))
  const lean = (trait: string, dark = false) => [1, 2, 3].map((stage) => ({ stage, weights: { [trait]: 2 }, dark }))
  const LEGEND = answers(6, 6)
  const SKILLED = answers(3, 6)
  const BEGINNER = answers(1, 6)

  test('tiers are tried earned first, then lower (closest first), then higher as a last resort', () => {
    expect(fallbackTiers('legend')).toEqual(['legend', 'skilled', 'beginner'])
    expect(fallbackTiers('skilled')).toEqual(['skilled', 'beginner', 'legend'])
    expect(fallbackTiers('beginner')).toEqual(['beginner', 'skilled', 'legend'])
  })

  test('a) an empty slot takes the next-best trait within the earned tier', () => {
    const r = computeResult(pack, 'quick', LEGEND, lean('clever'))
    expect(r.characterId).toBe('legend-brave')
    expect(r.tier).toBe('legend')
    expect(computeResult(pack, 'quick', BEGINNER, lean('brave')).characterId).toBe('beginner-clever')
  })

  test('a) inside the tier, the player ranking decides between several characters', () => {
    const two = PackSchema.parse({ ...pack, characters: [...pack.characters, base.characters.find((c) => c.id === 'beginner-brave')!] })
    expect(computeResult(two, 'quick', BEGINNER, lean('brave')).characterId).toBe('beginner-brave')
    expect(computeResult(two, 'quick', BEGINNER, lean('clever')).characterId).toBe('beginner-clever')
  })

  test('b) a tier with no characters at all drops to the closest lower tier, never up', () => {
    const r = computeResult(pack, 'quick', SKILLED, lean('brave'))
    expect(r.characterId).toBe('beginner-clever') // not legend-brave
    expect(r.tier).toBe('beginner')
  })

  test('c) a higher tier only when nothing lower exists', () => {
    const solo = PackSchema.parse({ ...pack, characters: pack.characters.filter((c) => c.id !== 'beginner-clever') })
    expect(computeResult(solo, 'quick', BEGINNER, lean('clever')).characterId).toBe('legend-brave')
    expect(computeResult(solo, 'quick', SKILLED, lean('clever')).characterId).toBe('legend-brave')
  })

  test('dark takes the earned or closest lower dark tier, a higher one only as a last resort, else a regular', () => {
    expect(computeResult(pack, 'quick', LEGEND, lean('brave', true)).characterId).toBe('skilled-dark')
    expect(computeResult(pack, 'quick', BEGINNER, lean('brave', true)).characterId).toBe('skilled-dark')
    const noDark = PackSchema.parse({ ...pack, characters: pack.characters.filter((c) => c.kind !== 'dark') })
    expect(computeResult(noDark, 'quick', LEGEND, lean('brave', true)).characterId).toBe('legend-brave')
  })

  test('with several secrets, the one matching the stronger lean wins', () => {
    expect(computeResult(pack, 'full', answers(8, 8), lean('clever')).characterId).toBe('secret-clever')
    expect(computeResult(pack, 'full', answers(8, 8), lean('brave')).characterId).toBe('secret-brave')
  })

  test('the schema keeps full rosters strict and partial rosters sane', () => {
    expect(PackSchema.safeParse({ ...pack, roster: 'full' }).success).toBe(false)
    const twoInSlot = [...pack.characters, { ...pack.characters[0]!, id: 'dupe-slot' }]
    expect(PackSchema.safeParse({ ...pack, characters: twoInSlot }).success).toBe(false)
    const sameSecretTrait = pack.characters.map((c) => (c.id === 'secret-clever' ? { ...c, trait: 'brave' } : c))
    expect(PackSchema.safeParse({ ...pack, characters: sameSecretTrait }).success).toBe(false)
  })
})
