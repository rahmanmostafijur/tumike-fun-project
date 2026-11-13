import type { CSSProperties } from 'react'
import type { Background, ParticleKind } from '../../engine/schema'
import type { Size } from './geometry'

type ParticleConfig = Background['effects']['particles'][number]
type Area = NonNullable<ParticleConfig['area']>

/** One rendered particle: a span with a class and inline style. */
export interface ParticleSpec {
  key: string
  className: string
  style: CSSProperties
}

const FULL: Area = { x: 0, y: 0, w: 100, h: 100 }

/** Stable pseudo-random number in [0, 1) so particles keep their places between renders. */
export function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

interface Seed {
  i: number
  r1: number
  r2: number
  r3: number
  box: Size
  /** Position inside the particle's area, from fractions of its width and height. */
  at: (fx: number, fy: number) => { left: string; top: string }
}

type Maker = (s: Seed) => { className: string; style: CSSProperties }

/**
 * Per-kind look and motion. Every kind animates transform and opacity only
 * (see the `amb-*` keyframes in index.css), so nothing triggers layout.
 * Without an area the original kinds (snow, leaves, smoke) place exactly as
 * they always have.
 */
const MAKERS: Record<ParticleKind, Maker> = {
  snow: ({ r1, r2, r3, box, at }) => {
    const size = 1.5 + r2 * 2.5
    return {
      className: 'amb amb-snow',
      style: {
        left: at(r1, 0).left, top: 0, width: size, height: size,
        '--fall': `${box.h * 1.06}px`, '--drift': `${(r3 - 0.5) * 60}px`,
        animationDuration: `${11 + r2 * 9}s`, animationDelay: `-${r3 * 20}s`,
      } as CSSProperties,
    }
  },
  leaves: ({ r1, r2, r3, box, at }) => ({
    className: 'amb amb-leaf',
    style: {
      ...at(r1 * 0.45, r2 * 0.25),
      '--dx': `${box.w * (0.25 + r3 * 0.35)}px`, '--dy': `${box.h * (0.3 + r1 * 0.25)}px`,
      animationDuration: `${15 + r3 * 8}s`, animationDelay: `-${r2 * 22}s`,
    } as CSSProperties,
  }),
  smoke: ({ i, r1, r2, r3, box, at }) => {
    const { top } = at(0, (5 + i * 7 + r2 * 4) / 100)
    return {
      className: 'amb amb-smoke',
      style: {
        left: at((-15 + r1 * 35) / 100, 0).left, top,
        '--dx': `${box.w * 0.28}px`,
        animationDuration: `${34 + r3 * 14}s`, animationDelay: `-${r2 * 30}s`,
      } as CSSProperties,
    }
  },
  /** Warm motes rising slowly from lit windows. */
  sparks: ({ r1, r2, r3, box, at }) => {
    const size = 1.5 + r3 * 1.8
    return {
      className: 'amb amb-spark',
      style: {
        ...at(r1, 0.35 + r2 * 0.65), width: size, height: size,
        '--rise': `${-box.h * (0.06 + r3 * 0.07)}px`, '--sway': `${(r2 - 0.5) * 34}px`,
        animationDuration: `${7 + r2 * 6}s`, animationDelay: `-${r1 * 12}s`,
      } as CSSProperties,
    }
  },
  /** Banknotes fluttering down across the whole scene. */
  notes: ({ r1, r2, r3, box, at }) => ({
    className: 'amb amb-note',
    style: {
      left: at(r1, 0).left, top: at(0, 0).top,
      '--fall': `${box.h * 1.05}px`, '--drift': `${(r3 - 0.5) * 90}px`, '--spin': `${(r2 > 0.5 ? 1 : -1) * (300 + r3 * 360)}deg`,
      animationDuration: `${16 + r2 * 10}s`, animationDelay: `-${r3 * 26}s`,
    } as CSSProperties,
  }),
  /** Soft green haze rising off the desert floor. */
  haze: ({ r1, r2, r3, box, at }) => ({
    className: 'amb amb-haze',
    style: {
      ...at(r1 * 0.8, r2), '--rise': `${-box.h * (0.08 + r3 * 0.06)}px`, '--dx': `${(r3 - 0.5) * box.w * 0.12}px`,
      animationDuration: `${18 + r3 * 10}s`, animationDelay: `-${r2 * 26}s`,
    } as CSSProperties,
  }),
  /** Small lights wandering through the greenery, glowing on and off. */
  fireflies: ({ r1, r2, r3, at }) => ({
    className: 'amb amb-firefly',
    style: {
      ...at(r1, r2), '--dx': `${(r3 - 0.5) * 46}px`, '--dy': `${(r1 - 0.5) * 30}px`,
      animationDuration: `${5 + r3 * 5}s, ${2.2 + r2 * 2.6}s`, animationDelay: `-${r2 * 9}s, -${r3 * 4}s`,
    } as CSSProperties,
  }),
  /** Short streaks of light glinting on the water. */
  glints: ({ r1, r2, r3, at }) => ({
    className: 'amb amb-glint',
    style: {
      ...at(r1, r2), width: 8 + r3 * 16, '--dx': `${(r2 - 0.5) * 14}px`,
      animationDuration: `${3 + r3 * 3}s`, animationDelay: `-${r1 * 5}s`,
    } as CSSProperties,
  }),
}

/** All particles for a painting, in a stable order with stable positions. */
export function particleSpecs(particles: readonly ParticleConfig[], box: Size): ParticleSpec[] {
  return particles.flatMap((p, k) => {
    const area = p.area ?? FULL
    const at = (fx: number, fy: number) => ({ left: `${area.x + fx * area.w}%`, top: `${area.y + fy * area.h}%` })
    return Array.from({ length: p.count }, (_, i) => {
      const made = MAKERS[p.kind]({ i, r1: rand(i, k + 1), r2: rand(i, k + 7), r3: rand(i, k + 13), box, at })
      return { key: `${p.kind}-${k}-${i}`, ...made }
    })
  })
}

/** Class names whose animations are hidden entirely under reduced motion. */
export const PARTICLE_CLASSES: Record<ParticleKind, string> = {
  snow: 'amb-snow', leaves: 'amb-leaf', smoke: 'amb-smoke', sparks: 'amb-spark',
  notes: 'amb-note', haze: 'amb-haze', fireflies: 'amb-firefly', glints: 'amb-glint',
}
