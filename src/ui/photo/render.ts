import type { PhotoRing } from '../../engine/schema'
import type { Crop } from './crop'
import type { PhotoSource } from './decode'
import { duotone, type PhotoLook } from './treatment'

/** Pixel size of the cropped square. Enough for the largest export (about 3x the 100-unit monogram). */
export const PORTRAIT_PX = 480

/** The photo as it appears on the card: treated pixels, shown on screen and drawn into exports. */
export interface CardPhoto {
  /** In-memory data URL for the on-screen card. */
  src: string
  /** The very same pixels, drawn into the exported images. */
  image: HTMLCanvasElement
  ring: PhotoRing
}

function canvas2d(px: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')
  return { canvas, ctx }
}

/** Cuts the chosen square out of the photo. */
export function cropToCanvas(source: PhotoSource, crop: Crop, px: number = PORTRAIT_PX): HTMLCanvasElement {
  const { canvas, ctx } = canvas2d(px)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source.canvas, crop.cx - crop.side / 2, crop.cy - crop.side / 2, crop.side, crop.side, 0, 0, px, px)
  return canvas
}

/** Applies the pack's treatment for this card to the cropped photo. */
export function treatPhoto(cropped: HTMLCanvasElement, look: PhotoLook): CardPhoto {
  const { canvas, ctx } = canvas2d(cropped.width)
  ctx.drawImage(cropped, 0, 0)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  pixels.data.set(duotone(pixels.data, look))
  ctx.putImageData(pixels, 0, 0)
  return { src: canvas.toDataURL('image/png'), image: canvas, ring: look.ring }
}
