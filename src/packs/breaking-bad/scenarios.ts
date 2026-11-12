import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 10 moments in the desert, two per season. Every option is
 * meant to be tempting; none is the "right" one. Most people here are already
 * on the wrong side of the law, so an option is flagged dark only when it is
 * cruel, selfish or betrays a partner. Picking dark often enough (40% or more)
 * leads to the dark-side characters.
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  // Season 1: a teacher in the desert
  {
    id: 's-secret-talent', stage: 1,
    prompt: L('হঠাৎ টের পেলে, তোমার একটা লুকোনো প্রতিভা পরিবারের সব টাকার চিন্তা মিটিয়ে দিতে পারে। কিন্তু সেটা কাজে লাগাতে গেলে একটা সীমা পার হতে হবে।', 'You realise a hidden talent of yours could solve all your family\'s money worries, but using it means crossing a line.'),
    options: [
      o(L('ভয় পেলে চলবে না; করলে ঠিকঠাক করব', 'No room for fear. If I do it, I do it properly'), { brave: 2, ambitious: 1 }),
      o(L('আগে কাগজে প্রতিটা ঝুঁকির হিসাব কষে নিই', 'First I work out every risk on paper'), { clever: 2, mysterious: 1 }),
      o(L('পরিবারের সাথে খোলাখুলি কথা না বলে কিছু না', 'Nothing happens until I talk it through with my family'), { loyal: 2, funny: 1 }),
      o(L('কাউকে কিছু না বলে চুপচাপ একটা ছোট্ট পরীক্ষা চালাই', 'Quietly run a small test without telling anyone'), { mysterious: 2, ambitious: 1 }),
    ],
  },
  {
    id: 's-dead-battery', stage: 1,
    prompt: L('মরুভূমির মাঝখানে পুরোনো মোটরহোমটা আর স্টার্ট নিচ্ছে না। ব্যাটারি শেষ, ফোনে নেটওয়ার্ক নেই, আর সাথে শুধু তোমার পার্টনার।', 'In the middle of the desert, the old motorhome will not start. The battery is dead, there is no signal, and it is just you and your partner.'),
    options: [
      o(L('যা আছে তা দিয়েই একটা ব্যাটারি বানিয়ে ফেলি', 'Build a battery out of whatever we have'), { clever: 2, brave: 1 }),
      o(L('রোদ মাথায় নিয়ে নিজেই সাহায্যের খোঁজে হাঁটা দিই', 'Brave the sun and walk off to find help myself'), { brave: 2, loyal: 1 }),
      o(L('জোক আর গল্পে দুজনের মন চাঙা রাখি', 'Keep us both going with jokes and stories'), { funny: 2, loyal: 1 }),
      o(L('শেষ পানির বোতলটা নিয়ে একাই রওনা দিই; পার্টনার অপেক্ষা করুক', 'Take the last bottle of water and set off alone; my partner can wait'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Season 2: the bear in the pool
  {
    id: 's-easy-lie', stage: 2,
    prompt: L('পুরো উইকেন্ড কোথায় ছিলে, বাড়ির সবাই জানতে চাইছে। একটা সহজ মিথ্যা মুখের সামনেই তৈরি।', 'Your family wants to know where you were all weekend. An easy lie is right there on the tip of your tongue.'),
    options: [
      o(L('খুঁটিনাটিসহ এমন একটা গল্প বলি যাতে কোনো ফাঁক নেই', 'Tell a story so detailed it has no holes'), { clever: 2, funny: 1 }),
      o(L('সত্যির একটা অংশ বলি, পুরোটা না হলেও', 'Tell them part of the truth, if not all of it'), { brave: 2, loyal: 1 }),
      o(L('এমন হাসাই যে প্রশ্নটাই সবাই ভুলে যায়', 'Make them laugh so hard they forget the question'), { funny: 2, clever: 1 }),
      o(L('উল্টো এমনভাবে কথা ঘোরাই যে প্রশ্ন করার জন্য ওরাই লজ্জা পায়', 'Turn it around until they feel guilty for even asking'), { mysterious: 2, ambitious: 1 }, true),
    ],
  },
  {
    id: 's-late-call', stage: 2,
    prompt: L('রাত তিনটায় এক পুরোনো বন্ধুর ফোন: বড় ঝামেলায় পড়েছে, এখনই সাহায্য চাই, কোনো প্রশ্ন নয়।', 'A call at three in the morning: an old friend is in deep trouble and needs help right now, no questions asked.'),
    options: [
      o(L('গাড়ির চাবি নিয়ে বেরিয়ে পড়ি', 'Grab the car keys and go'), { loyal: 2, brave: 1 }),
      o(L('এমন একজন চটপটে উকিলকে ফোন করি যে সব সামলাতে জানে', 'Call a slick lawyer who knows how to handle anything'), { funny: 2, clever: 1 }),
      o(L('যাব, কিন্তু আগে পুরো ঘটনাটা শুনে নেব', 'I will go, but first I hear the whole story'), { mysterious: 2, clever: 1 }),
      o(L('সাহায্য করব, তবে বিনিময়ে একটা বড় সুবিধা চেয়ে রাখব', 'Help, but ask for a big favour in return'), { ambitious: 2, loyal: 1 }),
    ],
  },

  // Season 3: under the laundry
  {
    id: 's-the-offer', stage: 3,
    prompt: L('এক শান্ত, ভদ্র ব্যবসায়ী তোমাকে স্বপ্নের মতো একটা কাজের জায়গা আর বড় চুক্তি দিতে চান। শর্ত একটাই: তিনি সবকিছু দেখবেন।', 'A calm, polite businessman offers you a dream workplace and a huge contract. One condition: he gets to watch everything.'),
    options: [
      o(L('রাজি; এমন সুযোগ ফেরানো বোকামি', 'Accept. Turning this down would be foolish'), { ambitious: 2, clever: 1 }),
      o(L('রাজি, কিন্তু গোপনে একটা বেরোনোর রাস্তা তৈরি রাখি', 'Accept, but quietly keep an escape route ready'), { clever: 2, mysterious: 1 }),
      o(L('আমার পুরোনো পার্টনারকে না নিলে আমি নেই', 'Not without my old partner'), { loyal: 2, brave: 1 }),
      o(L('হেসে জিজ্ঞেস করি, স্বপ্নের কাজের জায়গায় দুপুরের খাবারটা ফ্রি তো?', 'Ask with a grin whether the dream workplace comes with free lunch'), { funny: 2, brave: 1 }),
    ],
  },
  {
    id: 's-new-assistant', stage: 3,
    prompt: L('বস চান তোমার পুরোনো, এলোমেলো পার্টনারের জায়গায় এক ঝকঝকে, পড়াশোনা জানা সহকারী আসুক।', 'Your boss wants to replace your messy old partner with a polished, highly educated new assistant.'),
    options: [
      o(L('পুরোনো পার্টনারের পক্ষে দাঁড়াই, যা হয় হোক', 'Stand up for my old partner, whatever it costs'), { loyal: 2, brave: 1 }),
      o(L('নতুন জনকে চুপচাপ একটু যাচাই করে দেখি', 'Quietly put the newcomer to the test'), { clever: 2, mysterious: 1 }),
      o(L('দুজনের সাথেই বন্ধুত্ব করে ফেলি; ঝগড়ার দরকার কী?', 'Make friends with both. Why fight at all?'), { funny: 2, loyal: 1 }),
      o(L('রাজি হই, আর পুরোনো পার্টনার খবরটা নিজেই খুঁজে পাক', 'Agree, and let my old partner find out on their own'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Season 4: behind the calm smile
  {
    id: 's-behind-my-back', stage: 4,
    prompt: L('সন্দেহ হচ্ছে, তোমার পার্টনার তোমাকে না জানিয়ে বসের সাথে আলাদা কথা বলছে।', 'You suspect your partner has been talking to the boss behind your back.'),
    options: [
      o(L('সরাসরি মুখোমুখি হয়ে জিজ্ঞেস করি', 'Confront them face to face'), { brave: 2, loyal: 1 }),
      o(L('ছোট্ট একটা পরীক্ষা সাজাই, সত্যিটা নিজেই বেরিয়ে আসবে', 'Set a small test and let the truth come out by itself'), { clever: 2, mysterious: 1 }),
      o(L('যত যা-ই হোক, পার্টনারকে বিশ্বাস করি', 'Trust my partner, whatever it looks like'), { loyal: 2, funny: 1 }),
      o(L('পুরো সত্যি না বলে পার্টনারকে কৌশলে বসের বিরুদ্ধে দাঁড় করাই', 'Steer my partner against the boss without telling them the whole truth'), { mysterious: 2, ambitious: 1 }, true),
    ],
  },
  {
    id: 's-lie-low', stage: 4,
    prompt: L('বিপদ ঘনিয়ে আসছে। নিরাপদ কোথাও কিছুদিন লুকিয়ে থাকার সুযোগ আছে, কিন্তু অহংকার বলছে, থেকে লড়াই করো।', 'Danger is closing in. You could hide somewhere safe for a while, but your pride says stay and fight.'),
    options: [
      o(L('পরিবারের নিরাপত্তা আগে; চুপচাপ সরে যাই', 'Family safety first. Step away quietly'), { loyal: 2, clever: 1 }),
      o(L('পিছু হটি না; এখানেই শেষ দেখব', 'I am not backing down. I will see it through here'), { brave: 2, ambitious: 1 }),
      o(L('সবার চোখের আড়ালে গিয়ে পরের চাল সাজাই', 'Vanish from sight and plan my next move'), { mysterious: 2, clever: 1 }),
      o(L('এমন ভাব করি যেন কিছুই হয়নি, আর একটা জোক মেরে দিই', 'Act as if nothing is wrong, and crack a joke'), { funny: 2, brave: 1 }),
    ],
  },

  // Season 5: the last road home
  {
    id: 's-credit', stage: 5,
    prompt: L('শহরে এক রহস্যময় প্রতিভার গল্প ছড়িয়েছে, আর অন্য কেউ সেই কৃতিত্বটা নিজের বলে দাবি করছে।', 'Stories about a mysterious genius are spreading through town, and someone else is claiming the credit.'),
    options: [
      o(L('নিতে দাও; নাম না থাকাটাই নিরাপদ', 'Let them. Staying nameless is safer'), { mysterious: 2, funny: 1 }),
      o(L('সবাইকে জানিয়ে দিই আসল মানুষটা কে', 'Make sure everyone knows who the real one is'), { ambitious: 2, brave: 1 }),
      o(L('কৃতিত্ব পার্টনারের সাথে ভাগ করে নিই', 'Share the credit with my partner'), { loyal: 2, funny: 1 }),
      o(L('দাবিদারের সব কিছু শেষ না হওয়া পর্যন্ত থামি না', 'Do not stop until the pretender has lost everything'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-walk-away', stage: 5,
    prompt: L('চিরকালের জন্য থামার মতো যথেষ্ট আছে। পার্টনার বেরিয়ে যেতে চায়, অথচ সামনে আরও বড় একটা শেষ কাজের সুযোগ।', 'You have enough to stop forever. Your partner wants out, and there is the chance of one last, even bigger job.'),
    options: [
      o(L('দুজনে একসাথে বেরিয়ে যাই, পেছনে না তাকিয়ে', 'Walk away together and never look back'), { loyal: 2, funny: 1 }),
      o(L('শেষ আরেকটা; এবার সাম্রাজ্যটা পূর্ণ হবে', 'One more. This time the empire is complete'), { ambitious: 2, brave: 1 }),
      o(L('নতুন নাম আর নতুন শহর নিয়ে নিঃশব্দে হারিয়ে যাই', 'Disappear quietly with a new name in a new town'), { mysterious: 2, clever: 1 }),
      o(L('পার্টনার থাকতে রাজি না হওয়া পর্যন্ত তার ভাগটা আটকে রাখি', 'Hold back my partner\'s share until they agree to stay'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
]
