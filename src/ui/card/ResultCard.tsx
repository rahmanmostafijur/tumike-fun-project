import type { CSSProperties } from 'react'
import type { Rarity } from '../../engine/schema'
import { Icon } from '../components/Icon'
import { Monogram } from '../components/Monogram'
import { cx, hasBengali, nameFontClass } from '../util'
import { BAND_H, frameColor, isRare, type CardData } from './cardData'

/** Four-point star used for corner ornaments on rare cards. */
function Star({ style, size = 10 }: { style: CSSProperties; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className="absolute" style={style} aria-hidden="true">
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4Z" fill="currentColor" />
    </svg>
  )
}

/** Small diagonal thorn marks for dark cards. */
function Thorn({ style }: { style: CSSProperties }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="absolute" style={style} aria-hidden="true">
      <path d="M1 1 L11 11 M1 6 L6 11" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

/** The frame treatment for each rarity. Legend and Secret clearly look rarer. */
export function CardFrame({ rarity, mini = false }: { rarity: Rarity; mini?: boolean }) {
  const color = frameColor(rarity)
  const inset = mini ? 4 : 8
  const outerR = mini ? 12 : 22
  const innerR = outerR - inset + 1
  const corner = mini ? 5 : 12
  const rare = isRare(rarity)
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ color }}>
      <div
        className="absolute inset-0 border-2"
        style={{ borderRadius: outerR, borderColor: color, opacity: rarity === 'beginner' ? 0.6 : 1 }}
      />
      <div
        className="absolute border"
        style={{
          inset,
          borderRadius: innerR,
          borderColor: color,
          borderStyle: rarity === 'dark' ? 'dashed' : 'solid',
          opacity: rarity === 'beginner' ? 0.35 : rarity === 'skilled' ? 0.7 : 1,
        }}
      />
      {rare && (
        <div className="absolute border" style={{ inset: inset + (mini ? 2 : 4), borderRadius: innerR - 3, borderColor: color, opacity: 0.45 }} />
      )}
      {rare &&
        !mini &&
        [
          { top: inset - 5, left: inset - 5 },
          { top: inset - 5, right: inset - 5 },
          { bottom: inset - 5, left: inset - 5 },
          { bottom: inset - 5, right: inset - 5 },
        ].map((s, i) => <Star key={i} style={s} />)}
      {rarity === 'skilled' && !mini && (
        <>
          <Star size={8} style={{ top: inset - 4, left: '50%', marginLeft: -4 }} />
          <Star size={8} style={{ bottom: inset - 4, left: '50%', marginLeft: -4 }} />
        </>
      )}
      {rarity === 'dark' &&
        !mini &&
        [
          { top: corner, left: corner },
          { top: corner, right: corner, transform: 'scaleX(-1)' },
          { bottom: corner, left: corner, transform: 'scaleY(-1)' },
          { bottom: corner, right: corner, transform: 'scale(-1)' },
        ].map((s, i) => <Thorn key={i} style={s} />)}
      {rarity === 'secret' && !mini && (
        <svg className="absolute left-1/2 -translate-x-1/2" style={{ top: 13 }} width="120" height="14" viewBox="0 0 120 14" aria-hidden="true">
          <path d="M8 9 L30 4 L52 10 L70 3 L92 9 L112 5" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.5" />
          {[[8, 9], [30, 4], [52, 10], [70, 3], [92, 9], [112, 5]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 1.6 : 1.1} fill="currentColor" />
          ))}
        </svg>
      )}
    </div>
  )
}

function TierLabel({ card }: { card: CardData }) {
  const latin = !hasBengali(card.tierLabel)
  const filled = isRare(card.rarity)
  return (
    <span
      className={cx(
        'inline-flex h-[22px] items-center rounded-full leading-none',
        latin ? 'spaced font-latin text-[12px]' : 'font-display text-[13px]',
        filled ? 'bg-accent px-2.5 text-on-accent' : card.band ? 'bg-surface/85 px-2.5' : 'px-0',
      )}
      style={filled ? undefined : { color: frameColor(card.rarity) }}
    >
      <span className={latin ? 'pt-px' : 'pt-0.5'}>{card.tierLabel}</span>
    </span>
  )
}

/**
 * Breaks a name only at spaces, never after a hyphen ("The Three-Eyed /
 * Raven", not "The Three- / Eyed Raven"), matching the image export.
 */
