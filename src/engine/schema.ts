import { z } from 'zod'
import { questionSplit } from './selection'

/**
 * Pack schema. A pack is plain data: everything a universe needs to run
 * (theme, stages, background, characters, questions, copy). The engine and UI only ever
 * read packs through this shape, via the registry in src/packs/index.ts.
 */

export const LocalizedSchema = z.object({
  bn: z.string().min(1),
  en: z.string().min(1),
})
export type Localized = z.infer<typeof LocalizedSchema>

export const TIERS = ['beginner', 'skilled', 'legend'] as const
export const TierSchema = z.enum(TIERS)
export type Tier = z.infer<typeof TierSchema>

export const RARITIES = ['beginner', 'skilled', 'legend', 'dark', 'secret'] as const
export type Rarity = (typeof RARITIES)[number]

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'expected a #RRGGBB colour')
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'expected a lowercase slug')

export const ThemeSchema = z.object({
  bg: hex,
  surface: hex,
  line: hex,
  accent: hex,
  text: hex,
  muted: hex,
  disabled: hex.optional(),
  /** Text colour on top of the accent (primary buttons). */
  onAccent: hex,
  /** The tokens below are optional; the UI fills sensible defaults. */
  success: hex.optional(),
  danger: hex.optional(),
  /** Frame colour for dark-side characters. */
  dark: hex.optional(),
})
export type Theme = z.infer<typeof ThemeSchema>

/** Small inline SVG icon (landing tiles). Draws in currentColor. */
export const SvgArtSchema = z.object({
  viewBox: z.string().regex(/^-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/),
  markup: z.string().min(1),
})
export type SvgArt = z.infer<typeof SvgArtSchema>

/** One stage of the journey (a school year, a season...). */
export const StageSchema = z.object({
  id: slug,
  label: LocalizedSchema,
})
export type Stage = z.infer<typeof StageSchema>

const pct = z.number().min(0).max(100)
/** A point on the background image, in percent of its width (x) and height (y). */
export const PointSchema = z.object({ x: pct, y: pct })
export type Point = z.infer<typeof PointSchema>

/**
 * Painted background plus ambient effects. All positions are percentages of
 * the image, so they stay aligned at every screen size.
 */
export const BackgroundSchema = z.object({
  /** Image URL. Import the file from the pack folder so it is hashed and cached. */
  src: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Point kept in view on the landing, reveal, result and collection screens. */
  rest: PointSchema,
  /** Points the view pans through, from the first stage to the last (playable packs). */
  journey: z.array(PointSchema).min(2).optional(),
  /** Point shown in the painted band at the top of the result card. Defaults to `rest`. */
  cardFocal: PointSchema.optional(),
  effects: z
    .object({
      /** Twinkling points. `size` in px. */
      stars: z.array(PointSchema.extend({ size: z.number().positive().max(8) })).default([]),
      /** Sources of soft rising puffs (chimneys, cauldrons). */
      steam: z.array(PointSchema).default([]),
      /** Soft light that pulses slowly. `w`/`h` in percent of the image. */
      glows: z
        .array(PointSchema.extend({ w: pct, h: pct, color: hex, strength: z.number().min(0).max(1), mode: z.enum(['pulse', 'flicker']).default('pulse') }))
        .default([]),
      /** Scene-wide particles: falling snow, drifting leaves, thin smoke in the sky. */
      particles: z.array(z.object({ kind: z.enum(['snow', 'leaves', 'smoke']), count: z.number().int().min(1).max(60) })).default([]),
    })
    .default({ stars: [], steam: [], glows: [], particles: [] }),
  /** Optional sprite that crosses the sky now and then, and delivers the result. */
  flyer: z
    .object({
      src: z.string().min(1),
      /** Width / height of the sprite image. */
      aspect: z.number().positive(),
      /** Sprite width in percent of the screen width. */
      width: z.number().min(5).max(60),
      /** Height on the image the flight passes through (percent of image height). */
      altitude: pct,
      /** Random height change per pass, in percent of the screen height. */
      jitter: z.number().min(0).max(20),
      /** Where the carried item sits in the sprite (percent of the sprite). */
      carry: PointSchema,
      passSeconds: z.number().min(4).max(40),
      pauseSeconds: z.tuple([z.number().min(0), z.number().min(0)]),
    })
    .optional(),
})
export type Background = z.infer<typeof BackgroundSchema>

