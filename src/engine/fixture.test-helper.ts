import { PackSchema, type Pack, type PackInput } from './schema'

const L = (s: string) => ({ bn: s, en: s })
const art = { viewBox: '0 0 10 10', markup: '<path d="M0 0L10 10"/>' }
const hex = '#123456'
const w = (t: Record<string, number>): Record<string, number> => t

export const TRAITS = ['brave', 'clever'] as const

function character(id: string, extra: Partial<PackInput['characters'][number]>) {
  return {
    id,
    kind: 'regular' as const,
    name: L(id),
    description: L('d'),
    strength: L('s'),
    weakness: L('w'),
    squad: L('q'),
    ...extra,
  }
}

/** A tiny valid pack: 4 stages, 2 traits, 5 knowledge per stage, 2 scenarios per stage. */
export function makeFixturePack(stages = 4): Pack {
  const characters = [
    ...(['beginner', 'skilled', 'legend'] as const).flatMap((tier) => [
      ...TRAITS.map((trait) => character(`${tier}-${trait}`, { tier, trait })),
      character(`${tier}-dark`, { kind: 'dark', tier }),
    ]),
    character('secret', { kind: 'secret' }),
  ]
  const knowledge = Array.from({ length: stages * 5 }, (_, i) => ({
    id: `k${i}`,
    stage: (i % stages) + 1,
    prompt: L(`k${i}`),
    options: [L('a'), L('b'), L('c'), L('d')],
    answer: i % 4,
  }))
  const scenarios: PackInput["scenarios"] = Array.from({ length: stages * 2 }, (_, i) => ({
    id: `s${i}`,
    stage: (i % stages) + 1,
    prompt: L(`s${i}`),
    options: [
      { text: L('a'), traits: w({ brave: 2 }) },
      { text: L('b'), traits: w({ clever: 2 }) },
      { text: L('c'), traits: w({ brave: 1, clever: 1 }) },
      { text: L('d'), traits: w({ clever: 1 }), dark: true },
    ],
  }))
  const input: PackInput = {
    id: 'fixture',
    title: L('Fixture'),
    headline: L('Who are you in the fixture?'),
    primaryLang: 'en',
    icon: art,
    theme: { bg: hex, surface: hex, line: hex, accent: hex, text: hex, muted: hex, disabled: hex, onAccent: hex, success: hex, danger: hex, dark: hex },
    stageLabel: L('Stage'),
    stages: Array.from({ length: stages }, (_, i) => ({ id: `stage-${i}`, label: L(`Stage ${i}`) })),
    lifelines: { fifty: L('50'), freeze: L('freeze'), swap: L('swap') },
    traits: TRAITS.map((id) => ({ id, label: L(id) })),
    tiers: {
      thresholds: { skilled: 40, legend: 75 },
      labels: { beginner: L('B'), skilled: L('S'), legend: L('L'), dark: L('D'), secret: L('X') },
    },
    characters,
    fanSince: { question: L('q'), options: [{ id: 'a', label: L('a'), badge: L('A') }, { id: 'b', label: L('b'), badge: L('B') }] },
    reveal: {
      kind: 'letter',
      hint: L('tap'),
      tapLabel: L('open'),
      lines: [L('late')],
      address: L('{name}'),
      anonymous: L('you'),
      envelope: { paper: hex, flap: hex, ink: hex, seal: hex, sealInk: hex },
    },
    knowledge,
    scenarios,
  }
  return PackSchema.parse(input)
}
