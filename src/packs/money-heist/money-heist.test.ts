import { describe, expect, test } from 'vitest'
import { getPack } from '../index'
import { computeResult, type KnowledgeOutcome, type ScenarioOutcome } from '../../engine/scoring'
import { buildQuiz } from '../../engine/selection'
import { createRng } from '../../engine/rng'
import type { Pack, Tier } from '../../engine/schema'

const pack = getPack('money-heist') as Pack

/** Knowledge answers giving a whole-number percentage: `right` of `total` correct. */
const answers = (right: number, total: number): KnowledgeOutcome[] =>
  Array.from({ length: total }, (_, i) => ({ correct: i < right }))

/** Three scenario answers all leaning the same way. */
const leaning = (trait: string, dark = false): ScenarioOutcome[] =>
  [1, 2, 3].map((stage) => ({ stage, weights: { [trait]: 2 }, dark }))

/** Quick-mode knowledge scores that land in each tier (40 / 75 thresholds). */
const TIER_SCORE: Record<Tier, KnowledgeOutcome[]> = {
  legend: answers(6, 6),
  skilled: answers(3, 6),
  beginner: answers(1, 6),
}

const GRID: Record<Tier, Record<string, string>> = {
  legend: { brave: 'tokyo', clever: 'lisbon', loyal: 'nairobi', ambitious: 'palermo', funny: 'denver', mysterious: 'berlin' },
  skilled: { brave: 'stockholm', clever: 'rio', loyal: 'helsinki', ambitious: 'alicia', funny: 'bogota', mysterious: 'marseille' },
  beginner: { brave: 'manila', clever: 'benjamin', loyal: 'moscow', ambitious: 'angel', funny: 'matias', mysterious: 'oslo' },
}

const DARK: Record<Tier, string> = { legend: 'gandia', skilled: 'tamayo', beginner: 'arturo' }

describe('money heist pack', () => {
  test('is playable with 5 parts, a 21-question journey and the origami reveal', () => {
    expect(pack).toBeDefined()
    expect(pack.stages).toHaveLength(5)
    expect(pack.stageLabel).toEqual({ bn: 'পর্ব', en: 'Part' })
    expect(pack.fullLength).toBe(21)
    expect(pack.reveal.kind).toBe('origami')
    expect(pack.reveal.lines[0]).toEqual({ bn: 'পরিকল্পনায় তোমার নামও ছিল।', en: 'Your name was in the plan.' })
    expect(pack.background?.journey).toHaveLength(5)
  })

  test('has 28 knowledge questions rising over the parts, 10 scenarios and 22 characters', () => {
    expect(pack.knowledge).toHaveLength(28)
    expect([1, 2, 3, 4, 5].map((s) => pack.knowledge.filter((q) => q.stage === s).length)).toEqual([7, 6, 6, 5, 4])
    expect(pack.scenarios).toHaveLength(10)
    expect(pack.characters).toHaveLength(22)
  })

  test('at least half of the knowledge questions open with a memory', () => {
    expect(pack.knowledge.filter((q) => q.memory).length * 2).toBeGreaterThanOrEqual(pack.knowledge.length)
  })

  test('every scenario option is tempting: no scenario is all dark, and dark options exist', () => {
    pack.scenarios.forEach((s) => expect(s.options.filter((o) => o.dark).length).toBeLessThanOrEqual(1))
    expect(pack.scenarios.filter((s) => s.options.some((o) => o.dark)).length).toBeGreaterThanOrEqual(5)
  })

  test('both modes build with spares left for Plan B', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const full = buildQuiz(pack, 'full', createRng(seed))
      expect(full.items).toHaveLength(21)
      expect(full.items.filter((i) => i.kind === 'knowledge')).toHaveLength(14)
      expect(buildQuiz(pack, 'quick', createRng(seed)).items).toHaveLength(9)
    }
    expect(pack.knowledge.length - 14).toBeGreaterThanOrEqual(1)
    expect(pack.scenarios.length - 7).toBeGreaterThanOrEqual(1)
  })
})

describe('money heist scoring grid', () => {
  for (const tier of ['legend', 'skilled', 'beginner'] as const) {
    for (const [trait, id] of Object.entries(GRID[tier])) {
      test(`${tier} + ${trait} = ${id}`, () => {
        const result = computeResult(pack, 'quick', TIER_SCORE[tier], leaning(trait))
        expect(result.characterId).toBe(id)
        expect(result.rarity).toBe(tier)
      })
    }

    test(`dark ${tier} = ${DARK[tier]}`, () => {
      const result = computeResult(pack, 'quick', TIER_SCORE[tier], leaning('ambitious', true))
      expect(result.characterId).toBe(DARK[tier])
      expect(result.rarity).toBe('dark')
    })
  }

  test('a perfect full journey reveals The Professor', () => {
    const result = computeResult(pack, 'full', answers(14, 14), leaning('clever'))
    expect(result.characterId).toBe('professor')
    expect(result.secret).toBe(true)
  })

  test('a perfect quick game is a legend, never the secret', () => {
    expect(computeResult(pack, 'quick', answers(6, 6), leaning('clever')).characterId).toBe('lisbon')
  })
})
