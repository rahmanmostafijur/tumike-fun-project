import type { Theme } from '../../engine/schema'
import { completeTheme } from '../util'
import { ICON_PATHS } from '../components/Icon'
import { hasBengali } from '../util'
import { BAND_H, isRare, type CardData } from './cardData'
import { PHOTO_R, ringMarks } from '../photo/ring'
import type { CardPhoto } from '../photo/render'

type FullTheme = Required<Theme>

/**
 * Canvas export of the result card. Mirrors ResultCard.tsx measurement for
 * measurement (in 342px "card units"), then scales to the export size.
 */

export type ExportFormat = 'story' | 'feed'

interface FormatSpec {
  width: number
  height: number
  /** Areas the platform covers; nothing important goes there. */
  safeTop: number
  safeBottom: number
  maxCardWidth: number
  /** Navy veil over the painting behind the card (0 = no painting). */
  backdropDim: number
}

export const FORMATS: Record<ExportFormat, FormatSpec> = {
  story: { width: 1080, height: 1920, safeTop: 250, safeBottom: 340, maxCardWidth: 860, backdropDim: 0.3 },
  feed: { width: 1080, height: 1350, safeTop: 70, safeBottom: 70, maxCardWidth: 880, backdropDim: 0 },
}

const CARD_W = 342
const PAD_X = 24
const INNER_W = CARD_W - PAD_X * 2

const F = {
  display: '"Anek Bangla", "Hind Siliguri", sans-serif',
  body: '"Hind Siliguri", sans-serif',
  latin: '"Cormorant Garamond", Georgia, serif',
}

const FONT_LOADS = [
  `700 24px ${F.display}`,
  `400 24px ${F.body}`,
  `500 24px ${F.body}`,
  `600 24px ${F.body}`,
  `700 24px ${F.latin}`,
]

/** Makes sure webfonts are ready before drawing text on canvas. */
export async function ensureFonts(): Promise<void> {
  if (!('fonts' in document)) return
  const loads = Promise.all(FONT_LOADS.map((f) => document.fonts.load(f, 'তুমি কে Aa 0123'))).then(() => undefined)
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 3500))
  await Promise.race([loads, timeout])
}

type Ctx = CanvasRenderingContext2D

/** Rounded rectangle path. Uses ctx.roundRect where available, with a fallback for older WebViews. */
function rrect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  const rr = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth || !line) line = test
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Latin spaced capitals, drawn letter by letter so spacing works everywhere. */
function spacedWidth(ctx: Ctx, text: string, spacing: number): number {
  return Array.from(text).reduce((w, ch) => w + ctx.measureText(ch).width + spacing, -spacing)
}

function drawSpaced(ctx: Ctx, text: string, x: number, y: number, spacing: number, align: 'left' | 'right' | 'center') {
  const w = spacedWidth(ctx, text, spacing)
  let cx = align === 'left' ? x : align === 'right' ? x - w : x - w / 2
  const prev = ctx.textAlign
  ctx.textAlign = 'left'
  for (const ch of Array.from(text)) {
    ctx.fillText(ch, cx, y)
    cx += ctx.measureText(ch).width + spacing
  }
  ctx.textAlign = prev
}

function star(ctx: Ctx, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - s)
  ctx.lineTo(x + s * 0.2, y - s * 0.2)
  ctx.lineTo(x + s, y)
  ctx.lineTo(x + s * 0.2, y + s * 0.2)
  ctx.lineTo(x, y + s)
  ctx.lineTo(x - s * 0.2, y + s * 0.2)
  ctx.lineTo(x - s, y)
  ctx.lineTo(x - s * 0.2, y - s * 0.2)
  ctx.closePath()
  ctx.fill()
}

function drawIcon(ctx: Ctx, name: keyof typeof ICON_PATHS, x: number, y: number, size: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / 24, size / 24)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.75
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(new Path2D(ICON_PATHS[name]))
  ctx.restore()
}

function pill(ctx: Ctx, x: number, y: number, w: number, h: number) {
  rrect(ctx, x, y, w, h, h / 2)
}

