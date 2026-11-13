import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { packs } from '../../packs/index'
import { BackgroundSchema, PARTICLE_KINDS } from '../../engine/schema'
import { PARTICLE_CLASSES, particleSpecs, rand } from './particles'

const box = { w: 360, h: 640 }
const css = readFileSync(new URL('../../index.css', import.meta.url), 'utf8')
const effectsOf = (id: string) => packs.find((p) => p.id === id)!.background!.effects

/** Each pack's own signature motion, on top of the shared glows and journey pan. */
const SIGNATURE: Record<string, string> = {
  'game-of-thrones': 'snow',
  'harry-potter': 'sparks',
  'money-heist': 'notes',
  'breaking-bad': 'haze',
  'himu-misir-ali': 'fireflies',
  'tin-goyenda': 'glints',
}
const PLAYABLE = Object.keys(SIGNATURE)

describe('every pack has ambient motion at the same level as Game of Thrones', () => {
  for (const id of PLAYABLE) {
    test(`${id}: has its own signature particles, a flickering light and a sane budget`, () => {
      const fx = effectsOf(id)
      const kinds = fx.particles.map((p) => p.kind)
      expect(kinds).toContain(SIGNATURE[id])
      const total = fx.particles.reduce((n, p) => n + p.count, 0)
      // Haze is a few large blobs, so the floor is low; snow is the busiest at 36.
      expect(total).toBeGreaterThanOrEqual(6)
      expect(total).toBeLessThanOrEqual(40)
      expect(fx.glows.some((g) => g.mode === 'flicker')).toBe(true)
      expect(particleSpecs(fx.particles, box)).toHaveLength(total)
    })
  }

  test('no two packs share a signature motion (themed, not copied)', () => {
    expect(new Set(Object.values(SIGNATURE)).size).toBe(PLAYABLE.length)
    for (const id of PLAYABLE) {
      for (const other of PLAYABLE.filter((o) => o !== id)) {
        expect(effectsOf(other).particles.map((p) => p.kind)).not.toContain(SIGNATURE[id])
      }
    }
  })
})

describe('one particle system', () => {
  test('every kind has a class, keyframes and a reduced-motion rule', () => {
    for (const kind of PARTICLE_KINDS) {
      const cls = PARTICLE_CLASSES[kind]
      expect(css).toContain(`.${cls} {`)
      expect(css).toMatch(new RegExp(`\\.is-static \\.${cls}[,\\s{]`))
      const made = particleSpecs([{ kind, count: 3 }], box)
      expect(made.every((p) => p.className.split(' ').includes(cls))).toBe(true)
    }
  })

  test('ambient keyframes animate only transform and opacity', () => {
    const blocks = [...css.matchAll(/@keyframes (amb-[\w-]+) \{([\s\S]*?\})\s*\}/g)]
    expect(blocks.length).toBeGreaterThanOrEqual(10)
    for (const [, name, body] of blocks) {
      const props = [...body!.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1])
      expect(props.every((p) => p === 'transform' || p === 'opacity'), `${name}: ${props.join(',')}`).toBe(true)
    }
  })

  test('specs are stable between renders', () => {
    for (const id of PLAYABLE) {
      expect(particleSpecs(effectsOf(id).particles, box)).toEqual(particleSpecs(effectsOf(id).particles, box))
    }
  })

  test('an area keeps particles inside it', () => {
    const area = { x: 40, y: 30, w: 20, h: 10 }
    for (const kind of ['sparks', 'haze', 'fireflies', 'glints'] as const) {
      for (const p of particleSpecs([{ kind, count: 12, area }], box)) {
        const left = parseFloat(String(p.style.left))
        const top = parseFloat(String(p.style.top))
        expect(left).toBeGreaterThanOrEqual(40)
        expect(left).toBeLessThanOrEqual(60)
        expect(top).toBeGreaterThanOrEqual(30)
        expect(top).toBeLessThanOrEqual(40)
      }
    }
  })

  test('an area outside the image does not validate', () => {
    const bg = { src: 'x.webp', width: 10, height: 10, rest: { x: 50, y: 50 } }
    expect(BackgroundSchema.safeParse({ ...bg, effects: { particles: [{ kind: 'glints', count: 3, area: { x: 60, y: 0, w: 50, h: 10 } }] } }).success).toBe(false)
    expect(BackgroundSchema.safeParse({ ...bg, effects: { particles: [{ kind: 'glints', count: 3, area: { x: 50, y: 0, w: 50, h: 10 } }] } }).success).toBe(true)
  })
})

describe('Game of Thrones and the older particles are unchanged', () => {
  // The placement code as it was before the shared system, for comparison.
  function legacy(particles: readonly { kind: 'snow' | 'leaves' | 'smoke'; count: number }[]) {
    return particles.flatMap((p, k) =>
      Array.from({ length: p.count }, (_, i) => {
        const r1 = rand(i, k + 1), r2 = rand(i, k + 7), r3 = rand(i, k + 13)
        if (p.kind === 'snow') return { left: r1 * 100, top: 0, dur: 11 + r2 * 9, delay: r3 * 20 }
        if (p.kind === 'leaves') return { left: r1 * 45, top: r2 * 25, dur: 15 + r3 * 8, delay: r2 * 22 }
        return { left: -15 + r1 * 35, top: 5 + i * 7 + r2 * 4, dur: 34 + r3 * 14, delay: r2 * 30 }
      }),
    )
  }
  const num = (v: unknown) => parseFloat(String(v))

  for (const [id, legacyKinds] of [['game-of-thrones', ['snow']], ['himu-misir-ali', ['leaves']], ['money-heist', ['smoke']]] as const) {
    test(`${id}: ${legacyKinds.join(', ')} placed exactly as before`, () => {
      const old = effectsOf(id).particles.filter((p) => (legacyKinds as readonly string[]).includes(p.kind)) as { kind: 'snow' | 'leaves' | 'smoke'; count: number }[]
      const before = legacy(old)
      const now = particleSpecs(old, box)
      expect(now).toHaveLength(before.length)
      now.forEach((p, i) => {
        expect(num(p.style.left)).toBeCloseTo(before[i]!.left, 9)
        expect(num(p.style.top ?? 0)).toBeCloseTo(before[i]!.top, 9)
        expect(num(p.style.animationDuration)).toBeCloseTo(before[i]!.dur, 9)
        expect(num(String(p.style.animationDelay).slice(1))).toBeCloseTo(before[i]!.delay, 9)
      })
    })
  }
})
