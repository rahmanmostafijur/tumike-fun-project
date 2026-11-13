import { describe, expect, test } from 'vitest'
import { getPack, packs } from '../../packs/index'
import { computeResult } from '../../engine/scoring'
import { PhotoTreatmentSchema } from '../../engine/schema'
import { completeTheme } from '../util'
import { buildCardData } from '../card/cardData'
import { clampCrop, initialCrop, panBy, zoomOf, zoomTo } from './crop'
import { readPhoto, type ImageDecoder } from './decode'
import type { CardPhoto } from './render'
import { ringMarks } from './ring'
import { initialPhotoState, photoReducer, type PhotoAction, type PhotoState } from './state'
import { duotone, photoLook } from './treatment'

const hp = getPack('harry-potter')!
const right = Array.from({ length: 6 }, () => ({ correct: true }))
const lean = [1, 2, 3].map((stage) => ({ stage, weights: { brave: 2 }, dark: false }))
const result = computeResult(hp, 'quick', right, lean)
const character = hp.characters.find((c) => c.id === result.characterId)!
const card = (photo?: CardPhoto | null) => buildCardData({ pack: hp, character, result, lang: 'bn', playerName: 'Rafi', fanBadge: null, photo })
// Stand-in for a treated photo; the card data only carries it through.
const fakePhoto = { src: 'data:image/png;base64,', image: {} as HTMLCanvasElement, ring: 'double' } as CardPhoto

type State = PhotoState<string, string>
const reduce = (s: State, ...actions: PhotoAction<string, string>[]) => actions.reduce((acc, a) => photoReducer(acc, a), s)

describe('no photo leaves the result card unchanged', () => {
  test('without a photo the card shows the monogram and nothing else changes', () => {
    expect(card().photo).toBeNull()
    expect(card(null)).toEqual(card())
    expect(card().monogram).toBe(card(fakePhoto).monogram)
  })

  test('a photo changes only the portrait, never the text on the card', () => {
    const { photo: withP, ...withPhoto } = card(fakePhoto)
    const { photo: withoutP, ...withoutPhoto } = card()
    expect(withP).toBe(fakePhoto)
    expect(withoutP).toBeNull()
    expect(withPhoto).toEqual(withoutPhoto)
  })
})

describe('photo state', () => {
  test('removing a photo restores the monogram', () => {
    const s = reduce(initialPhotoState(), { type: 'picked', source: 'decoded' }, { type: 'done', photo: 'cropped' })
    expect(s.photo).toBe('cropped')
    const removed = photoReducer(s, { type: 'remove' })
    expect(removed.photo).toBeNull()
    expect(card(null).photo).toBeNull()
  })

  test('cancelling the crop keeps what was on the card', () => {
    const withPhoto = initialPhotoState<string, string>('old')
    expect(reduce(withPhoto, { type: 'picked', source: 'new' }, { type: 'cancel' })).toEqual({ photo: 'old', editing: null, error: false })
  })

  test('an undecodable file shows the error and keeps the monogram', async () => {
    const failing: ImageDecoder = () => Promise.reject(new Error('HEIC not supported'))
    const source = await readPhoto(new Blob(['not an image'], { type: 'image/heic' }), failing)
    expect(source).toBeNull()
    const s = photoReducer(initialPhotoState<string, string>(), { type: 'unreadable' })
    expect(s).toEqual({ photo: null, editing: null, error: true })
    expect(card(null).photo).toBeNull()
    // An existing photo also stays put.
    expect(photoReducer(initialPhotoState<string, string>('mine'), { type: 'unreadable' }).photo).toBe('mine')
  })

  test('the next successful pick clears the error', () => {
    const s = reduce(initialPhotoState(), { type: 'unreadable' }, { type: 'picked', source: 'ok' })
    expect(s.error).toBe(false)
  })
})

describe('every pack has a photo treatment', () => {
  for (const pack of packs) {
    test(`${pack.id}: treatment is defined, subtle, and resolves per rarity`, () => {
      expect(PhotoTreatmentSchema.safeParse(pack.theme.photo).success).toBe(true)
      expect(pack.theme.photo.strength).toBeLessThanOrEqual(0.5)
      expect(ringMarks(pack.theme.photo.ring).length).toBeGreaterThan(0)
      const full = completeTheme(pack.theme)
      expect(photoLook(pack.theme, 'legend').highlight).toBe(pack.theme.photo.highlight)
      expect(photoLook(pack.theme, 'dark')).toMatchObject({ highlight: full.dark, frame: full.dark })
      expect(photoLook(pack.theme, 'secret')).toMatchObject({ highlight: full.accent, frame: full.accent })
    })
  }
})

describe('duotone', () => {
  const look = { shadow: '#000000', highlight: '#ffffff', strength: 0.3 }
  test('keeps most of the original colour and never touches alpha', () => {
    const out = duotone(new Uint8ClampedArray([200, 40, 40, 128]), look)
    expect(out[3]).toBe(128)
    expect(out[0]).toBeGreaterThan(out[1]!) // still clearly red
    expect(Math.abs(out[0]! - 200)).toBeLessThanOrEqual(0.3 * 255)
  })
  test('returns new pixels and leaves the input alone', () => {
    const px = new Uint8ClampedArray([10, 20, 30, 255])
    const copy = px.slice()
    expect(duotone(px, look)).not.toBe(px)
    expect(px).toEqual(copy)
  })
})

describe('crop', () => {
  const size = { width: 1600, height: 1200 }
  test('starts as the largest centred square at zoom 1', () => {
    expect(initialCrop(size)).toEqual({ cx: 800, cy: 600, side: 1200 })
    expect(zoomOf(initialCrop(size), size)).toBe(1)
  })
  test('zoom is clamped to 1..4 and the square stays inside the photo', () => {
    expect(zoomOf(zoomTo(initialCrop(size), size, 10), size)).toBe(4)
    expect(zoomOf(zoomTo(initialCrop(size), size, 0.2), size)).toBe(1)
    expect(clampCrop({ cx: -500, cy: 5000, side: 300 }, size)).toEqual({ cx: 150, cy: 1050, side: 300 })
  })
  test('dragging right reveals the left of the photo', () => {
    const zoomed = zoomTo(initialCrop(size), size, 2)
    expect(panBy(zoomed, size, 100, 0, 260).cx).toBeLessThan(zoomed.cx)
  })
})
