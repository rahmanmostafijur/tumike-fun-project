import { definePack } from '../../engine/schema'
import { characters } from './characters'
import { knowledge } from './knowledge'
import { scenarios } from './scenarios'
import background from './background.webp'

export default definePack({
  id: 'money-heist',
  order: 4,
  primaryLang: 'en',
  title: { bn: 'Money Heist', en: 'Money Heist' },
  headline: { bn: 'মানি হাইস্টের দুনিয়ায় তুমি কে?', en: 'Who are you in the world of Money Heist?' },
  tagline: { bn: 'লাল জাম্পস্যুট পরলে তোমার শহরের নাম কী হতো?', en: 'Put on the red jumpsuit. What is your city name?' },
  /** Carousel icon: the mask. */
  icon: { viewBox: '0 0 32 32', markup: '<path d="M6 10 Q16 6 26 10 Q27 20 16 27 Q5 20 6 10Z"/><path d="M11 15 Q13 13 15 15 M17 15 Q19 13 21 15 M12 20 Q16 23 20 20"/>' },
  theme: {
    // The red is lifted from #E0303A so it holds 4.5:1 on the background and surface.
    bg: '#1A0B0E', surface: '#281A1C', line: '#413437', accent: '#E6555D', onAccent: '#1A0B0E',
    text: '#F6E9E9', muted: '#B8ABAC', disabled: '#9E9091',
    // Dark-side frames in cold steel, so they never blend into the red accent.
    dark: '#9FB0C3',
  },
  // The five parts of the series; 21 questions spread over them (5, 4, 4, 4, 4).
  stageLabel: { bn: 'পর্ব', en: 'Part' },
  stages: [
    { id: 'the-plan', label: { bn: 'টেবিলের ওপর প্ল্যান', en: 'The plan on the table' } },
    { id: 'the-mint', label: { bn: 'টাকার কারখানার ভেতরে', en: 'Inside the Mint' } },
    { id: 'the-call', label: { bn: 'ফিরে আসার ডাক', en: 'The call to come back' } },
    { id: 'the-bank', label: { bn: 'ব্যাংকের ভেতরে', en: 'Inside the bank' } },
    { id: 'the-last-night', label: { bn: 'লাল আলোর শেষ রাত', en: 'The last red-lit night' } },
  ],
  modes: { full: { knowledge: 14, scenario: 7 } },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 50, y: 14 },
    cardFocal: { x: 52, y: 21 },
    // Part 1 opens on the table with the blueprints and mask; the last part reaches the red-lit building.
    journey: [
      { x: 42, y: 86 },
      { x: 70, y: 64 },
      { x: 62, y: 48 },
      { x: 52, y: 34 },
      { x: 50, y: 22 },
    ],
    effects: {
      glows: [
        { x: 51, y: 28, w: 80, h: 22, color: '#FF2A3A', strength: 0.22 },
        { x: 81, y: 53, w: 18, h: 9, color: '#FF5A4A', strength: 0.4, mode: 'flicker' },
        { x: 83, y: 8, w: 12, h: 7, color: '#FFE0E0', strength: 0.18 },
      ],
      particles: [{ kind: 'smoke', count: 3 }],
    },
  },
  lifelines: {
    fifty: { bn: 'দুটো বাদ', en: 'Cut two' },
    freeze: { bn: 'সময় কেনো', en: 'Buy time' },
    swap: { bn: 'প্ল্যান বি', en: 'Plan B' },
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
    question: { bn: 'এই গল্পটা তোমার কাছে কীভাবে পৌঁছেছিল?', en: 'How did this story find you?' },
    options: [
      { id: 'lockdown', label: { bn: 'লকডাউনে, যখন সবাই এটাই দেখছিল', en: 'During lockdown, when everyone was watching it' }, badge: { bn: 'লকডাউনের রাত জাগা দল', en: 'The lockdown binge crew' } },
      { id: 'pushy-friend', label: { bn: 'এক বন্ধু দেখার জন্য পেছনে লেগেই ছিল', en: 'A friend would not stop insisting' }, badge: { bn: 'বন্ধুর জোরাজুরিতে জেতা fan', en: 'Won over by a pushy friend' } },
      { id: 'song-first', label: { bn: 'আগে গানটা শুনেছি, তারপর সিরিজ', en: 'Heard the song first, then found the show' }, badge: { bn: 'গান শুনে এসে থেকে যাওয়া fan', en: 'Came for the song, stayed for the heist' } },
      { id: 'much-later', label: { bn: 'অনেক পরে, যখন সব পর্ব বেরিয়ে গেছে', en: 'Much later, when every part was already out' }, badge: { bn: 'দেরিতে এসে এক বসায় শেষ', en: 'Late, then finished it in one go' } },
    ],
  },
  reveal: {
    kind: 'origami',
    lines: [{ bn: 'পরিকল্পনায় তোমার নামও ছিল।', en: 'Your name was in the plan.' }],
    hint: { bn: 'পাখিটায় চাপ দাও, ভাঁজ খুলে যাবে', en: 'Tap the bird to unfold it' },
    tapLabel: { bn: 'কাগজের পাখির ভাঁজ খোলো', en: 'Unfold the paper bird' },
    paper: { front: '#D62B35', back: '#8E1A22', crease: '#F6B9BC' },
  },
  knowledge,
  scenarios,
})
