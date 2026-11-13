import type { Character, Localized, Theme } from '../engine/schema'

/** The landing heading for the active pack, or the generic one when no pack is active yet. */
export function packHeadline(pack: { headline: Localized } | null | undefined, lang: keyof Localized, generic: string): string {
  return pack ? pack.headline[lang] : generic
}

const THEME_DEFAULTS = { success: '#7CC49A', danger: '#E58A80', dark: '#C9707A' }

/** Fills optional theme tokens with defaults. */
export function completeTheme(theme: Theme): Required<Theme> {
  return {
    ...theme,
    disabled: theme.disabled ?? theme.muted,
    success: theme.success ?? THEME_DEFAULTS.success,
    danger: theme.danger ?? THEME_DEFAULTS.danger,
    dark: theme.dark ?? THEME_DEFAULTS.dark,
  }
}

const BENGALI = /[ঀ-৿]/

export function hasBengali(text: string): boolean {
  return BENGALI.test(text)
}

/** Font class for names, stage and tier labels: Latin uses Cormorant, Bangla uses Anek. */
export function nameFontClass(text: string): string {
  return hasBengali(text) ? 'font-display' : 'font-latin'
}

/** Monogram letters for a character. */
export function monogramOf(character: Character): string {
  if (character.monogram) return character.monogram
  const first = Array.from(character.name.en.trim())[0] ?? '?'
  return first.toUpperCase()
}

/** Light haptic feedback where supported. Silently ignored elsewhere. */
export function haptic(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    // Some browsers throw when vibration is blocked; feedback is optional.
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Applies pack theme tokens as CSS variables (--t-bg, --t-accent, ...). */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(completeTheme(theme))) {
    // Colour tokens only; the photo treatment is read by the photo code directly.
    if (typeof value === 'string') root.style.setProperty(`--t-${kebab(key)}`, value)
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bg)
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
