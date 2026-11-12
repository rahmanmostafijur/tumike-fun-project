import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 10 moments across the eight seasons (two in the first and
 * last, one in each of the others). Every option is meant to be tempting;
 * none is the "right" one. An option is flagged dark only when it is cruel,
 * selfish or treacherous. Picking dark often enough (40% or more) leads to
 * the dark-side characters.
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  // Season 1: the king rides north
  {
    id: 's-southbound', stage: 1,
    prompt: L('রাজা তোমাকে দক্ষিণে তাঁর দরবারে কাজ করার প্রস্তাব দিলেন। যাওয়া মানে বাড়ি আর আপনজনদের অনেক দূরে ফেলে যাওয়া।', 'The king offers you a place at his court in the south. Going means leaving home and everyone you love far behind.'),
    options: [
      o(L('যাব; এমন সুযোগ জীবনে দুবার আসে না', 'Go. A chance like this never comes twice'), { ambitious: 2, brave: 1 }),
      o(L('যাব, তবে আগে জেনে নিই দরবারে কাকে বিশ্বাস করা যায়', 'Go, but first find out who at court can be trusted'), { clever: 2, mysterious: 1 }),
      o(L('যাব না; বরং উত্তরে গিয়ে দেখি দেয়ালের ওপারে কী আছে', 'Stay out of it, and head north to see what lies beyond the Wall'), { mysterious: 2, brave: 1 }),
      o(L('আগে জিজ্ঞেস করি, দক্ষিণের রান্না অন্তত ভালো তো?', 'First ask whether the southern cooking is any good'), { funny: 2, loyal: 1 }),
    ],
  },
  {
    id: 's-stranger', stage: 1,
    prompt: L('রাতে এক ভয় পাওয়া অচেনা লোক তোমার তাঁবুর কাছে ধরা পড়ল। সে বলছে, উত্তরে ভয়ংকর কিছু দেখে সে পালিয়ে এসেছে।', 'A frightened stranger is caught near your camp at night. He says he ran from something terrible in the north.'),
    options: [
      o(L('আগে আগুনের পাশে বসাই, খেতে দিই, তারপর গল্প শুনি', 'Sit him by the fire, feed him, then hear his story'), { loyal: 2, brave: 1 }),
      o(L('খুঁটিয়ে প্রশ্ন করি; ভয় পাওয়া মানুষও মিথ্যা বলে', 'Question him carefully; scared men lie too'), { clever: 2, mysterious: 1 }),
      o(L('ভোর হলেই নিজে উত্তরে গিয়ে দেখে আসি', 'Ride north at dawn and see for myself'), { brave: 2, mysterious: 1 }),
      o(L('এমন গল্প শোনাই যে সে হাসতে হাসতে শান্ত হয়ে যায়', 'Tell him a story so silly he laughs himself calm'), { funny: 2, loyal: 1 }),
    ],
  },

  // Season 2: one throne, many crowns
  {
    id: 's-crowns', stage: 2,
    prompt: L('একসাথে পাঁচজন নিজেকে রাজা দাবি করছে। একজন কাক পাঠিয়ে লিখেছে: তার কাছে মাথা নোয়ালে তোমাকে লর্ড বানাবে।', 'Five people are claiming to be king. One sends a raven: kneel to him and you will be made a lord.'),
    options: [
      o(L('মাথা নোয়াই; লর্ড হওয়ার সুযোগ ছাড়ার মানে নেই', 'Kneel. A lordship is a lordship'), { ambitious: 2, clever: 1 }),
      o(L('না; আমি অন্য কাউকে আগেই কথা দিয়েছি', 'Refuse. I already gave my word to someone else'), { loyal: 2, brave: 1 }),
      o(L('পাঁচজনকেই ভদ্র চিঠি লিখি, আর প্রত্যেককে আলাদা কিছু কথা দিই', 'Write politely to all five kings and promise each of them something'), { mysterious: 2, ambitious: 1 }, true),
      o(L('উত্তরে জানতে চাই, পাঁচজনের মধ্যে কার ভোজ সবচেয়ে ভালো', 'Write back asking which of the five throws the best feasts'), { funny: 2, clever: 1 }),
    ],
  },

  // Season 3: beyond the Wall
  {
    id: 's-oath', stage: 3,
    prompt: L('তুমি নতুন এক দলের কাছে শপথ নিয়েছিলে। এখন তারা বলছে, তোমার নিজের পরিবারের পতাকার বিরুদ্ধে লড়তে হবে।', 'You swore an oath to a new order. Now they want you to ride against your own family\'s banners.'),
    options: [
      o(L('শপথ রাখি; আমার কথাই আমার পরিচয়', 'Keep the oath. My word is who I am'), { loyal: 2, brave: 1 }),
      o(L('শপথ ভেঙে বাড়ির দিকে ঘোড়া ছোটাই', 'Break the oath and ride for home'), { brave: 2, loyal: 1 }),
      o(L('এমন একটা তৃতীয় পথ খুঁজি যাতে কাউকে লড়তেই না হয়', 'Find a third way so nobody has to fight at all'), { clever: 2, loyal: 1 }),
      o(L('ঠিক সময়ে, সবচেয়ে ভালো দামে, পক্ষ বদলে ফেলি', 'Switch sides at the right moment, for the best price'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Season 4: whispers in the capital
  {
    id: 's-letter', stage: 4,
    prompt: L('তুমি একটা চিঠি পেলে, যা প্রমাণ করে এক ক্ষমতাধর পরিবার পুরো রাজ্যের সাথে মিথ্যা বলছে। এটা প্রকাশ পেলে যুদ্ধ বেধে যেতে পারে।', 'You find a letter proving that a powerful family has been lying to the whole realm. Showing it could start a war.'),
    options: [
      o(L('সবচেয়ে বিশ্বাসের মানুষটাকে দেখাই, একসাথে সিদ্ধান্ত নিই', 'Show the one person I trust most and decide together'), { loyal: 2, clever: 1 }),
      o(L('লুকিয়ে রাখি, আর ঠিক সময়ের অপেক্ষা করি', 'Hide it and wait for the right moment'), { mysterious: 2, clever: 1 }),
      o(L('পুরো দরবারের সামনে জোরে পড়ে শোনাই', 'Read it aloud in front of the whole court'), { brave: 2, ambitious: 1 }),
      o(L('চিঠিটা দিয়ে ওই পরিবারকে দিয়ে নিজের সব কাজ করিয়ে নিই', 'Use it to make that family do whatever I want'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Season 5: across the Narrow Sea
  {
    id: 's-mercy', stage: 5,
    prompt: L('যে শত্রু একসময় তোমার বন্ধুকে কষ্ট দিয়েছিল, সে আজ আহত হয়ে তোমার সামনে, দয়া চাইছে।', 'The enemy who once hurt your friend is wounded at your feet, asking for mercy.'),
    options: [
      o(L('ছেড়ে দিই; প্রতিশোধের চেয়ে দয়া বড়', 'Spare him. Mercy is stronger than revenge'), { loyal: 2, brave: 1 }),
      o(L('ছেড়ে দিই, তবে আগে তার জানা সব খবর বের করে নিই', 'Spare him, but only after he tells me everything he knows'), { clever: 2, mysterious: 1 }),
      o(L('ক্ষত বেঁধে দিই, তারপর এত জ্বালাই যে সে বন্ধু হয়ে যায়', 'Patch him up, then annoy him with jokes until he becomes a friend'), { funny: 2, loyal: 1 }),
      o(L('তাকে ঠান্ডার মধ্যে একা ফেলে চলে যাই', 'Walk away and leave him alone in the cold'), { mysterious: 2, brave: 1 }, true),
    ],
  },

  // Season 6: old banners rise again
  {
    id: 's-banners', stage: 6,
    prompt: L('বাড়ি ফিরে পেতে সেনা দরকার। উত্তরের ছোট ছোট House-গুলোকে রাজি করানোর দায়িত্ব তোমার।', 'To take back your home you need an army, and it is your job to win over the small houses of the North.'),
    options: [
      o(L('আগুনঝরা একটা ভাষণ দিই, বাড়ি আর সম্মান নিয়ে', 'Give a fiery speech about home and honour'), { brave: 2, loyal: 1 }),
      o(L('প্রতিটা House-এ নিজে গিয়ে আগে মন দিয়ে শুনি', 'Visit every house in person and listen first'), { loyal: 2, clever: 1 }),
      o(L('প্রত্যেক লর্ড মনে মনে কী চায়, ঠিক সেটাই প্রস্তাব দিই', 'Offer each lord exactly what he secretly wants'), { clever: 2, ambitious: 1 }),
      o(L('সবচেয়ে গোমড়ামুখো লর্ডকে একটা রসিকতায় হাসিয়ে দিই', 'Win over the grumpiest lord with one good joke'), { funny: 2, brave: 1 }),
    ],
  },

  // Season 7: allies at Dragonstone
  {
    id: 's-table', stage: 7,
    prompt: L('আরও বড় এক বিপদের মুখে দুই প্রতিদ্বন্দ্বী শাসককে এক টেবিলে বসাতে হবে। আয়োজনের ভার তোমার হাতে।', 'Facing a far bigger threat, two rival rulers must sit at one table, and you are arranging the meeting.'),
    options: [
      o(L('দুজনকেই সোজা সত্যিটা বলি, রেগে গেলেও', 'Tell both of them the plain truth, even if it angers them'), { brave: 2, loyal: 1 }),
      o(L('প্রতিটা আসন, প্রতিটা কথা আর বেরোনোর পথ আগে থেকে ঠিক করি', 'Plan every seat, every word and a way out'), { clever: 2, mysterious: 1 }),
      o(L('এমন একটা অস্বস্তিকর গল্প বলি যে দুজনেই হেসে ফেলে', 'Tell a story so awkward that both of them burst out laughing'), { funny: 2, clever: 1 }),
      o(L('চুপিচুপি এমন ব্যবস্থা করি যাতে আসল ক্ষমতা আমার হাতেই থাকে', 'Quietly make sure the real power ends up in my hands'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Season 8: the longest night
  {
    id: 's-long-night', stage: 8,
    prompt: L('দীর্ঘতম রাত আসছে। সবাই জানতে চায়, তুমি কোথায় দাঁড়াবে।', 'The longest night is coming, and everyone wants to know where you will stand.'),
    options: [
      o(L('একেবারে সামনের সারিতে, অন্ধকারের মুখোমুখি', 'On the front line, first to face the dark'), { brave: 2, loyal: 1 }),
      o(L('যারা লড়তে পারে না, তাদের পাহারায়', 'Guarding the people who cannot fight'), { loyal: 2, brave: 1 }),
      o(L('দেয়ালের ওপরে, পুরো মাঠ দেখে নির্দেশ দিতে', 'Up on the walls, reading the field and calling orders'), { clever: 2, brave: 1 }),
      o(L('এমন জায়গায়, যা কেউ জানে না; শুধু সেই একটা মুহূর্তের অপেক্ষায়', 'Somewhere nobody knows, waiting for the one moment that matters'), { mysterious: 2, brave: 1 }),
    ],
  },
  {
    id: 's-throne', stage: 8,
    prompt: L('লম্বা যুদ্ধের পর মুকুটটা এখন তোমার হাতের নাগালে। মিত্ররা বলছে, তুমি চাইলেই এটা তোমার।', 'After a long war, the crown is finally within reach. Your allies say it is yours if you want it.'),
    options: [
      o(L('রাজি; সারাজীবন এই দিনের অপেক্ষায় ছিলাম', 'Accept. I have waited my whole life for this'), { ambitious: 2, brave: 1 }),
      o(L('ফিরিয়ে দিই; কিছু ক্ষমতা না ছোঁয়াই ভালো', 'Turn it down. Some power is better left alone'), { mysterious: 2, clever: 1 }),
      o(L('হেসে না বলি, আর জিজ্ঞেস করি ভোজটা কোথায়', 'Laugh, say no, and ask where the feast is'), { funny: 2, loyal: 1 }),
      o(L('রাজি, আর যারা বিরোধিতা করেছিল তাদের সবাইকে দূরে পাঠিয়ে দিই', 'Accept, then send everyone who stood against me far away'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
]
