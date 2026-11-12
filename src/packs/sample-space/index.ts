import { definePack, type Localized } from '../../engine/schema'

/**
 * A deliberately tiny placeholder pack. It exists only to prove the engine
 * is generic: different theme, no painted background, three stages, two traits,
 * and Bangla-first character names. Unlisted; open it with ?pack=sample-space
 */

const L = (bn: string, en: string): Localized => ({ bn, en })
const k = (id: string, stage: number, prompt: Localized, options: Localized[]) => ({ id, stage, prompt, options, answer: 0 })
const c = (id: string, kind: 'regular' | 'dark' | 'secret', tier: 'beginner' | 'skilled' | 'legend' | undefined, trait: string | undefined, name: Localized) => ({
  id, kind, ...(tier ? { tier } : {}), ...(trait ? { trait } : {}), name,
  description: L('এটা শুধু নমুনা চরিত্র।', 'This is just a sample character.'),
  strength: L('নমুনা শক্তি', 'Sample strength'),
  weakness: L('নমুনা দুর্বলতা', 'Sample weakness'),
  squad: L('আমার সাথে মহাকাশে যাবে কে?', 'Who is coming to space with me?'),
})

export default definePack({
  id: 'sample-space',
  title: L('নমুনা: মহাকাশ', 'Sample: Space'),
  listed: false,
  primaryLang: 'bn',
  icon: { viewBox: '0 0 32 32', markup: '<circle cx="16" cy="16" r="7"/><ellipse cx="16" cy="16" rx="14" ry="4.5" transform="rotate(-20 16 16)"/>' },
  theme: {
    bg: '#0B1A1C', surface: '#12282B', line: '#24464A', accent: '#6FD1C4', text: '#E6F2EF',
    muted: '#9DB8B4', disabled: '#7E9C98', onAccent: '#0B1A1C', success: '#8FD18A', danger: '#E8907F', dark: '#C98AD6',
  },
  stageLabel: L('ধাপ', 'Stage'),
  stages: [
    { id: 'launch-pad', label: L('উৎক্ষেপণ মঞ্চ', 'Launch pad') },
    { id: 'orbit', label: L('কক্ষপথ', 'Orbit') },
    { id: 'moon', label: L('চাঁদের মাটি', 'On the moon') },
  ],
  // No background: the app falls back to the plain theme colour.
  lifelines: { fifty: L('দুটো বাদ', 'Drop two'), freeze: L('ঘড়ি থামাও', 'Stop clock'), swap: L('বদলে দাও', 'Swap') },
  traits: [
    { id: 'curious', label: L('কৌতূহলী', 'Curious') },
    { id: 'calm', label: L('শান্ত', 'Calm') },
  ],
  tiers: {
    thresholds: { skilled: 40, legend: 75 },
    labels: { beginner: L('নবীন', 'Rookie'), skilled: L('দক্ষ', 'Skilled'), legend: L('কিংবদন্তি', 'Legend'), dark: L('ছায়া', 'Shadow'), secret: L('গোপন', 'Secret') },
  },
  characters: [
    c('nila', 'regular', 'legend', 'curious', L('নীলা', 'Nila')),
    c('ronju', 'regular', 'legend', 'calm', L('রঞ্জু', 'Ronju')),
    c('mitu', 'regular', 'skilled', 'curious', L('মিতু', 'Mitu')),
    c('tushar', 'regular', 'skilled', 'calm', L('তুষার', 'Tushar')),
    c('pinku', 'regular', 'beginner', 'curious', L('পিংকু', 'Pinku')),
    c('bablu', 'regular', 'beginner', 'calm', L('বাবলু', 'Bablu')),
    c('kalo-tara', 'dark', 'legend', undefined, L('কালো তারা', 'Black Star')),
    c('dhumketu', 'dark', 'skilled', undefined, L('ধূমকেতু', 'Comet')),
    c('ulka', 'dark', 'beginner', undefined, L('উল্কা', 'Meteor')),
    c('dhrubotara', 'secret', undefined, undefined, L('ধ্রুবতারা', 'Pole Star')),
  ],
  fanSince: {
    question: L('মহাকাশের প্রেম শুরু কবে?', 'When did you fall for space?'),
    options: [
      { id: 'books', label: L('বই পড়ে', 'From books'), badge: L('বইপোকা', 'Bookworm') },
      { id: 'sky', label: L('ছাদে শুয়ে আকাশ দেখে', 'Lying on the roof, stargazing'), badge: L('ছাদের তারা-গোনা দল', 'Rooftop star-counter') },
    ],
  },
  reveal: {
    kind: 'letter',
    hint: L('সিলে চাপ দিয়ে খামটা খোলো', 'Tap the seal to open it'),
    tapLabel: L('খাম খোলো', 'Open the envelope'),
    lines: [L('সংকেত এসে পৌঁছেছে।', 'The signal has arrived.')],
    address: L('{name}\nপৃথিবী', '{name}\nEarth'),
    anonymous: L('পৃথিবীর বাসিন্দা', 'Earthling'),
    envelope: { paper: '#D8EEEA', flap: '#C4E2DD', ink: '#24464A', seal: '#2F6F8E', sealInk: '#E6F2EF' },
  },
  knowledge: [
    k('sk1', 1, L('সূর্যের সবচেয়ে কাছের গ্রহ কোনটা?', 'Which planet is closest to the Sun?'), [L('বুধ', 'Mercury'), L('শুক্র', 'Venus'), L('মঙ্গল', 'Mars'), L('পৃথিবী', 'Earth')]),
    k('sk2', 1, L('লাল গ্রহ বলা হয় কাকে?', 'Which is called the red planet?'), [L('মঙ্গল', 'Mars'), L('বৃহস্পতি', 'Jupiter'), L('শনি', 'Saturn'), L('বুধ', 'Mercury')]),
    k('sk3', 1, L('পৃথিবীর প্রাকৃতিক উপগ্রহ কয়টা?', 'How many natural moons does Earth have?'), [L('একটা', 'One'), L('দুটো', 'Two'), L('তিনটা', 'Three'), L('একটাও না', 'None')]),
    k('sk4', 2, L('সৌরজগতের সবচেয়ে বড় গ্রহ কোনটা?', 'Which is the largest planet?'), [L('বৃহস্পতি', 'Jupiter'), L('শনি', 'Saturn'), L('নেপচুন', 'Neptune'), L('পৃথিবী', 'Earth')]),
    k('sk5', 2, L('কোন গ্রহের চারপাশে সবচেয়ে চোখে পড়ার মতো বলয় আছে?', 'Which planet has the most famous rings?'), [L('শনি', 'Saturn'), L('মঙ্গল', 'Mars'), L('শুক্র', 'Venus'), L('বুধ', 'Mercury')]),
    k('sk6', 2, L('চাঁদে প্রথম পা রাখার বছর কোনটা?', 'In which year did people first walk on the Moon?'), [L('১৯৬৯', '1969'), L('১৯৫৭', '1957'), L('১৯৭৫', '1975'), L('১৯৮১', '1981')]),
    k('sk7', 3, L('সূর্যের আলো পৃথিবীতে আসতে মোটামুটি কত সময় লাগে?', 'Roughly how long does sunlight take to reach Earth?'), [L('৮ মিনিট', '8 minutes'), L('৮ সেকেন্ড', '8 seconds'), L('৮ ঘণ্টা', '8 hours'), L('৮ দিন', '8 days')]),
    k('sk8', 3, L('আকাশের সবচেয়ে উজ্জ্বল তারা কোনটা?', 'Which is the brightest star in the night sky?'), [L('Sirius', 'Sirius'), L('Polaris', 'Polaris'), L('Vega', 'Vega'), L('Rigel', 'Rigel')]),
  ],
  scenarios: [
    { id: 'ss1', stage: 1, prompt: L('রকেটের জানালা দিয়ে প্রথম পৃথিবী দেখলে, কী করবে?', 'Your first look at Earth from the rocket. What do you do?'), options: [
      { text: L('ছবি তুলে রাখি', 'Take a photo'), traits: { calm: 2 } },
      { text: L('সব বোতাম টিপে দেখি', 'Press every button'), traits: { curious: 2 } },
      { text: L('চুপচাপ তাকিয়ে থাকি', 'Just stare in silence'), traits: { calm: 1, curious: 1 } },
      { text: L('সবার আগে চাঁদে নামার প্ল্যান করি', 'Plan to land on the Moon before anyone else'), traits: { curious: 1 }, dark: true },
    ] },
    { id: 'ss2', stage: 2, prompt: L('কক্ষপথে একটা অচেনা সংকেত।', 'A strange signal in orbit.'), options: [
      { text: L('উত্তর পাঠাই', 'Reply to it'), traits: { curious: 2 } },
      { text: L('রেকর্ড করে রাখি', 'Record it'), traits: { calm: 2 } },
      { text: L('কাউকে না বলে নিজেই খুঁজি', 'Investigate alone, tell no one'), traits: { curious: 1 }, dark: true },
      { text: L('সবাইকে জানাই', 'Tell the whole crew'), traits: { calm: 1, curious: 1 } },
    ] },
    { id: 'ss3', stage: 3, prompt: L('চাঁদে একটা পতাকা গাঁথার সুযোগ।', 'A chance to plant a flag on the Moon.'), options: [
      { text: L('দলের নামে গাঁথি', 'Plant it for the team'), traits: { calm: 2 } },
      { text: L('আগে চারপাশটা ঘুরে দেখি', 'Explore around first'), traits: { curious: 2 } },
      { text: L('নিজের নামে গাঁথি', 'Plant it in my own name'), traits: { calm: 1 }, dark: true },
      { text: L('পাথর কুড়াই', 'Collect rocks'), traits: { curious: 1, calm: 1 } },
    ] },
    { id: 'ss4', stage: 2, prompt: L('অক্সিজেন একটু কম। কী করবে?', 'Oxygen is a little low. What now?'), options: [
      { text: L('শান্ত থেকে হিসাব করি', 'Stay calm and calculate'), traits: { calm: 2 } },
      { text: L('নতুন উপায় খুঁজি', 'Look for a new fix'), traits: { curious: 2 } },
      { text: L('অন্যদের ভাগ থেকে একটু নিই', 'Take a bit from the others\' share'), traits: { curious: 1 }, dark: true },
      { text: L('সবাইকে গান শোনাই', 'Sing to keep spirits up'), traits: { calm: 1, curious: 1 } },
    ] },
  ],
})
