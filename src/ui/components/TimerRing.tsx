import type { CSSProperties } from 'react'
import { useI18n } from '../../i18n/I18n'
import { cx } from '../util'
import { Icon } from './Icon'

const SIZE = 42
const STROKE = 3
const R = (SIZE - STROKE) / 2 - 0.5
const C = 2 * Math.PI * R
export const URGENT_SECONDS = 5

interface TimerRingProps {
  /** Restarts the ring animation when it changes. */
  resetKey: string
  seconds: number
  totalSeconds: number
  running: boolean
  frozen: boolean
  untimed: boolean
}

/**
 * Compact circular countdown for the top row. The ring drains with a CSS
 * animation (paused with the clock); the number comes from the countdown hook.
 */
export function TimerRing({ resetKey, seconds, totalSeconds, running, frozen, untimed }: TimerRingProps) {
  const { t, num } = useI18n()
  const urgent = !untimed && !frozen && seconds <= URGENT_SECONDS
  const ringStyle = {
    strokeDasharray: C,
    '--ring-c': C,
    animationDuration: `${totalSeconds}s`,
    animationPlayState: running ? 'running' : 'paused',
  } as CSSProperties
  const label = untimed ? t('q.untimed') : frozen ? t('q.frozen') : t('q.secondsLeft', { n: seconds })

  return (
    <div className={cx('relative shrink-0', urgent && 'timer-urgent')} style={{ width: SIZE, height: SIZE }} role="timer" aria-label={label} title={label}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="var(--t-bg)" fillOpacity={0.85} stroke="var(--t-line)" strokeWidth={untimed ? 1.25 : STROKE} strokeDasharray={untimed ? '2.5 3.5' : undefined} />
        {!untimed && (
          <circle
            key={resetKey}
            className="ring-progress"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={frozen ? 'var(--t-muted)' : urgent ? 'var(--t-danger)' : 'var(--t-accent)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={ringStyle}
          />
        )}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {untimed ? (
          <Icon name="quill" size={17} className="text-accent" />
        ) : frozen ? (
          <Icon name="freeze" size={17} className="text-muted" />
        ) : (
          <span key={urgent ? seconds : 'calm'} className={cx('text-[15px] font-semibold leading-none tabular-nums', urgent ? 'tick text-danger' : 'text-ink')}>
            {num(seconds)}
          </span>
        )}
      </div>
    </div>
  )
}
