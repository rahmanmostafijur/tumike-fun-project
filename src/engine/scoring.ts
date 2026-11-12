import type { Character, Pack, Rarity, Tier } from './schema'
import type { Mode } from './selection'

/** A knowledge answer reduced to what scoring needs. */
export interface KnowledgeOutcome {
  correct: boolean
}

/** A scenario answer reduced to what scoring needs, in the order it was answered. */
export interface ScenarioOutcome {
  /** 1-based stage (scene index + 1) the answer was given in. */
  stage: number
  weights: Readonly<Record<string, number>>
  dark: boolean
}

export interface Thresholds {
  skilled: number
  legend: number
}

export const DARK_SHARE = 0.4
export const MATCH_MIN = 60
export const MATCH_MAX = 99

/** Knowledge score as a whole percentage (0-100). No questions scores 0. */
export function knowledgePercent(outcomes: readonly KnowledgeOutcome[]): number {
  if (outcomes.length === 0) return 0
  const correct = outcomes.filter((o) => o.correct).length
  return Math.round((correct / outcomes.length) * 100)
}

/** Below `skilled` = beginner, below `legend` = skilled, otherwise legend. */
export function tierFor(percent: number, thresholds: Thresholds): Tier {
  if (percent >= thresholds.legend) return 'legend'
  if (percent >= thresholds.skilled) return 'skilled'
  return 'beginner'
}

/** Sum of trait weights across scenario answers, with every trait present. */
export function traitTotals(outcomes: readonly ScenarioOutcome[], traitOrder: readonly string[]): Record<string, number> {
  const totals: Record<string, number> = Object.fromEntries(traitOrder.map((t) => [t, 0]))
  for (const o of outcomes) {
    for (const [trait, w] of Object.entries(o.weights)) {
      if (trait in totals) totals[trait] = (totals[trait] ?? 0) + w
    }
  }
  return totals
}

/**
 * Highest total wins. On a tie, the answer from the latest stage decides:
 * walking back from the latest answer, the tied trait it weighted most wins.
 * If nothing separates them, the first trait in pack order wins.
 */
export function winningTrait(outcomes: readonly ScenarioOutcome[], traitOrder: readonly string[]): string {
  const totals = traitTotals(outcomes, traitOrder)
  const top = Math.max(...traitOrder.map((t) => totals[t] ?? 0))
  let tied = traitOrder.filter((t) => (totals[t] ?? 0) === top)

  const latestFirst = outcomes
    .map((o, i) => ({ o, i }))
    .sort((a, b) => b.o.stage - a.o.stage || b.i - a.i)

  for (const { o } of latestFirst) {
    if (tied.length === 1) break
    const best = Math.max(...tied.map((t) => o.weights[t] ?? 0))
    if (best > 0) tied = tied.filter((t) => (o.weights[t] ?? 0) === best)
  }
  return tied[0] ?? traitOrder[0] ?? ''
}

/** Dark side when at least 40% of scenario answers were flagged dark. */
export function isDarkSide(outcomes: readonly ScenarioOutcome[]): boolean {
  if (outcomes.length === 0) return false
  const dark = outcomes.filter((o) => o.dark).length
  return dark / outcomes.length >= DARK_SHARE
}

/** Secret character: a perfect knowledge score in the full journey only. */
export function isSecret(mode: Mode, percent: number, knowledgeCount: number): boolean {
  return mode === 'full' && knowledgeCount > 0 && percent === 100
}

/**
 * Match % from how dominant the winning trait was: its share of all trait
 * points, scaled from "no better than even" (60) to "only this trait" (99).
 */
export function matchPercent(totals: Readonly<Record<string, number>>, winner: string): number {
  const values = Object.values(totals)
  const count = values.length
  const sum = values.reduce((a, b) => a + b, 0)
  if (count < 2 || sum <= 0) return MATCH_MIN
  const share = (totals[winner] ?? 0) / sum
  const even = 1 / count
  const norm = Math.min(1, Math.max(0, (share - even) / (1 - even)))
  return Math.round(MATCH_MIN + (MATCH_MAX - MATCH_MIN) * norm)
}

/** Finds the character for a tier x trait, honouring dark and secret overrides. */
export function resolveCharacter(
  characters: readonly Character[],
  tier: Tier,
  trait: string,
  flags: { dark: boolean; secret: boolean },
): Character {
  const find = (pred: (c: Character) => boolean) => characters.find(pred)
  const pick =
    (flags.secret ? find((c) => c.kind === 'secret') : undefined) ??
    (flags.dark ? find((c) => c.kind === 'dark' && c.tier === tier) : undefined) ??
    find((c) => c.kind === 'regular' && c.tier === tier && c.trait === trait)
  if (!pick) throw new Error(`No character for ${tier} / ${trait}`)
  return pick
}

export function rarityOf(character: Character): Rarity {
  if (character.kind === 'secret') return 'secret'
  if (character.kind === 'dark') return 'dark'
  return character.tier ?? 'beginner'
}

export interface QuizResult {
  characterId: string
  tier: Tier
  trait: string
  rarity: Rarity
  knowledgePercent: number
  correct: number
  knowledgeTotal: number
  matchPercent: number
  dark: boolean
  secret: boolean
}

/** The whole scoring pipeline. Fan-since is deliberately not an input. */
export function computeResult(
  pack: Pack,
  mode: Mode,
  knowledge: readonly KnowledgeOutcome[],
  scenarios: readonly ScenarioOutcome[],
): QuizResult {
  const traitOrder = pack.traits.map((t) => t.id)
  const percent = knowledgePercent(knowledge)
  const tier = tierFor(percent, pack.tiers.thresholds)
  const trait = winningTrait(scenarios, traitOrder)
  const dark = isDarkSide(scenarios)
  const secret = isSecret(mode, percent, knowledge.length)
  const character = resolveCharacter(pack.characters, tier, trait, { dark, secret })
  return {
    characterId: character.id,
    tier,
    trait,
    rarity: rarityOf(character),
    knowledgePercent: percent,
    correct: knowledge.filter((k) => k.correct).length,
    knowledgeTotal: knowledge.length,
    matchPercent: matchPercent(traitTotals(scenarios, traitOrder), trait),
    dark: character.kind === 'dark',
    secret: character.kind === 'secret',
  }
}
