import type { CSSProperties } from 'react'
import type { Background, LetterReveal } from '../../../engine/schema'
import { APP } from '../../../config'
import { fill, useI18n } from '../../../i18n/I18n'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** Delivery: the flyer swoops in and drops the envelope, or the envelope slides in. */
const DELIVER_FLYER_MS = 1300
const DELIVER_PLAIN_MS = 800
const OWL_W = 170
/** How far above the envelope's centre the flyer lets go. */
const DROP_LIFT = 130
const SEAL = 60
const SEAL_TOP = STAGE_H * 0.6 - 40
const SEAL_BUTTON = 68

export function letterDeliverMs(hasFlyer: boolean): number {
  return hasFlyer ? DELIVER_FLYER_MS : DELIVER_PLAIN_MS
}

/** Scalloped wax seal outline. */
function sealPath(r: number, bumps = 14): string {
  let d = ''
  for (let i = 0; i <= bumps * 2; i++) {
    const a = (i / (bumps * 2)) * Math.PI * 2
    const rr = i % 2 === 0 ? r : r * 0.9
    d += `${i === 0 ? 'M' : 'L'}${(r + Math.cos(a) * rr).toFixed(2)} ${(r + Math.sin(a) * rr).toFixed(2)}`
  }
  return `${d}Z`
}

function Seal({ color, ink, half }: { color: string; ink: string; half?: 'l' | 'r' }) {
  const r = SEAL / 2
  const clip = half === 'l' ? 'inset(0 50% 0 0)' : half === 'r' ? 'inset(0 0 0 50%)' : undefined
  return (
    <div className="absolute inset-0" style={{ clipPath: clip }}>
      <svg width={SEAL} height={SEAL} viewBox={`0 0 ${SEAL} ${SEAL}`} aria-hidden="true">
        <path d={sealPath(r)} fill={color} />
        <circle cx={r} cy={r} r={r * 0.68} fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="1" />
      </svg>
      <span className="absolute inset-0 grid place-items-center pt-1 font-display text-[19px]" style={{ color: ink }}>
        {APP.monogram}
      </span>
    </div>
  )
}

interface LetterSequenceProps extends SequenceProps {
  reveal: LetterReveal
  flyer: Background['flyer']
  playerName: string
}

/**
 * The flyer delivers the envelope, the wax seal pulses until tapped, then the
 * seal breaks, the flap opens and the card rises out.
 */
