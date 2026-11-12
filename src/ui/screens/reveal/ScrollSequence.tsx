import type { ScrollReveal } from '../../../engine/schema'
import { CARD_H, CARD_W, RevealCardFace, STAGE_H, STAGE_W, TapTarget, type SequenceProps } from './shared'

/** The raven carries the scroll in, lets go and flies off. */
export const SCROLL_DELIVER_MS = 1500
const ROLLED_W = 196
const ROLLED_H = 30
const ROLLER_H = 14
const SEAL = 34
const RAVEN_W = 132
const RAVEN_H = 88
const TAP = 96
const CX = STAGE_W / 2
const CY = STAGE_H / 2

/** A raven in flight, facing right, with a pale rim so it reads on a night sky. */
function Raven({ color, rim }: { color: string; rim: string }) {
  const edge = { stroke: rim, strokeOpacity: 0.55, strokeWidth: 1.2, strokeLinejoin: 'round' as const }
  return (
    <svg width={RAVEN_W} height={RAVEN_H} viewBox="0 0 120 80" aria-hidden="true" style={{ overflow: 'visible' }}>
      <polygon className="sc-wing sc-wing-far" points="48,38 62,37 74,8" fill={color} {...edge} strokeOpacity={0.3} />
      <polygon points="6,42 26,35 28,48" fill={color} {...edge} />
      <ellipse cx="50" cy="43" rx="26" ry="11" fill={color} {...edge} />
      <circle cx="77" cy="36" r="9" fill={color} {...edge} />
      <polygon points="85,33 101,37 85,40" fill={color} {...edge} />
      <circle cx="80" cy="34" r="1.6" fill={rim} />
      <polygon className="sc-wing" points="36,40 64,37 42,2" fill={color} {...edge} />
    </svg>
  )
}

function Seal({ scroll, half }: { scroll: ScrollReveal['scroll']; half?: 'l' | 'r' }) {
  const clip = half === 'l' ? 'inset(0 50% 0 0)' : half === 'r' ? 'inset(0 0 0 50%)' : undefined
  return (
    <svg className="absolute inset-0" width={SEAL} height={SEAL} viewBox="0 0 34 34" style={{ clipPath: clip }} aria-hidden="true">
      <circle cx="17" cy="17" r="16" fill={scroll.seal} />
      <circle cx="17" cy="17" r="10.5" fill="none" stroke={scroll.sealInk} strokeOpacity="0.6" />
      <path d="M17 10 L21 17 L17 24 L13 17 Z" fill="none" stroke={scroll.sealInk} strokeOpacity="0.75" />
    </svg>
  )
}

function Roller({ color, className }: { color: string; className: string }) {
  return (
    <div className={`absolute ${className}`} style={{ left: CX - CARD_W / 2 - 8, top: CY - ROLLER_H / 2, width: CARD_W + 16, height: ROLLER_H, zIndex: 3 }}>
      <div className="h-full w-full rounded-full" style={{ background: `linear-gradient(${color}, #00000066 140%)` }} />
    </div>
  )
}

interface ScrollSequenceProps extends SequenceProps {
  reveal: ScrollReveal
}

/**
 * A raven flies in carrying a sealed scroll, drops it and leaves. The scroll
 * waits until its seal is tapped; the seal breaks, the scroll unrolls from
 * the middle, and the parchment becomes the card.
 */
export function ScrollSequence({ reveal, character, rarity, phase, onOpen, tapLabel }: ScrollSequenceProps) {
  const { scroll } = reveal
  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      <div className="rv-exit absolute inset-0" aria-hidden="true">
        <div className="sc-carry absolute inset-0">
          {/* The rolled scroll, sealed in the middle. */}
          <div className="sc-sway absolute inset-0">
            <div className="sc-rolled absolute rounded-full" style={{ left: CX - ROLLED_W / 2, top: CY - ROLLED_H / 2, width: ROLLED_W, height: ROLLED_H, zIndex: 4, background: `linear-gradient(${scroll.paper}, ${scroll.paper} 45%, #00000040 120%)`, boxShadow: `inset 10px 0 0 ${scroll.roller}, inset -10px 0 0 ${scroll.roller}` }} />
            <div className="sc-seal absolute" style={{ left: CX - SEAL / 2, top: CY - SEAL / 2, width: SEAL, height: SEAL, zIndex: 5 }}>
              <Seal scroll={scroll} />
            </div>
          </div>
          <div className="sc-raven absolute" style={{ left: CX - RAVEN_W / 2, top: CY - ROLLED_H / 2 - RAVEN_H + 14, zIndex: 6 }}>
            <Raven color={scroll.raven} rim={scroll.rim} />
          </div>
        </div>

        {/* Seal halves fall away when it breaks. */}
        <div className="absolute" style={{ left: CX - SEAL / 2, top: CY - SEAL / 2, width: SEAL, height: SEAL, zIndex: 7 }}>
          <div className="sc-half rv-half-l absolute inset-0"><Seal scroll={scroll} half="l" /></div>
          <div className="sc-half rv-half-r absolute inset-0"><Seal scroll={scroll} half="r" /></div>
        </div>

        {/* The parchment unrolls from the middle and becomes the card. */}
        <div className="sc-lift absolute" style={{ left: CX - CARD_W / 2, top: CY - CARD_H / 2, width: CARD_W, height: CARD_H, zIndex: 2 }}>
          {/* Faint lines of writing on the parchment. */}
          <div className="sc-paper absolute inset-0 rounded-[6px]" style={{ background: `repeating-linear-gradient(transparent 0 22px, ${scroll.roller}33 22px 23.5px) 0 14px / 78% 86% no-repeat, ${scroll.paper}`, backgroundPosition: 'center' }} />
          <div className="sc-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] bg-surface">
            <RevealCardFace character={character} rarity={rarity} />
          </div>
        </div>
        <Roller color={scroll.roller} className="sc-roller sc-roller-top" />
        <Roller color={scroll.roller} className="sc-roller sc-roller-bottom" />
      </div>

      {phase === 'waiting' && (
        <TapTarget label={tapLabel} onOpen={onOpen} ringColor={scroll.rim} box={{ width: TAP, height: TAP, left: CX - TAP / 2, top: CY - TAP / 2 }} />
      )}
    </div>
  )
}
