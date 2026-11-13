import type { PhotoRing, Rarity, Theme } from '../../engine/schema'
import { completeTheme } from '../util'

/** The resolved look for one card: duotone colours, strength, ring style and frame colour. */
export interface PhotoLook {
  shadow: string
  highlight: string
  strength: number
  ring: PhotoRing
  /** Colour of the card's frame, used for the ring drawn at the photo's edge. */
  frame: string
}

/**
 * The pack's photo treatment for a card of the given rarity. Dark cards use
 * the dark frame accent and secret cards the secret frame accent as the
 * duotone highlight, so the photo always sits in the card's own colour.
 */
export function photoLook(theme: Theme, rarity: Rarity): PhotoLook {
  const full = completeTheme(theme)
  const frame = rarity === 'dark' ? full.dark : full.accent
  const highlight = rarity === 'dark' || rarity === 'secret' ? frame : theme.photo.highlight
  return { shadow: theme.photo.shadow, highlight, strength: theme.photo.strength, ring: theme.photo.ring, frame }
}

type Rgb = readonly [number, number, number]

export function hexToRgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Lays a duotone over RGBA pixels and returns new pixels. Each pixel's
 * brightness picks a colour between `shadow` and `highlight`; that colour is
 * mixed over the original by `strength`, so most of the real photo remains.
 * Alpha is untouched.
 */
export function duotone(pixels: Uint8ClampedArray, look: Pick<PhotoLook, 'shadow' | 'highlight' | 'strength'>): Uint8ClampedArray {
  const [sr, sg, sb] = hexToRgb(look.shadow)
  const [hr, hg, hb] = hexToRgb(look.highlight)
  const s = look.strength
  const out = new Uint8ClampedArray(pixels.length)
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0
    const g = pixels[i + 1] ?? 0
    const b = pixels[i + 2] ?? 0
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    out[i] = r + (sr + (hr - sr) * lum - r) * s
    out[i + 1] = g + (sg + (hg - sg) * lum - g) * s
    out[i + 2] = b + (sb + (hb - sb) * lum - b) * s
    out[i + 3] = pixels[i + 3] ?? 255
  }
  return out
}
