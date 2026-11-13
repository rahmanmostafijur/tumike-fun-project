import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Pack } from '../../engine/schema'
import type { Mode } from '../../engine/selection'
import type { QuizResult } from '../../engine/scoring'
import { createRng } from '../../engine/rng'
import { LIFELINES, type LifelineId } from '../../engine/lifelines'
import {
  KNOWLEDGE_SECONDS, answer, applyLifeline, canUseLifeline, createGame, currentItem,
  findKnowledge, findScenario, finish, isComplete, type GameState,
} from '../../engine/game'
import { useCountdown } from '../../engine/timer'
import { useI18n } from '../../i18n/I18n'
import { OPTION_LETTERS } from '../../i18n/strings'
import { useSceneryView } from '../scenery/view'
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
import { TimerRing, URGENT_SECONDS } from '../components/TimerRing'
import { cx, haptic } from '../util'

const FEEDBACK_KNOWLEDGE_MS = 1000
const FEEDBACK_SCENARIO_MS = 520
const FEEDBACK_TIMEOUT_MS = 1300
const LIFELINE_ICONS: Record<LifelineId, IconName> = { fifty: 'fifty', freeze: 'freeze', swap: 'swap' }
const KEYS = ['1', '2', '3', '4']
const LETTER_KEYS = ['a', 'b', 'c', 'd']

interface QuestionProps {
  pack: Pack
  mode: Mode
  seed: number
  onFinish: (result: QuizResult) => void
  onQuit: () => void
}

type Phase = 'asking' | 'feedback'