function drawFrame(ctx: Ctx, card: CardData, theme: FullTheme, h: number) {
  const color = card.rarity === 'dark' ? theme.dark : theme.accent
  const rare = isRare(card.rarity)
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color

  ctx.globalAlpha = card.rarity === 'beginner' ? 0.6 : 1
  ctx.lineWidth = 2
    rrect(ctx, 1, 1, CARD_W - 2, h - 2, 21)
  ctx.stroke()

  ctx.globalAlpha = card.rarity === 'beginner' ? 0.35 : card.rarity === 'skilled' ? 0.7 : 1
  ctx.lineWidth = 1
  if (card.rarity === 'dark') ctx.setLineDash([4, 3])
    rrect(ctx, 8.5, 8.5, CARD_W - 17, h - 17, 14.5)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.globalAlpha = 1
  if (rare) {
    ctx.globalAlpha = 0.45
        rrect(ctx, 12.5, 12.5, CARD_W - 25, h - 25, 11.5)
    ctx.stroke()
    ctx.globalAlpha = 1
    for (const [x, y] of [[8, 8], [CARD_W - 8, 8], [8, h - 8], [CARD_W - 8, h - 8]] as const) star(ctx, x, y, 5)
  }
  if (card.rarity === 'skilled') {
    star(ctx, CARD_W / 2, 8, 4)
    star(ctx, CARD_W / 2, h - 8, 4)
  }
  if (card.rarity === 'dark') {
    const thorn = (x: number, y: number, sx: number, sy: number) => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 10 * sx, y + 10 * sy)
      ctx.moveTo(x, y + 5 * sy)
      ctx.lineTo(x + 5 * sx, y + 10 * sy)
      ctx.stroke()
    }
    thorn(13, 13, 1, 1)
    thorn(CARD_W - 13, 13, -1, 1)
    thorn(13, h - 13, 1, -1)
    thorn(CARD_W - 13, h - 13, -1, -1)
  }
  if (card.rarity === 'secret') {
    const pts = [[8, 9], [30, 4], [52, 10], [70, 3], [92, 9], [112, 5]] as const
    const ox = CARD_W / 2 - 60
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 0.75
    ctx.beginPath()
    // Top 13 matches the on-screen card and keeps clear of a long trait pill.
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(ox + x, 13 + y) : ctx.moveTo(ox + x, 13 + y)))
    ctx.stroke()
    ctx.globalAlpha = 1
    pts.forEach(([x, y], i) => {
      ctx.beginPath()
      ctx.arc(ox + x, 13 + y, i % 2 ? 1.6 : 1.1, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  ctx.restore()
}

function drawMonogram(ctx: Ctx, card: CardData, theme: FullTheme, cx: number, cy: number, filled = false) {
  const color = card.rarity === 'dark' ? theme.dark : theme.accent
  const r = 48
  ctx.save()
  if (filled && !card.photo) {
    ctx.globalAlpha = 0.84
    ctx.fillStyle = theme.surface
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  if (card.photo) drawPhoto(ctx, card.photo, color, cx, cy)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  if (card.rarity === 'dark') ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
  if (card.rarity !== 'beginner' && !card.photo) {
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 0.75
    ctx.beginPath()
    ctx.arc(cx, cy, r - 7, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
  if (isRare(card.rarity)) {
    ctx.lineWidth = 1
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2
      const r2 = r + (i % 3 === 0 ? 8 : 5.5)
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * (r + 3), cy + Math.sin(a) * (r + 3))
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
      ctx.stroke()
    }
  }
  if (card.rarity === 'secret') {
    ctx.lineWidth = 1
    ctx.setLineDash([1, 6])
    ctx.beginPath()
    ctx.arc(cx, cy, r + 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(cx, cy - r - 12, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  if (!card.photo) {
    const latin = !hasBengali(card.monogram)
    const size = card.monogram.length > 1 ? (latin ? 36 : 30) : latin ? 48 : 40
    ctx.fillStyle = theme.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${size}px ${latin ? F.latin : F.display}`
    ctx.fillText(card.monogram, cx, cy + (latin ? 1 : size * 0.08))
  }
  ctx.restore()
}

/** The player's photo, clipped to the same circle as on screen, with the pack's ring at its edge. */
function drawPhoto(ctx: Ctx, photo: CardPhoto, color: string, cx: number, cy: number) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, PHOTO_R, 0, Math.PI * 2)
  ctx.clip()
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(photo.image, cx - PHOTO_R, cy - PHOTO_R, PHOTO_R * 2, PHOTO_R * 2)
  ctx.restore()
  ctx.save()
  ctx.strokeStyle = color
  for (const m of ringMarks(photo.ring)) {
    ctx.globalAlpha = m.opacity
    ctx.lineWidth = m.width
    ctx.beginPath()
    if (m.kind === 'circle') {
      ctx.setLineDash(m.dash ? [...m.dash] : [])
      ctx.lineCap = m.dash ? 'round' : 'butt'
      ctx.arc(cx, cy, m.r, 0, Math.PI * 2)
    } else {
      ctx.setLineDash([])
      ctx.moveTo(cx + Math.cos(m.angle) * m.r1, cy + Math.sin(m.angle) * m.r1)
      ctx.lineTo(cx + Math.cos(m.angle) * m.r2, cy + Math.sin(m.angle) * m.r2)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/**
 * Lays out (and when `draw` is true, paints) the card in card units.
 * Returns the card height.
 */
/** The pack's painting across the top of the card, fading into the surface (mirrors .card-band). */
function drawBand(ctx: Ctx, card: CardData, theme: FullTheme, img: HTMLImageElement) {
  const focal = card.band?.focal ?? { x: 50, y: 50 }
  const scale = Math.max(CARD_W / img.naturalWidth, BAND_H / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  const dx = -(dw - CARD_W) * (focal.x / 100)
  const dy = -(dh - BAND_H) * (focal.y / 100)
  ctx.save()
  // Rounded top corners, square bottom exactly at the band height.
  rrect(ctx, 0, 0, CARD_W, BAND_H + 22, 22)
  ctx.clip()
  ctx.beginPath()
  ctx.rect(0, 0, CARD_W, BAND_H)
  ctx.clip()
  ctx.globalAlpha = 0.85
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.globalAlpha = 1
  const fade = ctx.createLinearGradient(0, 0, 0, BAND_H)
  fade.addColorStop(0, `${theme.surface}00`)
  fade.addColorStop(0.42, `${theme.surface}00`)
  fade.addColorStop(1, theme.surface)
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, CARD_W, BAND_H + 1)
  ctx.restore()
}

function labelPill(ctx: Ctx, theme: FullTheme, x: number, y: number, w: number) {
  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.fillStyle = theme.surface
  pill(ctx, x, y, w, 22)
  ctx.fill()
  ctx.restore()
}

function layoutCard(ctx: Ctx, card: CardData, theme: FullTheme, draw: boolean, height = 0, band: HTMLImageElement | null = null): number {
  const color = card.rarity === 'dark' ? theme.dark : theme.accent
  if (draw) {
    ctx.fillStyle = theme.surface
        rrect(ctx, 0, 0, CARD_W, height, 22)
    ctx.fill()
    if (band) drawBand(ctx, card, theme, band)
    drawFrame(ctx, card, theme, height)
  }
  ctx.textBaseline = 'alphabetic'
  let y = 26

  // Top row: tier and trait.
  const tierLatin = !hasBengali(card.tierLabel)
  if (draw) {
    ctx.font = tierLatin ? `700 12px ${F.latin}` : `700 13px ${F.display}`
    const text = tierLatin ? card.tierLabel.toUpperCase() : card.tierLabel
    const tw = tierLatin ? spacedWidth(ctx, text, 2.9) : ctx.measureText(text).width
    if (isRare(card.rarity)) {
      ctx.fillStyle = theme.accent
      pill(ctx, PAD_X, y, tw + 20, 22)
      ctx.fill()
      ctx.fillStyle = theme.onAccent
      if (tierLatin) drawSpaced(ctx, text, PAD_X + 10, y + 15.5, 2.9, 'left')
      else {
        ctx.textAlign = 'left'
        ctx.fillText(text, PAD_X + 10, y + 16)
      }
    } else {
      if (band) labelPill(ctx, theme, PAD_X - 10, y, tw + 20)
      ctx.fillStyle = color
      if (tierLatin) drawSpaced(ctx, text, PAD_X, y + 15.5, 2.9, 'left')
      else {
        ctx.textAlign = 'left'
        ctx.fillText(text, PAD_X, y + 16)
      }
    }
    const traitLabel = card.traitLabel
    if (traitLabel !== null) {
      const traitLatin = !hasBengali(traitLabel)
      ctx.font = traitLatin ? `700 12px ${F.latin}` : `700 13px ${F.display}`
      if (band) {
        const traitW = traitLatin ? spacedWidth(ctx, traitLabel.toUpperCase(), 2.9) : ctx.measureText(traitLabel).width
        labelPill(ctx, theme, CARD_W - PAD_X - traitW - 10, y, traitW + 20)
      }
      ctx.fillStyle = theme.muted
      if (traitLatin) drawSpaced(ctx, traitLabel.toUpperCase(), CARD_W - PAD_X, y + 15.5, 2.9, 'right')
      else {
        ctx.textAlign = 'right'
        ctx.fillText(traitLabel, CARD_W - PAD_X, y + 16)
      }
    }
  }
  y += 22 + 20

  if (draw) drawMonogram(ctx, card, theme, CARD_W / 2, y + 50, band !== null)
  y += 100 + 14

  ctx.textAlign = 'center'
  ctx.font = `400 15px ${F.body}`
  if (draw) {
    ctx.fillStyle = theme.muted
    ctx.fillText(card.youAre, CARD_W / 2, y + 15)
  }
  y += 20 + 4

  // Name: as large as fits, at most two lines.
  const nameLatin = !hasBengali(card.name)
  const family = nameLatin ? F.latin : F.display
  let size = nameLatin ? (card.name.length > 14 ? 34 : 38) : 32
  ctx.font = `700 ${size}px ${family}`
  let lines = [card.name]
  if (ctx.measureText(card.name).width > INNER_W) {
    lines = wrap(ctx, card.name, INNER_W)
    while (lines.some((l) => ctx.measureText(l).width > INNER_W) && size > 24) {
      size -= 2
      ctx.font = `700 ${size}px ${family}`
    }
  }
  const lh = size * 1.08
  if (draw) {
    ctx.fillStyle = theme.text
    lines.forEach((l, i) => ctx.fillText(l, CARD_W / 2, y + lh * (i + 1) - lh * 0.22))
  }
  y += lh * lines.length + 12

  // Match pill and fan badge on one row when they fit; no row when both are hidden.
  const match = card.match
  ctx.font = `600 13px ${F.body}`
  const matchW = match !== null ? ctx.measureText(match).width + 24 : 0
  ctx.font = `400 13px ${F.body}`
  const badgeW = card.badge ? ctx.measureText(card.badge).width + 24 + 19 : 0
  const hasRow = match !== null || Boolean(card.badge)
  const oneRow = match === null || !card.badge || matchW + 8 + badgeW <= INNER_W
  const drawMatch = (x: number, yy: number) => {
    if (match === null) return
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    pill(ctx, x + 0.5, yy + 0.5, matchW - 1, 25)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.font = `600 13px ${F.body}`
    ctx.textAlign = 'center'
    ctx.fillText(match, x + matchW / 2, yy + 17.5)
  }
  const drawBadge = (x: number, yy: number) => {
    if (!card.badge) return
    ctx.strokeStyle = theme.line
    ctx.setLineDash([3, 3])
    pill(ctx, x + 0.5, yy + 0.5, badgeW - 1, 25)
    ctx.stroke()
    ctx.setLineDash([])
    drawIcon(ctx, 'book', x + 12, yy + 6.5, 13, theme.muted)
    ctx.fillStyle = theme.muted
    ctx.font = `400 13px ${F.body}`
    ctx.textAlign = 'left'
    ctx.fillText(card.badge, x + 31, yy + 17.5)
  }
  if (draw && hasRow) {
    if (oneRow) {
      const gap = match !== null && card.badge ? 8 : 0
      const x0 = CARD_W / 2 - (matchW + gap + badgeW) / 2
      drawMatch(x0, y)
      drawBadge(x0 + matchW + gap, y)
    } else {
      drawMatch(CARD_W / 2 - matchW / 2, y)
      drawBadge(CARD_W / 2 - badgeW / 2, y + 34)
    }
  }
  if (hasRow) y += oneRow ? 26 : 26 + 8 + 26
  y += 18

  // Divider with a diamond.
  if (draw) {
    ctx.fillStyle = theme.line
    ctx.fillRect(PAD_X, y, INNER_W / 2 - 8, 1)
    ctx.fillRect(CARD_W / 2 + 8, y, INNER_W / 2 - 8, 1)
    ctx.beginPath()
    ctx.moveTo(CARD_W / 2, y - 4)
    ctx.lineTo(CARD_W / 2 + 4, y + 0.5)
    ctx.lineTo(CARD_W / 2, y + 5)
    ctx.lineTo(CARD_W / 2 - 4, y + 0.5)
    ctx.fill()
  }
  y += 1 + 16

  // Strength / weakness rows.
  const valueX = PAD_X + 84 + 12
  const valueW = CARD_W - PAD_X - valueX
  const row = (label: string, value: string) => {
    ctx.font = `400 15px ${F.body}`
    const vLines = wrap(ctx, value, valueW)
    if (draw) {
      ctx.fillStyle = theme.text
      ctx.textAlign = 'left'
      vLines.forEach((l, i) => ctx.fillText(l, valueX, y + 15.5 + i * 21))
      ctx.fillStyle = theme.accent
      if (card.lang === 'bn') {
        ctx.font = `700 14px ${F.display}`
        ctx.fillText(label, PAD_X, y + 16)
      } else {
        ctx.font = `700 12px ${F.latin}`
        drawSpaced(ctx, label.toUpperCase(), PAD_X, y + 15, 2.9, 'left')
      }
    }
    y += vLines.length * 21
  }
  row(card.strengthLabel, card.strength)
  y += 10
  row(card.weaknessLabel, card.weakness)
  y += 16

  // Squad line with a tag icon.
  ctx.font = `700 17px ${F.display}`
  const sLines = wrap(ctx, card.squad, INNER_W - 26)
  if (draw) {
    ctx.fillStyle = theme.accent
    sLines.forEach((l, i) => {
      const w = ctx.measureText(l).width
      const x = CARD_W / 2 - (w + (i === 0 ? 24 : 0)) / 2
      if (i === 0) drawIcon(ctx, 'tag', x, y + 4, 16, theme.accent)
      ctx.textAlign = 'left'
      ctx.fillText(l, x + (i === 0 ? 24 : 0), y + 18 + i * 24)
    })
  }
  y += sLines.length * 24 + 18

  // Footer.
  if (draw) {
    ctx.fillStyle = theme.line
    ctx.fillRect(PAD_X, y, INNER_W, 1)
    ctx.fillStyle = theme.accent
    ctx.font = `700 15px ${F.display}`
    ctx.textAlign = 'left'
    ctx.fillText(card.wordmark, PAD_X, y + 31)
    ctx.fillStyle = theme.muted
    ctx.font = `400 12.5px ${F.body}`
    ctx.textAlign = 'right'
    ctx.fillText(card.site, CARD_W - PAD_X, y + 30)
  }
  y += 12 + 24 + 18
  return Math.ceil(y)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load backdrop'))
    img.src = src
  })
}

/** Draws an image cover-fit across the whole canvas. */
function drawCover(ctx: Ctx, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

interface RenderArgs {
  card: CardData
  theme: Theme
  /** The pack's painting, drawn behind the card in the story format. */
  backdrop?: string
  format: ExportFormat
}

/** Renders the card to a PNG blob at the export size. */
export async function renderCardImage({ card, theme: partialTheme, backdrop, format }: RenderArgs): Promise<Blob> {
  await ensureFonts()
  const theme = completeTheme(partialTheme)
  const band = card.band ? await loadImage(card.band.src).catch(() => null) : null
  const spec = FORMATS[format]
  const canvas = document.createElement('canvas')
  canvas.width = spec.width
  canvas.height = spec.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')

  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, spec.width, spec.height)

  if (backdrop && spec.backdropDim > 0) {
    try {
      drawCover(ctx, await loadImage(backdrop), spec.width, spec.height)
      ctx.globalAlpha = spec.backdropDim
      ctx.fillStyle = theme.bg
      ctx.fillRect(0, 0, spec.width, spec.height)
      ctx.globalAlpha = 1
    } catch {
      // The plain theme background is a fine fallback; never block sharing.
    }
  }

  // Measure, fit inside the safe area, then paint.
  const h = layoutCard(ctx, card, theme, false)
  const availH = spec.height - spec.safeTop - spec.safeBottom - 40
  const scale = Math.min(spec.maxCardWidth / CARD_W, availH / h)
  const x = (spec.width - CARD_W * scale) / 2
  const y = spec.safeTop + (spec.height - spec.safeTop - spec.safeBottom - h * scale) / 2
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  layoutCard(ctx, card, theme, true, h, band)
  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode PNG'))), 'image/png')
  })
}
