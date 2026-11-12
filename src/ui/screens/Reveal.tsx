import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Character, Pack, Rarity } from '../../engine/schema'
import { useI18n, fill } from '../../i18n/I18n'
import { APP } from '../../config'
import { Monogram } from '../components/Monogram'
import { useSceneryView } from '../scenery/view'
import { cx, haptic, monogramOf, nameFontClass, prefersReducedMotion } from '../util'
import { CardFrame } from '../card/ResultCard'

/** Delivery: the owl swoops in and drops the envelope (or it slides in). */
const DELIVER_FLYER_MS = 1300
const DELIVER_PLAIN_MS = 800
/** If nobody taps the seal, the letter opens by itself. */
const AUTO_OPEN_MS = 4000
/** From the seal breaking to moving on to the result. */
const OPEN_MS = 3300
const REDUCED_MS = 1400
const ENV_W = 288
const ENV_H = 184
const OWL_W = 170
/** How far above the envelope's centre the owl lets go. */
const DROP_LIFT = 130
const SEAL = 60
const SEAL_TOP = ENV_H * 0.6 - 40
const SEAL_BUTTON = 68

type Phase = 'deliver' | 'waiting' | 'opening'

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

interface RevealProps {
  pack: Pack
  character: Character
  rarity: Rarity
  playerName: string
  onDone: () => void
}

/**
 * The emotional peak. The owl delivers the envelope, then the letter waits
 * for the player to tap the wax seal (it pulses as a hint and opens by itself
 * after a few seconds). The seal breaks, the flap opens and the card rises.
 */
