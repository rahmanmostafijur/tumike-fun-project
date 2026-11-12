/**
 * Small, defensive localStorage wrapper. Storage can be missing or throw
 * (private mode, blocked cookies); every call degrades to a safe default.
 */

export type Lang = 'bn' | 'en'

const LANG_KEY = 'tumike:lang'
const PACK_KEY = 'tumike:pack'
const NUDGE_KEY = 'tumike:nudged'
const collectionKey = (packId: string) => `tumike:collection:${packId}`

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function getLang(): Lang | null {
  const v = read(LANG_KEY)
  return v === 'bn' || v === 'en' ? v : null
}

export function setLang(lang: Lang): void {
  write(LANG_KEY, lang)
}

/** The last pack viewed in the landing carousel. */
export function getLastPack(): string | null {
  return read(PACK_KEY)
}

export function setLastPack(id: string): void {
  write(PACK_KEY, id)
}

/** Whether the one-time "this swipes" nudge has been shown. */
export function hasSeenNudge(): boolean {
  return read(NUDGE_KEY) === '1'
}

export function markNudgeSeen(): void {
  write(NUDGE_KEY, '1')
}

/** Unlocked character ids for a pack. Ignores anything malformed. */
export function getCollection(packId: string): string[] {
  const raw = read(collectionKey(packId))
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Adds a character to the collection and returns the new list. */
export function addToCollection(packId: string, characterId: string): string[] {
  const current = getCollection(packId)
  if (current.includes(characterId)) return current
  const next = [...current, characterId]
  write(collectionKey(packId), JSON.stringify(next))
  return next
}
