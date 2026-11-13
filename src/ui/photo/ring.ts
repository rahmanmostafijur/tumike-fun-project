import type { PhotoRing } from '../../engine/schema'

/**
 * Photo geometry in monogram units: the monogram is 100 wide and its outer
 * ring has radius 48. The photo fills the circle just inside that ring. The
 * on-screen card (SVG) and the image export (canvas) both draw from these
 * marks, so they always match.
 */
export const MONOGRAM_UNITS = 100
export const PHOTO_R = 45.5

export type RingMark =
  | { kind: 'circle'; r: number; width: number; opacity: number; dash?: readonly [number, number] }
  | { kind: 'tick'; angle: number; r1: number; r2: number; width: number; opacity: number }

const TICKS = 36

/** The pack's ring style at the photo's edge. */
export function ringMarks(ring: PhotoRing, r: number = PHOTO_R): RingMark[] {
  switch (ring) {
    case 'single':
      return [{ kind: 'circle', r, width: 1.5, opacity: 1 }]
    case 'double':
      return [
        { kind: 'circle', r, width: 1, opacity: 1 },
        { kind: 'circle', r: r - 3.5, width: 0.75, opacity: 0.7 },
      ]
    case 'dotted':
      return [{ kind: 'circle', r, width: 2, opacity: 1, dash: [0.01, 4.5] }]
    case 'ticked':
      return [
        { kind: 'circle', r, width: 1, opacity: 1 },
        ...Array.from({ length: TICKS }, (_, i): RingMark => ({ kind: 'tick', angle: (i / TICKS) * Math.PI * 2, r1: r, r2: r - 3, width: 0.75, opacity: 0.85 })),
      ]
  }
}
