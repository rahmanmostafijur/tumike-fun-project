import type { FlashlightReveal } from '../../../engine/schema'
import { useI18n } from '../../../i18n/I18n'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** The beam sweeps across the scene, then settles on the visiting card. */
export const FLASHLIGHT_DELIVER_MS = 1500
const VISIT_W = 156
const VISIT_H = 92
const BEAM = 260
const TAP = 112
const CX = STAGE_W / 2
const CY = STAGE_H / 2

interface FlashlightSequenceProps extends SequenceProps {
  reveal: FlashlightReveal
}

/**
 * A flashlight beam sweeps across the dark and lands on a small visiting
 * card. Tapped, the card turns over and the back of it is the result card.
 */
export function FlashlightSequence({ reveal, character, rarity, phase, onOpen, tapLabel }: FlashlightSequenceProps) {
  const { loc } = useI18n()
  const { card } = reveal
  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div
        className="fl-beam pointer-events-none absolute rounded-full"
        style={{ left: CX - BEAM / 2, top: CY - BEAM / 2, width: BEAM, height: BEAM, background: `radial-gradient(circle, ${card.beam}8c 0%, ${card.beam}33 45%, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="rv-exit absolute inset-0" aria-hidden="true">
        <div className="fl-lift absolute" style={{ left: CX - CARD_W / 2, top: CY - CARD_H / 2, width: CARD_W, height: CARD_H, perspective: 900 }}>
          <div className="fl-flip relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* Front: the visiting card, small, in the middle. */}
            <div className="absolute inset-0 grid place-items-center" style={{ backfaceVisibility: 'hidden' }}>
              <div className="fl-visit relative flex flex-col items-center justify-center rounded-[6px]" style={{ width: VISIT_W, height: VISIT_H, background: card.paper, color: card.ink, boxShadow: '0 6px 18px #0008' }}>
                <span className="font-latin text-[34px] leading-none tracking-[0.12em]">{card.mark}</span>
                <span className="mt-1.5 font-display text-[13px]">{loc(card.caption)}</span>
                <span className="fl-shade absolute inset-0 rounded-[6px] bg-black" />
              </div>
            </div>
            {/* Back: the result card. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] bg-surface" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <RevealCardFace character={character} rarity={rarity} />
            </div>
          </div>
        </div>
      </div>

      {phase === 'waiting' && (
        <TapTarget label={tapLabel} onOpen={onOpen} ringColor={card.beam} box={{ width: TAP, height: TAP, left: CX - TAP / 2, top: CY - TAP / 2 }} />
      )}
    </div>
  )
}
