import { useId, type CSSProperties } from 'react'
import { isPlayable, type AnyPack } from '../../engine/schema'
import { QUICK_PATTERN, fullLength } from '../../engine/selection'
import { useI18n } from '../../i18n/I18n'
import { APP } from '../../config'
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Button'
import { Carousel } from '../components/Carousel'
import { Icon } from '../components/Icon'
import { LangToggle } from '../components/LangToggle'
import { useSceneryView } from '../scenery/view'
import { cx } from '../util'

interface LandingProps {
  packs: readonly AnyPack[]
  selected: AnyPack
  onSelect: (id: string) => void
  name: string
  onNameChange: (name: string) => void
  onStart: (mode: 'quick' | 'full') => void
  onCollection: () => void
}

/** Quick mode is pitched as ~90 seconds: six timed questions plus quick picks. */
const QUICK_SECONDS = 90
const NAME_MAX = 24
const FULL_FALLBACK = 21

export function Landing({ packs, selected, onSelect, name, onNameChange, onStart, onCollection }: LandingProps) {
  const { t, num } = useI18n()
  const nameId = useId()
  useSceneryView('landing')
  const playable = isPlayable(selected)
  const fullCount = playable ? fullLength(selected) : FULL_FALLBACK
  // With a painting, the headline starts below the skyline at the top.
  const headlineTop = selected.background ? 'mt-[clamp(96px,calc(27vh-50px),196px)]' : 'mt-[clamp(20px,6vh,72px)]'

  return (
    <main className="screen screen-enter pb-0">
      <header className="relative flex items-center justify-between">
        <span className="font-display text-[24px] leading-none text-accent">{APP.wordmark}</span>
        <div className="flex items-center gap-2">
          <IconButton icon="cards" label={t('landing.collection')} onClick={onCollection} />
          <LangToggle />
        </div>
      </header>

      <section className={cx('stagger relative', headlineTop)}>
        <h1 className="font-display text-[clamp(28px,8.4vw,34px)] leading-[1.18] text-ink" style={{ '--i': 0 } as CSSProperties}>
          {t('landing.headline')}
        </h1>
        <p className="mt-2 text-[15.5px] leading-[1.5] text-muted" style={{ '--i': 1 } as CSSProperties}>
          {t('landing.subtitle', { q: QUICK_PATTERN.length, s: QUICK_SECONDS })}
        </p>
      </section>

      <div className="relative mt-4">
        <h2 className="text-[13px] font-semibold text-muted">{t('landing.pick')}</h2>
        <Carousel packs={packs} activeId={selected.id} onActive={onSelect} />
      </div>

      <div className="relative mt-2">
        <label htmlFor={nameId} className="text-[13px] font-semibold text-muted">
          {t('landing.nameLabel')}
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          maxLength={NAME_MAX}
          autoComplete="given-name"
          enterKeyHint="go"
          placeholder={t('landing.namePlaceholder')}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && playable && onStart('quick')}
          className="mt-1.5 h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-disabled focus:border-accent focus:outline-none"
        />
      </div>

      {/* Sticky so the primary action is always reachable, even on very short screens. */}
      <div className="landing-actions mt-auto">
        {playable ? (
          <PrimaryButton onClick={() => onStart('quick')}>{t('landing.start')}</PrimaryButton>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-line bg-bg font-display text-[18px] text-muted"
          >
            <Icon name="lock" size={18} />
            <span className="pt-0.5">{t('landing.comingSoonButton')}</span>
          </button>
        )}
        <SecondaryButton
          className={cx('bg-bg', !playable && 'invisible')}
          aria-hidden={playable ? undefined : true}
          tabIndex={playable ? undefined : -1}
          onClick={() => playable && onStart('full')}
        >
          {t('landing.full', { n: num(fullCount) })}
        </SecondaryButton>
      </div>
    </main>
  )
}
