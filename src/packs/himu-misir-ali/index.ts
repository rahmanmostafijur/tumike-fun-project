import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'

export default definePack({
  id: 'himu-misir-ali',
  order: 2,
  primaryLang: 'bn',
  title: { bn: 'হিমু ও মিসির আলি', en: 'Himu & Misir Ali' },
  headline: { bn: 'হিমু ও মিসির আলির দুনিয়ায় তুমি কে?', en: 'Who are you in the world of Himu & Misir Ali?' },
  tagline: { bn: 'হলুদ পাঞ্জাবি নাকি যুক্তির খাতা, তুমি কোন দিকে?', en: 'The yellow panjabi or the logician’s notebook?' },
  /** Carousel icon: the crescent moon. */
  icon: { viewBox: '0 0 32 32', markup: '<path d="M21 6 a10 10 0 1 0 5 14 a8 8 0 1 1 -5 -14z"/>' },
  theme: {
    bg: '#101832', surface: '#1E263E', line: '#393F55', accent: '#F2C94C', onAccent: '#101832',
    text: '#F1EEE4', muted: '#B2B2B2', disabled: '#97989D',
  },
  // One night in old Dhaka, from the first glass of tea to the full moon.
  // Personality-led: 12 knowledge questions (3 per chapter), 16 scenarios (4 per chapter).
  stageLabel: { bn: 'অধ্যায়', en: 'Chapter' },
  stages: [
    { id: 'tea-stall', label: { bn: 'চায়ের দোকানে সন্ধ্যা', en: 'Evening at the tea stall' } },
    { id: 'empty-lanes', label: { bn: 'নির্জন গলিপথে', en: 'Down the empty lanes' } },
    { id: 'lit-window', label: { bn: 'জানালায় একটুকরো আলো', en: 'A light in the window' } },
    { id: 'moonlit-night', label: { bn: 'জোছনার রাত', en: 'The moonlit night' } },
  ],
  modes: { quick: { knowledge: 3, scenario: 6 }, full: { knowledge: 8, scenario: 10 } },
  roster: 'partial',
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 55, y: 12 },
    // The old rooftops and the lit balcony; the moon stays out of the band so it never doubles the backdrop moon.
    cardFocal: { x: 70, y: 25 },
    // Chapter 1 opens on the glass of tea and the stall; the walk ends under the full moon.
    journey: [
      { x: 32, y: 78 },
      { x: 80, y: 56 },
      { x: 22, y: 27 },
      { x: 79, y: 10 },
    ],
    effects: {
      stars: [{ x: 45, y: 3, size: 1.5 }, { x: 60, y: 8, size: 2 }, { x: 95, y: 18, size: 1.5 }],
      steam: [{ x: 87, y: 49 }, { x: 31, y: 73 }],
      glows: [
        { x: 79, y: 10, w: 30, h: 17, color: '#FFF1C2', strength: 0.35 },
        { x: 93, y: 45, w: 10, h: 6, color: '#FFC060', strength: 0.5, mode: 'flicker' },
      ],
      // Fireflies in the greenery and the lane (home), and down by the tea stall (early questions).
      particles: [
        { kind: 'leaves', count: 6 },
        { kind: 'fireflies', count: 14, area: { x: 2, y: 24, w: 70, h: 38 } },
        { kind: 'fireflies', count: 8, area: { x: 40, y: 62, w: 55, h: 22 } },
      ],
    },
  },
  lifelines: {
    // Misir Ali crosses out two wrong answers; the moonlight stops the clock; Himu takes another lane.
    fifty: { bn: 'যুক্তির ছাঁকনি', en: 'Logic sieve' },
    freeze: { bn: 'জোছনায় থামো', en: 'Moonlit pause' },
    swap: { bn: 'অন্য গলি', en: 'Another lane' },
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
    question: { bn: 'হিমু আর মিসির আলির সাথে তোমার প্রথম দেখা কোথায়?', en: 'Where did you first meet Himu and Misir Ali?' },
    options: [
      { id: 'book-fair', label: { bn: 'বইমেলায়, নতুন বইটার জন্য লম্বা লাইনে দাঁড়িয়ে', en: 'At the book fair, in the long queue for the new one' }, badge: { bn: 'বইমেলার লাইনের পুরোনো যাত্রী', en: 'Book fair queue veteran' } },
      { id: 'borrowed', label: { bn: 'খালাতো-মামাতো ভাইবোনের কাছ থেকে ধার করে, ফেরত দিয়েছি অনেক পরে', en: 'Borrowed from a cousin, returned much, much later' }, badge: { bn: 'ধার করা বইয়ের চিরকালের পাঠক', en: 'Forever reader of borrowed books' } },
      { id: 'under-blanket', label: { bn: 'রাতে লেপের নিচে টর্চ জ্বেলে, যাতে কেউ টের না পায়', en: 'At night under a blanket with a torch, so nobody would know' }, badge: { bn: 'লেপের নিচের টর্চ-পাঠক', en: 'Torch-under-the-blanket reader' } },
      { id: 'tv-first', label: { bn: 'আগে টিভি-নাটক বা সিনেমায়, পরে বইয়ে', en: 'On TV or film first, the books came after' }, badge: { bn: 'পর্দা থেকে পাতায়', en: 'From the screen to the page' } },
    ],
  },
  reveal: {
    kind: 'moonlight',
    lines: [{ bn: 'আজ জোছনা তোমার জন্য।', en: 'Tonight the moonlight is yours.' }],
    hint: { bn: 'চিঠিটায় চাপ দাও, ভাঁজ খুলে যাবে', en: 'Tap the letter to unfold it' },
    tapLabel: { bn: 'ভাঁজ করা চিঠিটা খোলো', en: 'Unfold the letter' },
    letter: { paper: '#F3EBD3', ink: '#5E4E36', glow: '#F7E7A6' },
  },
  knowledge,
  scenarios,
})
