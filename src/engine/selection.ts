import type { Pack } from './schema'
import { pickOne, shuffle, type Rng } from './rng'

export type Mode = 'quick' | 'full'
export type QuestionKind = 'knowledge' | 'scenario'

export interface QuizItem {
  kind: QuestionKind
  questionId: string
  /** 0-based stage index this question belongs to. */
  stageIndex: number
  /** Display order of the original option indices. */
  order: number[]
}

export interface Quiz {
  mode: Mode
  items: QuizItem[]
  /** Question ids that were swapped out and must not come back. */
  retired: string[]
}

/** Quick mode: 9 questions, 6 knowledge + 3 scenario, in K K S rhythm. */
export const QUICK_PATTERN: readonly QuestionKind[] = [
  'knowledge', 'knowledge', 'scenario',
  'knowledge', 'knowledge', 'scenario',
  'knowledge', 'knowledge', 'scenario',
]

/** Full journey: per stage, 2 knowledge + 1 scenario. */
export const FULL_STAGE_PATTERN: readonly QuestionKind[] = ['knowledge', 'knowledge', 'scenario']

/** Stage index for a question position, spreading `total` questions over `stageCount` stages. */
export function stageForPosition(position: number, total: number, stageCount: number): number {
  if (total <= 1) return 0
  return Math.round((position * (stageCount - 1)) / (total - 1))
}

/**
 * Target difficulties for quick mode's knowledge questions: a gentle rise
 * that skips the hardest stages, so a 90 second game stays friendly.
 */
export function quickDifficulties(stageCount: number, count = 6): number[] {
  const cap = Math.max(1, stageCount - 2)
  return Array.from({ length: count }, (_, i) =>
    count === 1 ? 1 : Math.round(1 + (i * (cap - 1)) / (count - 1)),
  )
}

interface Staged {
  id: string
  stage: number
}

/** Picks an unused question closest to the target stage, randomly among equals. */
function pickNearest<T extends Staged>(pool: readonly T[], used: ReadonlySet<string>, target: number, rng: Rng): T | undefined {
  const free = pool.filter((q) => !used.has(q.id))
  if (free.length === 0) return undefined
  const best = Math.min(...free.map((q) => Math.abs(q.stage - target)))
  return pickOne(free.filter((q) => Math.abs(q.stage - target) === best), rng)
}

function makeItem(kind: QuestionKind, questionId: string, stageIndex: number, rng: Rng): QuizItem {
  return { kind, questionId, stageIndex, order: shuffle([0, 1, 2, 3], rng) }
}

/** Builds a randomised quiz for the given mode. */
export function buildQuiz(pack: Pack, mode: Mode, rng: Rng): Quiz {
  const used = new Set<string>()
  const items: QuizItem[] = []
  const stageCount = pack.stages.length

  const take = (kind: QuestionKind, target: number, stageIndex: number) => {
    const pool = kind === 'knowledge' ? pack.knowledge : pack.scenarios
    const q = pickNearest<Staged>(pool, used, target, rng)
    if (!q) throw new Error(`Pack "${pack.id}" ran out of ${kind} questions`)
    used.add(q.id)
    items.push(makeItem(kind, q.id, stageIndex, rng))
  }

  if (mode === 'quick') {
    const difficulties = quickDifficulties(stageCount)
    let k = 0
    QUICK_PATTERN.forEach((kind, position) => {
      const stageIndex = stageForPosition(position, QUICK_PATTERN.length, stageCount)
      const target = kind === 'knowledge' ? (difficulties[k++] ?? 1) : stageIndex + 1
      take(kind, target, stageIndex)
    })
  } else {
    for (let stageIndex = 0; stageIndex < stageCount; stageIndex++) {
      FULL_STAGE_PATTERN.forEach((kind) => take(kind, stageIndex + 1, stageIndex))
    }
  }

  return { mode, items, retired: [] }
}

/** Target difficulty used when swapping: the stage of the question being replaced. */
function stageOf(pack: Pack, item: QuizItem): number {
  const pool: readonly Staged[] = item.kind === 'knowledge' ? pack.knowledge : pack.scenarios
  return pool.find((q) => q.id === item.questionId)?.stage ?? item.stageIndex + 1
}

/** True when a spare question exists for the item at `index`. */
export function hasSpare(pack: Pack, quiz: Quiz, index: number): boolean {
  const item = quiz.items[index]
  if (!item) return false
  const pool = item.kind === 'knowledge' ? pack.knowledge : pack.scenarios
  const used = new Set([...quiz.items.map((i) => i.questionId), ...quiz.retired])
  return pool.some((q) => !used.has(q.id))
}

/**
 * Replaces the question at `index` with an unused one of similar difficulty.
 * Returns a new quiz, or null when no spare is left.
 */
export function swapQuestion(pack: Pack, quiz: Quiz, index: number, rng: Rng): Quiz | null {
  const item = quiz.items[index]
  if (!item) return null
  const pool: readonly Staged[] = item.kind === 'knowledge' ? pack.knowledge : pack.scenarios
  const used = new Set([...quiz.items.map((i) => i.questionId), ...quiz.retired])
  const next = pickNearest(pool, used, stageOf(pack, item), rng)
  if (!next) return null
  const items = quiz.items.map((it, i) => (i === index ? makeItem(item.kind, next.id, item.stageIndex, rng) : it))
  return { ...quiz, items, retired: [...quiz.retired, item.questionId] }
}
