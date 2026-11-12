# তুমি কে? (Tumi Ke?)

A mobile-first "which character are you?" quiz across the stories a generation grew up with. Free, ad-free, fan-made.
Answer 9 questions in about 90 seconds (or play the 21-question full journey). Your result arrives as a letter, and you can share the card straight to your Facebook story.

- Vite + React + TypeScript + Tailwind CSS v4. Fully static: no backend, no login.
- Packs are plain data validated with zod. The scoring engine is pure functions, tested with vitest.
- Result cards are drawn on canvas as 1080×1920 (story) and 1080×1350 (feed) PNGs.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (engine + pack validation)
npm run build      # type-check and build to dist/
npm run preview    # serve the production build
```

Deploy `dist/` to any static host. Netlify reads `netlify.toml`, and Vercel detects Vite automatically.

The app name, wordmark, seal monogram and site URL live in one place: [`src/config.ts`](src/config.ts).

> On Windows, run npm from a path whose drive letter matches the one on disk (`D:\…`, not `d:\…`). Otherwise vitest can load two copies of itself and report "Cannot read properties of undefined (reading 'config')".

### Handy URLs

| URL | What it does |
| --- | --- |
| `/?pack=sample-space` | Opens an unlisted pack (here, the placeholder that proves the engine is generic). |
| `/?preview=hermione` | **Dev only.** Jumps straight to a result card. Add `&reveal=1` to watch the letter reveal. |

## Project layout

```
src/
  config.ts          app name, wordmark, seal monogram, site URL
  engine/            pure game logic, no React except the timer hook
    schema.ts        zod pack schema + definePack()
    selection.ts     builds quick/full quizzes, swap lifeline
    scoring.ts       tier, trait, dark side, secret, match %
    lifelines.ts     "remove two" picker
    game.ts          game state transitions
    timer.ts         pausable clock + useCountdown hook
  packs/
    index.ts         registry (auto-discovers every pack folder)
    coming-soon.ts   disabled tiles on the landing page
    harry-potter/    the full pack (with background.webp and owl.webp)
    sample-space/    tiny placeholder pack
  ui/
    App.tsx          screen flow
    screens/         Landing, FanSince, Question, Reveal, Result, Collection, ErrorScreen
    card/            ResultCard (DOM), exportCard (canvas PNG), share (Web Share / download)
    components/      buttons, icons, timer ring, monogram…
    scenery/         shared painted background, ambient effects, pan geometry
  i18n/              bn/en UI strings, provider, Bangla digits
  storage/           localStorage: language, collection
```

`engine/` and `ui/` never import a specific pack, only the registry.

## How a game works

- **Quick mode** (default): 9 questions = 6 knowledge + 3 scenario, spread across the pack's stages from first to last.
- **Full journey**: every stage gets 2 knowledge + 1 scenario, and knowledge difficulty rises per stage. The Harry Potter pack has 7 stages, so 21 questions.
- Knowledge questions have a 20 s timer, and running out counts as wrong. Scenario questions are untimed. Everyone finishes.
- Three lifelines, each usable once: remove two wrong options, freeze the timer, swap the question.
- **Scoring:**
  - Tier comes from the knowledge score: below 40% is Beginner, 40–74% is Skilled, 75% and up is Legend.
  - Trait comes from scenario trait weights. On a tie, the latest stage wins.
  - Character = tier × trait.
  - Choosing dark-flagged options in 40% or more of scenarios gives the dark character for your tier.
  - A 100% score in the full journey gives the secret character.
  - Match % (60–99) shows how dominant the winning trait was.
- The fan-since answer is only a badge on the card. It never affects scoring.

## Landing carousel and coming-soon packs

- **The carousel:** the landing page shows every listed pack in a swipeable carousel built on native CSS scroll-snap, ordered by each pack's `order`.
- **Switching packs:** swiping to a pack cross-fades the shared background to its painting (about 400 ms) and transitions every theme colour together. Only that pack's ambient effects run.
- **Loading:** the active painting loads first. The two neighbours are preloaded after a short delay, and the rest load only when you get near them.
- **Deep links:** `#<pack-id>` and `?pack=<pack-id>` open a pack directly. The last viewed pack is remembered in localStorage.
- **Coming-soon packs:** a pack with `status: 'coming-soon'` needs only `id`, `title`, `tagline`, `theme`, `background` (with effects), and optionally `order` and `icon`. It has no questions and can never start a game: its primary button is a disabled "শীঘ্রই আসছে" and the full-journey button is hidden.

