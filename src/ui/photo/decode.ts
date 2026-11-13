/** Long side of the photo kept for cropping. A 12 MP phone photo shrinks to about 2 MP. */
export const MAX_PHOTO_SIDE = 1600

/** File types offered by the picker. Phones convert other formats to JPEG on the way. */
export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp'

/** A decoded, upright, downscaled photo ready for cropping. Lives in memory only. */
export interface PhotoSource {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

interface Decoded {
  image: CanvasImageSource
  width: number
  height: number
  release: () => void
}

export type ImageDecoder = (file: Blob) => Promise<Decoded>
export type SourceMaker = (decoded: Decoded) => PhotoSource

/**
 * Decodes in the browser. `imageOrientation: 'from-image'` applies the EXIF
 * orientation, so phone photos come out upright. Falls back to an <img> on a
 * local object URL (also EXIF-aware in current browsers). Nothing is uploaded.
 */
export const decodeImage: ImageDecoder = async (file) => {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { image: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
    } catch {
      // Fall through to the <img> path, which some browsers decode more formats with.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return { image: img, width: img.naturalWidth, height: img.naturalHeight, release: () => undefined }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Draws the decoded photo onto a canvas no larger than MAX_PHOTO_SIDE. */
export const downscaleToCanvas: SourceMaker = ({ image, width, height }) => {
  const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return { canvas, width: canvas.width, height: canvas.height }
}

/** Opens a picked file, or returns null when the browser cannot decode it. */
export async function readPhoto(file: Blob, decode: ImageDecoder = decodeImage, toSource: SourceMaker = downscaleToCanvas): Promise<PhotoSource | null> {
  let decoded: Decoded
  try {
    decoded = await decode(file)
  } catch {
    return null
  }
  try {
    if (decoded.width < 1 || decoded.height < 1) return null
    return toSource(decoded)
  } catch {
    return null
  } finally {
    decoded.release()
  }
}