export function QuestionScreen({ pack, mode, seed, onFinish, onQuit }: QuestionProps) {
  const { t, loc, num, lang } = useI18n()
  const rng = useRef(createRng(seed))
  const [game, setGame] = useState<GameState>(() => createGame(pack, mode, rng.current))
  const gameRef = useRef(game)
  const [phase, setPhase] = useState<Phase>('asking')
  const [picked, setPicked] = useState<number | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const pending = useRef<number | undefined>(undefined)
  // Phase mirrored in a ref so timer callbacks never act twice on a stale value.
  const phaseRef = useRef<Phase>('asking')
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])


  useEffect(() => {
    gameRef.current = game
  }, [game])
  useEffect(() => () => window.clearTimeout(pending.current), [])

  const item = currentItem(game)
  const knowledge = item?.kind === 'knowledge' ? findKnowledge(pack, item.questionId) : undefined
  const scenario = item?.kind === 'scenario' ? findScenario(pack, item.questionId) : undefined
  const itemKey = `${game.index}:${item?.questionId ?? ''}`
  const total = game.quiz.items.length
  const untimed = item?.kind !== 'knowledge'
  const running = phase === 'asking' && !untimed && !game.frozen && !confirmQuit
  // Journey pan: per stage in the full journey, per question in quick mode.
  const progress = mode === 'quick'
    ? Math.min(1, game.index / Math.max(1, total - 1))
    : (item?.stageIndex ?? 0) / Math.max(1, pack.stages.length - 1)
  useSceneryView('journey', progress)

  const commit = useCallback(
    (choice: number | null, delay: number) => {
      window.clearTimeout(pending.current)
      pending.current = window.setTimeout(() => {
        const next = answer(gameRef.current, choice)
        if (isComplete(next)) {
          onFinish(finish(pack, next))
          return
        }
        setGame(next)
        setPicked(null)
        setTimedOut(false)
        setPhase('asking')
      }, delay)
    },
    [onFinish, pack],
  )

  const onExpire = useCallback(() => {
    if (phaseRef.current !== 'asking') return
    phaseRef.current = 'feedback'
    setPhase('feedback')
    setTimedOut(true)
    haptic([40, 30, 40])
    commit(null, FEEDBACK_TIMEOUT_MS)
  }, [commit])

  const seconds = useCountdown({ durationMs: KNOWLEDGE_SECONDS * 1000, running, resetKey: itemKey, onExpire })

  useEffect(() => {
    if (running && seconds === URGENT_SECONDS) haptic(8)
  }, [running, seconds])

  const pick = useCallback(
    (original: number) => {
      if (phaseRef.current !== 'asking' || game.hidden.includes(original) || confirmQuit) return
      phaseRef.current = 'feedback'
      setPicked(original)
      setPhase('feedback')
      if (knowledge) {
        haptic(original === knowledge.answer ? 12 : [30, 40, 30])
        commit(original, FEEDBACK_KNOWLEDGE_MS)
      } else {
        haptic(10)
        commit(original, FEEDBACK_SCENARIO_MS)
      }
    },
    [game.hidden, confirmQuit, knowledge, commit],
  )

  const useLifelineAction = (id: LifelineId) => {
    if (phase !== 'asking' || !canUseLifeline(pack, game, id)) return
    haptic(10)
    setGame((g) => applyLifeline(pack, g, id, rng.current))
  }

  // Keyboard: 1-4 or A-D to answer, Escape to open the quit dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.key === 'Escape') {
        setConfirmQuit((v) => !v)
        return
      }
      const idx = KEYS.indexOf(e.key) >= 0 ? KEYS.indexOf(e.key) : LETTER_KEYS.indexOf(e.key.toLowerCase())
      const original = idx >= 0 ? item?.order[idx] : undefined
      if (original !== undefined) pick(original)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, pick])

  if (!item || (!knowledge && !scenario)) return null

  const prompt = knowledge ? knowledge.prompt : scenario?.prompt
  const memory = knowledge?.memory
  const promptText = prompt ? loc(prompt) : ''
  const stageText = `${loc(pack.stageLabel)} ${num(item.stageIndex + 1)}`
  const optionText = (original: number) => {
    if (knowledge) return loc(knowledge.options[original] ?? { bn: '', en: '' })
    return loc(scenario?.options[original]?.text ?? { bn: '', en: '' })
  }

  return (
    <main className="screen q-screen">
      <header className="relative grid grid-cols-[64px_1fr_64px] items-center">
        <IconButton icon="close" label={t('q.close')} onClick={() => setConfirmQuit(true)} />
        <div className="flex items-center justify-center gap-2">
          <p key={item.stageIndex} className={cx('fade-in rounded-full bg-bg/80 px-3 text-center text-accent', lang === 'en' ? 'font-latin text-[21px] tracking-wide' : 'font-display text-[17px]')}>
            {stageText}
          </p>
          <TimerRing resetKey={itemKey} seconds={seconds} totalSeconds={KNOWLEDGE_SECONDS} running={running} frozen={game.frozen} untimed={untimed} />
        </div>
        <p className="justify-self-end rounded-full bg-bg/75 px-2.5 py-0.5 text-right text-[15px] font-semibold tabular-nums text-ink" aria-label={t('q.counter', { i: game.index + 1, n: total })}>
          {num(game.index + 1)}/{num(total)}
        </p>
      </header>

      <div className="relative mt-3.5 flex gap-1" aria-hidden="true">
        {game.quiz.items.map((_, i) => (
          <span
            key={i}
            className={cx('h-1 flex-1 rounded-full transition-colors duration-300', i < game.index ? 'bg-accent' : i === game.index ? 'bg-ink' : 'bg-line')}
          />
        ))}
      </div>

      {/* A clear window onto the painting; the question starts on the dark fade below it. */}
      <div className="q-window" aria-hidden="true" />

      <div className="q-body relative flex flex-1 flex-col justify-center py-4">
      <section key={itemKey} className="stagger text-center" aria-live="polite">
        {memory && (
          <p className="mx-auto max-w-[36ch] text-[14.5px] leading-[1.5] text-muted" style={{ '--i': 0 } as CSSProperties}>
            {loc(memory)}
          </p>
        )}
        <h1
          className={cx('mx-auto font-display text-ink', memory && 'mt-2')}
          style={{ '--i': 1, fontSize: promptText.length > 80 ? 21 : promptText.length > 56 ? 23 : 25, lineHeight: 1.34 } as CSSProperties}
        >
          {promptText}
        </h1>
        {timedOut && <p className="pop mt-2 text-[14px] font-semibold text-danger">{t('q.timeUp')}</p>}
      </section>
      </div>

      <div key={`opts-${itemKey}`} className="q-options stagger relative flex flex-col gap-2.5" role="group" aria-label={promptText}>
        {item.order.map((original, displayIdx) => {
          const hidden = game.hidden.includes(original)
          const isPicked = picked === original
          const isCorrect = knowledge !== undefined && original === knowledge.answer
          const reveal = phase === 'feedback'
          const state = !reveal
            ? 'idle'
            : knowledge
              ? isCorrect
                ? 'correct'
                : isPicked
                  ? 'wrong'
                  : 'dim'
              : isPicked
                ? 'selected'
                : 'dim'
          const letter = OPTION_LETTERS[lang][displayIdx]
          const status = state === 'correct' ? t('q.correct') : state === 'wrong' ? t('q.wrong') : hidden ? t('q.removed') : ''
          return (
            <button
              key={original}
              type="button"
              disabled={hidden || reveal}
              onClick={() => pick(original)}
              aria-label={`${letter}. ${optionText(original)}${status ? `, ${status}` : ''}`}
              style={{ '--i': displayIdx + 2 } as CSSProperties}
              className={cx(
                'press flex min-h-[58px] w-full items-center gap-3 rounded-[14px] bg-surface px-3.5 py-2 text-left',
                state === 'idle' && 'border border-line hover:border-muted/50',
                state === 'correct' && 'ok-bump border-2 border-success',
                state === 'wrong' && 'shake border-2 border-danger',
                state === 'selected' && 'border-2 border-accent',
                state === 'dim' && 'border border-line opacity-45',
                hidden && 'opacity-25',
              )}
            >
              <span
                className={cx(
                  'grid size-8 shrink-0 place-items-center rounded-full border font-display text-[15px]',
                  state === 'correct' ? 'border-success bg-success text-on-accent' : state === 'wrong' ? 'border-danger bg-danger text-on-accent' : state === 'selected' ? 'border-accent bg-accent text-on-accent' : 'border-line text-muted',
                )}
              >
                {state === 'correct' ? <Icon name="check" size={16} strokeWidth={2.4} className="pop" /> : state === 'wrong' ? <Icon name="x" size={16} strokeWidth={2.4} className="pop" /> : <span className="pt-0.5">{letter}</span>}
              </span>
              <span className={cx('flex-1 text-[16.5px] font-medium leading-snug text-ink', hidden && 'line-through decoration-line')}>{optionText(original)}</span>
            </button>
          )
        })}
      </div>

      <nav className="relative mt-4 grid grid-cols-3 gap-2.5" aria-label={t('q.lifelines')}>
        {LIFELINES.map((id) => {
          const used = game.used[id]
          const available = !used && canUseLifeline(pack, game, id) && phase === 'asking'
          return (
            <button
              key={id}
              type="button"
              onClick={() => useLifelineAction(id)}
              disabled={!available}
              className={cx(
                'press flex h-14 flex-col items-center justify-center gap-0.5 rounded-[14px] px-1',
                used ? 'border border-dashed border-line text-disabled' : 'border border-line text-ink',
                !used && !available && 'opacity-40',
              )}
            >
              <Icon name={LIFELINE_ICONS[id]} size={19} className={used ? '' : 'text-accent'} />
              <span className="text-[12.5px] leading-4">{used ? t('q.used') : loc(pack.lifelines[id])}</span>
            </button>
          )
        })}
      </nav>

      {confirmQuit && (
        <div className="fade-in fixed inset-0 z-20 flex items-end justify-center bg-bg/80" onClick={() => setConfirmQuit(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="quit-title"
            aria-describedby="quit-body"
            onClick={(e) => e.stopPropagation()}
            className="screen-enter w-full max-w-[480px] rounded-t-[22px] border-t border-line bg-surface px-6 pt-6 pb-[max(24px,env(safe-area-inset-bottom))]"
          >
            <h2 id="quit-title" className="font-display text-[22px] text-ink">{t('q.quitTitle')}</h2>
            <p id="quit-body" className="mt-1.5 text-[15px] text-muted">{t('q.quitBody')}</p>
            <div className="mt-5 flex flex-col gap-2.5">
              <PrimaryButton autoFocus onClick={() => setConfirmQuit(false)}>{t('q.keep')}</PrimaryButton>
              <SecondaryButton onClick={onQuit}>{t('q.quit')}</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