export function LetterSequence({ reveal, flyer, playerName, character, rarity, phase, onOpen, tapLabel }: LetterSequenceProps) {
  const { loc } = useI18n()
  const env = reveal.envelope
  const name = playerName.trim()
  const address = name ? fill(loc(reveal.address), { name }) : loc(reveal.anonymous)
  const dust = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return { '--dx': `${Math.cos(a) * 46}px`, '--dy': `${Math.sin(a) * 46}px`, animationDelay: `${340 + (i % 3) * 40}ms` } as CSSProperties
  })

  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div className="rv-exit absolute inset-0">
        <div className="rv-envelope absolute inset-0" style={{ '--drop-y': `${-DROP_LIFT}px` } as CSSProperties} aria-hidden="true">
          {/* Back of the envelope */}
          <div className="absolute inset-0 rounded-[10px]" style={{ background: env.flap, zIndex: 0 }} />

          {/* The card that rises out */}
          <div className="rv-card absolute top-3 flex flex-col items-center justify-center gap-2 bg-surface" style={{ width: CARD_W, height: CARD_H, borderRadius: 14, zIndex: 2, marginLeft: -CARD_W / 2, left: '50%' }}>
            <RevealCardFace character={character} rarity={rarity} />
          </div>

          {/* Front pocket */}
          <svg className="absolute inset-0" style={{ zIndex: 3 }} width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
            <path d={`M0 10 Q0 0 10 0 L${STAGE_W / 2} ${STAGE_H * 0.56} L${STAGE_W - 10} 0 Q${STAGE_W} 0 ${STAGE_W} 10 V${STAGE_H - 10} Q${STAGE_W} ${STAGE_H} ${STAGE_W - 10} ${STAGE_H} H10 Q0 ${STAGE_H} 0 ${STAGE_H - 10}Z`} fill={env.paper} />
            <path d={`M2 ${STAGE_H - 4} L${STAGE_W / 2 - 8} ${STAGE_H * 0.6} M${STAGE_W - 2} ${STAGE_H - 4} L${STAGE_W / 2 + 8} ${STAGE_H * 0.6}`} stroke={env.ink} strokeOpacity="0.2" strokeWidth="1" fill="none" />
          </svg>
          <p className="absolute right-6 bottom-5 whitespace-pre-line text-right text-[12.5px] leading-[1.45]" style={{ color: env.ink, zIndex: 3, fontStyle: 'italic' }}>
            {address}
          </p>
          <svg className="absolute left-5 bottom-6" style={{ zIndex: 3 }} width="34" height="40" viewBox="0 0 34 40">
            <rect x="1" y="1" width="32" height="38" rx="2" fill="none" stroke={env.ink} strokeOpacity="0.45" strokeDasharray="2 2" />
            <path d="M9 28 L17 12 L25 28Z" fill="none" stroke={env.ink} strokeOpacity="0.45" />
          </svg>

          {/* Flap, with the seal on its tip */}
          <div className="rv-flap absolute inset-x-0 top-0" style={{ height: STAGE_H * 0.6 }}>
            <svg className="absolute inset-0" width={STAGE_W} height={STAGE_H * 0.6} viewBox={`0 0 ${STAGE_W} ${STAGE_H * 0.6}`} style={{ backfaceVisibility: 'hidden' }}>
              <path d={`M0 10 Q0 0 10 0 H${STAGE_W - 10} Q${STAGE_W} 0 ${STAGE_W} 10 L${STAGE_W / 2 + 14} ${STAGE_H * 0.6 - 10} Q${STAGE_W / 2} ${STAGE_H * 0.6 + 2} ${STAGE_W / 2 - 14} ${STAGE_H * 0.6 - 10}Z`} fill={env.flap} stroke={env.ink} strokeOpacity="0.18" />
            </svg>
            <div className="rv-seal absolute" style={{ width: SEAL, height: SEAL, left: STAGE_W / 2 - SEAL / 2, top: SEAL_TOP, backfaceVisibility: 'hidden' }}>
              <div className="rv-seal-whole absolute inset-0">
                <Seal color={env.seal} ink={env.sealInk} />
                <svg className="rv-crack absolute inset-0" viewBox={`0 0 ${SEAL} ${SEAL}`} width={SEAL} height={SEAL}>
                  <path d="M30 4 L27 18 L33 27 L26 38 L31 48 L29 57" stroke={env.sealInk} strokeWidth="1.4" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Seal halves fall away (outside the flap so they don't rotate with it) */}
        <div className="absolute" style={{ width: SEAL, height: SEAL, left: STAGE_W / 2 - SEAL / 2, top: SEAL_TOP, zIndex: 6 }} aria-hidden="true">
          <div className="rv-half rv-half-l absolute inset-0"><Seal color={env.seal} ink={env.sealInk} half="l" /></div>
          <div className="rv-half rv-half-r absolute inset-0"><Seal color={env.seal} ink={env.sealInk} half="r" /></div>
          {dust.map((style, i) => (
            <span key={i} className="rv-dust absolute left-1/2 top-1/2 size-1.5 rounded-full" style={{ ...style, background: env.seal }} />
          ))}
        </div>
      </div>

      {phase === 'waiting' && (
        <TapTarget
          label={tapLabel}
          onOpen={onOpen}
          ringColor={env.sealInk}
          box={{ width: SEAL_BUTTON, height: SEAL_BUTTON, left: STAGE_W / 2 - SEAL_BUTTON / 2, top: SEAL_TOP + SEAL / 2 - SEAL_BUTTON / 2 }}
        />
      )}

      {flyer && (
        <img
          className="rv-owl"
          src={flyer.src}
          alt=""
          width={OWL_W}
          height={Math.round(OWL_W / flyer.aspect)}
          style={{
            left: STAGE_W / 2 - (flyer.carry.x / 100) * OWL_W,
            top: STAGE_H / 2 - DROP_LIFT - (flyer.carry.y / 100) * (OWL_W / flyer.aspect),
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}