export function Reveal({ pack, character, rarity, playerName, onDone }: RevealProps) {
  const { t, loc } = useI18n()
  useSceneryView('reveal')
  const reduced = prefersReducedMotion()
  const flyer = reduced ? undefined : pack.background?.flyer
  const [phase, setPhase] = useState<Phase>('deliver')
  const phaseRef = useRef<Phase>('deliver')
  const done = useRef(false)
  const onDoneRef = useRef(onDone)
  const timers = useRef<number[]>([])
  const env = pack.reveal.envelope

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    onDoneRef.current()
  }, [])

  const open = useCallback(() => {
    if (phaseRef.current === 'opening') return
    phaseRef.current = 'opening'
    setPhase('opening')
    haptic([14, 60, 22])
    timers.current.push(window.setTimeout(finish, OPEN_MS))
  }, [finish])

  useEffect(() => {
    const list: number[] = []
    timers.current = list
    if (reduced) {
      list.push(window.setTimeout(finish, REDUCED_MS))
    } else {
      const deliver = flyer ? DELIVER_FLYER_MS : DELIVER_PLAIN_MS
      list.push(
        window.setTimeout(() => {
          if (phaseRef.current !== 'deliver') return
          phaseRef.current = 'waiting'
          setPhase('waiting')
        }, deliver),
      )
      list.push(window.setTimeout(open, deliver + AUTO_OPEN_MS))
    }
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [reduced, flyer, finish, open])

  const name = playerName.trim()
  const address = name ? fill(loc(pack.reveal.address), { name }) : loc(pack.reveal.anonymous)
  const [line1, line2] = pack.reveal.lines

  if (reduced) {
    return (
      <main className="screen items-center justify-center text-center" onClick={finish} aria-label={t('reveal.label')}>
        <div className="fade-in relative flex flex-col items-center gap-4">
          {line1 && <p className="font-display text-[24px] text-ink">{loc(line1)}</p>}
          <Monogram text={monogramOf(character)} rarity={rarity} size={88} />
          {line2 && <p className="text-[16px] text-ink">{loc(line2)}</p>}
        </div>
      </main>
    )
  }

  const dust = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return { '--dx': `${Math.cos(a) * 46}px`, '--dy': `${Math.sin(a) * 46}px`, animationDelay: `${340 + (i % 3) * 40}ms` } as CSSProperties
  })

  return (
    <main
      className={cx(
        'screen rv-root cursor-pointer items-center overflow-hidden text-center',
        flyer && 'has-flyer',
        phase === 'waiting' && 'is-waiting',
        phase === 'opening' && 'is-opening',
      )}
      onClick={() => phaseRef.current === 'waiting' && open()}
      role="dialog"
      aria-label={t('reveal.label')}
    >
      <div className="relative mt-[clamp(70px,14vh,130px)] flex min-h-[92px] flex-col items-center gap-1.5">
        {line1 && <p className="rv-line-1 font-display text-[25px] leading-snug text-ink">{loc(line1)}</p>}
        {line2 && <p className="rv-line-2 text-[16px] font-medium text-ink">{loc(line2)}</p>}
      </div>

      <div className="rv-stage relative mt-[clamp(130px,25vh,230px)] grid place-items-center">
        <div className="relative" style={{ width: ENV_W, height: ENV_H }}>
          <div className="rv-exit absolute inset-0">
            <div className="rv-envelope absolute inset-0" style={{ '--drop-y': `${-DROP_LIFT}px` } as CSSProperties} aria-hidden="true">
              {/* Back of the envelope */}
              <div className="absolute inset-0 rounded-[10px]" style={{ background: env.flap, zIndex: 0 }} />

              {/* The card that rises out */}
              <div className="rv-card absolute top-3 flex h-[168px] w-[236px] flex-col items-center justify-center gap-2 bg-surface" style={{ borderRadius: 14, zIndex: 2, marginLeft: -118, left: '50%' }}>
                <CardFrame rarity={rarity} mini />
                <Monogram text={monogramOf(character)} rarity={rarity} size={64} />
                <span className={cx('px-4 text-ink', nameFontClass(loc(character.name)), nameFontClass(loc(character.name)) === 'font-latin' ? 'text-[24px] leading-7' : 'text-[20px]')}>
                  {loc(character.name)}
                </span>
              </div>

              {/* Front pocket */}
              <svg className="absolute inset-0" style={{ zIndex: 3 }} width={ENV_W} height={ENV_H} viewBox={`0 0 ${ENV_W} ${ENV_H}`}>
                <path d={`M0 10 Q0 0 10 0 L${ENV_W / 2} ${ENV_H * 0.56} L${ENV_W - 10} 0 Q${ENV_W} 0 ${ENV_W} 10 V${ENV_H - 10} Q${ENV_W} ${ENV_H} ${ENV_W - 10} ${ENV_H} H10 Q0 ${ENV_H} 0 ${ENV_H - 10}Z`} fill={env.paper} />
                <path d={`M2 ${ENV_H - 4} L${ENV_W / 2 - 8} ${ENV_H * 0.6} M${ENV_W - 2} ${ENV_H - 4} L${ENV_W / 2 + 8} ${ENV_H * 0.6}`} stroke={env.ink} strokeOpacity="0.2" strokeWidth="1" fill="none" />
              </svg>
              <p className="absolute right-6 bottom-5 whitespace-pre-line text-right text-[12.5px] leading-[1.45]" style={{ color: env.ink, zIndex: 3, fontStyle: 'italic' }}>
                {address}
              </p>
              <svg className="absolute left-5 bottom-6" style={{ zIndex: 3 }} width="34" height="40" viewBox="0 0 34 40">
                <rect x="1" y="1" width="32" height="38" rx="2" fill="none" stroke={env.ink} strokeOpacity="0.45" strokeDasharray="2 2" />
                <path d="M9 28 L17 12 L25 28Z" fill="none" stroke={env.ink} strokeOpacity="0.45" />
              </svg>

              {/* Flap, with the seal on its tip */}
              <div className="rv-flap absolute inset-x-0 top-0" style={{ height: ENV_H * 0.6 }}>
                <svg className="absolute inset-0" width={ENV_W} height={ENV_H * 0.6} viewBox={`0 0 ${ENV_W} ${ENV_H * 0.6}`} style={{ backfaceVisibility: 'hidden' }}>
                  <path d={`M0 10 Q0 0 10 0 H${ENV_W - 10} Q${ENV_W} 0 ${ENV_W} 10 L${ENV_W / 2 + 14} ${ENV_H * 0.6 - 10} Q${ENV_W / 2} ${ENV_H * 0.6 + 2} ${ENV_W / 2 - 14} ${ENV_H * 0.6 - 10}Z`} fill={env.flap} stroke={env.ink} strokeOpacity="0.18" />
                </svg>
                <div className="rv-seal absolute" style={{ width: SEAL, height: SEAL, left: ENV_W / 2 - SEAL / 2, top: SEAL_TOP, backfaceVisibility: 'hidden' }}>
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
            <div className="absolute" style={{ width: SEAL, height: SEAL, left: ENV_W / 2 - SEAL / 2, top: SEAL_TOP, zIndex: 6 }} aria-hidden="true">
              <div className="rv-half rv-half-l absolute inset-0"><Seal color={env.seal} ink={env.sealInk} half="l" /></div>
              <div className="rv-half rv-half-r absolute inset-0"><Seal color={env.seal} ink={env.sealInk} half="r" /></div>
              {dust.map((style, i) => (
                <span key={i} className="rv-dust absolute left-1/2 top-1/2 size-1.5 rounded-full" style={{ ...style, background: env.seal }} />
              ))}
            </div>
          </div>

          {phase === 'waiting' && (
            <button
              type="button"
              autoFocus
              className="absolute grid place-items-center rounded-full"
              style={{ width: SEAL_BUTTON, height: SEAL_BUTTON, left: ENV_W / 2 - SEAL_BUTTON / 2, top: SEAL_TOP + SEAL / 2 - SEAL_BUTTON / 2, zIndex: 8 }}
              onClick={(e) => {
                e.stopPropagation()
                open()
              }}
              aria-label={t('reveal.openLabel')}
            >
              <span className="rv-seal-ring absolute inset-1 rounded-full" style={{ borderColor: env.sealInk }} />
            </button>
          )}

          {flyer && (
            <img
              className="rv-owl"
              src={flyer.src}
              alt=""
              width={OWL_W}
              height={Math.round(OWL_W / flyer.aspect)}
              style={{
                left: ENV_W / 2 - (flyer.carry.x / 100) * OWL_W,
                top: ENV_H / 2 - DROP_LIFT - (flyer.carry.y / 100) * (OWL_W / flyer.aspect),
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>

      <p className={cx('rv-hint relative mt-7 rounded-full bg-bg/80 px-4 py-1 text-[14px] font-medium text-ink', phase !== 'waiting' && 'opacity-0')} aria-live="polite">
        {t('reveal.open')}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          finish()
        }}
        className="press relative mt-auto h-11 rounded-full border border-line bg-bg/70 px-5 text-[14px] font-medium text-muted"
      >
        {t('reveal.skip')}
      </button>
    </main>
  )
}
