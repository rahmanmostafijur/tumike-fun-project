import { useI18n } from '../../i18n/I18n'
import type { Lang } from '../../storage/storage'
import { cx } from '../util'

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: 'bn', label: 'বাং', name: 'বাংলা' },
  { lang: 'en', label: 'EN', name: 'English' },
]

/** বাং / EN pill. Remembered in localStorage by the i18n provider. */
export function LangToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('lang.label')} className="flex h-11 items-center rounded-full border border-line bg-bg/70 p-1">
      {OPTIONS.map((o) => {
        const active = o.lang === lang
        return (
          <button
            key={o.lang}
            type="button"
            lang={o.lang}
            aria-pressed={active}
            aria-label={o.name}
            onClick={() => setLang(o.lang)}
            className={cx(
              'h-full min-w-11 rounded-full px-3 text-[14px] font-semibold transition-colors duration-200',
              active ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink',
              o.lang === 'bn' ? 'font-display' : 'font-body',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
