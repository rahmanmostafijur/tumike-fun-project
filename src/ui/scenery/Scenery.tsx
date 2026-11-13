import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import type { AnyPack, Background, Point } from '../../engine/schema'
import { cx } from '../util'
import { placeBox, pointAlong, type Box, type Size } from './geometry'
import { particleSpecs } from './particles'
import type { SceneryKind, SceneryView } from './view'

/** Where the focal point should sit on screen, per view (fractions of the frame). */
const ANCHORS: Record<SceneryKind, Point> = {
  landing: { x: 0.5, y: 0.2 },
  journey: { x: 0.5, y: 0.15 },
  reveal: { x: 0.5, y: 0.2 },
  dim: { x: 0.5, y: 0.25 },
}
const FADES: readonly SceneryKind[] = ['landing', 'journey', 'reveal', 'dim']
const FIRST_FLIGHT_MS = 2500
const CROSSFADE_MS = 400
/** The flyer never rises into the header row (px from the top of the screen). */
const HEADER_CLEARANCE = 80
/** ...and stays in the upper sky band (fraction of the screen height). */
const SKY_BOTTOM = 0.3

function useFrameSize(ref: RefObject<HTMLDivElement | null>): Size | null {
  const [size, setSize] = useState<Size | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Pauses every CSS animation while the tab is hidden. */
function usePauseWhenHidden(): void {
  useEffect(() => {
    const sync = () => document.documentElement.classList.toggle('anim-paused', document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])
}

/** Every pack's ambient particles, from the shared per-kind specs (see particles.ts). */
function Particles({ particles, box }: { particles: Background['effects']['particles']; box: Size }) {
  return (
    <>
      {particleSpecs(particles, box).map((p) => (
        <span key={p.key} className={p.className} style={p.style} />
      ))}
    </>
  )
}

function Effects({ effects, box }: { effects: Background['effects']; box: Box }) {
  return (
    <>
      {effects.glows.map((g, i) => (
        <span
          key={`g${i}`}
          className={cx('amb amb-glow', g.mode === 'flicker' && 'is-flicker')}
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.w}%`, height: `${g.h}%`, '--glow': g.color, '--glow-a': g.strength, animationDelay: `-${i * 2.7}s` } as CSSProperties}
        />
      ))}
      {effects.stars.map((s, i) => (
        <span
          key={`s${i}`}
          className="amb amb-star"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `-${(i * 0.73) % 4}s`, animationDuration: `${3 + (i % 4) * 0.8}s` }}
        />
      ))}
      {effects.steam.map((p, i) => (
        <span key={`p${i}`} className="amb-steam-src" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          {[0, 1, 2, 3].map((j) => (
            <i key={j} className="amb amb-puff" style={{ animationDelay: `-${j * 1.45}s` }} />
          ))}
        </span>
      ))}
      <Particles particles={effects.particles} box={box} />
    </>
  )
}

interface FlyerProps {
  flyer: NonNullable<Background['flyer']>
  frame: Size
  /** Screen y the flight path passes through (the flyer's altitude on the image). */
  pathY: number
}

/** One pass across the sky, a random pause, then another pass at a slightly different height. */
function Flyer({ flyer, frame, pathY }: FlyerProps) {
  const [pass, setPass] = useState(0)
  const [flying, setFlying] = useState(false)
  const [jitter, setJitter] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    timer.current = window.setTimeout(() => setFlying(true), FIRST_FLIGHT_MS)
    return () => window.clearTimeout(timer.current)
  }, [])

  const onEnd = useCallback(() => {
    setFlying(false)
    const [a, b] = flyer.pauseSeconds
    const pause = (Math.min(a, b) + Math.random() * Math.abs(b - a)) * 1000
    timer.current = window.setTimeout(() => {
      setJitter((Math.random() * 2 - 1) * flyer.jitter)
      setPass((p) => p + 1)
      setFlying(true)
    }, pause)
  }, [flyer])

  // Only fly when the flight path (around the moon) is on screen and below the
  // header; otherwise skip this pass and try again after the next pause.
  const onScreen = pathY > HEADER_CLEARANCE && pathY < frame.h * SKY_BOTTOM
  useEffect(() => {
    if (flying && !onScreen) onEnd()
  }, [flying, onScreen, onEnd])

  if (!flying || !onScreen) return null
  const w = (frame.w * flyer.width) / 100
  const h = w / flyer.aspect
  const wanted = pathY - h / 2 + (jitter / 100) * frame.h
  const top = Math.min(Math.max(wanted, HEADER_CLEARANCE), frame.h * SKY_BOTTOM - h)
  return (
    <div
      key={pass}
      className="flyer"
      style={{ top, width: w, '--from': `${-w * 1.15}px`, '--to': `${frame.w + w * 0.15}px`, animationDuration: `${flyer.passSeconds}s` } as CSSProperties}
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <div className="flyer-bob">
        <img src={flyer.src} alt="" width={480} height={Math.round(480 / flyer.aspect)} draggable={false} />
      </div>
    </div>
  )
}

interface LayerState {
  key: number
  id: string
  bg?: Background
  loaded: boolean
}

interface SceneLayerProps {
  layerKey: number
  bg: Background
  frame: Size
  view: SceneryView
  active: boolean
  visible: boolean
  reduced: boolean
  onLoaded: (key: number) => void
}

/** One pack's painting with its effects, in a cover-fit box. */
function SceneLayer({ layerKey, bg, frame, view, active, visible, reduced, onLoaded }: SceneLayerProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const focal = view.kind === 'journey' && bg.journey ? pointAlong(bg.journey, view.progress) : bg.rest
  const box = placeBox(frame, { w: bg.width, h: bg.height }, focal, ANCHORS[view.kind], view.kind === 'journey')

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) onLoaded(layerKey)
  }, [layerKey, onLoaded])

  return (
    <div className={cx('scenery-layer', !active && 'is-paused')} style={{ opacity: visible ? 1 : 0 }}>
      <div className="scenery-box" style={{ width: box.w, height: box.h, transform: `translate3d(${box.x}px, ${box.y}px, 0)` }}>
        <img
          ref={imgRef}
          className="scenery-img"
          src={bg.src}
          alt=""
          width={bg.width}
          height={bg.height}
          decoding="async"
          fetchPriority={active ? 'high' : 'low'}
          draggable={false}
          onLoad={() => onLoaded(layerKey)}
        />
        {active && <Effects effects={bg.effects} box={box} />}
      </div>
      {active && bg.flyer && !reduced && view.kind !== 'reveal' && (
        <Flyer flyer={bg.flyer} frame={frame} pathY={box.y + (bg.flyer.altitude / 100) * box.h} />
      )}
    </div>
  )
}

interface SceneryProps {
  pack: AnyPack
  view: SceneryView
}

/**
 * The shared background behind every screen. Each pack brings its own
 * painting and ambient effects; switching packs cross-fades between them
 * (the new painting fades in once it has loaded). Per-screen fades keep the
 * UI readable. Packs without a background get the plain theme colour.
 */
export function Scenery({ pack, view }: SceneryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useFrameSize(ref)
  const reduced = useReducedMotion()
  usePauseWhenHidden()
  const counter = useRef(0)
  const [layers, setLayers] = useState<LayerState[]>(() => [{ key: 0, id: pack.id, bg: pack.background, loaded: !pack.background }])

  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1]
      if (top && top.id === pack.id) return prev
      counter.current += 1
      const next: LayerState = { key: counter.current, id: pack.id, bg: pack.background, loaded: !pack.background }
      // Keep only the painting currently on screen underneath the incoming one.
      const showing = prev.filter((l) => l.loaded).slice(-1)
      return [...showing, next]
    })
  }, [pack.id, pack.background])

  const markLoaded = useCallback((key: number) => {
    setLayers((prev) => (prev.some((l) => l.key === key && !l.loaded) ? prev.map((l) => (l.key === key ? { ...l, loaded: true } : l)) : prev))
  }, [])

  const newest = layers[layers.length - 1]

  // Once the newest painting has faded in, drop the ones underneath.
  useEffect(() => {
    if (!newest?.loaded || layers.length < 2) return
    const id = window.setTimeout(() => setLayers((prev) => prev.slice(-1)), CROSSFADE_MS + 60)
    return () => window.clearTimeout(id)
  }, [newest?.loaded, newest?.key, layers.length])

  return (
    <div ref={ref} className={cx('scenery', reduced && 'is-static')} aria-hidden="true">
      {frame &&
        layers.map((l) =>
          l.bg ? (
            <SceneLayer
              key={l.key}
              layerKey={l.key}
              bg={l.bg}
              frame={frame}
              view={view}
              active={l === newest}
              visible={l === newest ? l.loaded : !newest?.loaded}
              reduced={reduced}
              onLoaded={markLoaded}
            />
          ) : null,
        )}
      {FADES.map((kind) => (
        <div key={kind} className={`scenery-fade fade-${kind}`} style={{ opacity: view.kind === kind ? 1 : 0 }} />
      ))}
    </div>
  )
}
