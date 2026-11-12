import { PackSchema, TeaserPackSchema, type AnyPack, type Pack } from '../engine/schema'

/**
 * Pack registry. Every folder in src/packs with an index.ts default-exporting
 * a pack is picked up automatically, so adding a universe needs no code changes
 * anywhere else. Packs are validated with zod; broken packs are reported and
 * skipped, never crash the app.
 */

export interface PackError {
  path: string
  message: string
}

const modules = import.meta.glob<{ default: unknown }>('./*/index.ts', { eager: true })

const isTeaser = (raw: unknown) => typeof raw === 'object' && raw !== null && (raw as { status?: unknown }).status === 'coming-soon'

function load(): { all: AnyPack[]; errors: PackError[] } {
  const all: AnyPack[] = []
  const errors: PackError[] = []
  for (const [path, mod] of Object.entries(modules)) {
    const parsed = isTeaser(mod.default) ? TeaserPackSchema.safeParse(mod.default) : PackSchema.safeParse(mod.default)
    if (parsed.success) {
      all.push(parsed.data)
    } else {
      const first = parsed.error.issues[0]
      errors.push({ path, message: first ? `${first.path.join('.')}: ${first.message}` : 'invalid pack' })
    }
  }
  all.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
  return { all, errors }
}

const loaded = load()

/** Every valid pack, playable or coming soon, in carousel order. */
export const allPacks: readonly AnyPack[] = loaded.all
export const packErrors: readonly PackError[] = loaded.errors

/** Playable packs only (anything that can start a game). */
export const packs: readonly Pack[] = allPacks.filter((p): p is Pack => p.status === 'playable')

/** Packs shown in the landing carousel. */
export const listedPacks: readonly AnyPack[] = allPacks.filter((p) => p.listed)

export function getPack(id: string | null | undefined): Pack | undefined {
  return id ? packs.find((p) => p.id === id) : undefined
}

export function getAnyPack(id: string | null | undefined): AnyPack | undefined {
  return id ? allPacks.find((p) => p.id === id) : undefined
}
