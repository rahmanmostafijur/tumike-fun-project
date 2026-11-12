import { describe, expect, test } from 'vitest'
import { buildQuiz, quickDifficulties, stageForPosition, swapQuestion } from './selection'
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
