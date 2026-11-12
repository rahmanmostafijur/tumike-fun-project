/**
 * 8 characters on a partial roster: the three detectives, the people closest
 * to them, one cheating rival on the dark side and the whole team as the
 * secret. Empty slots fall back to the nearest filled one when scoring.
 *
 *            brave   clever   loyal        ambitious  funny          mysterious
 *  legend    Musa    Kishore  Robin        -          -              -
 *  skilled   Jina    -        Meri Chachi  -          -              -
 *  beginner  -       -        -            -          Rashed Chacha  -
 *  dark      skilled: Shutki Terry
 *  secret    the Three Detectives, together
 *
 * Names are written in Bangla on the bn side and transliterated on the en
 * side. Beginner results are written to feel lovable, never insulting.
 */
import type { Localized, PackInput } from '../../engine/schema'

type C = PackInput['characters'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

export const characters: C[] = [
  // Legend: the three detectives
  {
    id: 'kishore', kind: 'regular', tier: 'legend', trait: 'clever',
    name: L('কিশোর পাশা', 'Kishore Pasha'), monogram: 'কি',
    description: L(
      'সবাই যেখানে শুধু জঞ্জাল দেখে, তুমি সেখানে সূত্র দেখো। ছোট্ট একটা অমিল তোমার চোখ এড়ায় না, আর পুরো ছবিটা মেলার আগে তুমি থামো না।',
      'Where everyone else sees junk, you see clues. No small mismatch slips past you, and you never stop until the whole picture fits.',
    ),
    strength: L('এক টুকরো সূত্র থেকে পুরো রহস্যের জট খোলা', 'Unravelling a whole mystery from one tiny clue'),
    weakness: L('ভাবতে বসলে ঠোঁটে চিমটি কাটতে কাটতে লাল করে ফেলো', 'Pinches your lip red whenever you start thinking'),
    squad: L('আমার মুসা আর রবিন কে?', 'Who are my Musa and Robin?'),
  },
  {
    id: 'musa', kind: 'regular', tier: 'legend', trait: 'brave',
    name: L('মুসা আমান', 'Musa Aman'), monogram: 'মু',
    description: L(
      'দৌড়ে, সাঁতারে, গায়ের জোরে দলের ভরসা তুমি। বিপদ এলে সবার আগে ঝাঁপিয়ে পড়ো, শুধু ব্যাপারটা ভূতের না হলেই হলো।',
      'Running, swimming, sheer muscle: the team counts on you. You charge into trouble first, as long as it is not a ghost.',
    ),
    strength: L('বিপদের মুখে সবার আগে এগিয়ে যাওয়া', 'Being first into any danger'),
    weakness: L('অন্ধকারে খুট করে শব্দ হলেই "খাইছে!"', 'One creak in the dark and out comes "Khaise!"'),
    squad: L('ভূতুড়ে বাড়িতে আমার হাত ধরে ঢুকবে কে?', 'Who is holding my hand in the haunted house?'),
  },
  {
    id: 'robin', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: L('রবিন মিলফোর্ড', 'Robin Milford'), monogram: 'র',
    description: L(
      'শান্ত, গোছানো আর ভীষণ নির্ভরযোগ্য। কেসের প্রতিটা খুঁটিনাটি তোমার খাতায় লেখা থাকে, আর বন্ধুদের দরকারে তুমি সবসময় হাজির।',
      'Calm, organised and utterly dependable. Every detail of the case is in your notebook, and you always turn up when your friends need you.',
    ),
    strength: L('যেকোনো তথ্য খুঁজে বের করে গুছিয়ে রাখা', 'Digging up any fact and filing it neatly'),
    weakness: L('লাইব্রেরিতে ঢুকলে সময়ের হিসাব হারিয়ে ফেলো', 'Lose all track of time once you step into a library'),
    squad: L('আমার কিশোর আর মুসা কে?', 'Who are my Kishore and Musa?'),
  },

  // Skilled
  {
    id: 'jina', kind: 'regular', tier: 'skilled', trait: 'brave',
    name: L('জিনা', 'Jina'), monogram: 'জি',
    description: L(
      'জেদি, ডাকাবুকো আর অভিযানের নেশায় পাগল। কেউ "পারবে না" বললে তুমি সেটা করেই দেখাও, আর তোমার বিশ্বস্ত কুকুরটা থাকে ঠিক পাশেই।',
      'Stubborn, daring and hooked on adventure. Tell you that you cannot, and you will do it just to prove a point, with your faithful dog right beside you.',
    ),
    strength: L('ভয়কে পাত্তা না দিয়ে অভিযানে নেমে পড়া', 'Heading into an adventure without a second look at fear'),
    weakness: L('কেউ হুকুম দিলেই উল্টোটা করতে ইচ্ছে করে', 'Any order makes you want to do the exact opposite'),
    squad: L('আমার সাথে পরের অভিযানে কে কে যাচ্ছ?', 'Who is coming on my next adventure?'),
  },
  {
    id: 'meri-chachi', kind: 'regular', tier: 'skilled', trait: 'loyal',
    name: L('মেরিচাচী', 'Meri Chachi'), monogram: 'মে',
    description: L(
      'বাইরে কড়া, ভেতরে মমতার খনি। কাজ ফাঁকি দিলে রক্ষা নেই, কিন্তু দিন শেষে সবার পেট ভরানোর দায়িত্বটাও তোমার।',
      'Strict on the outside, a goldmine of warmth inside. Nobody gets away with skipping work, and nobody goes home hungry either.',
    ),
    strength: L('সবাইকে কাজে লাগিয়ে, খাইয়ে-দাইয়ে আগলে রাখা', 'Keeping everyone busy, fed and looked after'),
    weakness: L('অলস কাউকে দেখলেই হাতে একটা কাজ ধরিয়ে দাও', 'Spot anyone idle and you hand them a job'),
    squad: L('আজ ইয়ার্ডের কাজ ফাঁকি দিচ্ছে কে কে?', 'Who is skipping yard work today?'),
  },

  // Beginner: lovable, never insulting
  {
    id: 'rashed-chacha', kind: 'regular', tier: 'beginner', trait: 'funny',
    name: L('রাশেদ চাচা', 'Rashed Chacha'), monogram: 'রা',
    description: L(
      'অন্যের কাছে যা ভাঙাচোরা, তোমার কাছে তা অমূল্য সম্পদ। আজব আজব জিনিস কিনে আনো, আর প্রতিটার পেছনে একটা মজার গল্প জুড়ে দাও।',
      'What others call broken, you call treasure. You bring home the oddest things and attach a fun story to every one of them.',
    ),
    strength: L('পুরোনো জিনিসের ভেতরে নতুন সম্ভাবনা দেখা', 'Seeing new life in old things'),
    weakness: L('"এটা একদিন কাজে লাগবে" বলে কিছুই ফেলতে পারো না', 'Cannot throw anything away, because "it will come in handy one day"'),
    squad: L('আমার সাথে পুরোনো জিনিস কিনতে কে কে যাবে?', 'Who is coming junk hunting with me?'),
  },

  // Dark: a rival who cheats, nothing worse
  {
    id: 'shutki-terry', kind: 'dark', tier: 'skilled',
    name: L('শুঁটকি টেরি', 'Shutki Terry'), monogram: 'টে',
    description: L(
      'জিততে তোমাকে হবেই, পথ যেটাই হোক। অন্যের সূত্রে চোখ রাখো, শর্টকাট খোঁজো, আর কৃতিত্বটা সবসময় নিজের নামে চাই।',
      'You have to win, whatever the route. You keep an eye on other people\'s clues, hunt for shortcuts and always want the credit in your own name.',
    ),
    strength: L('প্রতিদ্বন্দ্বীর প্রতিটা চালে নজর রাখা', 'Watching every move your rivals make'),
    weakness: L('তোমার শর্টকাটগুলো শেষমেশ উল্টো দিকেই নিয়ে যায়', 'Your shortcuts somehow always lead the wrong way'),
    squad: L('আমাকে হারাতে পারবে ভাবছে কে?', 'Who thinks they can beat me?'),
  },

  // Secret: 100% knowledge in the full journey
  {
    id: 'tin-goyenda', kind: 'secret',
    name: L('তিন গোয়েন্দা', 'The Three Detectives'), monogram: '???',
    description: L(
      'তুমি একা একজন নও, তুমি পুরো দলটা: কিশোরের মাথা, মুসার সাহস আর রবিনের খাতা, সব একসাথে। যেকোনো রহস্য, যেকোনো সময়।',
      'You are not one detective, you are the whole team: Kishore\'s brain, Musa\'s nerve and Robin\'s notebook, all at once. Any mystery, any time.',
    ),
    strength: L('তিনজনের সব গুণ এক মানুষে', 'All three detectives\' gifts in one person'),
    weakness: L('কার্ডের প্রশ্নবোধক চিহ্নগুলো কাউকে বোঝাতে পারো না', 'Can never quite explain the question marks on your card'),
    squad: L('আমার তিনজনের দলে বাকি দুজন কে?', 'Who are the other two in my trio?'),
  },
]
