import type { CSSProperties } from 'react'
import type { MotorhomeReveal } from '../../../engine/schema'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** The motorhome rolls in from the left and settles. */
export const MOTORHOME_DELIVER_MS = 1400
/** The door, in stage px. Its centre is the stage centre, so the card grows out of the doorway. */
const DOOR = { x: 104, y: 36, w: 80, h: 112 }
const TAP = 104
const WHEEL = 36
const WHEELS = [60, 236]
const PUFFS = Array.from({ length: 7 }, (_, i) => ({
  '--dx': `${(i - 3) * 22}px`,
  '--dy': `${-70 - (i % 3) * 24}px`,
  animationDelay: `${150 + i * 90}ms`,
}))

function Body({ van }: { van: MotorhomeReveal['van'] }) {
  return (
    <svg className="absolute inset-0" width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden="true">
      <path d="M16 22 H236 Q246 22 252 32 L280 82 Q284 88 284 96 V140 Q284 150 274 150 H16 Q6 150 6 140 V32 Q6 22 16 22 Z" fill={van.body} />
      <rect x="6" y="114" width="278" height="9" fill={van.stripe} />
      <rect x="24" y="42" width="58" height="34" rx="4" fill={van.window} />
      <rect x="206" y="42" width="34" height="34" rx="4" fill={van.window} />
      <path d="M252 40 L276 84 H252 Z" fill={van.window} />
      {/* The doorway: dark until the door swings open. */}
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx="3" fill="#120E0A" />
    </svg>
  )
}

function Wheel() {
  return (
    <svg width={WHEEL} height={WHEEL} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="17" fill="#1B1B1B" />
      <circle cx="18" cy="18" r="8" fill="#8D8A80" />
      <path d="M18 10 V26 M10 18 H26" stroke="#1B1B1B" strokeWidth="2" />
    </svg>
  )
}

interface MotorhomeSequenceProps extends SequenceProps {
  reveal: MotorhomeReveal
}

/**
 * A motorhome rolls in and idles until its door is tapped. The door swings
 * open, pale smoke drifts out and clears, and the card comes out of the
 * doorway to full size.
 */
export function MotorhomeSequence({ reveal, character, rarity, phase, onOpen, tapLabel }: MotorhomeSequenceProps) {
  const { van } = reveal
  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div className="rv-exit absolute inset-0" aria-hidden="true">
        <div className="mh-roll absolute inset-0">
          <div className="mh-idle absolute inset-0">
            <div className="mh-van-fade absolute inset-0" style={{ zIndex: 1 }}>
              <Body van={van} />
              {WHEELS.map((x) => (
                <div key={x} className="mh-wheel absolute" style={{ left: x - WHEEL / 2, top: 150 - WHEEL / 2, width: WHEEL, height: WHEEL }}>
                  <Wheel />
                </div>
              ))}
            </div>

            <div className="mh-lift absolute" style={{ left: STAGE_W / 2 - CARD_W / 2, top: STAGE_H / 2 - CARD_H / 2, width: CARD_W, height: CARD_H, zIndex: 2 }}>
              <div className="mh-card flex h-full w-full flex-col items-center justify-center gap-2 rounded-[14px] bg-surface">
                <RevealCardFace character={character} rarity={rarity} />
              </div>
            </div>

            <div className="mh-van-fade absolute" style={{ left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, zIndex: 3 }}>
              <div className="mh-door absolute inset-0">
                <svg width={DOOR.w} height={DOOR.h} viewBox={`0 0 ${DOOR.w} ${DOOR.h}`}>
                  <rect x="0.5" y="0.5" width={DOOR.w - 1} height={DOOR.h - 1} rx="3" fill={van.door} stroke="#000" strokeOpacity="0.25" />
                  <rect x="12" y="12" width={DOOR.w - 24} height="30" rx="3" fill={van.window} />
                  <circle cx={DOOR.w - 12} cy={DOOR.h / 2 + 6} r="3.5" fill="#6F6A5C" />
                </svg>
              </div>
            </div>

            {PUFFS.map((style, i) => (
              <span
                key={i}
                className="mh-smoke absolute rounded-full"
                style={{ ...style, left: STAGE_W / 2 - 22, top: STAGE_H / 2 - 22, width: 44, height: 44, zIndex: 4, background: `radial-gradient(circle, ${van.smoke} 0%, transparent 70%)` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>

      {phase === 'waiting' && (
        <TapTarget
          label={tapLabel}
          onOpen={onOpen}
          ringColor={van.smoke}
          box={{ width: TAP, height: TAP, left: STAGE_W / 2 - TAP / 2, top: DOOR.y + DOOR.h / 2 - TAP / 2 }}
        />
      )}
    </div>
  )
}
