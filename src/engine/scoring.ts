import { TIERS, type Character, type Pack, type Rarity, type Tier } from './schema'
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

/**
 * Every trait, best first: the winner, then the rest by total (pack order on
 * ties). Small rosters walk this list to find the closest filled slot.
 */
export function traitRanking(outcomes: readonly ScenarioOutcome[], traitOrder: readonly string[]): string[] {
  const totals = traitTotals(outcomes, traitOrder)
  const winner = winningTrait(outcomes, traitOrder)
  const rest = traitOrder.filter((t) => t !== winner).sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0))
  return [winner, ...rest]
}

/**
 * The order tiers are searched in for an earned tier: the earned tier itself,
 * then every lower tier (closest first), and only then the higher tiers
 * (closest first) as a last resort. A fallback never promotes while a lower
 * tier can still fill the slot.
 */
export function fallbackTiers(tier: Tier): Tier[] {
  const at = TIERS.indexOf(tier)
  const lower = TIERS.slice(0, at).reverse()
  const higher = TIERS.slice(at + 1)
  return [tier, ...lower, ...higher]
}

/**
 * Finds the character for a tier and trait ranking, honouring secret and dark.
 * Full rosters always hit their exact slot. Small rosters fall back in this
 * order: the next-best trait within the earned tier; only if that tier has no
 * regular characters at all, the closest lower tier (best trait first); a
 * higher tier only when nothing lower exists. Dark looks for the earned tier's
 * dark character, then lower, then higher. Several secrets: the one whose
 * trait the player leaned to most.
 */
export function resolveCharacter(
  characters: readonly Character[],
  tier: Tier,
  ranking: readonly string[],
  flags: { dark: boolean; secret: boolean },
): Character {
  const tiers = fallbackTiers(tier)
  const of = (kind: Character['kind']) => characters.filter((c) => c.kind === kind)

  if (flags.secret) {
    const secrets = of('secret')
    const pick = (secrets.length > 1 ? ranking.map((t) => secrets.find((c) => c.trait === t)).find(Boolean) : undefined) ?? secrets[0]
    if (pick) return pick
  }
  if (flags.dark) {
    const pick = tiers.map((t) => of('dark').find((c) => c.tier === t)).find(Boolean)
    if (pick) return pick
  }
  const regulars = of('regular')
  for (const t of tiers) {
    const inTier = regulars.filter((c) => c.tier === t)
    const pick = ranking.map((trait) => inTier.find((c) => c.trait === trait)).find(Boolean) ?? inTier[0]
    if (pick) return pick
  }
  const any = regulars[0] ?? characters[0]
  if (!any) throw new Error(`No character for ${tier} / ${ranking[0] ?? '?'}`)
  return any
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
  const scoredTier = tierFor(percent, pack.tiers.thresholds)
  const ranking = traitRanking(scenarios, traitOrder)
  const dark = isDarkSide(scenarios)
  const secret = isSecret(mode, percent, knowledge.length)
  const character = resolveCharacter(pack.characters, scoredTier, ranking, { dark, secret })
  // On a small roster the character may sit in a neighbouring slot; the card shows its own tier and trait.
  const tier = character.tier ?? scoredTier
  const trait = character.trait ?? ranking[0] ?? ''
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
