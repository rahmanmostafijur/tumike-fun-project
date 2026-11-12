import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 12 situations tied to stages. Every option is meant to be
 * tempting; none is the "right" one. Options flagged dark lean towards the
 * dark-side characters when chosen often enough (40% or more).
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  {
    id: 's-compartment', stage: 1,
    prompt: L('ট্রেনের কামরায় এক অচেনা ছেলে এসে বসল। তোমার হাতে মায়ের দেওয়া টিফিন বক্স।', 'A stranger sits down in your train compartment. You are holding the snack box your mum packed.'),
    options: [
      o(L('টিফিন ভাগ করে গল্প জুড়ে দাও', 'Share the snacks and start chatting'), { loyal: 2, funny: 1 }),
      o(L('চুপচাপ দেখো, ও কী বই পড়ছে', 'Quietly check what book they are reading'), { mysterious: 2, clever: 1 }),
      o(L('ট্রলির সবচেয়ে অদ্ভুত মিষ্টিটা কিনে দুজনে চ্যালেঞ্জ নাও', 'Buy the weirdest sweet on the trolley and dare each other'), { funny: 2, brave: 1 }),
      o(L('জেনে নাও ওর পরিবার কে; কাজের বন্ধু চিনে রাখা ভালো', 'Find out who their family is; useful friends matter'), { ambitious: 2 }, true),
    ],
  },
  {
    id: 's-blackout', stage: 1,
    prompt: L('মাঝপথে ট্রেন থেমে গেল। বাতি নিভে গেছে, জানালায় বরফ জমছে।', 'The train stops halfway. The lights go out and frost creeps across the window.'),
    options: [
      o(L('দরজা খুলে নিজেই দেখে আসো কী হচ্ছে', 'Open the door and go see for yourself'), { brave: 2 }),
      o(L('সবাইকে চকোলেট বিলিয়ে দাও; ভয় কমবে', 'Hand out chocolate to everyone; it helps'), { loyal: 2, funny: 1 }),
      o(L('জাদুদণ্ডে আলো জ্বেলে চুপ করে লক্ষ করো', 'Light your wand and watch in silence'), { mysterious: 2, clever: 1 }),
      o(L('অন্ধকারে কার কী দুর্বলতা বেরোয়, মনে রেখে দাও', 'Note who panics in the dark; it may be useful later'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-sorting', stage: 2,
    prompt: L('Sorting Hat কানে কানে বলল, "তুমি যেকোনো জায়গায় মানিয়ে নেবে। তুমিই বলো।"', 'The Sorting Hat whispers: "You would do well anywhere. You choose."'),
    options: [
      o(L('যেখানে সাহস লাগে, সেখানে পাঠাও', 'Wherever courage is needed'), { brave: 2, funny: 1 }),
      o(L('যেখানে সবচেয়ে কঠিন বইগুলো আছে', 'Wherever the hardest books are'), { clever: 2, mysterious: 1 }),
      o(L('যেখানে বন্ধুরা সারাজীবন পাশে থাকে', 'Wherever friends stay for life'), { loyal: 2, funny: 1 }),
      o(L('যেখানে গেলে একদিন সবাই আমার নাম জানবে', 'Wherever one day everyone will know my name'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-troll-night', stage: 2,
    prompt: L('Halloween-এর ভোজের মাঝে খবর এল, dungeon-এ troll ঢুকেছে। সবাই dormitory-তে ফিরছে।', 'Mid-way through the Halloween feast: a troll is in the dungeons. Everyone is heading back to the dormitories.'),
    options: [
      o(L('হারিয়ে যাওয়া বন্ধুটাকে খুঁজতে উল্টো দিকে দৌড়াও', 'Run the other way to find the friend who is missing'), { loyal: 2, brave: 1 }),
      o(L('ভিড়ের ফাঁকে এক প্লেট কেক তুলে নাও; রাত লম্বা হবে', 'Grab a plate of cake on the way; it will be a long night'), { funny: 2 }),
      o(L('ভাবো: troll ঢুকল কীভাবে? কেউ তো ঢুকিয়েছে', 'Think: how did a troll get in? Someone let it in'), { clever: 2, mysterious: 1 }),
      o(L('শিক্ষকরা ব্যস্ত; বন্ধ ঘরগুলো দেখে আসার এটাই সুযোগ', 'The teachers are busy; time to explore the locked rooms'), { ambitious: 1, mysterious: 2 }, true),
    ],
  },
  {
    id: 's-cauldron', stage: 3,
    prompt: L('Potions ক্লাসে তোমার পোশন ভুল রঙ ধরেছে, ফুটছেও বেশি। শিক্ষক এদিকেই আসছেন।', 'Your potion has turned the wrong colour and is bubbling over. The teacher is walking your way.'),
    options: [
      o(L('রেসিপিটা আবার পড়ে চট করে একটা উপাদান যোগ করো', 'Re-read the recipe and add one quick fix'), { clever: 2 }),
      o(L('পাশের জনের কড়াই থেকে এক চামচ নিয়ে নাও; কেউ টের পাবে না', 'Borrow a spoonful from your neighbour; no one will notice'), { ambitious: 2 }, true),
      o(L('হেসে বলো, "স্যার, এটা আমার নতুন আবিষ্কার"', 'Smile and say, "Sir, this is my new invention"'), { funny: 2, brave: 1 }),
      o(L('আগে ভয় পাওয়া বন্ধুর কড়াইটা ঠিক করে দাও', 'Fix your nervous friend\'s cauldron first'), { loyal: 2 }),
    ],
  },
  {
    id: 's-talking-book', stage: 4,
    prompt: L('রাতে লাইব্রেরিতে একটা বই নিজে থেকে খুলে গেল। পাতায় তোমার নাম লেখা।', 'Late at night in the library, a book flips open on its own. Your name is written on the page.'),
    options: [
      o(L('পড়তে থাকো; শেষটা জানতেই হবে', 'Keep reading; you have to know how it ends'), { mysterious: 2, clever: 1 }),
      o(L('বন্ধুদের ডেকে আনো; এসব একা দেখার জিনিস না', 'Fetch your friends; this is not a solo job'), { loyal: 2 }),
      o(L('বইটা লুকিয়ে রাখো; এই ক্ষমতা আর কারও হাতে যাবে না', 'Hide the book; nobody else gets this power'), { ambitious: 1, mysterious: 1 }, true),
      o(L('বইটাকেই জিজ্ঞেস করো, "তুমি কে?"', 'Ask the book, "Who are you?"'), { brave: 2, funny: 1 }),
    ],
  },
  {
    id: 's-duel', stage: 4,
    prompt: L('Duelling Club-এ প্রতিপক্ষ সবার সামনে তোমাকে নিয়ে ঠাট্টা করল।', 'At Duelling Club, your opponent mocks you in front of everyone.'),
    options: [
      o(L('প্রথম spell-টা তুমিই ছোড়ো', 'Cast the first spell yourself'), { brave: 2 }),
      o(L('এমন পাল্টা জবাব দাও যে সবাই হেসে গড়াগড়ি', 'Fire back a line so good the room falls about laughing'), { funny: 2 }),
      o(L('কিছু বলো না, মনে রাখো; সময় হলে শোধ', 'Say nothing, remember everything, settle it later'), { mysterious: 1, ambitious: 1 }, true),
      o(L('ওর কৌশল দেখে নাও, তারপর ঠান্ডা মাথায় জেতো', 'Study their moves, then win with a cool head'), { clever: 2 }),
    ],
  },
  {
    id: 's-lost', stage: 5,
    prompt: L('জঙ্গলে পথ হারিয়েছ। দূরে একটা আলো, আর পেছনে কিছু একটার পায়ের শব্দ।', 'You are lost in the forest. A light glows ahead, and something is moving behind you.'),
    options: [
      o(L('আলোর দিকে এগোও, যা হবার হবে', 'Head for the light, come what may'), { brave: 2 }),
      o(L('গাছে উঠে চারপাশটা দেখে নাও, তারপর ঠিক করো', 'Climb a tree, scout the area, then decide'), { clever: 2 }),
      o(L('একটা ফাঁদ পেতে অপেক্ষা করো; এবার ও-ই ভয় পাবে', 'Set a trap and wait; let it be the one who is scared'), { ambitious: 1, mysterious: 1 }, true),
      o(L('জোরে গান গাইতে গাইতে হাঁটো; ভয় পালাবে', 'Walk on singing loudly; fear hates a tune'), { funny: 2, brave: 1 }),
    ],
  },
  {
    id: 's-creature', stage: 5,
    prompt: L('জঙ্গলের ধারে একটা আহত প্রাণী। দেখতে ভয়ংকর, কিন্তু চোখে ব্যথা।', 'An injured creature at the edge of the forest. Fearsome to look at, but clearly in pain.'),
    options: [
      o(L('কাছে গিয়ে ক্ষতটা বেঁধে দাও', 'Go close and bandage the wound'), { loyal: 2, brave: 1 }),
      o(L('বই ঘেঁটে বের করো এটা কোন প্রাণী, কী খায়', 'Look it up: what is it, and what does it eat?'), { clever: 2 }),
      o(L('চুপিচুপি পোষ মানাও; এমন সঙ্গী আর কারও নেই', 'Quietly tame it; nobody else has a companion like this'), { ambitious: 2, mysterious: 1 }),
      o(L('Hagrid-কে খবর দাও, ততক্ষণ ওকে গল্প শোনাও', 'Send for Hagrid and tell it stories while you wait'), { funny: 2, loyal: 1 }),
    ],
  },
  {
    id: 's-owl-letter', stage: 6,
    prompt: L('একটা পেঁচা চিঠি এনেছে। কেউ তোমার এক বন্ধুর গোপন কথা জানতে চায়, বদলে দেবে অনেক কিছু।', 'An owl brings a letter. Someone wants a friend\'s secret, and offers a lot in return.'),
    options: [
      o(L('কথাটা রাখো; বিশ্বাস ভাঙা যায় না', 'Keep the secret; trust is not for sale'), { loyal: 2 }),
      o(L('পাল্টা চিঠিতে জানতে চাও, ও আসলে কে', 'Write back asking who they really are'), { mysterious: 2, clever: 1 }),
      o(L('দর কষো; এমন সুযোগ রোজ আসে না', 'Negotiate; chances like this are rare'), { ambitious: 2 }, true),
      o(L('একটা ভুয়া গোপন কথা লিখে পাঠাও, তারপর মজা দেখো', 'Send a fake secret and enjoy the chaos'), { funny: 2, clever: 1 }),
    ],
  },
  {
    id: 's-tower-watch', stage: 6,
    prompt: L('Astronomy Tower থেকে দেখলে, রাতের অন্ধকারে কেউ Forbidden Forest-এর দিকে যাচ্ছে।', 'From the Astronomy Tower you spot someone slipping into the Forbidden Forest at night.'),
    options: [
      o(L('এখনই পিছু নাও', 'Follow them, right now'), { brave: 2 }),
      o(L('খাতায় লিখে রাখো: কে, কখন, কোথায়', 'Write it down: who, when, where'), { mysterious: 2, clever: 1 }),
      o(L('খবরটা জমিয়ে রাখো; ঠিক মানুষের কাছে এর দাম অনেক', 'Keep it to yourself; to the right person this is worth a lot'), { ambitious: 2 }, true),
      o(L('বন্ধুদের ঘুম থেকে তোলো; দল ছাড়া অভিযান নয়', 'Wake your friends; no adventure without the gang'), { loyal: 2, funny: 1 }),
    ],
  },
  {
    id: 's-last-night', stage: 7,
    prompt: L('শেষ রাত। দুর্গের ছাদে দাঁড়িয়ে মনে হলো, এখানে নিজের একটা চিহ্ন রেখে যাওয়া উচিত।', 'The last night. Standing on the castle roof, you feel you should leave your mark here.'),
    options: [
      o(L('দেয়ালে বন্ধুদের সবার নাম খোদাই করো', 'Carve all your friends\' names into the wall'), { loyal: 2, funny: 1 }),
      o(L('একটা গোপন ঘর বানাও, যেটা শুধু তুমিই খুঁজে পাবে', 'Build a secret room only you can find'), { mysterious: 2, clever: 1 }),
      o(L('এমন একটা দুষ্টুমি করো, যা নিয়ে বছরের পর বছর গল্প হবে', 'Pull a prank they will talk about for years'), { funny: 2, brave: 1 }),
      o(L('নিজের নামে একটা নিয়ম চালু করো, সবাই মানবে', 'Start a rule in your own name that everyone must follow'), { ambitious: 2 }, true),
    ],
  },
]
