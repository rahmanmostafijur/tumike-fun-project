import { useCallback, useEffect, useRef, useState } from 'react'
import type { Character, Pack, Rarity } from '../../engine/schema'
import { useI18n } from '../../i18n/I18n'
import { Monogram } from '../components/Monogram'
import { useSceneryView } from '../scenery/view'
import { cx, haptic, monogramOf, prefersReducedMotion } from '../util'
import { LetterSequence, letterDeliverMs } from './reveal/LetterSequence'
import { FLASHLIGHT_DELIVER_MS, FlashlightSequence } from './reveal/FlashlightSequence'
import { MOONLIGHT_DELIVER_MS, MoonlightSequence } from './reveal/MoonlightSequence'
import { MOTORHOME_DELIVER_MS, MotorhomeSequence } from './reveal/MotorhomeSequence'
import { ORIGAMI_DELIVER_MS, OrigamiSequence } from './reveal/OrigamiSequence'
import { SCROLL_DELIVER_MS, ScrollSequence } from './reveal/ScrollSequence'
import type { RevealPhase } from './reveal/shared'

/** If nobody taps, the item opens by itself this long after it arrives. */
const AUTO_OPEN_MS = 4000
/** From the tap to moving on to the result. */
const OPEN_MS = 3300
const REDUCED_MS = 1400

interface RevealProps {
  pack: Pack
  character: Character
  rarity: Rarity
  playerName: string
  onDone: () => void
}

/**
 * The emotional peak. The pack chooses the sequence (a letter delivered by its
 * flyer, or a paper bird). The item arrives, waits for a tap (a pulsing hint;
 * it opens by itself after a few seconds), then opens into the card.
 */
export function Reveal({ pack, character, rarity, playerName, onDone }: RevealProps) {
  const { t, loc } = useI18n()
  useSceneryView('reveal')
  const reduced = prefersReducedMotion()
  const reveal = pack.reveal
  const flyer = !reduced && reveal.kind === 'letter' ? pack.background?.flyer : undefined
  const deliverMs =
    reveal.kind === 'origami' ? ORIGAMI_DELIVER_MS
    : reveal.kind === 'motorhome' ? MOTORHOME_DELIVER_MS
    : reveal.kind === 'scroll' ? SCROLL_DELIVER_MS
    : reveal.kind === 'moonlight' ? MOONLIGHT_DELIVER_MS
    : reveal.kind === 'flashlight' ? FLASHLIGHT_DELIVER_MS
    : letterDeliverMs(Boolean(flyer))
  const [phase, setPhase] = useState<RevealPhase>('deliver')
  const phaseRef = useRef<RevealPhase>('deliver')
  const done = useRef(false)
  const onDoneRef = useRef(onDone)
  const timers = useRef<number[]>([])

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
      list.push(
        window.setTimeout(() => {
          if (phaseRef.current !== 'deliver') return
          phaseRef.current = 'waiting'
          setPhase('waiting')
        }, deliverMs),
      )
      list.push(window.setTimeout(open, deliverMs + AUTO_OPEN_MS))
    }
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [reduced, deliverMs, finish, open])

  const [line1, line2] = reveal.lines

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

  const sequence = { character, rarity, phase, onOpen: open, tapLabel: loc(reveal.tapLabel) }

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
        {reveal.kind === 'letter' && <LetterSequence {...sequence} reveal={reveal} flyer={flyer} playerName={playerName} />}
        {reveal.kind === 'origami' && <OrigamiSequence {...sequence} reveal={reveal} />}
        {reveal.kind === 'motorhome' && <MotorhomeSequence {...sequence} reveal={reveal} />}
        {reveal.kind === 'scroll' && <ScrollSequence {...sequence} reveal={reveal} />}
        {reveal.kind === 'moonlight' && <MoonlightSequence {...sequence} reveal={reveal} />}
        {reveal.kind === 'flashlight' && <FlashlightSequence {...sequence} reveal={reveal} />}
      </div>

      <p className={cx('rv-hint relative mt-7 rounded-full bg-bg/80 px-4 py-1 text-[14px] font-medium text-ink', phase !== 'waiting' && 'opacity-0')} aria-live="polite">
        {loc(reveal.hint)}
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
