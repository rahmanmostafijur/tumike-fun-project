import type { Localized, PackInput } from '../../engine/schema'

/**
 * Knowledge pool: 28 questions over the five seasons (7, 6, 6, 5, 4), from easy
 * to real-fan hard. The full journey uses 14 and quick mode 6; the rest are
 * spares for the swap lifeline. All wording is original. Questions stay with
 * the story, people, places and objects: nothing about how drugs are made,
 * used or sold, and no answer reveals a death.
 * Convention: the correct option is written first; options are shuffled at runtime.
 * Every question is listed for fact-checking in docs/review-breaking-bad.md.
 */

type Q = PackInput['knowledge'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
/** Same text in both languages (names and titles). */
const N = (s: string): Localized => ({ bn: s, en: s })

function q(id: string, stage: number, memory: Localized | null, prompt: Localized, options: Localized[]): Q {
  return { id, stage, ...(memory ? { memory } : {}), prompt, options, answer: 0 }
}

export const knowledge: Q[] = [
  // Season 1: a teacher in the desert
  q('k-city', 1,
    L('ধুলোমাখা হাইওয়ে, চওড়া নীল আকাশ আর দূরে লালচে পাহাড়, মনে আছে প্রথম দেখাতেই শহরটা কেমন চেনা লেগেছিল?', 'Dusty highways, a huge blue sky and red hills in the distance: remember how quickly that city started to feel familiar?'),
    L('Breaking Bad-এর গল্পটা কোন শহরে?', 'Which city is Breaking Bad set in?'),
    [N('Albuquerque'), N('Phoenix'), N('El Paso'), N('Las Vegas')]),
  q('k-subject', 1, null,
    L('স্কুলে Walter White কোন বিষয় পড়ান?', 'What subject does Walter White teach at school?'),
    [L('রসায়ন', 'Chemistry'), L('পদার্থবিজ্ঞান', 'Physics'), L('জীববিজ্ঞান', 'Biology'), L('গণিত', 'Mathematics')]),
  q('k-second-job', 1,
    L('শিক্ষকের বেতনে সংসার চলে না, তাই শেষ ঘণ্টা বাজলেই Walt ছুটত আরেকটা কাজে, মনে আছে?', 'Remember how a teacher\'s pay never stretched far enough, so after the last bell Walt hurried off to a second job?'),
    L('গল্পের শুরুতে Walt কোথায় দ্বিতীয় চাকরি করেন?', 'Where does Walt work a second job at the start of the story?'),
    [L('একটা কার ওয়াশে', 'At a car wash'), L('একটা পিৎজার দোকানে', 'At a pizza place'), L('একটা হার্ডওয়্যারের দোকানে', 'At a hardware store'), L('ট্যাক্সি চালিয়ে', 'Driving a taxi')]),
  q('k-birthday', 1,
    L('প্রথম পর্বের সকালে নাশতার প্লেটে সাজানো একটা সংখ্যা দিয়ে Skyler জন্মদিনের শুভেচ্ছা জানিয়েছিল…', 'On the very first morning, Skyler wished him happy birthday with a number laid out on his breakfast plate…'),
    L('গল্প শুরুর দিন Walt-এর কততম জন্মদিন?', 'Which birthday is Walt celebrating when the story begins?'),
    [L('৫০তম', '50th'), L('৪০তম', '40th'), L('৪৫তম', '45th'), L('৬০তম', '60th')]),
  q('k-student', 1,
    L('Hank-এর গাড়িতে বসে Walt দেখল, জানালা দিয়ে লাফিয়ে পালাচ্ছে চেনা একটা মুখ…', 'Sitting in Hank\'s car, Walt watched a familiar face scramble out of a window and run…'),
    L('Walt আর Jesse একে অপরকে আগে থেকে চিনত কীভাবে?', 'How did Walt and Jesse know each other before?'),
    [L('Jesse ছিল Walt-এর পুরোনো ছাত্র', 'Jesse was Walt\'s former student'), L('Jesse ছিল Walt-এর ভাতিজা', 'Jesse was Walt\'s nephew'), L('দুজনে পাশাপাশি বাড়িতে থাকত', 'They were next-door neighbours'), L('দুজনে একই কার ওয়াশে কাজ করত', 'They worked at the same car wash')]),
  q('k-hank-job', 1, null,
    L('Hank Schrader কোথায় কাজ করেন?', 'Where does Hank Schrader work?'),
    [N('DEA'), N('FBI'), L('Albuquerque শহরের পুলিশ', 'The Albuquerque police'), L('একটা প্রাইভেট গোয়েন্দা সংস্থা', 'A private detective agency')]),
  q('k-alias', 1,
    L('মাথা কামানো, মুখে নতুন কঠিন ভাব: Walt যেদিন প্রথম নিজের জন্য একটা নতুন নাম বেছে নিল…', 'A shaved head and a hard new look: the day Walt first picked a new name for himself…'),
    L('Walt কোন ছদ্মনাম ব্যবহার করতে শুরু করেন?', 'Which alias does Walt start using?'),
    [N('Heisenberg'), N('Schrödinger'), N('Oppenheimer'), N('Einstein')]),

  // Season 2: the bear in the pool
  q('k-flynn', 2,
    L('বাড়িতে সবাই যাকে Junior ডাকে, সে একদিন জানিয়ে দিল এখন থেকে তাকে অন্য নামে ডাকতে হবে…', 'The boy everyone at home called Junior announced that he wanted a different name from now on…'),
    L('Walter Jr. নিজেকে কী নামে ডাকতে বলে?', 'What does Walter Jr. ask to be called?'),
    [N('Flynn'), N('Jack'), N('Kevin'), N('Danny')]),
  q('k-holly', 2, null,
    L('Walt আর Skyler-এর ছোট্ট মেয়ের নাম কী?', 'What is the name of Walt and Skyler\'s baby daughter?'),
    [N('Holly'), N('Hannah'), N('Hope'), N('Heather')]),
  q('k-pollos', 2,
    L('এক ঝকঝকে ফাস্টফুড দোকানের কাউন্টারের পেছনে দাঁড়িয়ে থাকা এক ভীষণ ভদ্র ম্যানেজার, মনে আছে প্রথম দেখা?', 'Remember first meeting that terribly polite manager behind the counter of a spotless fast-food place?'),
    L('Gus Fring কোন রেস্তোরাঁ চেইন চালান?', 'Which restaurant chain does Gus Fring run?'),
    [N('Los Pollos Hermanos'), N('El Rancho Grande'), N('Casa Fiesta'), N('Taco Loco')]),
  q('k-saul-first', 2,
    L('টিভির রঙিন বিজ্ঞাপন থেকে সোজা গল্পের ভেতরে ঢুকে পড়ল এক চটপটে উকিল…', 'A fast-talking lawyer stepped straight out of his loud TV adverts and into the story…'),
    L('Saul Goodman প্রথম কার উকিল হিসেবে গল্পে আসেন?', 'Saul Goodman first enters the story as whose lawyer?'),
    [N('Badger'), N('Skinny Pete'), N('Jesse Pinkman'), N('Tuco Salamanca')]),
  q('k-bear', 2,
    L('পুরো সিজন জুড়ে পর্বের শুরুতে সাদা-কালো ঝলক, আর মাঝে শুধু একটা জিনিস রঙিন…', 'All season, the episodes opened on black-and-white glimpses, with just one thing in colour…'),
    L('সিজনের শুরুর সেই ঝলকগুলোতে Walt-দের সুইমিং পুলে কী ভাসতে দেখা যায়?', 'What is seen floating in the Whites\' swimming pool in those opening glimpses?'),
    [L('একটা গোলাপি টেডি বেয়ার', 'A pink teddy bear'), L('একটা রাবারের হাঁস', 'A rubber duck'), L('একটা লাল বল', 'A red ball'), L('একটা খড়ের হ্যাট', 'A straw hat')]),
  q('k-jane', 2,
    L('তাদের মধ্যে যা যা ঘটেছিল তার অনেক আগে, Jesse আর Jane-এর প্রথম দেখাটা হয়েছিল একেবারে সাধারণভাবে…', 'Long before everything that happened between them, Jesse and Jane met in a very ordinary way…'),
    L('প্রথম দেখায় Jane Margolis ছিল Jesse-র কী?', 'What was Jane Margolis to Jesse when they first met?'),
    [L('তার বাড়িওয়ালি', 'His landlady'), L('তার উকিলের সহকারী', 'His lawyer\'s assistant'), L('তার স্কুলের পুরোনো বন্ধু', 'An old school friend'), L('তার ডাক্তার', 'His doctor')]),

  // Season 3: under the laundry
  q('k-ted', 3, null,
    L('অফিসে ফিরে Skyler-এর বস কে?', 'Who is Skyler\'s boss when she goes back to work?'),
    [N('Ted Beneke'), N('Saul Goodman'), N('Gus Fring'), N('Elliott Schwartz')]),
  q('k-gale', 3,
    L('নতুন, ঝকঝকে কাজের জায়গায় Walt পেল এক নরম স্বভাবের সহকারী, যে কফি আর পুরোনো গান দুটোই ভালোবাসে…', 'In his gleaming new workplace, Walt got a gentle assistant who loved coffee and old songs…'),
    L('Gus-এর নতুন ল্যাবে Walt-এর প্রথম সহকারী কে?', 'Who is Walt\'s first assistant in Gus\'s new lab?'),
    [N('Gale Boetticher'), N('Todd'), N('Skinny Pete'), N('Badger')]),
  q('k-laundry', 3,
    L('Gus কখনো কিছু এমন জায়গায় রাখত না যেখানে কেউ খুঁজতে যাবে, নিজের ল্যাব তো নয়ই…', 'Gus never kept anything where anyone would think to look, least of all his lab…'),
    L('Gus-এর গোপন ল্যাবটা কোথায় লুকোনো?', 'Where is Gus\'s hidden lab?'),
    [L('একটা ইন্ডাস্ট্রিয়াল লন্ড্রির নিচে', 'Beneath an industrial laundry'), L('একটা কার ওয়াশের নিচে', 'Beneath a car wash'), L('রেস্তোরাঁর রান্নাঘরের পেছনে', 'Behind a restaurant kitchen'), L('একটা জাংকইয়ার্ডের ভেতরে', 'Inside a junkyard')]),
  q('k-bell', 3,
    L('হুইলচেয়ারে বসা এক বৃদ্ধ, মুখে একটা কথাও নেই, তবু ঘরের সবাই তার উত্তরের অপেক্ষায়…', 'An old man in a wheelchair who never says a word, yet the whole room waits for his answer…'),
    L('Hector Salamanca কীভাবে কথা বলেন?', 'How does Hector Salamanca communicate?'),
    [L('একটা ঘণ্টা বাজিয়ে', 'By ringing a bell'), L('কাগজে লিখে', 'By writing notes'), L('শিস দিয়ে', 'By whistling'), L('হাতের ইশারায়', 'With hand signs')]),
  q('k-fly', 3,
    L('পুরো একটা পর্ব প্রায় একটা ঘরের ভেতরে, আর Walt-এর মাথায় শুধু একটাই চিন্তা…', 'A whole episode spent almost entirely in one room, with Walt fixated on one thing…'),
    L('সেই বিখ্যাত পর্বে Walt ল্যাবে কী ধরার জন্য পাগল হয়ে ওঠেন?', 'In that famous episode, what is Walt desperate to catch in the lab?'),
    [L('একটা মাছি', 'A fly'), L('একটা ইঁদুর', 'A mouse'), L('একটা বাদুড়', 'A bat'), L('একটা মথ', 'A moth')]),
  q('k-brock', 3, null,
    L('Jesse-র বান্ধবী Andrea-র ছোট্ট ছেলের নাম কী?', 'What is the name of Andrea\'s young son?'),
    [N('Brock'), N('Brad'), N('Blake'), N('Bruce')]),

  // Season 4: behind the calm smile
  q('k-minerals', 4,
    L('সেরে ওঠার লম্বা দিনগুলোতে Hank-এর ঘরে একের পর এক পার্সেল আসত, আর কেউ ভুল নামে ডাকলেই রেগে যেতেন…', 'During his long recovery, parcel after parcel arrived for Hank, and he hated it when anyone called them by the wrong name…'),
    L('সেরে ওঠার সময় Hank কী জমাতে শুরু করেন?', 'What does Hank start collecting while he recovers?'),
    [L('খনিজ পাথর', 'Minerals'), L('পুরোনো মুদ্রা', 'Old coins'), L('ডাকটিকিট', 'Stamps'), L('মডেল ট্রেন', 'Model trains')]),
  q('k-car-wash-name', 4, null,
    L('Walt আর Skyler যে কার ওয়াশটা কিনে নেন, তার নাম কী?', 'What is the car wash that Walt and Skyler buy called?'),
    [N('A1A Car Wash'), N('Sparkle Car Wash'), N('Desert Shine'), N('Blue Wave Car Wash')]),
  q('k-cover-story', 4,
    L('পরিবারকে বিশ্বাস করাতে Skyler নিজে বসে একটা নিখুঁত গল্প সাজাল, এমনকি রিহার্সালও করাল…', 'To convince the family, Skyler wrote a careful cover story and even made Walt rehearse it…'),
    L('টাকার উৎস হিসেবে পরিবারকে কী গল্প বলা হয়?', 'What story do they tell the family to explain the money?'),
    [L('জুয়ায় তাস গুনে জেতা', 'He won it counting cards at blackjack'), L('দূরের আত্মীয়ের উত্তরাধিকার', 'An inheritance from a distant relative'), L('লটারির টিকিট', 'A winning lottery ticket'), L('পুরোনো একটা আবিষ্কার বিক্রি', 'Selling an old invention')]),
  q('k-chile', 4, null,
    L('Gus Fring আসলে কোন দেশের মানুষ?', 'Which country does Gus Fring originally come from?'),
    [N('Chile'), N('Mexico'), N('Colombia'), N('Spain')]),
  q('k-challenger', 4,
    L('ছেলেকে খুশি করতে Walt বাড়িতে নিয়ে এলেন একটা চকচকে উপহার, আর Skyler-এর মুখ দেখার মতো হলো…', 'To win his son over, Walt brought home a shiny present, and Skyler\'s face said it all…'),
    L('Walt ছেলের জন্য কোন গাড়ি কিনে আনেন?', 'Which car does Walt buy for his son?'),
    [L('একটা লাল Dodge Challenger', 'A red Dodge Challenger'), L('একটা কালো Chevrolet Impala', 'A black Chevrolet Impala'), L('একটা হলুদ Hummer', 'A yellow Hummer'), L('একটা রুপালি Ford Mustang', 'A silver Ford Mustang')]),

  // Season 5: the last road home
  q('k-book', 5,
    L('বাথরুমে বসে হাতের কাছের একটা বই উল্টাতেই Hank-এর চোখ আটকে গেল ভেতরের একটা লেখায়…', 'Flipping through a book he found in the bathroom, Hank froze at a handwritten note inside…'),
    L('কোন বই থেকে Hank সবচেয়ে বড় সূত্রটা পান?', 'Which book gives Hank his biggest clue?'),
    [N('Leaves of Grass'), N('Moby-Dick'), N('The Great Gatsby'), N('Of Mice and Men')]),
  q('k-vacuum', 5, null,
    L('মানুষকে নতুন পরিচয় দিয়ে গায়েব করে দেওয়া লোকটার ব্যবসার আড়াল কী?', 'What shop is the cover for the man who gives people brand-new identities?'),
    [L('ভ্যাকুয়াম ক্লিনার মেরামতের দোকান', 'A vacuum cleaner repair shop'), L('তালাচাবির দোকান', 'A locksmith'), L('ছবি তোলার স্টুডিও', 'A photo studio'), L('পুরোনো বইয়ের দোকান', 'A second-hand bookshop')]),
  q('k-hideout', 5,
    L('বরফে ঢাকা জঙ্গলের মাঝে একলা একটা কেবিন, মরুভূমি থেকে যতটা দূরে যাওয়া যায়…', 'A lonely cabin in snowy woods, about as far from the desert as you can get…'),
    L('শেষের দিকে Walt কোন রাজ্যে লুকিয়ে থাকেন?', 'Which state does Walt hide out in near the end?'),
    [N('New Hampshire'), N('Alaska'), N('Montana'), N('Maine')]),
  q('k-mcgill', 5,
    L('Saul একবার হেসে স্বীকার করেছিলেন, তাঁর নামটা আসলে ব্যবসার জন্য বানানো…', 'Saul once admitted with a grin that his name was really just good for business…'),
    L('Saul Goodman-এর আসল পদবি কী?', 'What is Saul Goodman\'s real surname?'),
    [N('McGill'), N('Goldberg'), N('Kettleman'), N('Wexler')]),
]
