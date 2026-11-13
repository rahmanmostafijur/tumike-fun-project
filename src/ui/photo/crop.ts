/** A square region of the source photo, in source pixels. */
export interface Crop {
  cx: number
  cy: number
  side: number
}

export interface Size {
  width: number
  height: number
}

export const MAX_ZOOM = 4

const shortSide = (size: Size) => Math.min(size.width, size.height)

/** Keeps the square inside the photo and no larger than its short side. */
export function clampCrop(crop: Crop, size: Size): Crop {
  const side = Math.min(Math.max(crop.side, shortSide(size) / MAX_ZOOM), shortSide(size))
  const half = side / 2
  return {
    side,
    cx: Math.min(Math.max(crop.cx, half), size.width - half),
    cy: Math.min(Math.max(crop.cy, half), size.height - half),
  }
}

/** The largest centred square: zoom 1. */
export function initialCrop(size: Size): Crop {
  return { cx: size.width / 2, cy: size.height / 2, side: shortSide(size) }
}

/** 1 = the whole short side fits the circle; MAX_ZOOM = closest. */
export function zoomOf(crop: Crop, size: Size): number {
  return shortSide(size) / crop.side
}

/** Zoom around the current centre. */
export function zoomTo(crop: Crop, size: Size, zoom: number): Crop {
  const z = Math.min(Math.max(zoom, 1), MAX_ZOOM)
  return clampCrop({ ...crop, side: shortSide(size) / z }, size)
}

/** Move the photo by a distance measured on screen, in a viewport `viewPx` wide. */
export function panBy(crop: Crop, size: Size, dxPx: number, dyPx: number, viewPx: number): Crop {
  const perPx = crop.side / viewPx
  // Dragging the photo right shows more of its left side.
  return clampCrop({ ...crop, cx: crop.cx - dxPx * perPx, cy: crop.cy - dyPx * perPx }, size)
}
