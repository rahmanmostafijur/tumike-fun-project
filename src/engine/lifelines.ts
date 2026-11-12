import type { KnowledgeQuestion } from './schema'
import { shuffle, type Rng } from './rng'

export type LifelineId = 'fifty' | 'freeze' | 'swap'
export const LIFELINES: readonly LifelineId[] = ['fifty', 'freeze', 'swap']

export type LifelineUse = Readonly<Record<LifelineId, boolean>>
export const NO_LIFELINES_USED: LifelineUse = { fifty: false, freeze: false, swap: false }

/** Picks two wrong options (original indices) to remove. */
export function pickRemovals(question: KnowledgeQuestion, rng: Rng): number[] {
  const wrong = [0, 1, 2, 3].filter((i) => i !== question.answer)
  return shuffle(wrong, rng).slice(0, 2).sort((a, b) => a - b)
}
