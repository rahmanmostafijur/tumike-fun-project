import type { Character, Localized, Pack, Point, Rarity } from '../../engine/schema'
import type { QuizResult } from '../../engine/scoring'
import type { Lang } from '../../storage/storage'
import { APP, SITE_HOST } from '../../config'
import { fill, toBnDigits } from '../../i18n/I18n'
import { strings } from '../../i18n/strings'
import { monogramOf } from '../util'

/**
 * Everything printed on a result card, already localised. The DOM card and
 * the canvas export both render from this, so they always match.
 */
export interface CardData {
  lang: Lang
  rarity: Rarity
  tierLabel: string
  traitLabel: string
  monogram: string
  name: string
  youAre: string
  match: string
  badge: string | null
  strengthLabel: string
  strength: string
  weaknessLabel: string
  weakness: string
  squad: string
  wordmark: string
  site: string
  /** The pack's painting, shown as a band across the top of the card. */
  band: { src: string; focal: Point } | null
}

/** Height of the painted band at the top of the card, in card units (card is 342 wide). */
export const BAND_H = 196

interface BuildArgs {
  pack: Pack
  character: Character
  result: QuizResult
  lang: Lang
  playerName: string
  fanBadge: Localized | null
}

export function buildCardData({ pack, character, result, lang, playerName, fanBadge }: BuildArgs): CardData {
  const s = (key: keyof typeof strings, vars: Record<string, string | number> = {}) => fill(strings[key][lang], vars)
  const n = (v: number) => (lang === 'bn' ? toBnDigits(v) : String(v))
  const trait = pack.traits.find((t) => t.id === result.trait)
  const name = playerName.trim()
  return {
    lang,
    rarity: result.rarity,
    tierLabel: pack.tiers.labels[result.rarity][lang],
    traitLabel: trait ? trait.label[lang] : '',
    monogram: monogramOf(character),
    name: character.name[lang],
    youAre: name ? s('result.youAre', { name }) : s('result.youAreAnon'),
    match: s('result.match', { n: n(result.matchPercent) }),
    badge: fanBadge ? fanBadge[lang] : null,
    strengthLabel: s('result.strength'),
    strength: character.strength[lang],
    weaknessLabel: s('result.weakness'),
    weakness: character.weakness[lang],
    squad: character.squad[lang],
    wordmark: APP.wordmark,
    site: SITE_HOST,
    band: pack.background ? { src: pack.background.src, focal: pack.background.cardFocal ?? pack.background.rest } : null,
  }
}

export function shareText(card: CardData): string {
  return fill(strings['result.shareText'][card.lang], { name: card.name, squad: card.squad, url: APP.siteUrl })
}

/** Frame colour per rarity, as CSS variable names. */
export function frameColor(rarity: Rarity): string {
  return rarity === 'dark' ? 'var(--t-dark)' : 'var(--t-accent)'
}

export const isRare = (rarity: Rarity): boolean => rarity === 'legend' || rarity === 'secret'
