import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'

export default definePack({
  id: 'breaking-bad',
  order: 3,
  primaryLang: 'en',
  title: { bn: 'Breaking Bad', en: 'Breaking Bad' },
  tagline: { bn: 'মরুভূমির ল্যাবে তুমি কে হতে?', en: 'Who would you be in the desert lab?' },
  /** Carousel icon: the flask. */
  icon: { viewBox: '0 0 32 32', markup: '<path d="M12 5 H20 M13 5 V13 L7 24 Q6 27 9 27 H23 Q26 27 25 24 L19 13 V5"/><path d="M10 20 H22"/>' },
  theme: {
    bg: '#0F1A12', surface: '#1D2820', line: '#38413A', accent: '#C9D24A', onAccent: '#0F1A12',
    text: '#EEF1DF', muted: '#B0B5A6', disabled: '#959B8D',
  },
  // The five seasons; 21 questions spread over them (14 knowledge + 7 scenarios).
  stageLabel: { bn: 'সিজন', en: 'Season' },
  stages: [
    { id: 'the-teacher', label: { bn: 'মরুভূমিতে এক শিক্ষক', en: 'A teacher in the desert' } },
    { id: 'the-bear', label: { bn: 'পুলে ভাসা টেডি বেয়ার', en: 'The bear in the pool' } },
    { id: 'the-laundry', label: { bn: 'লন্ড্রির নিচে', en: 'Under the laundry' } },
    { id: 'the-smile', label: { bn: 'শান্ত হাসির আড়ালে', en: 'Behind the calm smile' } },
    { id: 'the-last-road', label: { bn: 'বাড়ি ফেরার শেষ রাস্তা', en: 'The last road home' } },
  ],
  modes: { full: { knowledge: 14, scenario: 7 } },
  roster: 'full',
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 55, y: 15 },
    // The motorhome in the painted band of the result card.
    cardFocal: { x: 68, y: 62 },
    // Season 1 opens on the glowing glassware; the last season reaches the motorhome under the mesas.
    journey: [
      { x: 20, y: 79 },
      { x: 46, y: 83 },
      { x: 82, y: 72 },
      { x: 74, y: 66 },
      { x: 66, y: 56 },
    ],
    effects: {
      glows: [
        { x: 13, y: 78, w: 12, h: 7, color: '#5FE0F0', strength: 0.45 },
        { x: 82, y: 62, w: 16, h: 6, color: '#FFC46B', strength: 0.4, mode: 'flicker' },
        { x: 83, y: 13, w: 22, h: 12, color: '#F4F2C8', strength: 0.22 },
      ],
    },
  },
  lifelines: {
    fifty: { bn: 'দুটো ছেঁকে ফেলো', en: 'Filter two' },
    freeze: { bn: 'বরফে রাখো', en: 'Ice bath' },
    swap: { bn: 'নতুন ফর্মুলা', en: 'New formula' },
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
    question: { bn: 'Albuquerque-তে তোমার প্রথম আসাটা কীভাবে?', en: 'How did you first end up in Albuquerque?' },
    options: [
      { id: 'on-air', label: { bn: 'চলার সময়েই, যখন সবাই এটা নিয়েই কথা বলছিল', en: 'While it was airing and everyone was talking about it' }, badge: { bn: 'প্রতি সপ্তাহের অপেক্ষার দল', en: 'The week-by-week crew' } },
      { id: 'laptop-binge', label: { bn: 'পরে, ল্যাপটপে টানা রাত জেগে', en: 'Later, binged on a laptop through the night' }, badge: { bn: 'ল্যাপটপে রাত-জাগা দর্শক', en: 'The all-night laptop binger' } },
      { id: 'pushy-friend', label: { bn: 'এক বন্ধু দেখার জন্য জোর করেই যাচ্ছিল', en: 'A friend would not stop insisting' }, badge: { bn: 'বন্ধুর জেদে হার মানা fan', en: 'Finally gave in to a friend' } },
      { id: 'memes-first', label: { bn: 'আগে মিম দেখেছি, তারপর সিরিজ', en: 'Saw the memes first, then started the show' }, badge: { bn: 'মিম দেখে এসে গল্পে আটকে যাওয়া', en: 'Came for the memes, stayed for the story' } },
    ],
  },
  reveal: {
    kind: 'motorhome',
    lines: [{ bn: 'রসায়ন মিলে গেছে।', en: 'The chemistry checks out.' }],
    hint: { bn: 'দরজায় টোকা দাও', en: 'Knock on the door' },
    tapLabel: { bn: 'মোটরহোমের দরজা খোলো', en: 'Open the motorhome door' },
    van: { body: '#E7DFC3', stripe: '#7C6A3E', door: '#D8CFB0', window: '#2A3530', smoke: '#F1F4E6' },
  },
  knowledge,
  scenarios,
})
