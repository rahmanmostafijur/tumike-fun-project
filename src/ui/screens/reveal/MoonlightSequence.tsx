import type { CSSProperties } from 'react'
import type { MoonlightReveal } from '../../../engine/schema'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** The letter drifts down like a leaf while the moonlight brightens. */
export const MOONLIGHT_DELIVER_MS = 1500
const PANEL = CARD_H / 3
const GLOW = 520
const TAP = 110
const CX = STAGE_W / 2
const CY = STAGE_H / 2

/** One third of the folded letter, with faint lines of handwriting. */
function Panel({ letter, className, top, style }: { letter: MoonlightReveal['letter']; className?: string; top: number; style?: CSSProperties }) {
  return (
    <div
      className={`absolute left-0 ${className ?? ''}`}
      style={{
        top,
        width: CARD_W,
        height: PANEL,
        background: `repeating-linear-gradient(transparent 0 13px, ${letter.ink}2e 13px 14px) 22px 10px / 80% 70% no-repeat, ${letter.paper}`,
        boxShadow: `inset 0 0 0 1px ${letter.ink}22`,
        ...style,
      }}
    />
  )
}

interface MoonlightSequenceProps extends SequenceProps {
  reveal: MoonlightReveal
}

/**
 * The moonlight brightens over the scene and a letter, folded in three,
 * drifts down. Tapped, it unfolds panel by panel and becomes the card.
 */
export function MoonlightSequence({ reveal, character, rarity, phase, onOpen, tapLabel }: MoonlightSequenceProps) {
  const { letter } = reveal
  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div
        className="ml-glow pointer-events-none absolute rounded-full"
        style={{ left: CX - GLOW / 2, top: CY - GLOW / 2 - 70, width: GLOW, height: GLOW, background: `radial-gradient(circle, ${letter.glow}66 0%, ${letter.glow}22 38%, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="rv-exit absolute inset-0" aria-hidden="true">
        <div className="ml-drift absolute inset-0">
          <div className="ml-lift absolute" style={{ left: CX - CARD_W / 2, top: CY - CARD_H / 2, width: CARD_W, height: CARD_H }}>
            <div className="ml-paper absolute inset-0">
              <Panel letter={letter} top={PANEL} />
              <Panel letter={letter} top={0} className="ml-fold-top" style={{ transformOrigin: '50% 100%' }} />
              <Panel letter={letter} top={PANEL * 2} className="ml-fold-bottom" style={{ transformOrigin: '50% 0' }} />
            </div>
            <div className="ml-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] bg-surface">
              <RevealCardFace character={character} rarity={rarity} />
            </div>
          </div>
        </div>
      </div>

      {phase === 'waiting' && (
        <TapTarget label={tapLabel} onOpen={onOpen} ringColor={letter.glow} box={{ width: TAP, height: TAP, left: CX - TAP / 2, top: CY - TAP / 2 }} />
      )}
    </div>
  )
}
