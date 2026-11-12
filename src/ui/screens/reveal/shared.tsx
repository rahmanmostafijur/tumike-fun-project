import type { Character, Rarity } from '../../../engine/schema'
import { useI18n } from '../../../i18n/I18n'
import { CardFrame } from '../../card/ResultCard'
import { Monogram } from '../../components/Monogram'
import { cx, monogramOf, nameFontClass } from '../../util'

/** deliver: the item arrives. waiting: it waits for a tap. opening: it opens into the card. */
export type RevealPhase = 'deliver' | 'waiting' | 'opening'

/** What every reveal sequence receives from the reveal screen. */
export interface SequenceProps {
  character: Character
  rarity: Rarity
  phase: RevealPhase
  /** Starts the opening; the screen ignores repeat calls. */
  onOpen: () => void
  /** Screen-reader label of the tap target. */
  tapLabel: string
}

/** Size of the box both sequences draw in, and of the card that comes out of it. */
export const STAGE_W = 288
export const STAGE_H = 184
export const CARD_W = 236
export const CARD_H = 168

/** The small card both sequences end on: frame, monogram and name. */
export function RevealCardFace({ character, rarity }: Pick<SequenceProps, 'character' | 'rarity'>) {
  const { loc } = useI18n()
  const name = loc(character.name)
  const latin = nameFontClass(name) === 'font-latin'
  return (
    <>
      <CardFrame rarity={rarity} mini />
      <Monogram text={monogramOf(character)} rarity={rarity} size={64} />
      <span className={cx('px-4 text-ink', nameFontClass(name), latin ? 'text-[24px] leading-7' : 'text-[20px]')}>{name}</span>
    </>
  )
}

interface TapTargetProps {
  label: string
  onOpen: () => void
  /** Box of the target inside the stage, in px. */
  box: { left: number; top: number; width: number; height: number }
  ringColor: string
}

/** Invisible button over the item, with a pulsing ring as a hint. */
export function TapTarget({ label, onOpen, box, ringColor }: TapTargetProps) {
  return (
    <button
      type="button"
      autoFocus
      className="absolute grid place-items-center"
      // Inline so the global :focus-visible radius cannot square off the round target.
      style={{ ...box, zIndex: 8, borderRadius: '50%' }}
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      aria-label={label}
    >
      <span className="rv-seal-ring absolute inset-1 rounded-full" style={{ borderColor: ringColor }} />
    </button>
  )
}
