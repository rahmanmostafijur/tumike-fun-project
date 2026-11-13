import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'

export default definePack({
  id: 'game-of-thrones',
  order: 5,
  primaryLang: 'en',
  title: { bn: 'Game of Thrones', en: 'Game of Thrones' },
  headline: { bn: 'গেম অব থ্রোনসের দুনিয়ায় তুমি কে?', en: 'Who are you in the world of Game of Thrones?' },
  tagline: { bn: 'দেয়ালের এপারে না ওপারে, তুমি কোন ঘরের?', en: 'North of the Wall or south: which house are you?' },
  /** Carousel icon: a castle keep. */
  icon: { viewBox: '0 0 32 32', markup: '<path d="M7 27 V12 H11 V8 H15 V12 H17 V8 H21 V12 H25 V27Z"/><path d="M14 27 V21 Q16 18 18 21 V27"/>' },
  theme: {
    bg: '#0D1318', surface: '#1C2126', line: '#363B3F', accent: '#A9CFE0', onAccent: '#0D1318',
    text: '#EAF1F5', muted: '#ACB3B7', disabled: '#92989D',
    // Player photo: Cold ice blue over night grey, in a double rim like an old shield.
    photo: { shadow: '#0D1318', highlight: '#A9CFE0', strength: 0.35, ring: 'double' },
  },
  // One stage per season; 32 knowledge questions, four per season.
  stageLabel: { bn: 'সিজন', en: 'Season' },
  stages: [
    { id: 'the-kings-road', label: { bn: 'রাজার উত্তরযাত্রা', en: 'The king rides north' } },
    { id: 'many-crowns', label: { bn: 'এক সিংহাসন, অনেক মুকুট', en: 'One throne, many crowns' } },
    { id: 'beyond-the-wall', label: { bn: 'দেয়ালের ওপারে', en: 'Beyond the Wall' } },
    { id: 'capital-whispers', label: { bn: 'রাজধানীর কানাকানি', en: 'Whispers in the capital' } },
    { id: 'across-the-sea', label: { bn: 'Narrow Sea-র ওপারে', en: 'Across the Narrow Sea' } },
    { id: 'old-banners', label: { bn: 'পুরোনো পতাকা আবার ওড়ে', en: 'Old banners rise again' } },
    { id: 'dragonstone-allies', label: { bn: 'Dragonstone-এ মিত্রতা', en: 'Allies at Dragonstone' } },
    { id: 'the-longest-night', label: { bn: 'দীর্ঘতম রাত', en: 'The longest night' } },
  ],
  modes: { full: { knowledge: 14, scenario: 7 } },
  roster: 'full',
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 50, y: 12 },
    // The result card shows the lit castle beside the wall of ice.
    cardFocal: { x: 45, y: 19 },
    // Season 1 opens at the table with the raven, map and crown; the camp and the
    // snowy plain follow, then the climb to the castle and the wall of ice.
    journey: [
      { x: 30, y: 77 },
      { x: 52, y: 76 },
      { x: 80, y: 65 },
      { x: 60, y: 57 },
      { x: 48, y: 45 },
      { x: 38, y: 32 },
      { x: 28, y: 20 },
      { x: 55, y: 20 },
    ],
    effects: {
      glows: [
        { x: 81, y: 58, w: 7, h: 5, color: '#FFB050', strength: 0.55, mode: 'flicker' },
        { x: 89, y: 68, w: 14, h: 7, color: '#FF9A40', strength: 0.42 },
        { x: 27, y: 17, w: 7, h: 4, color: '#FFC46B', strength: 0.5, mode: 'flicker' },
        { x: 86, y: 8, w: 22, h: 12, color: '#E8F2FF', strength: 0.22 },
      ],
      particles: [{ kind: 'snow', count: 36 }],
    },
  },
  lifelines: {
    fifty: { bn: 'দুই তলোয়ার', en: 'Two swords' },
    freeze: { bn: 'সময় জমিয়ে বরফ', en: 'Freeze the clock' },
    swap: { bn: 'আরেকটা কাক', en: 'Send another raven' },
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
    question: { bn: 'Westeros-এ তোমার প্রথম পা পড়েছিল কীভাবে?', en: 'How did you first set foot in Westeros?' },
    options: [
      { id: 'every-monday', label: { bn: 'প্রতি সোমবার সকালে, পর্ব বেরোনোর সাথে সাথে', en: 'Every Monday morning, as each episode aired' }, badge: { bn: 'সোমবার সকালের নিয়মিত যাত্রী', en: 'Monday-morning regular' } },
      { id: 'binged-later', label: { bn: 'অনেক বছর পরে, সব সিজন একটানা', en: 'Years later, every season in one long binge' }, badge: { bn: 'দেরিতে এসে এক টানে শেষ', en: 'Late arrival, one long binge' } },
      { id: 'read-first', label: { bn: 'দেখার আগেই এটা নিয়ে অনেক পড়ে ফেলেছিলাম', en: 'Read all about it before I watched' }, badge: { bn: 'আগে পড়া, পরে দেখা fan', en: 'Read first, watched second' } },
      { id: 'dragged-in', label: { bn: 'এক বন্ধু জোর করে বসিয়ে দিয়েছিল', en: 'A friend dragged me in' }, badge: { bn: 'বন্ধুর টানে Westeros-এ', en: 'Pulled into Westeros by a friend' } },
    ],
  },
  reveal: {
    kind: 'scroll',
    lines: [{ bn: 'কাক খবর নিয়ে এসেছে।', en: 'A raven has arrived.' }],
    hint: { bn: 'সিলে চাপ দাও, চিঠিটা খুলে যাবে', en: 'Tap the seal to unroll the scroll' },
    tapLabel: { bn: 'কাকের আনা চিঠি খোলো', en: "Unroll the raven's scroll" },
    scroll: { paper: '#E6DCC4', roller: '#5A4632', seal: '#7E1F27', sealInk: '#E8D8B8', raven: '#14171C', rim: '#A9CFE0' },
  },
  knowledge,
  scenarios,
})
