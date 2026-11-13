import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'

export default definePack({
  id: 'tin-goyenda',
  order: 1,
  primaryLang: 'bn',
  title: { bn: 'তিন গোয়েন্দা', en: 'Tin Goyenda' },
  headline: { bn: 'তিন গোয়েন্দার দুনিয়ায় তুমি কে?', en: 'Who are you in the world of Tin Goyenda?' },
  tagline: { bn: 'তিন কিশোর গোয়েন্দার দলে তুমি কোন জন?', en: 'Which of the three young detectives are you?' },
  icon: { viewBox: '0 0 32 32', markup: '<circle cx="13" cy="13" r="7"/><path d="M18.5 18.5 L26 26"/>' },
  theme: {
    bg: '#0C1F24', surface: '#1B2C31', line: '#354549', accent: '#F0A545', onAccent: '#0C1F24',
    text: '#EAF3EF', muted: '#ACB8B6', disabled: '#919E9E',
    // Player photo: Lamp-lit amber over sea-fog teal, inside one clean rim like a magnifying glass.
    photo: { shadow: '#0C1F24', highlight: '#F0A545', strength: 0.3, ring: 'single' },
  },
  // Four cases; 16 knowledge questions (4 per case) and 16 scenarios (4 per case).
  stageLabel: { bn: 'কেস', en: 'Case' },
  stages: [
    { id: 'headquarters', label: { bn: 'জঞ্জালের নিচে হেডকোয়ার্টার', en: 'Headquarters under the junk' } },
    { id: 'bicycle-trail', label: { bn: 'সাইকেলে সূত্রের খোঁজে', en: 'Chasing clues by bicycle' } },
    { id: 'foggy-shore', label: { bn: 'কুয়াশা-ঢাকা সাগরপাড়', en: 'The foggy shore' } },
    { id: 'cliff-house', label: { bn: 'পাহাড়চূড়ার রহস্যময় বাড়ি', en: 'The mystery house on the cliff' } },
  ],
  modes: { quick: { knowledge: 3, scenario: 6 }, full: { knowledge: 8, scenario: 10 } },
  roster: 'partial',
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 45, y: 12 },
    // The band on the result card shows the lit house on the cliff; the moon stays out of it so it never doubles the backdrop moon.
    cardFocal: { x: 38, y: 25 },
    // Case 1 opens by the bicycles and the salvage yard; the last case reaches the house on the cliff.
    journey: [
      { x: 34, y: 70 },
      { x: 70, y: 58 },
      { x: 62, y: 38 },
      { x: 28, y: 17 },
    ],
    effects: {
      stars: [{ x: 60, y: 4, size: 1.5 }, { x: 70, y: 9, size: 2 }, { x: 92, y: 14, size: 1.5 }, { x: 40, y: 3, size: 1.5 }],
      glows: [
        { x: 53, y: 55, w: 8, h: 5, color: '#FFC46B', strength: 0.55, mode: 'flicker' },
        { x: 78, y: 59, w: 18, h: 8, color: '#FFB45A', strength: 0.32 },
        { x: 30, y: 80, w: 9, h: 5, color: '#FFE7A8', strength: 0.45 },
        { x: 82, y: 8, w: 12, h: 7, color: '#FFF1CF', strength: 0.2 },
      ],
      // Sunset glints on the sea, mist at the cliff foot (home) and night mist over the yard (early questions).
      particles: [
        { kind: 'glints', count: 10, area: { x: 52, y: 34, w: 46, h: 6 } },
        { kind: 'glints', count: 8, area: { x: 5, y: 40, w: 90, h: 16 } },
        { kind: 'smoke', count: 3, area: { x: 0, y: 30, w: 70, h: 10 } },
        { kind: 'smoke', count: 3, area: { x: 0, y: 62, w: 100, h: 20 } },
      ],
    },
  },
  lifelines: {
    fifty: { bn: 'দুই সন্দেহ বাদ', en: 'Clear two suspects' },
    freeze: { bn: 'ঠোঁটে চিমটি', en: 'Pinch and think' },
    swap: { bn: 'নতুন সূত্র', en: 'New lead' },
  },
  traits: [
    { id: 'brave', label: { bn: 'সাহসী', en: 'Brave' } },
    { id: 'clever', label: { bn: 'বুদ্ধিমান', en: 'Clever' } },
    { id: 'loyal', label: { bn: 'বিশ্বস্ত', en: 'Loyal' } },
    { id: 'ambitious', label: { bn: 'উচ্চাকাঙ্ক্ষী', en: 'Ambitious' } },
    { id: 'funny', label: { bn: 'মজার', en: 'Funny' } },
    { id: 'mysterious', label: { bn: 'রহস্যময়', en: 'Mysterious' } },
  ],
  tiers: {
    thresholds: { skilled: 40, legend: 75 },
    labels: {
      beginner: { bn: 'বিগিনার', en: 'Beginner' },
      skilled: { bn: 'স্কিলড', en: 'Skilled' },
      legend: { bn: 'লেজেন্ড', en: 'Legend' },
      dark: { bn: 'ডার্ক', en: 'Dark' },
      secret: { bn: 'সিক্রেট', en: 'Secret' },
    },
  },
  characters,
  fanSince: {
    question: { bn: 'তিন গোয়েন্দার সাথে তোমার প্রথম দেখা কীভাবে?', en: 'How did you first meet the Three Detectives?' },
    options: [
      { id: 'library', label: { bn: 'পাড়ার লাইব্রেরি থেকে ধার করে', en: 'Borrowed from the neighbourhood library' }, badge: { bn: 'লাইব্রেরি কার্ডের পুরোনো সদস্য', en: 'Card-carrying library regular' } },
      { id: 'inside-textbook', label: { bn: 'পাঠ্যবইয়ের ভেতরে লুকিয়ে পড়ে', en: 'Read in secret, hidden inside a textbook' }, badge: { bn: 'অঙ্ক বইয়ের ভেতরের গোয়েন্দা', en: 'The detective inside the maths book' } },
      { id: 'book-swap', label: { bn: 'বন্ধুদের সাথে বই অদলবদল করে', en: 'Swapping books with friends' }, badge: { bn: 'বই অদলবদল চক্রের সদস্য', en: 'Member of the book-swap ring' } },
      { id: 'much-later', label: { bn: 'অনেক পরে, বড় হয়ে খুঁজে পেয়ে', en: 'Much later, after growing up' }, badge: { bn: 'দেরিতে এসেও পাকা গোয়েন্দা', en: 'Late to the case, still sharp' } },
    ],
  },
  reveal: {
    kind: 'flashlight',
    lines: [{ bn: 'নতুন কেস, নতুন গোয়েন্দা।', en: 'New case, new detective.' }],
    hint: { bn: 'কার্ডটায় চাপ দাও, উল্টে দেখো', en: 'Tap the card to turn it over' },
    tapLabel: { bn: 'ভিজিটিং কার্ডটা উল্টাও', en: 'Turn the visiting card over' },
    card: { paper: '#F4EBD6', ink: '#24363B', beam: '#FFE9B0', mark: '???', caption: { bn: 'তিন গোয়েন্দা', en: 'Tin Goyenda' } },
  },
  knowledge,
  scenarios,
})