```ts
import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'game-of-thrones', status: 'coming-soon', order: 5,
  title: { bn: 'Game of Thrones', en: 'Game of Thrones' },
  tagline: { bn: '…', en: '…' },
  theme: { bg, surface, line, accent, onAccent, text, muted },   // disabled/success/danger/dark are optional
  background: { src: background, width: 941, height: 1672, rest: { x: 50, y: 12 }, effects: { … } },
})
```

To make a coming-soon pack playable, switch it to `definePack` and add the playable fields described below.

`src/packs/contrast.test.ts` checks every pack's colours for 4.5:1 contrast: text and muted text on the background and surface, the accent on both, and button text on the accent. A pack with weak colours fails the test.

## Adding a new universe

Adding a pack is adding **one folder**. No other code changes are needed: the registry picks up every `src/packs/*/index.ts` automatically and validates it with zod when the app starts.

1. Create `src/packs/my-pack/index.ts`:

   ```ts
   import { definePack } from '../../engine/schema'

   export default definePack({
     id: 'my-pack',                        // lowercase slug, unique
     title: { bn: 'তিন গোয়েন্দা', en: 'Tin Goyenda' },
     primaryLang: 'bn',                    // packs can be Bangla-first
     listed: true,                         // false = only reachable via ?pack=my-pack
     icon: { viewBox: '0 0 32 32', markup: '<circle cx="16" cy="16" r="8"/>' },
     theme: { /* see below */ },
     stageLabel: { bn: 'অধ্যায়', en: 'Chapter' },
     stages: [ /* one per stage, see below */ ],
     background: { /* optional painting, see below */ },
     lifelines: { fifty: {…}, freeze: {…}, swap: {…} },
     traits: [{ id: 'brave', label: { bn: 'সাহসী', en: 'Brave' } }, …],
     tiers: { thresholds: { skilled: 40, legend: 75 }, labels: { beginner, skilled, legend, dark, secret } },
     characters: [ … ],
     fanSince: { question, options: [{ id, label, badge }] },
     reveal: { lines, address, anonymous, envelope: { paper, flap, ink, seal, sealInk } },
     knowledge: [ … ],
     scenarios: [ … ],
   })
   ```

2. Run `npm test`. The pack test fails with a precise message if anything is missing (for example "expected exactly one skilled brave character").

3. To remove it from the landing page's coming-soon tiles, delete its entry from `src/packs/coming-soon.ts`.

### Theme

Every colour is a `#RRGGBB` token. The UI reads them as CSS variables (`--t-bg`, `--t-accent`, …), so the whole app re-themes per pack.

| token | used for |
| --- | --- |
| `bg`, `surface`, `line` | page background, cards and options, 1px borders |
| `accent` | primary buttons, selected state, frames |
| `text`, `muted`, `disabled` | text levels. Keep 4.5:1 contrast against `bg` and `surface`. |
| `onAccent` | text on accent buttons |
| `success`, `danger` | correct/wrong answers, timer urgency |
| `dark` | frame colour for dark-side cards |

### Stages and the painted background

`stages` is the list of journey stages (`{ id, label: { bn, en } }`). The number of stages sets the length of the full journey.

`background` is optional. Without it the app sits on the plain theme colour (see `sample-space`). With it, one shared layer shows the painting behind every screen:

