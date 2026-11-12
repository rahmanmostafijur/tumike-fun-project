import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { isPlayable, type AnyPack } from '../../engine/schema'
import { useI18n } from '../../i18n/I18n'
import { hasSeenNudge, markNudgeSeen } from '../../storage/storage'
import { cx, nameFontClass, prefersReducedMotion } from '../util'
import { Art } from './Art'
import { Icon } from './Icon'

const NUDGE_DELAY_MS = 900
const PRELOAD_DELAY_MS = 600

interface CarouselProps {
  packs: readonly AnyPack[]
  activeId: string
  onActive: (id: string) => void
}

/** Preloads a painting so swiping to it shows it immediately. */
function preload(src: string | undefined) {
  if (!src) return
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

/**
 * Swipeable universe picker built on native CSS scroll-snap. The centred card
 * is the active pack; the next card peeks in from the side.
 */
export function Carousel({ packs, activeId, onActive }: CarouselProps) {
  const { t, loc } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const activeRef = useRef(activeId)
  const [nudge, setNudge] = useState(false)
  const activeIndex = Math.max(0, packs.findIndex((p) => p.id === activeId))


  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = ref.current
    const slide = el?.children[index] as HTMLElement | undefined
    if (!el || !slide) return
    const reduced = prefersReducedMotion()
    el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2, behavior: reduced ? 'auto' : behavior })
  }

  // Start centred on the active pack (deep link or last viewed).
  useLayoutEffect(() => {
    scrollToIndex(activeIndex, 'auto')
    // Only on mount: later changes come from the user's own scrolling.
  }, [])

  // When the active pack changes from outside (a deep link), bring its card to the centre.
  useEffect(() => {
    if (activeRef.current === activeId) return
    activeRef.current = activeId
    scrollToIndex(activeIndex)
  }, [activeId, activeIndex])

  // Neighbours of the active slide load ahead of time; the rest stay lazy.
  // A short delay keeps them from competing with the active painting on first load.
  useEffect(() => {
    const id = window.setTimeout(() => {
      preload(packs[activeIndex - 1]?.background?.src)
      preload(packs[activeIndex + 1]?.background?.src)
    }, PRELOAD_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [activeIndex, packs])

  // First visit only: one gentle nudge to show that the row swipes.
  useEffect(() => {
    if (hasSeenNudge() || prefersReducedMotion() || packs.length < 2) return
    const id = window.setTimeout(() => {
      setNudge(true)
      markNudgeSeen()
    }, NUDGE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [packs.length])

  const onScroll = () => {
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      const el = ref.current
      if (!el) return
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      const id = packs[best]?.id
      if (id && id !== activeRef.current) {
        activeRef.current = id
        onActive(id)
      }
    })
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = e.key === 'ArrowRight' ? activeIndex + 1 : e.key === 'ArrowLeft' ? activeIndex - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? packs.length - 1 : null
    if (next === null) return
    e.preventDefault()
    scrollToIndex(Math.min(packs.length - 1, Math.max(0, next)))
  }

  const total = packs.length

  return (
    <section aria-roledescription="carousel" aria-label={t('landing.carousel')} className="relative">
      <div
        ref={ref}
        className={cx('carousel', nudge && 'nudge')}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onAnimationEnd={() => setNudge(false)}
        aria-label={t('landing.carousel')}
      >
        {packs.map((p, i) => {
          const active = i === activeIndex
          const title = loc(p.title)
          const latin = nameFontClass(title) === 'font-latin'
          const playable = isPlayable(p)
          return (
            <div
              key={p.id}
              className={cx('slide', active && 'is-active')}
              role="group"
              aria-roledescription="slide"
              aria-label={`${t('landing.slide', { i: i + 1, n: total })}: ${title}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => !active && scrollToIndex(i)}
            >
              <div className={cx('slide-card flex h-full flex-col gap-2 rounded-[16px] bg-surface px-4 py-3.5', active ? 'border-2 border-accent' : 'border border-line')}>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/60 text-accent">
                    {p.icon ? <Art art={p.icon} strokeWidth={1.6} className="size-6" /> : <Icon name="sparkle" size={20} />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cx('truncate text-ink', nameFontClass(title), latin ? 'text-[22px] leading-7' : 'text-[18px] leading-7')}>{title}</span>
                    {playable ? (
                      <span className="text-[13px] text-muted">{t('landing.characters', { n: p.characters.length })}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[13px] text-muted">
                        <Icon name="lock" size={13} />
                        {t('landing.comingSoon')}
                      </span>
                    )}
                  </span>
                  {active && playable && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-on-accent" aria-label={t('landing.selected')}>
                      <Icon name="check" size={16} strokeWidth={2.4} />
                    </span>
                  )}
                </div>
                {p.tagline && <p className="line-clamp-2 text-[13.5px] leading-5 text-muted">{loc(p.tagline)}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <button
          type="button"
          className="desk-only press size-9 place-items-center rounded-full border border-line text-ink disabled:opacity-40"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label={t('landing.prev')}
        >
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="flex">
          {packs.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="grid h-9 w-7 place-items-center"
              onClick={() => scrollToIndex(i)}
              aria-label={t('landing.goTo', { name: loc(p.title) })}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <span className={cx('block h-1.5 rounded-full transition-all duration-300', i === activeIndex ? 'w-4 bg-accent' : 'w-1.5 bg-line')} />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="desk-only press size-9 place-items-center rounded-full border border-line text-ink disabled:opacity-40"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === total - 1}
          aria-label={t('landing.next')}
        >
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </section>
  )
}
