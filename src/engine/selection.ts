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

/** How many questions of each kind a mode asks. */
export interface QuestionSplit {
  knowledge: number
  scenario: number
}

/** Quick mode unless the pack says otherwise: 9 questions, 6 knowledge + 3 scenario. */
export const DEFAULT_QUICK: QuestionSplit = { knowledge: 6, scenario: 3 }
/** Full journey unless the pack says otherwise: per stage, 2 knowledge + 1 scenario. */
export const DEFAULT_PER_STAGE: QuestionSplit = { knowledge: 2, scenario: 1 }

/** The pack's own split for a mode, or the default. */
export function questionSplit(pack: Pick<Pack, 'stages' | 'modes'>, mode: Mode): QuestionSplit {
  const own = pack.modes?.[mode]
  if (own) return own
  if (mode === 'quick') return DEFAULT_QUICK
  const stages = pack.stages.length
  return { knowledge: stages * DEFAULT_PER_STAGE.knowledge, scenario: stages * DEFAULT_PER_STAGE.scenario }
}

/** Number of questions a mode asks. */
export function modeLength(pack: Pick<Pack, 'stages' | 'modes'>, mode: Mode): number {
  const split = questionSplit(pack, mode)
  return split.knowledge + split.scenario
}

/**
 * Question kinds in play order: scenarios spread evenly, each closing a run of
 * knowledge questions. 6 + 3 gives K K S K K S K K S; 3 + 6 gives K S S K S S K S S.
 */
export function kindsFor(split: QuestionSplit): QuestionKind[] {
  const total = split.knowledge + split.scenario
  return Array.from({ length: total }, (_, p) =>
    Math.floor(((p + 1) * split.scenario) / total) > Math.floor((p * split.scenario) / total) ? 'scenario' : 'knowledge',
  )
}

export interface PlannedSlot {
  kind: QuestionKind
  /** 0-based stage the question is asked in. */
  stageIndex: number
}

/**
 * The full journey's slots, spread evenly over the stages from first to last.
 * 14 + 7 over 7 stages is exactly K K S per stage; over 5 stages it is 5, 4, 4, 4, 4.
 */
export function fullJourneyPlan(
  stageCount: number,
  split: QuestionSplit = { knowledge: stageCount * DEFAULT_PER_STAGE.knowledge, scenario: stageCount * DEFAULT_PER_STAGE.scenario },
): PlannedSlot[] {
  const stages = Math.max(1, stageCount)
  const kinds = kindsFor(split)
  return kinds.map((kind, position) => ({
    kind,
    stageIndex: Math.min(stages - 1, Math.floor((position * stages) / kinds.length)),
  }))
}

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

  const split = questionSplit(pack, mode)
  if (mode === 'quick') {
    const kinds = kindsFor(split)
    const difficulties = quickDifficulties(stageCount, split.knowledge)
    let k = 0
    kinds.forEach((kind, position) => {
      const stageIndex = stageForPosition(position, kinds.length, stageCount)
      const target = kind === 'knowledge' ? (difficulties[k++] ?? 1) : stageIndex + 1
      take(kind, target, stageIndex)
    })
  } else {
    fullJourneyPlan(stageCount, split).forEach(({ kind, stageIndex }) => take(kind, stageIndex + 1, stageIndex))
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
