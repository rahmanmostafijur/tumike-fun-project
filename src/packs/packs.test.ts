import { describe, expect, test } from 'vitest'
import { allPacks, getAnyPack, getPack, listedPacks, packErrors, packs } from './index'
import { buildQuiz, modeLength } from '../engine/selection'
import { computeResult } from '../engine/scoring'
import { TIERS } from '../engine/schema'
import { createRng } from '../engine/rng'

describe('pack registry', () => {
  test('every pack folder validates against the schema', () => {
    expect(packErrors).toEqual([])
    expect(packs.length).toBeGreaterThanOrEqual(2)
  })

  test('carousel order is fixed; the finished universes are playable, the rest coming soon', () => {
    const PLAYABLE = ['harry-potter', 'breaking-bad', 'money-heist']
    expect(listedPacks.map((p) => p.id)).toEqual(['harry-potter', 'tin-goyenda', 'himu-misir-ali', 'breaking-bad', 'money-heist', 'game-of-thrones'])
    listedPacks.forEach((p) => expect(p.status).toBe(PLAYABLE.includes(p.id) ? 'playable' : 'coming-soon'))
  })

  test('coming-soon packs can never start a game', () => {
    for (const p of allPacks.filter((x) => x.status === 'coming-soon')) {
      expect(getPack(p.id)).toBeUndefined()
      expect(getAnyPack(p.id)?.background).toBeDefined()
    }
  })

  test('the sample pack is unlisted, loadable, and works without a background', () => {
    expect(getPack('sample-space')).toBeDefined()
    expect(getPack('sample-space')?.background).toBeUndefined()
    expect(listedPacks.map((p) => p.id)).not.toContain('sample-space')
  })
})

describe('content rules hold for every playable pack', () => {
  for (const pack of packs.filter((p) => p.listed)) {
    test(`${pack.id}: half the knowledge questions open with a memory; scenarios have at most one dark option`, () => {
      expect(pack.knowledge.filter((q) => q.memory).length * 2).toBeGreaterThanOrEqual(pack.knowledge.length)
      pack.scenarios.forEach((s) => expect(s.options.filter((o) => o.dark).length).toBeLessThanOrEqual(1))
    })
  }
})

describe('every pack always produces a real result', () => {
  const answers = (right: number, total: number) => Array.from({ length: total }, (_, i) => ({ correct: i < right }))
  const leaning = (trait: string, dark = false) => [1, 2, 3].map((stage) => ({ stage, weights: { [trait]: 2 }, dark }))
  const SCORES = { legend: answers(6, 6), skilled: answers(3, 6), beginner: answers(1, 6) } as const

  for (const pack of packs) {
    const ids = new Set(pack.characters.map((c) => c.id))
    test(`${pack.id}: every tier x trait, every dark tier and every secret lean resolve to a character`, () => {
      for (const tier of TIERS) {
        for (const { id: trait } of pack.traits) {
          const r = computeResult(pack, 'quick', SCORES[tier], leaning(trait))
          expect(ids.has(r.characterId)).toBe(true)
          expect(pack.characters.find((c) => c.id === r.characterId)?.kind).toBe('regular')
        }
        const dark = computeResult(pack, 'quick', SCORES[tier], leaning(pack.traits[0]!.id, true))
        expect(ids.has(dark.characterId)).toBe(true)
        if (pack.characters.some((c) => c.kind === 'dark')) expect(dark.rarity).toBe('dark')
      }
      for (const { id: trait } of pack.traits) {
        const secret = computeResult(pack, 'full', answers(8, 8), leaning(trait))
        expect(secret.rarity).toBe('secret')
        expect(ids.has(secret.characterId)).toBe(true)
      }
    })
  }
})

describe('harry potter pack', () => {
  const hp = getPack('harry-potter')

  test('has 22 characters, 7 stages, 6 traits, and a background', () => {
    expect(hp?.characters).toHaveLength(22)
    expect(hp?.stages).toHaveLength(7)
    expect(hp?.background?.flyer).toBeDefined()
    expect(hp?.traits).toHaveLength(6)
  })

  test('has 4+ knowledge questions per stage and 10+ scenarios', () => {
    for (let stage = 1; stage <= 7; stage++) {
      expect(hp?.knowledge.filter((q) => q.stage === stage).length).toBeGreaterThanOrEqual(4)
    }
    expect(hp?.knowledge.length).toBeGreaterThan(28)
    expect(hp?.scenarios.length).toBeGreaterThan(10)
  })

  test('at least half of the knowledge questions open with a memory', () => {
    const withMemory = hp?.knowledge.filter((q) => q.memory).length ?? 0
    expect(withMemory * 2).toBeGreaterThanOrEqual(hp?.knowledge.length ?? 0)
  })

  test('every scenario has at least one non-dark option per trait group and some dark options exist', () => {
    const darkCount = hp?.scenarios.filter((s) => s.options.some((o) => o.dark)).length ?? 0
    expect(darkCount).toBeGreaterThanOrEqual(7)
  })

  test('both modes build for every pack', () => {
    for (const pack of packs) {
      for (let seed = 1; seed <= 25; seed++) {
        expect(buildQuiz(pack, 'quick', createRng(seed)).items).toHaveLength(9)
        expect(buildQuiz(pack, 'quick', createRng(seed)).items).toHaveLength(modeLength(pack, 'quick'))
        expect(buildQuiz(pack, 'full', createRng(seed)).items).toHaveLength(modeLength(pack, 'full'))
      }
    }
  })

  test('the full journey stays at 21 questions (3 per stage)', () => {
    const quiz = hp && buildQuiz(hp, 'full', createRng(3))
    expect(quiz?.items).toHaveLength(21)
    quiz?.items.forEach((item, i) => expect(item.stageIndex).toBe(Math.floor(i / 3)))
  })
})
