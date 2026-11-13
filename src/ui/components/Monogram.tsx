import type { PhotoRing, Rarity } from '../../engine/schema'
import { MONOGRAM_UNITS, PHOTO_R, ringMarks } from '../photo/ring'
import { cx, hasBengali } from '../util'

interface MonogramProps {
  text: string
  rarity: Rarity
  size?: number
  locked?: boolean
  /** Solid disc behind the letters, for use over a painting. */
  filled?: boolean
  /** The player's photo in place of the letters (result card only). */
  photo?: { src: string; ring: PhotoRing } | null
}

/** The pack's ring at the edge of the player's photo, drawn from the shared ring marks. */
function PhotoRingMarks({ ring, c, k, color }: { ring: PhotoRing; c: number; k: number; color: string }) {
  return (
    <>
      {ringMarks(ring).map((m, i) =>
        m.kind === 'circle' ? (
          <circle
            key={i}
            cx={c}
            cy={c}
            r={m.r * k}
            fill="none"
            stroke={color}
            strokeWidth={m.width * k}
            opacity={m.opacity}
            strokeDasharray={m.dash ? `${m.dash[0] * k} ${m.dash[1] * k}` : undefined}
            strokeLinecap={m.dash ? 'round' : undefined}
          />
        ) : (
          <line
            key={i}
            x1={c + Math.cos(m.angle) * m.r1 * k}
            y1={c + Math.sin(m.angle) * m.r1 * k}
            x2={c + Math.cos(m.angle) * m.r2 * k}
            y2={c + Math.sin(m.angle) * m.r2 * k}
            stroke={color}
            strokeWidth={m.width * k}
            opacity={m.opacity}
          />
        ),
      )}
    </>
  )
}

/** The character's initials (or the player's photo) in a ring. Rarer cards get richer rings. */
export function Monogram({ text, rarity, size = 100, locked = false, filled = false, photo = null }: MonogramProps) {
  const color = locked ? 'var(--t-line)' : rarity === 'dark' ? 'var(--t-dark)' : 'var(--t-accent)'
  const c = size / 2
  const r = c - 2
  const k = size / MONOGRAM_UNITS
  const isLatin = !hasBengali(text)
  const fontSize = locked ? size * 0.42 : text.length > 1 ? size * (isLatin ? 0.36 : 0.3) : size * (isLatin ? 0.48 : 0.4)
  const ticks = rarity === 'legend' || rarity === 'secret'
  const showPhoto = photo !== null && !locked
  const photoR = PHOTO_R * k

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {showPhoto && (
        <img
          src={photo.src}
          alt=""
          draggable={false}
          className="absolute rounded-full object-cover"
          style={{ left: c - photoR, top: c - photoR, width: photoR * 2, height: photoR * 2 }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 overflow-visible">
        <circle cx={c} cy={c} r={r} fill={filled && !showPhoto ? 'var(--t-surface)' : 'none'} fillOpacity={0.84} stroke={color} strokeWidth={1.5} strokeDasharray={rarity === 'dark' && !locked ? '5 4' : undefined} />
        {showPhoto ? (
          <PhotoRingMarks ring={photo.ring} c={c} k={k} color={color} />
        ) : (
          !locked && rarity !== 'beginner' && <circle cx={c} cy={c} r={r - size * 0.07} fill="none" stroke={color} strokeWidth={0.75} opacity={0.6} />
        )}
        {!locked &&
          ticks &&
          Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            const r1 = r + 3
            const r2 = r + (i % 3 === 0 ? 8 : 5.5)
            return <line key={i} x1={c + Math.cos(a) * r1} y1={c + Math.sin(a) * r1} x2={c + Math.cos(a) * r2} y2={c + Math.sin(a) * r2} stroke={color} strokeWidth={1} />
          })}
      </svg>
      {!locked && rarity === 'secret' && (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="orbit absolute inset-0 overflow-visible">
          <circle cx={c} cy={c} r={r + 12} fill="none" stroke={color} strokeWidth={1} strokeDasharray="1 6" strokeLinecap="round" />
          <circle cx={c} cy={c - r - 12} r={2.5} fill={color} />
        </svg>
      )}
      {!showPhoto && (
        <span
          className={cx('absolute inset-0 grid place-items-center leading-none', isLatin ? 'font-latin' : 'font-display')}
          style={{ fontSize, color: locked ? 'var(--t-disabled)' : 'var(--t-text)', paddingTop: isLatin ? 0 : size * 0.04 }}
        >
          {locked ? '?' : text}
        </span>
      )}
    </div>
  )
}