```ts
import background from './background.webp'   // hashed and cached by Vite
import owl from './owl.webp'

background: {
  src: background, width: 941, height: 1672,   // intrinsic image size
  rest: { x: 55, y: 12 },                      // kept in view on landing / reveal / result
  journey: [{ x: 70, y: 66 }, …, { x: 58, y: 11 }],  // pan path, first stage to last
  effects: {
    stars: [{ x: 6, y: 3, size: 2 }],          // twinkling points
    steam: [{ x: 61.5, y: 63.6 }],             // puffs rising from this point
    glows: [{ x: 80.2, y: 10.6, w: 30, h: 17, color: '#FFF1CF', strength: 0.35 }],
  },
  flyer: {                                     // optional sprite crossing the sky
    src: owl, aspect: 480 / 479, width: 22,    // width in % of the screen
    altitude: 10.6, jitter: 4,                 // flight height (% of image), random change (% of screen)
    carry: { x: 74.6, y: 65.2 },               // where the carried letter sits in the sprite
    passSeconds: 14, pauseSeconds: [8, 12],
  },
}
```

- Every position is a percentage of the image. The effects live in the same cover-fit box as the image, so they stay aligned on any screen size.
- **Journey pan:** the view pans along `journey` as the player advances: per stage in the full journey, per question in quick mode.
- **Fades per screen:**
  - Landing: clear at the top, navy over roughly the lower 55%.
  - Questions: the top 30% is a window onto the painting.
  - Result and collection: heavily darkened.
- **Flyer:** it flies only when its altitude is on screen. In the reveal it swoops in and drops the envelope at the `carry` point.
- **Story export:** it draws the painting behind the card.
- **Preload:** name the file `background.webp`. The background of the default pack (`DEFAULT_PACK_ID` in `src/config.ts`) is preloaded with its hashed URL.
- **Motion:** animations use transform and opacity only and pause while the tab is hidden. Under `prefers-reduced-motion` everything is static.
- **Image budget:** keep paintings at or under about 250 KB as WebP and sprites at or under about 60 KB. Keep the source PNGs in `art-src/`, outside `public/`, so they never ship.

### Characters

- A pack needs one `regular` character for every tier × trait, one `dark` character per tier, and exactly one `secret` character.
- Each character needs `name`, `description`, `strength`, `weakness` and `squad` (a line that invites tagging friends), all in `bn` and `en`.
- `monogram` is optional (1–3 letters). Bangla names are rendered with Anek Bangla automatically, and Latin names with Cormorant Garamond.

### Questions

- **Knowledge:** `{ id, stage, memory?, prompt, options: [4], answer }`.
  - `stage` (1-based) is also the difficulty.
  - `memory` is an optional nostalgic opener shown above the question.
  - Options are shuffled at runtime.
  - The schema requires at least `max(6, 2 × stages) + 1` questions. Aim for 4 per stage plus spares for the swap lifeline.
- **Scenario:** `{ id, stage, prompt, options: [4 × { text, traits: { traitId: weight }, dark? }] }`.
  - Make every option tempting.
  - Mark the cunning or power-hungry choices `dark: true`.

### Language

Every user-facing string has `bn` and `en`. In Bangla, keep character, spell and place names in their original script. Bangla digits are applied automatically to UI numbers.

## Accessibility and motion

- Real buttons and labelled inputs throughout. Keyboard: `1–4` or `A–D` answers, and `Esc` opens the quit dialog.
- Tap targets are 44 px or larger, and text contrast is at least 4.5:1.
- Animations use transform and opacity only and pause while the tab is hidden. `prefers-reduced-motion` makes the background fully static and replaces the letter reveal with a short fade.

## Legal

This is an unofficial, non-commercial fan project. It uses no official images, logos, fonts or music. Characters appear only as monograms and abstract shapes. All question and character text is written fresh.
