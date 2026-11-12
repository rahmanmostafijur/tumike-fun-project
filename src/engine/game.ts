import type { KnowledgeQuestion, Pack, ScenarioQuestion } from './schema'
import type { Rng } from './rng'
import { buildQuiz, hasSpare, swapQuestion, type Mode, type Quiz, type QuizItem } from './selection'
import { NO_LIFELINES_USED, pickRemovals, type LifelineId, type LifelineUse } from './lifelines'
import { computeResult, type KnowledgeOutcome, type QuizResult, type ScenarioOutcome } from './scoring'

/** Knowledge questions are timed; scenario questions are not. */
export const KNOWLEDGE_SECONDS = 20

export interface AnswerRecord {
  item: QuizItem
  /** Original option index, or null when the timer ran out. */
  choice: number | null
}

export interface GameState {
  mode: Mode
  quiz: Quiz
  index: number
  answers: AnswerRecord[]
  used: LifelineUse
  /** Original option indices hidden by "remove two" on the current question. */
  hidden: number[]
  /** Timer frozen on the current question. */
  frozen: boolean
}

export function createGame(pack: Pack, mode: Mode, rng: Rng): GameState {
  return {
    mode,
    quiz: buildQuiz(pack, mode, rng),
    index: 0,
    answers: [],
    used: NO_LIFELINES_USED,
    hidden: [],
    frozen: false,
  }
}

export function currentItem(state: GameState): QuizItem | undefined {
  return state.quiz.items[state.index]
}

export function isComplete(state: GameState): boolean {
  return state.index >= state.quiz.items.length
}

export function findKnowledge(pack: Pack, id: string): KnowledgeQuestion | undefined {
  return pack.knowledge.find((q) => q.id === id)
}

export function findScenario(pack: Pack, id: string): ScenarioQuestion | undefined {
  return pack.scenarios.find((q) => q.id === id)
}

/** Records an answer for the current question and moves on. */
export function answer(state: GameState, choice: number | null): GameState {
  const item = currentItem(state)
  if (!item) return state
  return {
    ...state,
    answers: [...state.answers, { item, choice }],
    index: state.index + 1,
    hidden: [],
    frozen: false,
  }
}

/** Whether a lifeline can be used on the current question right now. */
export function canUseLifeline(pack: Pack, state: GameState, id: LifelineId): boolean {
  const item = currentItem(state)
  if (!item || state.used[id]) return false
  if (id === 'swap') return hasSpare(pack, state.quiz, state.index)
  return item.kind === 'knowledge'
}

export function applyLifeline(pack: Pack, state: GameState, id: LifelineId, rng: Rng): GameState {
  if (!canUseLifeline(pack, state, id)) return state
  const item = currentItem(state)
  if (!item) return state
  const used = { ...state.used, [id]: true }

  if (id === 'fifty') {
    const q = findKnowledge(pack, item.questionId)
    return q ? { ...state, used, hidden: pickRemovals(q, rng) } : state
  }
  if (id === 'freeze') return { ...state, used, frozen: true }

  const quiz = swapQuestion(pack, state.quiz, state.index, rng)
  return quiz ? { ...state, used, quiz, hidden: [], frozen: false } : state
}

/** Turns recorded answers into scoring inputs. */
export function outcomes(pack: Pack, answers: readonly AnswerRecord[]) {
  const knowledge: KnowledgeOutcome[] = []
  const scenarios: ScenarioOutcome[] = []
  for (const { item, choice } of answers) {
    if (item.kind === 'knowledge') {
      const q = findKnowledge(pack, item.questionId)
      knowledge.push({ correct: q !== undefined && choice === q.answer })
    } else {
      const option = choice === null ? undefined : findScenario(pack, item.questionId)?.options[choice]
      scenarios.push({ stage: item.stageIndex + 1, weights: option?.traits ?? {}, dark: option?.dark ?? false })
    }
  }
  return { knowledge, scenarios }
}

export function finish(pack: Pack, state: GameState): QuizResult {
  const { knowledge, scenarios } = outcomes(pack, state.answers)
  return computeResult(pack, state.mode, knowledge, scenarios)
}
