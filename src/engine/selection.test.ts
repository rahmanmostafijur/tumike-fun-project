import { describe, expect, test } from 'vitest'
import { buildQuiz, countKinds, fullJourneyPlan, fullLength, quickDifficulties, stageForPosition, swapQuestion } from './selection'
import { PackSchema, type Pack } from './schema'
import { createRng } from './rng'
import { makeFixturePack } from './fixture.test-helper'

describe('stageForPosition', () => {
  test('quick mode spreads 9 questions over 7 stages, first to last', () => {
    const stages = Array.from({ length: 9 }, (_, i) => stageForPosition(i, 9, 7))
    expect(stages[0]).toBe(0)
    expect(stages[8]).toBe(6)
    expect(new Set(stages).size).toBe(7)
    stages.slice(1).forEach((v, i) => expect(v).toBeGreaterThanOrEqual(stages[i] ?? 0))
  })
})

describe('quickDifficulties', () => {
  test('rises gently and skips the hardest stages', () => {
    expect(quickDifficulties(7)).toEqual([1, 2, 3, 3, 4, 5])
    expect(quickDifficulties(3)).toEqual([1, 1, 1, 1, 1, 1])
  })
})

describe('buildQuiz', () => {
  const pack = makeFixturePack(4)

  test('quick mode is 9 questions: 6 knowledge + 3 scenario', () => {
    const quiz = buildQuiz(pack, 'quick', createRng(1))
    expect(quiz.items).toHaveLength(9)
    expect(quiz.items.filter((i) => i.kind === 'knowledge')).toHaveLength(6)
    expect(quiz.items.filter((i) => i.kind === 'scenario')).toHaveLength(3)
  })

  test('full journey is 3 per stage with difficulty rising per stage', () => {
    const quiz = buildQuiz(pack, 'full', createRng(2))
    expect(quiz.items).toHaveLength(4 * 3)
    quiz.items.forEach((item, i) => {
      expect(item.stageIndex).toBe(Math.floor(i / 3))
      if (item.kind === 'knowledge') {
        expect(pack.knowledge.find((q) => q.id === item.questionId)?.stage).toBe(item.stageIndex + 1)
      }
    })
  })

  test('never repeats a question and shuffles option order', () => {
    const quiz = buildQuiz(pack, 'full', createRng(3))
    const ids = quiz.items.map((i) => i.questionId)
    expect(new Set(ids).size).toBe(ids.length)
    quiz.items.forEach((i) => expect([...i.order].sort()).toEqual([0, 1, 2, 3]))
  })

  test('different seeds give different quizzes', () => {
    const a = buildQuiz(pack, 'quick', createRng(10)).items.map((i) => i.questionId).join()
    const b = buildQuiz(pack, 'quick', createRng(11)).items.map((i) => i.questionId).join()
    expect(a).not.toBe(b)
  })

  test('same seed gives the same quiz', () => {
    const a = buildQuiz(pack, 'quick', createRng(7))
    const b = buildQuiz(pack, 'quick', createRng(7))
    expect(a).toEqual(b)
  })
})

describe('configurable stage count', () => {
  const perStage = (stageCount: number, length?: number) => {
    const counts = Array.from({ length: stageCount }, () => 0)
    fullJourneyPlan(stageCount, length).forEach((s) => counts[s.stageIndex]!++)
    return counts
  }

  test('7 stages x 21 questions is exactly the old shape: K K S in every stage', () => {
    const plan = fullJourneyPlan(7, 21)
    expect(perStage(7, 21)).toEqual([3, 3, 3, 3, 3, 3, 3])
    plan.forEach((slot, i) => {
      expect(slot.stageIndex).toBe(Math.floor(i / 3))
      expect(slot.kind).toBe(i % 3 === 2 ? 'scenario' : 'knowledge')
    })
  })

  test('5 stages x 21 questions spreads 5, 4, 4, 4, 4 and keeps the 2:1 rhythm', () => {
    const plan = fullJourneyPlan(5, 21)
    expect(perStage(5, 21)).toEqual([5, 4, 4, 4, 4])
    expect(countKinds(plan.map((s) => s.kind))).toEqual({ knowledge: 14, scenario: 7 })
    plan.slice(1).forEach((s, i) => expect(s.stageIndex).toBeGreaterThanOrEqual(plan[i]?.stageIndex ?? 0))
  })

  test('without a pack length it falls back to three per stage', () => {
    expect(fullJourneyPlan(3)).toHaveLength(9)
    expect(fullLength({ stages: makeFixturePack(4).stages })).toBe(12)
    expect(fullLength({ stages: makeFixturePack(5).stages, fullLength: 21 })).toBe(21)
  })

  test('buildQuiz follows the pack length and stage count', () => {
    const pack: Pack = { ...makeFixturePack(5), fullLength: 21 }
    const full = buildQuiz(pack, 'full', createRng(9))
    expect(full.items).toHaveLength(21)
    expect(full.items.map((i) => i.stageIndex)).toEqual(fullJourneyPlan(5, 21).map((s) => s.stageIndex))
    full.items.forEach((item) => {
      if (item.kind !== 'knowledge') return
      expect(pack.knowledge.find((q) => q.id === item.questionId)?.stage).toBe(item.stageIndex + 1)
    })
    const quick = buildQuiz(pack, 'quick', createRng(9))
    expect(quick.items).toHaveLength(9)
    expect(quick.items[0]?.stageIndex).toBe(0)
    expect(quick.items[8]?.stageIndex).toBe(4)
  })

  test('the schema rejects a pack with too few questions for its journey', () => {
    const small = makeFixturePack(3) // 15 knowledge, 6 scenarios
    expect(PackSchema.safeParse(small).success).toBe(true)
    const result = PackSchema.safeParse({ ...small, fullLength: 21 }) // needs 15 knowledge and 8 scenarios
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((i) => i.message)).toContain('need at least 8 scenario questions')
  })
})

describe('swapQuestion', () => {
  const pack = makeFixturePack(4)

  test('replaces with an unused question of the same stage and retires the old one', () => {
    const quiz = buildQuiz(pack, 'full', createRng(4))
    const before = quiz.items[0]
    const swapped = swapQuestion(pack, quiz, 0, createRng(5))
    expect(swapped).not.toBeNull()
    const after = swapped?.items[0]
    expect(after?.questionId).not.toBe(before?.questionId)
    expect(after?.kind).toBe(before?.kind)
    expect(pack.knowledge.find((q) => q.id === after?.questionId)?.stage).toBe(1)
    expect(swapped?.retired).toContain(before?.questionId)
    expect(quiz.items[0]).toBe(before) // original untouched
  })

  test('returns null when no spare is left', () => {
    let quiz = buildQuiz(pack, 'full', createRng(6))
    const scenarioIndex = quiz.items.findIndex((i) => i.kind === 'scenario')
    let result = swapQuestion(pack, quiz, scenarioIndex, createRng(1))
    let guard = 0
    while (result && guard++ < 20) {
      quiz = result
      result = swapQuestion(pack, quiz, scenarioIndex, createRng(guard))
    }
    expect(result).toBeNull()
  })
})
