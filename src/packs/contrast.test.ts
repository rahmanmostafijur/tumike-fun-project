import { describe, expect, test } from 'vitest'
import { allPacks } from './index'

/** WCAG relative luminance of a #RRGGBB colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

const AA = 4.5

describe('theme contrast (WCAG AA 4.5:1)', () => {
  for (const pack of allPacks) {
    const t = pack.theme
    const pairs: [string, string, string][] = [
      ['text on background', t.text, t.bg],
      ['text on surface', t.text, t.surface],
      ['muted on background', t.muted, t.bg],
      ['muted on surface', t.muted, t.surface],
      ['accent on background', t.accent, t.bg],
      ['accent on surface', t.accent, t.surface],
      ['button text on accent', t.onAccent, t.accent],
    ]
    for (const [label, fg, bg] of pairs) {
      test(`${pack.id}: ${label}`, () => {
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA)
      })
    }
  }
})