export const KnowledgeQuestionSchema = z.object({
  id: z.string().min(1),
  /** 1-based stage, which is also the difficulty (1 = easiest). */
  stage: z.number().int().min(1),
  /** Optional nostalgic opener shown above the question. */
  memory: LocalizedSchema.optional(),
  prompt: LocalizedSchema,
  options: z.array(LocalizedSchema).length(4),
  /** Index of the correct option. Options are shuffled at runtime. */
  answer: z.number().int().min(0).max(3),
})
export type KnowledgeQuestion = z.infer<typeof KnowledgeQuestionSchema>

export const ScenarioOptionSchema = z.object({
  text: LocalizedSchema,
  traits: z.record(z.string(), z.number().positive()),
  dark: z.boolean().optional(),
})
export type ScenarioOption = z.infer<typeof ScenarioOptionSchema>

export const ScenarioQuestionSchema = z.object({
  id: z.string().min(1),
  /** 1-based stage the scenario belongs to (used to place it in the story). */
  stage: z.number().int().min(1),
  prompt: LocalizedSchema,
  options: z.array(ScenarioOptionSchema).length(4),
})
export type ScenarioQuestion = z.infer<typeof ScenarioQuestionSchema>

export const CharacterSchema = z.object({
  id: slug,
  kind: z.enum(['regular', 'dark', 'secret']),
  tier: TierSchema.optional(),
  trait: z.string().optional(),
  name: LocalizedSchema,
  /** 1-3 characters for the monogram ring. Defaults to the first letter. */
  monogram: z.string().min(1).max(3).optional(),
  description: LocalizedSchema,
  strength: LocalizedSchema,
  weakness: LocalizedSchema,
  /** A line that invites tagging friends. */
  squad: LocalizedSchema,
})
export type Character = z.infer<typeof CharacterSchema>

export const TraitSchema = z.object({ id: slug, label: LocalizedSchema })
export type Trait = z.infer<typeof TraitSchema>

export const FanSinceSchema = z.object({
  question: LocalizedSchema,
  options: z
    .array(z.object({ id: slug, label: LocalizedSchema, badge: LocalizedSchema }))
    .min(2)
    .max(4),
})
export type FanSince = z.infer<typeof FanSinceSchema>

/** Copy every reveal sequence needs. */
const RevealCopy = {
  /** One or two short lines shown while the result arrives. */
  lines: z.array(LocalizedSchema).min(1).max(2),
  /** Hint shown while the sequence waits for a tap. */
  hint: LocalizedSchema,
  /** Screen-reader label of the tap target. */
  tapLabel: LocalizedSchema,
}

/** A letter delivered by the pack's flyer (or sliding in); tap the wax seal to open it. */
export const LetterRevealSchema = z.object({
  kind: z.literal('letter'),
  ...RevealCopy,
  /** Address written on the envelope. `{name}` is replaced by the player's name. */
  address: LocalizedSchema,
  /** Used when the player left the name empty. */
  anonymous: LocalizedSchema,
  envelope: z.object({ paper: hex, flap: hex, ink: hex, seal: hex, sealInk: hex }),
})

/** A paper bird flies in; tap it and it unfolds into the card. */
export const OrigamiRevealSchema = z.object({
  kind: z.literal('origami'),
  ...RevealCopy,
  /** `front` is the bird's main colour, `back` the shaded side, `crease` the fold lines. */
  paper: z.object({ front: hex, back: hex, crease: hex }),
})

/** A motorhome rolls in; tap its door, pale smoke clears and the card is inside. */
export const MotorhomeRevealSchema = z.object({
  kind: z.literal('motorhome'),
  ...RevealCopy,
  van: z.object({ body: hex, stripe: hex, door: hex, window: hex, smoke: hex }),
})

/** A raven brings a sealed scroll; tap the seal and the scroll unrolls into the card. */
export const ScrollRevealSchema = z.object({
  kind: z.literal('scroll'),
  ...RevealCopy,
  scroll: z.object({ paper: hex, roller: hex, seal: hex, sealInk: hex, raven: hex, rim: hex }),
})

/** Moonlight brightens and a folded letter drifts down; tap it and it unfolds into the card. */
export const MoonlightRevealSchema = z.object({
  kind: z.literal('moonlight'),
  ...RevealCopy,
  letter: z.object({ paper: hex, ink: hex, glow: hex }),
})

/** A flashlight beam sweeps the scene and lands on a visiting card; tap it and it turns over into the card. */
export const FlashlightRevealSchema = z.object({
  kind: z.literal('flashlight'),
  ...RevealCopy,
  /** `mark` is printed large on the visiting card, `caption` under it. */
  card: z.object({ paper: hex, ink: hex, beam: hex, mark: z.string().min(1).max(6), caption: LocalizedSchema }),
})

