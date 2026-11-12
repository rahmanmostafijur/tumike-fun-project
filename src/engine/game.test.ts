import { describe, expect, test } from 'vitest'
import { answer, applyLifeline, canUseLifeline, createGame, currentItem, finish, findKnowledge, isComplete } from './game'
import { createRng } from './rng'
import { makeFixturePack } from './fixture.test-helper'

const pack = makeFixturePack(4)

describe('game flow', () => {
  test('everyone finishes: timeouts count as wrong and the game still completes', () => {
    let state = createGame(pack, 'quick', createRng(1))
    while (!isComplete(state)) state = answer(state, null)
    expect(state.answers).toHaveLength(9)
    const result = finish(pack, state)
    expect(result.knowledgePercent).toBe(0)
    expect(result.tier).toBe('beginner')
  })

  test('answering every knowledge question right in the full journey unlocks the secret', () => {
    let state = createGame(pack, 'full', createRng(2))
    while (!isComplete(state)) {
      const item = currentItem(state)
      if (!item) break
      const choice = item.kind === 'knowledge' ? (findKnowledge(pack, item.questionId)?.answer ?? 0) : 0
      state = answer(state, choice)
    }
    expect(finish(pack, state).characterId).toBe('secret')
  })
})

describe('lifelines', () => {
  test('remove two hides two wrong options, once', () => {
    let state = createGame(pack, 'quick', createRng(3))
    const item = currentItem(state)
    const q = item && findKnowledge(pack, item.questionId)
    state = applyLifeline(pack, state, 'fifty', createRng(4))
    expect(state.hidden).toHaveLength(2)
    expect(state.hidden).not.toContain(q?.answer)
    expect(state.used.fifty).toBe(true)
    expect(canUseLifeline(pack, state, 'fifty')).toBe(false)
    const again = applyLifeline(pack, state, 'fifty', createRng(5))
    expect(again).toBe(state)
  })

  test('freeze stops the timer for the current question only', () => {
    let state = createGame(pack, 'quick', createRng(6))
    state = applyLifeline(pack, state, 'freeze', createRng(7))
    expect(state.frozen).toBe(true)
    state = answer(state, 0)
    expect(state.frozen).toBe(false)
    expect(state.hidden).toEqual([])
  })

  test('remove two and freeze do not apply to scenario questions; swap does', () => {
    let state = createGame(pack, 'quick', createRng(8))
    state = answer(answer(state, 0), 0)
    expect(currentItem(state)?.kind).toBe('scenario')
    expect(canUseLifeline(pack, state, 'fifty')).toBe(false)
    expect(canUseLifeline(pack, state, 'freeze')).toBe(false)
    expect(canUseLifeline(pack, state, 'swap')).toBe(true)
  })

  test('swap replaces the current question without advancing', () => {
    let state = createGame(pack, 'quick', createRng(9))
    const before = currentItem(state)?.questionId
    state = applyLifeline(pack, state, 'swap', createRng(10))
    expect(state.index).toBe(0)
    expect(currentItem(state)?.questionId).not.toBe(before)
    expect(state.used.swap).toBe(true)
  })
})
