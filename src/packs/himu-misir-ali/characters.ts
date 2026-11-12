/**
 * Partial roster: 6 regular characters plus 2 secrets, only people every
 * reader knows. Empty tier x trait slots fall back to the nearest filled one.
 *
 *            brave     clever    loyal     ambitious      funny          mysterious
 * legend     -         -         Rupa      Himu's father  -              -
 * skilled    -         -         -         -              Majeda Khala   Ranu
 * beginner   Badal     Anis      -         -              -              -
 *
 * Secrets (a perfect full journey): Himu for the wonder lean (mysterious),
 * Misir Ali for the logic lean (clever). No dark character.
 * Names are in Bangla on the bn side and transliterated on the en side.
 * Beginner results are written to feel lovable, never insulting.
 */
import type { Localized, PackInput } from '../../engine/schema'

type C = PackInput['characters'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

export const characters: C[] = [
  // Legend
  {
    id: 'rupa', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: L('রূপা', 'Rupa'), monogram: 'রূ',
    description: L(
      'তুমি অপেক্ষা করতে জানো, আর তোমার অপেক্ষাতেও একটা নরম মর্যাদা থাকে। প্রিয় মানুষটার সব খামখেয়ালি জেনেও তার জন্য বারান্দার আলোটা জ্বেলে রাখো।',
      'You know how to wait, and there is a gentle dignity in the way you do it. You know every whim of the one you love, and you still leave the balcony light on for them.',
    ),
    strength: L('ধৈর্য, আর গভীর এক মমতা', 'Patience, and a deep, steady tenderness'),
    weakness: L('প্রতিবার শাড়িটা পরে ভাবো, আজ নিশ্চয়ই আসবে', 'Dresses up every time, sure that tonight they will really come'),
    squad: L('কথা দিয়েও এখনো আসেনি কে কে?', 'Who promised to come and still has not shown up?'),
  },
  {
    id: 'himus-father', kind: 'regular', tier: 'legend', trait: 'ambitious',
    name: L('হিমুর বাবা', 'Himu\'s Father'), monogram: 'বা',
    description: L(
      'তোমার স্বপ্নগুলো সাধারণ মাপের নয়। প্রিয় মানুষের জন্য তুমি এমন এক পরিকল্পনা আঁকো যা আর কেউ ভাবতেও সাহস পেত না, আর তার প্রতিটা নিয়ম যত্ন করে লিখে রাখো।',
      'Your dreams do not come in ordinary sizes. For the people you love you draw up a plan nobody else would dare imagine, and you write down every rule of it with care.',
    ),
    strength: L('অসম্ভব স্বপ্নকে নিয়মের খাতায় বেঁধে ফেলা', 'Turning an impossible dream into a notebook of rules'),
    weakness: L('তোমার উপদেশের খাতার পাতা কোনোদিন ফুরোয় না', 'Your book of advice never runs out of pages'),
    squad: L('আমার উপদেশ মেনে চলার সাহস কার আছে?', 'Who is brave enough to follow my advice?'),
  },

  // Skilled
  {
    id: 'majeda-khala', kind: 'regular', tier: 'skilled', trait: 'funny',
    name: L('মাজেদা খালা', 'Majeda Khala'), monogram: 'মা',
    description: L(
      'তোমার ভালোবাসা জোরালো, গলা তার চেয়েও জোরালো। অসময়ে ডেকে পাঠাও, বকাঝকা করো, তারপর এমন যত্ন করে খাওয়াও যে কেউ আর রাগ করে থাকতে পারে না।',
      'Your love is loud and your voice is louder. You summon people at odd hours, you scold them, and then you feed them so well that nobody can stay cross with you.',
    ),
    strength: L('যেকোনো বাড়িকে উৎসব বানিয়ে ফেলা', 'Turning any house into a festival'),
    weakness: L('"এক মিনিট" বলে এক ঘণ্টা কথা বলা', 'Says "just a minute" and talks for an hour'),
    squad: L('আজ রাতে আমার বাসায় খেতে আসছ কে কে?', 'Who is coming over to eat at mine tonight?'),
  },
  {
    id: 'ranu', kind: 'regular', tier: 'skilled', trait: 'mysterious',
    name: L('রানু', 'Ranu'), monogram: 'রা',
    description: L(
      'অন্যেরা যা টের পায় না, তুমি পাও: একটা শব্দ, একটা ছায়া, আগেভাগে আসা একটা অনুভূতি। লোকে তোমাকে নিয়ে ভাবে, আর তুমি চুপচাপ জানালার বাইরে তাকিয়ে থাকো।',
      'You sense what others miss: a sound, a shadow, a feeling that arrives early. People wonder about you, and you just keep gazing out of the window.',
    ),
    strength: L('মনের গভীরের ডাক শুনতে পাওয়া', 'Hearing what the heart whispers'),
    weakness: L('রাতে কলের টুপটাপ শব্দেও একটা গল্প খুঁজে পাও', 'Finds a whole story in a dripping tap at night'),
    squad: L('আমার অদ্ভুত অনুভূতিগুলো বিশ্বাস করবে কে?', 'Who believes my strange feelings?'),
  },

  // Beginner: lovable, never insulting
  {
    id: 'badal', kind: 'regular', tier: 'beginner', trait: 'brave',
    name: L('বাদল', 'Badal'), monogram: 'বদ',
    description: L(
      'কাউকে ভালো লাগলে তুমি পুরোপুরি তার মতো হতে চাও। তার হাঁটা, তার কথা, তার রাতজাগা খেয়াল: সাহস করে সবটাই চেষ্টা করে দেখো, আর দারুণ মজাও পাও।',
      'When you admire someone, you go all in. Their walk, their way of talking, their night-time whims: you bravely try every bit of it, and have a wonderful time.',
    ),
    strength: L('মন উজাড় করে কাউকে ভক্তি করতে পারা', 'Admiring someone with your whole heart'),
    weakness: L('গুরুর প্রতিটা কথা মুখস্থ, নিজের কথাটাই ভুলে যাও', 'Knows every word your hero said, forgets your own'),
    squad: L('আমি মনে মনে যার মতো হতে চাই, তাকে ট্যাগ করো', 'Tag the friend I secretly want to be'),
  },
  {
    id: 'anis', kind: 'regular', tier: 'beginner', trait: 'clever',
    name: L('আনিস', 'Anis'), monogram: 'আ',
    description: L(
      'অদ্ভুত কিছু ঘটলে তুমি ঘাবড়ে যাও ঠিকই, কিন্তু মাথা ঠান্ডা রাখো। তুমি জানো সব প্রশ্নের উত্তর তোমার কাছে নেই, আর জানো ঠিক কার দরজায় কড়া নাড়তে হবে।',
      'Strange things rattle you, but you keep a cool head. You know you do not have every answer, and you know exactly whose door to knock on.',
    ),
    strength: L('ঠিক সময়ে ঠিক মানুষের কাছে সাহায্য চাওয়া', 'Asking the right person for help at the right time'),
    weakness: L('প্রতিটা খুঁটিনাটি নিয়ে রাতভর দুশ্চিন্তা', 'Worries over every little detail until dawn'),
    squad: L('রহস্যে পড়লে আমার মিসির আলি কে?', 'Who is my Misir Ali when things get strange?'),
  },

  // Secrets: 100% knowledge in the full journey; the lean decides which one
  {
    id: 'himu', kind: 'secret', trait: 'mysterious',
    name: L('হিমু', 'Himu'), monogram: 'হি',
    description: L(
      'যুক্তির খাতাটা তুমি বন্ধ করে রেখেছ। হলুদ পাঞ্জাবি, পকেট নেই, খালি পায়ে জোছনায় হাঁটো, আর মুখে এমন সব কথা যা পরে আশ্চর্যভাবে মিলে যায়।',
      'You have closed the book of logic. A yellow panjabi with no pockets, bare feet in the moonlight, and a habit of saying things that strangely come true.',
    ),
    strength: L('নিজে কিছুতেই অবাক না হওয়া, অথচ সবাইকে অবাক করা', 'Never surprised by anything, always surprising everyone'),
    weakness: L('"আসছি" বলে কোনোদিন সময়মতো পৌঁছাও না', 'Says "on my way" and never arrives on time'),
    squad: L('আমার রূপা কে, আর আমার বাদল কে?', 'Who is my Rupa, and who is my Badal?'),
  },
  {
    id: 'misir-ali', kind: 'secret', trait: 'clever',
    name: L('মিসির আলি', 'Misir Ali'), monogram: 'মি',
    description: L(
      'পৃথিবীতে রহস্য আছে, আর প্রতিটা রহস্যের পেছনে একটা যুক্তিও আছে: এটাই তোমার বিশ্বাস। হাতে নোটখাতা, পাশে চায়ের কাপ, তুমি প্রতিটা অদ্ভুত ঘটনার সুতো ধরে ধীরে ধীরে টানো।',
      'The world is full of mysteries, and every one of them has a reason: that is your creed. Notebook in hand and tea at your elbow, you slowly pull at the thread of every strange event.',
    ),
    strength: L('ছোট্ট একটা খুঁটিনাটি থেকে পুরো সত্যটা দেখে ফেলা', 'Seeing the whole truth from one small detail'),
    weakness: L('রহস্যের ঘোরে খাওয়াদাওয়ার কথা ভুলে যাও', 'Forgets to eat whenever a mystery is on the desk'),
    squad: L('কোন বন্ধুর রহস্যটা আগে আমার টেবিলে আসবে?', 'Which friend\'s mystery lands on my desk first?'),
  },
]