export const RevealSchema = z.discriminatedUnion('kind', [
  LetterRevealSchema, OrigamiRevealSchema, MotorhomeRevealSchema, ScrollRevealSchema, MoonlightRevealSchema, FlashlightRevealSchema,
])
export type Reveal = z.infer<typeof RevealSchema>
export type LetterReveal = z.infer<typeof LetterRevealSchema>
export type OrigamiReveal = z.infer<typeof OrigamiRevealSchema>
export type MotorhomeReveal = z.infer<typeof MotorhomeRevealSchema>
export type ScrollReveal = z.infer<typeof ScrollRevealSchema>
export type MoonlightReveal = z.infer<typeof MoonlightRevealSchema>
export type FlashlightReveal = z.infer<typeof FlashlightRevealSchema>

/** How many knowledge and scenario questions a mode asks. */
export const QuestionSplitSchema = z
  .object({ knowledge: z.number().int().min(0).max(30), scenario: z.number().int().min(0).max(30) })
  .refine((s) => s.knowledge + s.scenario >= 3, 'a mode needs at least 3 questions')

export const PackSchema = z
  .object({
    status: z.literal('playable').default('playable'),
    id: slug,
    title: LocalizedSchema,
    /** One line shown on the landing carousel card. */
    tagline: LocalizedSchema.optional(),
    /** Position on the landing carousel (lower comes first). */
    order: z.number().int().default(100),
    /** Packs are listed on the landing page unless set to false. */
    listed: z.boolean().default(true),
    /** Language the pack was written in first. */
    primaryLang: z.enum(['bn', 'en']),
    icon: SvgArtSchema,
    theme: ThemeSchema,
    stageLabel: LocalizedSchema,
    stages: z.array(StageSchema).min(3).max(12),
    /**
     * Knowledge / scenario split per mode. Defaults: quick 6 + 3, full journey
     * 2 + 1 per stage. Personality-led packs can ask more scenarios.
     */
    modes: z.object({ quick: QuestionSplitSchema.optional(), full: QuestionSplitSchema.optional() }).optional(),
    /**
     * `full`: every tier x trait slot has exactly one character, plus one dark
     * character per tier. `partial`: a smaller roster; empty slots fall back to
     * the nearest filled one when scoring.
     */
    roster: z.enum(['full', 'partial']).default('full'),
    /** Optional painted background. Without it the app uses the plain theme colour. */
    background: BackgroundSchema.optional(),
    lifelines: z.object({ fifty: LocalizedSchema, freeze: LocalizedSchema, swap: LocalizedSchema }),
    traits: z.array(TraitSchema).min(2).max(8),
    tiers: z.object({
      /** Knowledge % at which each tier starts. Below `skilled` is beginner. */
      thresholds: z.object({ skilled: z.number().min(1).max(99), legend: z.number().min(2).max(100) }),
      labels: z.object({
        beginner: LocalizedSchema,
        skilled: LocalizedSchema,
        legend: LocalizedSchema,
        dark: LocalizedSchema,
        secret: LocalizedSchema,
      }),
    }),
    characters: z.array(CharacterSchema),
    fanSince: FanSinceSchema,
    reveal: RevealSchema,
    knowledge: z.array(KnowledgeQuestionSchema),
    scenarios: z.array(ScenarioQuestionSchema),
  })
  .superRefine((pack, ctx) => {
    const issue = (message: string, path: (string | number)[] = []) =>
      ctx.addIssue({ code: 'custom', message, path })

    const traitIds = new Set(pack.traits.map((t) => t.id))
    const stageCount = pack.stages.length

    if (pack.tiers.thresholds.skilled >= pack.tiers.thresholds.legend) {
      issue('skilled threshold must be below legend threshold', ['tiers', 'thresholds'])
    }

    const seen = new Set<string>()
    const unique = (id: string, path: (string | number)[]) => {
      if (seen.has(id)) issue(`duplicate id "${id}"`, path)
      seen.add(id)
    }
    pack.characters.forEach((c, i) => unique(`char:${c.id}`, ['characters', i]))
    pack.knowledge.forEach((q, i) => unique(`q:${q.id}`, ['knowledge', i]))
    pack.scenarios.forEach((q, i) => unique(`q:${q.id}`, ['scenarios', i]))

    checkRoster(pack, traitIds, issue)

    pack.knowledge.forEach((q, i) => {
      if (q.stage > stageCount) issue(`stage ${q.stage} does not exist`, ['knowledge', i, 'stage'])
    })
    pack.scenarios.forEach((q, i) => {
      if (q.stage > stageCount) issue(`stage ${q.stage} does not exist`, ['scenarios', i, 'stage'])
      q.options.forEach((o, j) => {
        const keys = Object.keys(o.traits)
        if (keys.length === 0) issue('scenario options need at least one trait weight', ['scenarios', i, 'options', j])
        keys.forEach((k) => {
          if (!traitIds.has(k)) issue(`unknown trait "${k}"`, ['scenarios', i, 'options', j, 'traits'])
        })
      })
    })

    // Enough questions for both modes, plus at least one spare for the swap lifeline.
    const quick = questionSplit(pack, 'quick')
    const full = questionSplit(pack, 'full')
    if (full.knowledge + full.scenario < stageCount) issue('the full journey must give every stage at least one question', ['modes', 'full'])
    const spare = (n: number) => (n > 0 ? n + 1 : 0)
    const needKnowledge = spare(Math.max(quick.knowledge, full.knowledge))
    const needScenarios = spare(Math.max(quick.scenario, full.scenario))
    if (pack.knowledge.length < needKnowledge) {
      issue(`need at least ${needKnowledge} knowledge questions`, ['knowledge'])
    }
    if (pack.scenarios.length < needScenarios) {
      issue(`need at least ${needScenarios} scenario questions`, ['scenarios'])
    }
  })

