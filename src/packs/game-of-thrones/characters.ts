/**
 * 22 characters: 6 traits x 3 tiers, 3 dark (one per tier), 1 secret.
 * TV series only. "Dark" means cruel, selfish or ready to betray anyone for
 * power. Descriptions never mention a death or the ending. Names stay in
 * English in both languages. Beginner results are written to feel lovable,
 * never insulting.
 */
import type { Localized, PackInput } from '../../engine/schema'

type C = PackInput['characters'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

export const characters: C[] = [
  // Legend
  {
    id: 'jon', kind: 'regular', tier: 'legend', trait: 'brave',
    name: L('Jon Snow', 'Jon Snow'), monogram: 'JS',
    description: L(
      'ঠিক কাজটা কঠিন হলেও তুমি সেটাই করো। কথা কম বলো, কিন্তু বিপদের দিনে সবার চোখ তোমার দিকেই যায়।',
      'You do the right thing even when it is the hard thing. You do not say much, but when trouble comes, every eye turns to you.',
    ),
    strength: L('যেকোনো দলকে এক পতাকার নিচে আনা', 'Uniting anyone under one banner'),
    weakness: L('একটু হাসতে যেন আলাদা অনুমতি লাগে', 'Smiling seems to need special permission'),
    squad: L('আমার Sam আর Tormund কে?', 'Who are my Sam and Tormund?'),
  },
  {
    id: 'tyrion', kind: 'regular', tier: 'legend', trait: 'clever',
    name: L('Tyrion Lannister', 'Tyrion Lannister'), monogram: 'TL',
    description: L(
      'তোমার সবচেয়ে বড় অস্ত্র তোমার মাথা আর তোমার কথা। যেকোনো ঘরে পাঁচ মিনিটেই সবাইকে পড়ে ফেলো, আর সবচেয়ে ধারালো কথাটা আসে তোমার মুখ থেকেই।',
      'Your mind and your words are your sharpest weapons. Five minutes in any room and you have read everyone, and the sharpest line is always yours.',
    ),
    strength: L('বই পড়ে আর মানুষ পড়ে লড়াই জেতা', 'Winning fights by reading books and people'),
    weakness: L('মুখে একটা চতুর কথা এলে চেপে রাখতে পারো না, সময় যেমনই হোক', 'Cannot hold back a clever remark, however bad the timing'),
    squad: L('রাত জেগে আমার সাথে তর্ক করবে কে?', 'Who is up for a late-night debate with me?'),
  },
  {
    id: 'brienne', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: L('Brienne of Tarth', 'Brienne of Tarth'), monogram: 'BT',
    description: L(
      'একবার কথা দিলে সেটা রাখতে তুমি পৃথিবীর শেষ মাথা পর্যন্ত যাবে। লোকে কী বলল, তাতে তোমার কিছুই যায় আসে না।',
      'Once you give your word, you will walk to the end of the world to keep it, whatever people say about you.',
    ),
    strength: L('দেওয়া কথা যেকোনো মূল্যে রাখা', 'Keeping your word at any cost'),
    weakness: L('কেউ প্রশংসা করলে কী বলবে বুঝে পাও না', 'No idea what to do with a compliment'),
    squad: L('আমার পাশে দাঁড়ানোর মতো সৎ মানুষ কে কে?', 'Who is honourable enough to stand beside me?'),
  },
  {
    id: 'daenerys', kind: 'regular', tier: 'legend', trait: 'ambitious',
    name: L('Daenerys Targaryen', 'Daenerys Targaryen'), monogram: 'DT',
    description: L(
      'তুমি ছাই থেকে উঠে দাঁড়াও, প্রতিবার আগের চেয়ে বড় হয়ে। তোমার স্বপ্ন বিশাল, আর সেটা ছুঁতে তুমি সমুদ্রও পার হতে রাজি।',
      'You rise from the ashes, bigger every time. Your dreams are enormous, and you would cross an ocean to reach them.',
    ),
    strength: L('অসম্ভব স্বপ্নের পেছনে হাল না ছেড়ে ছোটা', 'Chasing impossible dreams without ever letting go'),
    weakness: L('নিজের পরিচয় দিতে গেলে উপাধির তালিকা আর শেষ হয় না', 'Your introduction comes with a very long list of titles'),
    squad: L('আমার তিনটা ড্রাগন কে কে?', 'Who are my three dragons?'),
  },
  {
    id: 'bronn', kind: 'regular', tier: 'legend', trait: 'funny',
    name: L('Bronn', 'Bronn'), monogram: 'B',
    description: L(
      'তুমি কোনো ভান করো না। দাম ঠিক থাকলে তুমি আছ, আর তোমার সোজাসাপ্টা রসিকতা সবচেয়ে গম্ভীর মুখেও হাসি ফোটায়।',
      'You never pretend. If the price is right, you are in, and your blunt jokes crack the stoniest faces.',
    ),
    strength: L('কথায় আর তলোয়ারে যেকোনো ঝামেলা থেকে বেরোনো', 'Talking or fighting your way out of anything'),
    weakness: L('প্রতিটা উপকারের আগে জিজ্ঞেস করো, এতে তোমার লাভ কী', 'Asks what is in it for you before every favour'),
    squad: L('আমার সাথে বাজি ধরার সাহস কার?', 'Who dares to bet against me?'),
  },
  {
    id: 'arya', kind: 'regular', tier: 'legend', trait: 'mysterious',
    name: L('Arya Stark', 'Arya Stark'), monogram: 'AS',
    description: L(
      'ছোটখাটো, চুপচাপ, আর অবিশ্বাস্য রকম ক্ষিপ্র। ভিড়ের মধ্যে মিলিয়ে যাও, আর কেউ টের পাওয়ার আগেই তিন পা এগিয়ে থাকো।',
      'Small, quiet and impossibly quick. You vanish into a crowd and are three steps ahead before anyone notices you were there.',
    ),
    strength: L('যেকোনো ভিড়ে অদৃশ্য হয়ে যাওয়া', 'Disappearing into any crowd'),
    weakness: L('কোনো মুখ ভোলো না, ভালো হোক বা খারাপ', 'Never forgets a face, good or bad'),
    squad: L('আজ আমার সাথে তলোয়ার চালানো শিখবে কে?', 'Who is training with me today?'),
  },

  // Skilled
  {
    id: 'jaime', kind: 'regular', tier: 'skilled', trait: 'brave',
    name: L('Jaime Lannister', 'Jaime Lannister'), monogram: 'JL',
    description: L(
      'বাইরে থেকে অহংকারী, ভেতরে অনেক বেশি জটিল। গল্প যত এগোয়, ততই বোঝা যায় তোমার সাহস শুধু তলোয়ারে না, নিজেকে বদলানোর ইচ্ছাতেও।',
      'Proud on the outside, far more complicated inside. The longer the story runs, the clearer it gets that your courage lives not just in your sword but in your will to change.',
    ),
    strength: L('নিজেকে বদলানোর সাহস', 'The courage to change'),
    weakness: L('চুল ঠিক না থাকলে সারা দিন মেজাজ খারাপ', 'A bad hair day ruins the whole day'),
    squad: L('আমার Brienne কে?', 'Who is my Brienne?'),
  },
  {
    id: 'sansa', kind: 'regular', tier: 'skilled', trait: 'clever',
    name: L('Sansa Stark', 'Sansa Stark'), monogram: 'SS',
    description: L(
      'শুরু করেছিলে গানের গল্প আর রাজপুত্রের স্বপ্ন নিয়ে, তারপর শিখে নিলে কঠিন খেলাটা। এখন তুমি চুপচাপ দেখো, মনে রাখো, আর ঠিক সময়ে চাল দাও।',
      'You began with songs and dreams of princes, then learned the hard game. Now you watch, remember, and move at exactly the right time.',
    ),
    strength: L('চুপচাপ দেখে শেখা আর ঠিক সময়ে চাল দেওয়া', 'Watching quietly and moving at the perfect moment'),
    weakness: L('লেবুর কেক দেখলে কোনো সংযম থাকে না', 'Zero self-control around lemon cakes'),
    squad: L('উত্তরের এই দলে আমার সাথে কে কে?', 'Who is in my pack of the North?'),
  },
  {
    id: 'davos', kind: 'regular', tier: 'skilled', trait: 'loyal',
    name: L('Davos Seaworth', 'Davos Seaworth'), monogram: 'DS',
    description: L(
      'তুমি সাধারণ ঘর থেকে উঠে এসেছ, আর সেটা কখনো ভোলো না। রাজার মুখের ওপরেও সত্যি কথাটা বলো, কারণ সৎ উপদেশই তোমার আনুগত্য।',
      'You came from humble beginnings and never forget it. You tell kings the truth to their faces, because honest advice is your kind of loyalty.',
    ),
    strength: L('রাজার সামনেও সত্যি বলা', 'Telling kings the truth'),
    weakness: L('পড়তে শিখছ এখনো, তাই তাড়া দিলে চলবে না', 'Still practising your reading, so no rushing you'),
    squad: L('আমার সাথে নৌকা নিয়ে বিপদ পার হবে কে?', 'Who is sailing through trouble with me?'),
  },
  {
    id: 'margaery', kind: 'regular', tier: 'skilled', trait: 'ambitious',
    name: L('Margaery Tyrell', 'Margaery Tyrell'), monogram: 'MT',
    description: L(
      'মিষ্টি হাসি, নিখুঁত আদবকায়দা, আর তার পেছনে যত্নে আঁকা একটা পরিকল্পনা। তুমি জানো, মানুষের মন জিতলেই মুকুট কাছে আসে।',
      'A sweet smile, flawless manners and a carefully drawn plan behind them. You know that winning hearts brings the crown closer.',
    ),
    strength: L('যেকোনো ভিড়ের মন জিতে নেওয়া', 'Winning over any crowd'),
    weakness: L('দাদিকে না জিজ্ঞেস করে বড় কোনো চাল দাও না', 'Never makes a big move without asking Grandmother first'),
    squad: L('আমার দরবারে কে কে আসছ?', 'Who is joining my court?'),
  },
  {
    id: 'tormund', kind: 'regular', tier: 'skilled', trait: 'funny',
    name: L('Tormund Giantsbane', 'Tormund Giantsbane'), monogram: 'TG',
    description: L(
      'জোরে হাসো, জোরে লড়ো, আর মনের কথা লুকোনোর চেষ্টাই করো না। তুমি যেখানে, সেখানে আগুনের পাশের গল্পগুলোও জমে ওঠে।',
      'You laugh loud, fight loud and never bother hiding how you feel. Wherever you are, the stories by the fire get better.',
    ),
    strength: L('সবচেয়ে ঠান্ডা রাতেও মন গরম রাখা', 'Keeping spirits warm on the coldest night'),
    weakness: L('পছন্দের মানুষের দিকে তাকিয়ে থাকা থামাতে পারো না', 'Cannot stop gazing at the person you like'),
    squad: L('দেয়ালের ওপারে আমার সাথে কে যাবে?', 'Who is coming beyond the Wall with me?'),
  },
  {
    id: 'varys', kind: 'regular', tier: 'skilled', trait: 'mysterious',
    name: L('Varys', 'Varys'), monogram: 'V',
    description: L(
      'তুমি সব জানো, অথচ কীভাবে জানো তা কেউ জানে না। চারদিকে তোমার কান পাতা, আর কোনো খবরই তোমার আগে প্রাসাদে পৌঁছায় না।',
      'You know everything, and nobody knows how. You have ears everywhere, and no news reaches the palace before you do.',
    ),
    strength: L('সবার আগে খবর জেনে ফেলা', 'Hearing the news before it happens'),
    weakness: L('হঠাৎ পেছন থেকে হাজির হয়ে সবাইকে চমকে দাও', 'Appears behind people and makes them jump'),
    squad: L('এই দলে আমার গোপন খবরদাতা কে কে?', 'Who are my secret informants in this group?'),
  },

  // Beginner: lovable, never insulting
  {
    id: 'gendry', kind: 'regular', tier: 'beginner', trait: 'brave',
    name: L('Gendry', 'Gendry'), monogram: 'G',
    description: L(
      'হাতুড়ি হাতে থাকলেই তুমি সবচেয়ে খুশি। সাদাসিধে, পরিশ্রমী, আর ভয় পেলেও পিছিয়ে যাও না।',
      'You are happiest with a hammer in your hand. Simple, hardworking, and you do not back down even when you are scared.',
    ),
    strength: L('আগুন আর লোহা দিয়ে যা চাও তা-ই বানানো', 'Forging anything out of fire and iron'),
    weakness: L('একবার নৌকা নিয়ে বেরোলে বছরের পর বছর খবর থাকে না', 'Row off in a boat and nobody hears from you for years'),
    squad: L('আমার সাথে কামারশালায় কে কাজ করবে?', 'Who is working the forge with me?'),
  },
  {
    id: 'samwell', kind: 'regular', tier: 'beginner', trait: 'clever',
    name: L('Samwell Tarly', 'Samwell Tarly'), monogram: 'ST',
    description: L(
      'তলোয়ারের চেয়ে বই তোমার বেশি প্রিয়, আর সেটাই তোমার জাদু। সবাই যে পুরোনো পাতাগুলো এড়িয়ে যায়, উত্তরটা তুমি সেখানেই খুঁজে পাও।',
      'You prefer books to swords, and that is your magic. You find the answer in the old pages everyone else skips.',
    ),
    strength: L('লাইব্রেরির কোণে লুকানো উত্তর খুঁজে বের করা', 'Finding the answer hidden in a library corner'),
    weakness: L('বইয়ের জন্য ঘুম ছাড়তে পারো, খাবার কখনো না', 'Will skip sleep for a book, but never a meal'),
    squad: L('আমার Jon কে?', 'Who is my Jon?'),
  },
  {
    id: 'podrick', kind: 'regular', tier: 'beginner', trait: 'loyal',
    name: L('Podrick Payne', 'Podrick Payne'), monogram: 'PP',
    description: L(
      'লাজুক, ভদ্র, আর অসম্ভব বিশ্বস্ত। যে কাজ দেওয়া হয় চুপচাপ শেষ করো, আর মাঝে মাঝে সবাইকে অবাক করে দাও।',
      'Shy, polite and endlessly loyal. You quietly finish whatever job you are given, and now and then you surprise everyone.',
    ),
    strength: L('চুপচাপ, নিখুঁত সেবা', 'Quiet, faithful service'),
    weakness: L('ঘোড়ায় চড়াটা এখনো শেখা চলছে', 'Still working on that horse-riding thing'),
    squad: L('আজ আমি কার squire?', 'Whose squire am I today?'),
  },
  {
    id: 'theon', kind: 'regular', tier: 'beginner', trait: 'ambitious',
    name: L('Theon Greyjoy', 'Theon Greyjoy'), monogram: 'TG',
    description: L(
      'তুমি নিজেকে প্রমাণ করতে চাও, আর খুঁজে বেড়াও কোথায় তোমার আসল জায়গা। পথে কয়েকটা ভুল মোড় নিয়েছ, তবু ফিরে আসার সাহসটাই তোমাকে আলাদা করে।',
      'You want to prove yourself and keep searching for where you truly belong. You took a few wrong turns, but the courage to find your way back is what sets you apart.',
    ),
    strength: L('ভুল মেনে নিয়ে আবার শুরু করার সাহস', 'The courage to own a mistake and start again'),
    weakness: L('তিরের নিশানা দারুণ, সিদ্ধান্তের নিশানা একটু কম', 'Great aim with a bow, less so with decisions'),
    squad: L('আমাকে বাড়ির পথ দেখাবে কে?', 'Who will show me the way home?'),
  },
  {
    id: 'edd', kind: 'regular', tier: 'beginner', trait: 'funny',
    name: L('Dolorous Edd', 'Dolorous Edd'), monogram: 'E',
    description: L(
      'তোমার রসিকতা শুকনো আর মুখটা সবসময় দুঃখী, আর ঠিক সেই কারণেই সবাই হাসতে হাসতে গড়িয়ে পড়ে। দুনিয়ার সব ঝামেলা তোমার ভাগেই পড়ে, তুমি সেটা নিয়েও মজা করো।',
      'Your humour is dry and your face is forever gloomy, which is exactly why everyone laughs. Every bit of bad luck finds you, and you joke about that too.',
    ),
    strength: L('সবচেয়ে খারাপ দিনেও একটা শুকনো রসিকতা', 'A dry joke on the worst of days'),
    weakness: L('আকাশ পরিষ্কার থাকলেও তুষারঝড়ের পূর্বাভাস দাও', 'Forecasts a blizzard on a clear day'),
    squad: L('আজ রাতে আমার সাথে দেয়ালে পাহারা দেবে কে?', 'Who is on Wall duty with me tonight?'),
  },
  {
    id: 'hodor', kind: 'regular', tier: 'beginner', trait: 'mysterious',
    name: L('Hodor', 'Hodor'), monogram: 'H',
    description: L(
      'বিশাল শরীর, কোমল মন, আর মুখে একটাই শব্দ। তোমার ভেতরে কী চলে কেউ পুরোপুরি জানে না, কিন্তু তুমি পাশে থাকলে সব পথ সহজ লাগে।',
      'A giant frame, a gentle heart and a single word. Nobody knows quite what goes on inside you, but every road feels easier with you beside it.',
    ),
    strength: L('বন্ধুকে কাঁধে নিয়ে যেকোনো পথ পাড়ি দেওয়া', 'Carrying a friend down any road'),
    weakness: L('বাজ পড়ার শব্দে ভীষণ ঘাবড়ে যাও', 'Thunderstorms make you very nervous'),
    squad: L('আজ আমি কাকে কাঁধে নিয়ে ঘুরব?', 'Who am I carrying on my shoulders today?'),
  },

  // Dark: cruel, selfish or ready to betray anyone
  {
    id: 'cersei', kind: 'dark', tier: 'legend',
    name: L('Cersei Lannister', 'Cersei Lannister'), monogram: 'CL',
    description: L(
      'তুমি খেলো জেতার জন্য, আর জেতার পথে কাউকে ছাড় দাও না। পরিবারই তোমার কাছে সব; বাকি সবাই দাবার ঘুঁটি।',
      'You play to win, and you spare no one on the way. Family is everything to you; everyone else is a piece on the board.',
    ),
    strength: L('লোহার মতো শক্ত ইচ্ছাশক্তি', 'An iron will'),
    weakness: L('একবার শত্রু ভাবলে আর কোনোদিন ক্ষমা নেই', 'Once an enemy, never forgiven'),
    squad: L('আমার রাজ্যে কার কার জায়গা হবে?', 'Who gets a place in my realm?'),
  },
  {
    id: 'littlefinger', kind: 'dark', tier: 'skilled',
    name: L('Petyr Baelish', 'Petyr Baelish'), monogram: 'PB',
    description: L(
      'তুমি সবসময় এক চাল এগিয়ে, আর প্রতিটা চালে কারো না কারো বিশ্বাস ভাঙে। মুখে মিষ্টি হাসি, আর আসল মতলবটা কেউ আন্দাজও করতে পারে না।',
      'You are always one move ahead, and every move costs someone their trust. A sweet smile on your face, and nobody can guess what you really want.',
    ),
    strength: L('মানুষ কী চায় তা তাদের আগেই বুঝে ফেলা', 'Knowing what people want before they do'),
    weakness: L('সবসময় একটা গোপন মতলব, এমনকি নাস্তার টেবিলেও', 'Always a secret scheme, even at breakfast'),
    squad: L('আমাকে বিশ্বাস করার সাহস কার আছে?', 'Who is brave enough to trust me?'),
  },
  {
    id: 'joffrey', kind: 'dark', tier: 'beginner',
    name: L('Joffrey Baratheon', 'Joffrey Baratheon'), monogram: 'JB',
    description: L(
      'মুকুটটা তোমার মাথায় একটু বড়, আর মেজাজটা তার চেয়েও বড়। সবাই তোমার কথা শুনবে, এটাই তোমার একমাত্র নিয়ম।',
      'The crown is a little big for your head, and your temper is bigger still. Everyone must do as you say: that is your one and only rule.',
    ),
    strength: L('আকাশছোঁয়া আত্মবিশ্বাস', 'Sky-high self-confidence'),
    weakness: L('ঘরে কেউ হাসলেই মনে করো তোমাকে নিয়েই হাসছে', 'Thinks every laugh in the room is about you'),
    squad: L('আমার রাজসভায় হাততালি দেবে কে কে?', 'Who is clapping in my throne room?'),
  },

  // Secret: 100% knowledge in the full journey
  {
    id: 'three-eyed-raven', kind: 'secret',
    name: L('The Three-Eyed Raven', 'The Three-Eyed Raven'), monogram: 'TER',
    description: L(
      'তুমি অতীত দেখো, বর্তমান দেখো, আর এমন অনেক কিছু দেখো যা আর কেউ দেখে না। প্রতিটা উত্তর তোমার জানা ছিল, কারণ পুরো গল্পটাই তোমার স্মৃতিতে।',
      'You see the past, the present and much that nobody else can. You knew every answer, because the whole story lives in your memory.',
    ),
    strength: L('সব মনে রাখা, সব দেখা', 'Remembering everything, seeing everything'),
    weakness: L('সহজ প্রশ্নের উত্তরও দাও রহস্যময় ধাঁধায়', 'Answers simple questions with mysterious riddles'),
    squad: L('আমার বন্ধুদের অতীতে কী লুকানো আছে?', 'What is hiding in my friends\' past?'),
  },
]
