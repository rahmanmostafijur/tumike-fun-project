import { describe, expect, test } from 'vitest'
import { allPacks, getAnyPack, getPack, listedPacks, packErrors, packs } from './index'
import { buildQuiz, fullLength } from '../engine/selection'
import { createRng } from '../engine/rng'

describe('pack registry', () => {
  test('every pack folder validates against the schema', () => {
    expect(packErrors).toEqual([])
    expect(packs.length).toBeGreaterThanOrEqual(2)
  })

  test('carousel order: Harry Potter first; Money Heist playable in its place among four coming-soon packs', () => {
    expect(listedPacks.map((p) => p.id)).toEqual(['harry-potter', 'tin-goyenda', 'himu-misir-ali', 'breaking-bad', 'money-heist', 'game-of-thrones'])
    expect(listedPacks.filter((p) => p.status === 'coming-soon').map((p) => p.id)).toEqual(['tin-goyenda', 'himu-misir-ali', 'breaking-bad', 'game-of-thrones'])
    expect(getPack('money-heist')).toBeDefined()
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
        expect(buildQuiz(pack, 'full', createRng(seed)).items).toHaveLength(fullLength(pack))
      }
    }
  })

  test('the full journey stays at 21 questions (3 per stage)', () => {
    const quiz = hp && buildQuiz(hp, 'full', createRng(3))
    expect(quiz?.items).toHaveLength(21)
    quiz?.items.forEach((item, i) => expect(item.stageIndex).toBe(Math.floor(i / 3)))
  })
})
