import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Pack } from '../../engine/schema'
import { useI18n } from '../../i18n/I18n'
import { OPTION_LETTERS } from '../../i18n/strings'
import { useSceneryView } from '../scenery/view'
import { IconButton } from '../components/Button'
import { Icon } from '../components/Icon'
import { cx, haptic, nameFontClass } from '../util'

interface FanSinceProps {
  pack: Pack
  onPick: (optionId: string | null) => void
  onBack: () => void
}

const CONFIRM_MS = 320

/** One unscored, one-tap question. The answer becomes a badge on the card. */
export function FanSince({ pack, onPick, onBack }: FanSinceProps) {
  const { t, loc, lang } = useI18n()
  const [picked, setPicked] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useSceneryView('journey', 0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const choose = (id: string) => {
    if (picked) return
    haptic(10)
    setPicked(id)
    timer.current = window.setTimeout(() => onPick(id), CONFIRM_MS)
  }

  const title = loc(pack.title)

  return (
    <main className="screen screen-enter">
      <header className="relative flex items-center justify-between">
        <IconButton icon="arrowLeft" label={t('collection.back')} onClick={onBack} />
        <span className={cx('rounded-full bg-bg/80 px-3 text-accent', nameFontClass(title), nameFontClass(title) === 'font-latin' ? 'text-[20px]' : 'text-[17px]')}>{title}</span>
        <span className="size-11" aria-hidden="true" />
      </header>

      <section className="stagger relative mt-[clamp(150px,31vh,270px)] text-center">
        <p className="text-[13px] font-semibold text-muted" style={{ '--i': 0 } as CSSProperties}>{t('fan.eyebrow')}</p>
        <h1 className="mx-auto mt-2 max-w-[18ch] font-display text-[25px] leading-[1.32] text-ink" style={{ '--i': 1 } as CSSProperties}>
          {loc(pack.fanSince.question)}
        </h1>
        <p className="mx-auto mt-2 max-w-[32ch] text-[13.5px] leading-5 text-muted" style={{ '--i': 2 } as CSSProperties}>{t('fan.hint')}</p>
      </section>

      <div className="stagger relative mt-auto flex flex-col gap-2.5 pt-8">
        {pack.fanSince.options.map((o, i) => {
          const active = picked === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              disabled={picked !== null && !active}
              style={{ '--i': i + 3 } as CSSProperties}
              className={cx(
                'press flex min-h-[58px] w-full items-center gap-3 rounded-[14px] bg-surface px-3.5 py-2 text-left',
                active ? 'border-2 border-accent' : 'border border-line',
                picked !== null && !active && 'opacity-50',
              )}
            >
              <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border font-display text-[15px]', active ? 'border-accent bg-accent text-on-accent' : 'border-line text-muted')}>
                <span className="pt-0.5">{OPTION_LETTERS[lang][i]}</span>
              </span>
              <span className="flex-1 text-[16.5px] font-medium leading-snug text-ink">{loc(o.label)}</span>
              {active && <Icon name="check" size={20} className="pop text-accent" strokeWidth={2.2} />}
            </button>
          )
        })}
        <button type="button" onClick={() => onPick(null)} className="press mx-auto mt-1 h-11 px-4 text-[14px] font-medium text-muted underline-offset-4 hover:underline">
          {t('fan.skip')}
        </button>
      </div>
    </main>
  )
}
