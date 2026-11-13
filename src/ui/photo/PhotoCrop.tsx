import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useI18n } from '../../i18n/I18n'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import { Icon } from '../components/Icon'
import { MAX_ZOOM, initialCrop, panBy, zoomOf, zoomTo, type Crop } from './crop'
import type { PhotoSource } from './decode'
import { cropToCanvas } from './render'

interface PhotoCropProps {
  source: PhotoSource
  onDone: (cropped: HTMLCanvasElement) => void
  onCancel: () => void
}

const VIEW_MAX = 260
const KEY_STEP = 0.05 // share of the visible square per arrow press
const ZOOM_STEP = 0.2

/** Crop step: the photo inside a circle; drag to move, pinch, wheel or slider to zoom. */
export function PhotoCrop({ source, onDone, onCancel }: PhotoCropProps) {
  const { t } = useI18n()
  const size = { width: source.width, height: source.height }
  const [crop, setCrop] = useState<Crop>(() => initialCrop(size))
  const [view, setView] = useState(VIEW_MAX)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<number | null>(null)

  // Fit the circle on narrow screens.
  useLayoutEffect(() => {
    const fit = () => setView(Math.min(VIEW_MAX, window.innerWidth - 80))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // Draw the visible square into the circle.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const px = Math.round(view * (window.devicePixelRatio || 1))
    canvas.width = px
    canvas.height = px
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source.canvas, crop.cx - crop.side / 2, crop.cy - crop.side / 2, crop.side, crop.side, 0, 0, px, px)
  }, [crop, view, source])

  useEffect(() => {
    areaRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const zoom = zoomOf(crop, size)
  const setZoom = (z: number) => setCrop((c) => zoomTo(c, size, z))

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    pinch.current = null
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const next = { x: e.clientX, y: e.clientY }
    pointers.current.set(e.pointerId, next)
    const all = [...pointers.current.values()]
    if (all.length >= 2) {
      const [a, b] = all as [{ x: number; y: number }, { x: number; y: number }]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinch.current) setCrop((c) => zoomTo(c, size, zoomOf(c, size) * (dist / (pinch.current ?? dist))))
      pinch.current = dist
      return
    }
    setCrop((c) => panBy(c, size, next.x - prev.x, next.y - prev.y, view))
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId)
    pinch.current = null
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = view * KEY_STEP
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }
    const move = moves[e.key]
    if (move) {
      e.preventDefault()
      setCrop((c) => panBy(c, size, move[0], move[1], view))
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      setZoom(zoom + ZOOM_STEP)
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      setZoom(zoom - ZOOM_STEP)
    }
  }

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-bg/90 px-4" role="dialog" aria-modal="true" aria-labelledby="photo-crop-title">
      <div className="flex w-full max-w-[360px] flex-col items-center rounded-[22px] border border-line bg-surface px-5 pt-5 pb-4">
        <h2 id="photo-crop-title" className="font-display text-[19px] text-ink">{t('photo.title')}</h2>
        <p className="mt-1 text-center text-[13.5px] text-muted">{t('photo.hint')}</p>

        <div
          ref={areaRef}
          tabIndex={0}
          role="img"
          aria-label={t('photo.area')}
          className="mt-4 cursor-grab touch-none overflow-hidden rounded-full border-2 border-accent outline-offset-4 select-none active:cursor-grabbing"
          style={{ width: view, height: view }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={(e) => setZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08))}
          onKeyDown={onKeyDown}
        >
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>

        <label className="mt-4 flex w-full items-center gap-3 text-[14px] text-muted">
          <span className="shrink-0">{t('photo.zoom')}</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[var(--t-accent)]"
          />
        </label>

        <div className="mt-4 grid w-full grid-cols-2 gap-2.5">
          <SecondaryButton onClick={onCancel}>{t('photo.cancel')}</SecondaryButton>
          <PrimaryButton onClick={() => onDone(cropToCanvas(source, crop))}>{t('photo.done')}</PrimaryButton>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-[18px] text-muted">
          <Icon name="lock" size={14} className="mt-0.5 shrink-0" />
          <span>{t('photo.privacy')}</span>
        </p>
      </div>
    </div>
  )
}
