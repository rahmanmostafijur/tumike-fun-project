import type { Point } from '../../engine/schema'

export interface Size {
  w: number
  h: number
}

/** The image box in screen pixels: its size and top-left offset. */
export interface Box extends Size {
  x: number
  y: number
}

/** Size of an image scaled to cover a frame (like object-fit: cover). */
export function coverSize(frame: Size, image: Size): Size {
  const scale = Math.max(frame.w / image.w, frame.h / image.h)
  return { w: image.w * scale, h: image.h * scale }
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** A point along a polyline, with t from 0 (first point) to 1 (last point). */
export function pointAlong(points: readonly Point[], t: number): Point {
  const first = points[0]
  if (!first) return { x: 50, y: 50 }
  if (points.length === 1) return first
  const pos = clamp(t, 0, 1) * (points.length - 1)
  const i = Math.min(Math.floor(pos), points.length - 2)
  const a = points[i] ?? first
  const b = points[i + 1] ?? a
  const f = pos - i
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
}

/**
 * Places the cover-sized image box so `focal` (percent of the image) lands
 * on `anchor` (fraction of the frame), without exposing the frame's sides or
 * top. With `allowBottomGap`, the image may rise above the frame bottom (the
 * screen below is covered by a solid fade there anyway).
 */
export function placeBox(frame: Size, image: Size, focal: Point, anchor: Point, allowBottomGap: boolean): Box {
  const size = coverSize(frame, image)
  const x = clamp(anchor.x * frame.w - (focal.x / 100) * size.w, frame.w - size.w, 0)
  const wantY = anchor.y * frame.h - (focal.y / 100) * size.h
  const y = allowBottomGap ? Math.min(0, wantY) : clamp(wantY, frame.h - size.h, 0)
  return { ...size, x, y }
}
