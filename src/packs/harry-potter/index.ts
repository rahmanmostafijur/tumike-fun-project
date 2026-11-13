import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'
import owl from './owl.webp'

export default definePack({
  id: 'harry-potter',
  title: { bn: 'Harry Potter', en: 'Harry Potter' },
  headline: { bn: 'হ্যারি পটারের দুনিয়ায় তুমি কে?', en: 'Who are you in the world of Harry Potter?' },
  tagline: { bn: 'Hogwarts-এ তুমি আসলে কে?', en: 'Who are you, really, at Hogwarts?' },
  order: 0,
  primaryLang: 'en',
  /** Landing tile icon: a wand with a spark. */
  icon: {
    viewBox: '0 0 32 32',
    markup:
      '<path d="M7 25 L20 12"/><path d="M7 25 L10 22" stroke-width="3"/><path d="M23 4 l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4z"/><circle cx="27" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="6" r="1" fill="currentColor" stroke="none"/>',
  },
  theme: {
    bg: '#0E1424',
    surface: '#182036',
    line: '#2B3554',
    accent: '#E0B45C',
    text: '#F2E9D8',
    muted: '#A9B1C6',
    disabled: '#8690AB',
    onAccent: '#0E1424',
    success: '#7CC49A',
    danger: '#E58A80',
    dark: '#C9707A',
  },
  stageLabel: { bn: 'বর্ষ', en: 'Year' },
  stages: [
    { id: 'platform', label: { bn: 'স্টিম ট্রেনের প্ল্যাটফর্ম', en: 'The steam train' } },
    { id: 'hall', label: { bn: 'ভাসমান মোমবাতির হলঘর', en: 'The candlelit hall' } },
    { id: 'classroom', label: { bn: 'পোশনের ক্লাসরুম', en: 'The potions classroom' } },
    { id: 'library', label: { bn: 'পুরোনো লাইব্রেরি', en: 'The old library' } },
    { id: 'forest', label: { bn: 'অন্ধকার জঙ্গল', en: 'The dark forest' } },
    { id: 'owl-tower', label: { bn: 'পেঁচার টাওয়ার', en: 'The owl tower' } },
    { id: 'castle', label: { bn: 'রাতের দুর্গ', en: 'The castle at night' } },
  ],
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 55, y: 12 },
    cardFocal: { x: 58, y: 9 },
    // Stage 1 opens on the train on the viaduct; the last stage reaches the castle and moon.
    journey: [
      { x: 70, y: 66 },
      { x: 62, y: 56 },
      { x: 55, y: 47 },
      { x: 48, y: 38 },
      { x: 46, y: 30 },
      { x: 50, y: 21 },
      { x: 58, y: 11 },
    ],
    effects: {
      stars: [
        { x: 6, y: 3, size: 2 }, { x: 14, y: 9, size: 1.5 }, { x: 22, y: 2.5, size: 2.5 },
        { x: 31, y: 6, size: 1.5 }, { x: 40, y: 1.8, size: 2 }, { x: 47, y: 8.5, size: 1.5 },
        { x: 56, y: 3.5, size: 2.5 }, { x: 66, y: 2, size: 1.5 }, { x: 70, y: 14, size: 2 },
        { x: 93, y: 4, size: 2 }, { x: 96, y: 16, size: 1.5 }, { x: 4, y: 15, size: 1.5 },
      ],
      steam: [{ x: 61.5, y: 63.6 }],
      glows: [
        { x: 80.2, y: 10.6, w: 30, h: 17, color: '#FFF1CF', strength: 0.35 },
        { x: 45, y: 22, w: 66, h: 14, color: '#FFC46B', strength: 0.26 },
        { x: 55, y: 48, w: 50, h: 9, color: '#FFB85C', strength: 0.14, mode: 'flicker' },
      ],
      // Golden sparks rising off the lit castle (home) and off the train by the lake (early questions).
      particles: [
        { kind: 'sparks', count: 16, area: { x: 16, y: 16, w: 66, h: 20 } },
        { kind: 'sparks', count: 8, area: { x: 55, y: 62, w: 40, h: 8 } },
      ],
    },
    flyer: {
      src: owl,
      aspect: 480 / 479,
      width: 17,
      // Crosses the lower half of the moon, below the header controls.
      altitude: 13.5,
      jitter: 4,
      carry: { x: 74.6, y: 65.2 },
      passSeconds: 14,
      pauseSeconds: [8, 12],
    },
  },
  lifelines: {
    fifty: { bn: 'দুটো উধাও', en: 'Vanish two' },
    freeze: { bn: 'সময় জমাও', en: 'Freeze time' },
    swap: { bn: 'প্রশ্ন বদল', en: 'Swap it' },
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
    question: { bn: 'এই গল্পের সাথে তোমার প্রথম দেখা কীভাবে?', en: 'How did you first meet this story?' },
    options: [
      { id: 'borrowed-book', label: { bn: 'বন্ধুর কাছ থেকে বই ধার করে', en: 'Borrowed a friend\'s book' }, badge: { bn: 'বই ধার করা প্রজন্ম', en: 'The borrowed-book generation' } },
      { id: 'tv', label: { bn: 'টিভিতে দেখে', en: 'Watched it on TV' }, badge: { bn: 'টিভির সামনে বসা প্রজন্ম', en: 'The glued-to-the-TV generation' } },
      { id: 'cd-rental', label: { bn: 'CD বা DVD ভাড়া করে', en: 'Rented a CD or DVD' }, badge: { bn: 'CD ভাড়া করা প্রজন্ম', en: 'The CD-rental generation' } },
      { id: 'online', label: { bn: 'অনেক পরে, অনলাইনে', en: 'Much later, online' }, badge: { bn: 'দেরিতে আসা, তবু আসল fan', en: 'Late to the story, still a real fan' } },
    ],
  },
  reveal: {
    kind: 'letter',
    hint: { bn: 'সিলে চাপ দিয়ে চিঠিটা খোলো', en: 'Tap the seal to open your letter' },
    tapLabel: { bn: 'চিঠি খোলো', en: 'Open the letter' },
    lines: [
      { bn: 'চিঠিটা একটু দেরিতে এল।', en: 'Your letter arrived a little late.' },
      { bn: 'কিন্তু এসেছে।', en: 'But it came.' },
    ],
    address: { bn: '{name}\nদোতলার কোণের ঘর\nঢাকা', en: '{name}\nThe corner room, first floor\nDhaka' },
    anonymous: { bn: 'তোমার জন্য', en: 'For you' },
    envelope: { paper: '#EADFC8', flap: '#DCCFB2', ink: '#5A4A35', seal: '#8E2F35', sealInk: '#F0D9B5' },
  },
  knowledge,
  scenarios,
})
