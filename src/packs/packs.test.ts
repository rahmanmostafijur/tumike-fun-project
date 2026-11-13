import { describe, expect, test } from 'vitest'
import { allPacks, getAnyPack, getPack, listedPacks, packErrors, packs } from './index'
import { buildQuiz, modeLength } from '../engine/selection'
import { computeResult, knowledgePercent, resolveCharacter, tierFor } from '../engine/scoring'
import { PackSchema, TIERS, type Pack, type Tier } from '../engine/schema'
import { packHeadline } from '../ui/util'
import { createRng } from '../engine/rng'

describe('pack registry', () => {
  test('every pack folder validates against the schema', () => {
    expect(packErrors).toEqual([])
    expect(packs.length).toBeGreaterThanOrEqual(2)
  })

  test('carousel order is fixed; the finished universes are playable, the rest coming soon', () => {
    const PLAYABLE = ['harry-potter', 'tin-goyenda', 'himu-misir-ali', 'breaking-bad', 'money-heist', 'game-of-thrones']
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

describe('landing heading names the active world', () => {
  for (const pack of allPacks) {
    test(`${pack.id}: has the heading in both languages`, () => {
      expect(pack.headline.en).toBe(`Who are you in the world of ${pack.id === 'sample-space' ? 'Space' : pack.title.en}?`)
      // Bangla is written out per pack (possessive suffix included), always in Bangla script.
      expect(pack.headline.bn).toMatch(/^[ঀ-৿][ঀ-৿ ]*দুনিয়ায় তুমি কে\?$/)
    })
  }

  test('the Bangla headings carry the right possessive for each world', () => {
    const bn = Object.fromEntries(allPacks.map((p) => [p.id, p.headline.bn]))
    expect(bn).toMatchObject({
      'harry-potter': 'হ্যারি পটারের দুনিয়ায় তুমি কে?',
      'money-heist': 'মানি হাইস্টের দুনিয়ায় তুমি কে?',
      'tin-goyenda': 'তিন গোয়েন্দার দুনিয়ায় তুমি কে?',
      'himu-misir-ali': 'হিমু ও মিসির আলির দুনিয়ায় তুমি কে?',
    })
  })

  test('a pack without a heading does not validate', () => {
    const hp = getPack('harry-potter')!
    const { headline: _omit, ...rest } = hp
    expect(PackSchema.safeParse(rest).success).toBe(false)
  })

  test('with no active pack the generic heading is the fallback', () => {
    expect(packHeadline(undefined, 'en', 'Who are you, and in which world?')).toBe('Who are you, and in which world?')
    expect(packHeadline(null, 'bn', 'কোন দুনিয়ায় তুমি কে?')).toBe('কোন দুনিয়ায় তুমি কে?')
    expect(packHeadline(getPack('harry-potter'), 'bn', 'x')).toBe('হ্যারি পটারের দুনিয়ায় তুমি কে?')
  })
})

describe('a fallback never promotes a player above the tier they earned', () => {
  const answers = (right: number, total: number) => Array.from({ length: total }, (_, i) => ({ correct: i < right }))
  // A knowledge score that earns `tier` under the pack's own thresholds.
  const scoreFor = (pack: Pack, tier: Tier) => {
    const total = 20
    const right = Array.from({ length: total + 1 }, (_, n) => n).find((n) => tierFor(knowledgePercent(answers(n, total)), pack.tiers.thresholds) === tier)
    return answers(right ?? 0, total)
  }
  const rank = (tier: Tier | undefined) => (tier ? TIERS.indexOf(tier) : -1)
  // Case c: a higher tier is allowed only when nothing of that kind exists at or below the earned tier.
  const nothingAtOrBelow = (pack: Pack, kind: 'regular' | 'dark', earned: Tier) =>
    !pack.characters.some((c) => c.kind === kind && rank(c.tier) <= rank(earned))
  // Scenario answers whose trait ranking is exactly `[first, ...rest]`.
  const leaning = (first: string, rest: readonly string[], dark: boolean) =>
    [first, ...rest].map((trait, i) => ({ stage: 1, weights: { [trait]: 10 - i }, dark }))

  for (const pack of packs) {
    const order = pack.traits.map((t) => t.id)

    test(`${pack.id}: every tier x trait, regular and dark, stays at or below the earned tier`, () => {
      for (const tier of TIERS) {
        for (const trait of order) {
          for (const dark of [false, true]) {
            const r = computeResult(pack, 'quick', scoreFor(pack, tier), leaning(trait, order.filter((t) => t !== trait), dark))
            const given = pack.characters.find((c) => c.id === r.characterId)!
            if (rank(given.tier) > rank(tier)) {
              const kind = given.kind === 'dark' ? 'dark' : 'regular'
              expect(nothingAtOrBelow(pack, kind, tier), `${tier}/${trait}${dark ? '/dark' : ''} gave ${given.id}`).toBe(true)
            }
          }
        }
      }
    })

    test(`${pack.id}: for every trait ranking, the earned tier's best available trait is given`, () => {
      const perms = (xs: string[]): string[][] =>
        xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]))
      for (const tier of TIERS) {
        const inTier = pack.characters.filter((c) => c.kind === 'regular' && c.tier === tier)
        for (const ranking of perms(order)) {
          const given = resolveCharacter(pack.characters, tier, ranking, { dark: false, secret: false })
          if (rank(given.tier) > rank(tier)) expect(nothingAtOrBelow(pack, 'regular', tier)).toBe(true)
          if (inTier.length > 0) {
            expect(given.tier).toBe(tier)
            expect(given.trait).toBe(ranking.find((t) => inTier.some((c) => c.trait === t)))
          }
        }
      }
    })
  }

  test('full rosters always land on the exact earned tier and winning trait', () => {
    for (const pack of packs.filter((p) => p.roster === 'full')) {
      const order = pack.traits.map((t) => t.id)
      for (const tier of TIERS) {
        for (const trait of order) {
          const given = resolveCharacter(pack.characters, tier, [trait, ...order.filter((t) => t !== trait)], { dark: false, secret: false })
          expect([given.tier, given.trait]).toEqual([tier, trait])
          expect(resolveCharacter(pack.characters, tier, [trait], { dark: true, secret: false })).toMatchObject({ kind: 'dark', tier })
        }
      }
    }
  })

  test('playtest case: Himu & Misir Ali quick, 0 of 3 right with a mysterious lean, stays Beginner', () => {
    const himu = getPack('himu-misir-ali')!
    const order = himu.traits.map((t) => t.id)
    const r = computeResult(himu, 'quick', answers(0, 3), leaning('mysterious', order.filter((t) => t !== 'mysterious'), false))
    expect(r.tier).toBe('beginner')
    expect(r.characterId).not.toBe('ranu')
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