function NameWords({ name }: { name: string }) {
  const words = name.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          {w.includes('-') ? <span className="whitespace-nowrap">{w}</span> : w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

/** The collectible result card. ~342px wide on a phone. */
export function ResultCard({ card, className }: { card: CardData; className?: string }) {
  const nameLatin = !hasBengali(card.name)
  const longName = card.name.length > 14
  return (
    <article
      className={cx('relative flex w-full flex-col items-center bg-surface px-6 pt-[26px] pb-[18px] text-center', className)}
      style={{ borderRadius: 22 }}
      aria-label={`${card.youAre} ${card.name}`}
    >
      {card.band && (
        <div
          aria-hidden="true"
          className="card-band"
          style={{ height: BAND_H, backgroundImage: `url("${card.band.src}")`, backgroundPosition: `${card.band.focal.x}% ${card.band.focal.y}%` }}
        />
      )}
      <CardFrame rarity={card.rarity} />
      <div className="relative flex w-full items-center justify-between">
        <TierLabel card={card} />
        {card.traitLabel !== null && (
          <span className={cx('text-[13px] text-muted', hasBengali(card.traitLabel) ? 'font-display' : 'spaced font-latin text-[12px]', card.band && 'inline-flex h-[22px] items-center rounded-full bg-surface/85 px-2.5')}>
            {card.traitLabel}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <Monogram text={card.monogram} rarity={card.rarity} size={100} filled={Boolean(card.band)} photo={card.photo} />
      </div>
      <p className="relative mt-3.5 text-[15px] leading-5 text-muted">{card.youAre}</p>
      <h2
        className={cx('relative mt-1 text-balance text-ink', nameFontClass(card.name))}
        style={{ fontSize: nameLatin ? (longName ? 34 : 38) : 32, lineHeight: 1.08 }}
      >
        <NameWords name={card.name} />
      </h2>

      {(card.match !== null || card.badge) && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {card.match !== null && (
            <span className="inline-flex h-[26px] items-center rounded-full border px-3 text-[13px] font-semibold" style={{ borderColor: frameColor(card.rarity), color: frameColor(card.rarity) }}>
              <span className="pt-px">{card.match}</span>
            </span>
          )}
          {card.badge && (
            <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-dashed border-line px-3 text-[13px] text-muted">
              <Icon name="book" size={13} />
              <span className="pt-px">{card.badge}</span>
            </span>
          )}
        </div>
      )}

      <div className="mt-[18px] flex w-full items-center gap-2 text-line" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0L8 4L4 8L0 4Z" fill="currentColor" /></svg>
        <span className="h-px flex-1 bg-line" />
      </div>

      <dl className="mt-4 grid w-full grid-cols-[84px_1fr] gap-x-3 gap-y-2.5 text-left">
        <dt className={cx('pt-0.5 text-accent', card.lang === 'bn' ? 'font-display text-[14px]' : 'spaced font-latin text-[12px] leading-6')}>{card.strengthLabel}</dt>
        <dd className="text-[15px] leading-[21px] text-ink">{card.strength}</dd>
        <dt className={cx('pt-0.5 text-accent', card.lang === 'bn' ? 'font-display text-[14px]' : 'spaced font-latin text-[12px] leading-6')}>{card.weaknessLabel}</dt>
        <dd className="text-[15px] leading-[21px] text-ink">{card.weakness}</dd>
      </dl>

      <p className="mt-4 text-balance font-display text-[17px] leading-6 text-accent">
        <Icon name="tag" size={16} className="mr-1.5 inline-block -translate-y-0.5 align-middle" />
        {card.squad}
      </p>

      <footer className="mt-[18px] flex w-full items-center justify-between border-t border-line pt-3">
        <span className="font-display text-[15px] text-accent">{card.wordmark}</span>
        <span className="text-[12.5px] text-muted">{card.site}</span>
      </footer>
    </article>
  )
}

interface MiniCardProps {
  name: string
  monogram: string
  rarity: Rarity
  rarityLabel: string
  locked: boolean
  lockedLabel: string
}

/** Collection thumbnail. Locked cards are silhouettes. */
export function MiniCard({ name, monogram, rarity, rarityLabel, locked, lockedLabel }: MiniCardProps) {
  return (
    <div
      className={cx('relative flex aspect-[3/4] flex-col items-center justify-center gap-2 px-2 text-center', locked ? 'bg-bg' : 'bg-surface')}
      style={{ borderRadius: 12 }}
      aria-label={locked ? lockedLabel : `${name}, ${rarityLabel}`}
      role="img"
    >
      {locked ? (
        <div aria-hidden="true" className="absolute inset-0 rounded-[12px] border border-dashed border-line" />
      ) : (
        <CardFrame rarity={rarity} mini />
      )}
      <Monogram text={monogram} rarity={rarity} size={44} locked={locked} />
      <span className={cx('line-clamp-2 text-[13px] leading-[15px]', locked ? 'text-disabled' : cx('text-ink', nameFontClass(name), !hasBengali(name) && 'text-[15px]'))}>
        {locked ? '• • •' : name}
      </span>
      <span
        className={cx('text-[10px] leading-none', hasBengali(rarityLabel) ? 'font-display text-[11px]' : 'spaced font-latin')}
        style={{ color: locked ? 'var(--t-disabled)' : frameColor(rarity) }}
      >
        {rarityLabel}
      </span>
    </div>
  )
}