type Issue = (message: string, path?: (string | number)[]) => void

/**
 * Roster rules. Full roster: exactly one regular per tier x trait and one dark
 * per tier. Partial roster: at most one per slot, at least one regular. Both:
 * at least one secret; several secrets each need their own trait, which
 * decides who the secret is.
 */
function checkRoster(pack: { roster: 'full' | 'partial'; characters: readonly Character[] }, traitIds: ReadonlySet<string>, issue: Issue) {
  const full = pack.roster === 'full'
  const chars = pack.characters
  for (const tier of TIERS) {
    for (const trait of traitIds) {
      const n = chars.filter((c) => c.kind === 'regular' && c.tier === tier && c.trait === trait).length
      if (full ? n !== 1 : n > 1) issue(`expected ${full ? 'exactly' : 'at most'} one ${tier} ${trait} character, found ${n}`, ['characters'])
    }
    const dark = chars.filter((c) => c.kind === 'dark' && c.tier === tier).length
    if (full ? dark !== 1 : dark > 1) issue(`expected ${full ? 'exactly' : 'at most'} one dark ${tier} character, found ${dark}`, ['characters'])
  }
  if (!chars.some((c) => c.kind === 'regular')) issue('a pack needs at least one regular character', ['characters'])
  const secrets = chars.filter((c) => c.kind === 'secret')
  if (secrets.length === 0) issue('a pack needs a secret character', ['characters'])
  if (secrets.length > 1) {
    const traits = secrets.map((c) => c.trait)
    if (traits.some((t) => !t || !traitIds.has(t)) || new Set(traits).size !== traits.length) {
      issue('several secret characters each need their own known trait', ['characters'])
    }
  }
  chars.forEach((c, i) => {
    if (c.kind === 'regular' && (!c.tier || !c.trait || !traitIds.has(c.trait))) {
      issue('regular characters need a tier and a known trait', ['characters', i])
    }
    if (c.kind === 'dark' && !c.tier) issue('dark characters need a tier', ['characters', i])
  })
}

export type PackInput = z.input<typeof PackSchema>
/** A playable pack: questions, characters and everything a game needs. */
export type Pack = z.output<typeof PackSchema>

/**
 * A coming-soon pack: just enough to appear in the landing carousel with its
 * own painting and colours. It has no questions and can never start a game.
 */
export const TeaserPackSchema = z.object({
  status: z.literal('coming-soon'),
  id: slug,
  title: LocalizedSchema,
  tagline: LocalizedSchema,
  order: z.number().int().default(100),
  listed: z.boolean().default(true),
  icon: SvgArtSchema.optional(),
  theme: ThemeSchema,
  background: BackgroundSchema,
})
export type TeaserPackInput = z.input<typeof TeaserPackSchema>
export type TeaserPack = z.output<typeof TeaserPackSchema>

/** Any pack shown on the landing page. */
export type AnyPack = Pack | TeaserPack

export function isPlayable(pack: AnyPack): pack is Pack {
  return pack.status === 'playable'
}

/** Identity helper so pack files get type checking and autocompletion. */
export function definePack(pack: PackInput): PackInput {
  return pack
}

export function defineTeaser(pack: TeaserPackInput): TeaserPackInput {
  return pack
}
