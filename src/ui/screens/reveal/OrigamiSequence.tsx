import type { CSSProperties } from 'react'
import type { OrigamiReveal } from '../../../engine/schema'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** The bird's flight in, from off-screen to hovering over the stage. */
export const ORIGAMI_DELIVER_MS = 1500
const BIRD_W = 150
const BIRD_H = Math.round((BIRD_W * 84) / 120)
/** Round tap target over the bird, so the hint ring and focus outline are circles. */
const TAP = 116

/** The four corner flaps of the folded sheet, opening one after another. */
const FLAPS = [
  { clip: 'polygon(0 0, 100% 0, 50% 50%)', origin: '50% 0', open: 'rotateX(-180deg)' },
  { clip: 'polygon(100% 0, 100% 100%, 50% 50%)', origin: '100% 50%', open: 'rotateY(-180deg)' },
  { clip: 'polygon(0 100%, 100% 100%, 50% 50%)', origin: '50% 100%', open: 'rotateX(180deg)' },
  { clip: 'polygon(0 0, 0 100%, 50% 50%)', origin: '0 50%', open: 'rotateY(180deg)' },
] as const

/** A paper crane in profile, flying right. Wings flap from their base. */
function Bird({ paper }: { paper: OrigamiReveal['paper'] }) {
  const crease = { stroke: paper.crease, strokeOpacity: 0.55, strokeWidth: 0.8, fill: 'none' }
  return (
    <svg width={BIRD_W} height={BIRD_H} viewBox="0 0 120 84" aria-hidden="true" style={{ overflow: 'visible' }}>
      <polygon className="og-wing og-wing-far" points="56,50 70,48 86,12" fill={paper.back} />
      <polygon points="34,54 4,24 46,50" fill={paper.front} />
      <polygon points="34,54 62,44 92,52 62,62" fill={paper.front} />
      <polygon points="34,54 92,52 62,62" fill={paper.back} fillOpacity="0.55" />
      <polygon points="84,50 108,16 92,54" fill={paper.front} />
      <polygon points="108,16 119,25 103,23" fill={paper.back} />
      <polyline points="34,54 92,52" {...crease} />
      <polygon className="og-wing og-wing-near" points="44,50 72,47 48,4" fill={paper.front} />
      <polyline className="og-wing og-wing-near" points="58,48 48,4" {...crease} />
    </svg>
  )
}

interface OrigamiSequenceProps extends SequenceProps {
  reveal: OrigamiReveal
}

/**
 * A paper bird flies in and hovers until tapped. Then it folds its wings,
 * a folded square of the same paper turns and opens its four corners, and the
 * sheet becomes the card.
 */
export function OrigamiSequence({ reveal, character, rarity, phase, onOpen, tapLabel }: OrigamiSequenceProps) {
  const { paper } = reveal
  const centre = { x: STAGE_W / 2, y: STAGE_H / 2 }

  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div className="rv-exit absolute inset-0" aria-hidden="true">
        <div className="og-lift absolute" style={{ width: CARD_W, height: CARD_H, left: centre.x - CARD_W / 2, top: centre.y - CARD_H / 2 }}>
          <div className="og-sheet absolute inset-0" style={{ zIndex: 2 }}>
            <div className="absolute inset-0 rounded-[14px]" style={{ background: paper.front }} />
            <svg className="og-creases absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 100 M100 0 L0 100 M50 0 V100 M0 50 H100" stroke={paper.crease} strokeWidth="0.6" vectorEffect="non-scaling-stroke" fill="none" />
            </svg>
            {FLAPS.map((f, i) => (
              <div
                key={f.origin}
                className="og-flap absolute inset-0"
                style={{ clipPath: f.clip, transformOrigin: f.origin, '--open': f.open, animationDelay: `${800 + i * 80}ms`, background: paper.back } as CSSProperties}
              />
            ))}
            <div className="og-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] bg-surface">
              <RevealCardFace character={character} rarity={rarity} />
            </div>
          </div>
        </div>

        <div className="og-bird absolute" style={{ left: centre.x - BIRD_W / 2, top: centre.y - BIRD_H / 2 - 10, zIndex: 4 }}>
          <div className="og-fly">
            <div className="og-hover">
              <Bird paper={paper} />
            </div>
          </div>
        </div>
      </div>

      {phase === 'waiting' && (
        <TapTarget
          label={tapLabel}
          onOpen={onOpen}
          ringColor={paper.crease}
          box={{ width: TAP, height: TAP, left: centre.x - TAP / 2, top: centre.y - TAP / 2 - 10 }}
        />
      )}
    </div>
  )
}
