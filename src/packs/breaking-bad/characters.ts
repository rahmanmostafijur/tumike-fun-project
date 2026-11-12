/**
 * 22 characters: 6 traits x 3 tiers, 3 dark (one per tier), 1 secret.
 * Most people here already live on the wrong side of the law, so "dark" means
 * cruel, selfish or ready to betray a partner, never just breaking the rules.
 * Names stay in English in both languages. Beginner results are written to
 * feel lovable, never insulting. No description mentions a death.
 */
import type { Localized, PackInput } from '../../engine/schema'

type C = PackInput['characters'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

export const characters: C[] = [
  // Legend
  {
    id: 'hank', kind: 'regular', tier: 'legend', trait: 'brave',
    name: L('Hank Schrader', 'Hank Schrader'), monogram: 'H',
    description: L(
      'বারবিকিউতে সবচেয়ে জোরে হাসো তুমি, কিন্তু একবার কোনো কেসের গন্ধ পেলে আর ছাড়ো না। হইচইয়ের নিচে লুকিয়ে আছে এক ধারালো গোয়েন্দা।',
      'You laugh the loudest at every barbecue, but once you smell a case you never let it go. Under all that noise is a seriously sharp investigator.',
    ),
    strength: L('একটা সূত্র পেলে শেষ পর্যন্ত লেগে থাকা', 'Never letting go of a lead'),
    weakness: L('তোমার জোকগুলো তোমার গ্রিলের চেয়েও বেশি গরম, আর বেশি জোরে', 'Your jokes are louder than your grill, and hotter too'),
    squad: L('আমার Gomez কে?', 'Who is my Gomez?'),
  },
  {
    id: 'walter-white', kind: 'regular', tier: 'legend', trait: 'clever',
    name: L('Walter White', 'Walter White'), monogram: 'WW',
    description: L(
      'চুপচাপ, নিখুঁত, আর বছরের পর বছর সবাই তোমাকে ছোট করে দেখেছে। যেকোনো সমস্যা দাও, তুমি সমাধান করবে, তারপর মনে মনে চাইবে সবাই যেন দেখত কে করল।',
      'Quiet, precise and underestimated for years. Hand you any problem and you will solve it, then quietly wish everyone had seen who did it.',
    ),
    strength: L('যে সমস্যা কেউ পারে না, সেটার সমাধান', 'Solving what nobody else can'),
    weakness: L('কেউ বিজ্ঞানে একটু ভুল বললেই শুধরে না দিয়ে থাকতে পারো না', 'Cannot let anyone get the science slightly wrong'),
    squad: L('আমার Jesse কে?', 'Who is my Jesse?'),
  },
  {
    id: 'jesse', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: L('Jesse Pinkman', 'Jesse Pinkman'), monogram: 'JP',
    description: L(
      'বাইরে খসখসে, ভেতরে বিশাল একটা মন। কথায় তুমি কঠিন, কিন্তু ঘরের সবার চেয়ে বেশি তুমিই অন্যদের কথা ভাবো, আর ঠিক কাজটা করার চেষ্টা থামাও না।',
      'Rough edges, huge heart. You talk tough, but you care more than anyone in the room, and you never stop trying to do the right thing.',
    ),
    strength: L('মানুষের ওপর থেকে কখনো পুরো আশা না ছাড়া', 'Never fully giving up on people'),
    weakness: L('তোমার কথার স্টাইল বুঝতে মাঝে মাঝে সাবটাইটেল লাগে', 'Your slang sometimes needs subtitles'),
    squad: L('আমার Mr. White কে?', 'Who is my Mr. White?'),
  },
  {
    id: 'gus', kind: 'regular', tier: 'legend', trait: 'ambitious',
    name: L('Gus Fring', 'Gus Fring'), monogram: 'GF',
    description: L(
      'শান্ত, ভদ্র, আর দশ বছর আগে থেকে পরিকল্পনা করা। তোমার উচ্চাকাঙ্ক্ষা কেউ টের পায় না, যতক্ষণ না পুরো সাম্রাজ্যটা দাঁড়িয়ে যায়।',
      'Calm, polite and planning ten years ahead. Nobody notices your ambition until the whole empire is already standing.',
    ),
    strength: L('সবাইকে ছাড়িয়ে যাওয়া ধৈর্য', 'Patience that outlasts everyone'),
    weakness: L('অন্যের টেবিলেও ন্যাপকিন সোজা না করে বসতে পারো না', 'Straightens the napkins even at someone else\'s table'),
    squad: L('আমার নিখুঁত সাজানো টেবিলে কার কার জায়গা হবে?', 'Who gets a seat at my perfectly arranged table?'),
  },
  {
    id: 'saul', kind: 'regular', tier: 'legend', trait: 'funny',
    name: L('Saul Goodman', 'Saul Goodman'), monogram: 'S',
    description: L(
      'কথা দ্রুত, স্যুট আরও উজ্জ্বল, আর সব কিছুর জন্য একটা টিভি বিজ্ঞাপন। যত বড় ঝামেলাই হোক, তোমার চেনা একজন লোক আছেই।',
      'Fast talk, louder suits and a TV advert for everything. Whatever the trouble, you always know a guy.',
    ),
    strength: L('কথার জোরে যেকোনো ঝামেলা থেকে বেরিয়ে আসা', 'Talking your way out of anything'),
    weakness: L('তোমার টাই মহাকাশ থেকেও দেখা যায়', 'Your ties are visible from space'),
    squad: L('আমার নম্বর কার কার স্পিড ডায়ালে থাকা দরকার?', 'Who needs my number on speed dial?'),
  },
  {
    id: 'mike', kind: 'regular', tier: 'legend', trait: 'mysterious',
    name: L('Mike Ehrmantraut', 'Mike Ehrmantraut'), monogram: 'M',
    description: L(
      'কথা কম, একটা চালও বাড়তি নয়, আর অতীত নিয়ে কেউ প্রশ্ন করে না। চুপচাপ সমস্যা মিটিয়ে তুমি বাড়ি ফেরো নাতনির কাছে।',
      'Few words, no wasted moves, and a past nobody asks about. You fix problems quietly, then head home to your granddaughter.',
    ),
    strength: L('প্রতিবার একই রকম ঠান্ডা, পেশাদার কাজ', 'Calm, professional work, every single time'),
    weakness: L('বেশি কথা বলা লোকের দিকে লম্বা, নীরব একটা চাহনি', 'A long, silent stare for anyone who talks too much'),
    squad: L('কোনো প্রশ্ন ছাড়াই কাকে ভরসা করি?', 'Who do I trust, no questions asked?'),
  },

  // Skilled
  {
    id: 'gomez', kind: 'regular', tier: 'skilled', trait: 'brave',
    name: L('Steve Gomez', 'Steve Gomez'), monogram: 'SG',
    description: L(
      'পার্টনারের ডান হাত, স্থির আর নির্ভীক। স্পটলাইট তোমার দরকার নেই; দরকারের সময় পাশে থাকাটাই তোমার কাজ।',
      'Your partner\'s right hand, steady and fearless. You do not need the spotlight; you just show up when it counts.',
    ),
    strength: L('ঠিক সময়ে ঠিক জায়গায় হাজির থাকা', 'Being there exactly when it counts'),
    weakness: L('পার্টনারের পুরোনো জোকেও প্রতিবার হেসে ফেলো', 'Laughs at your partner\'s old jokes, every time'),
    squad: L('আমার Hank কে?', 'Who is my Hank?'),
  },
  {
    id: 'gale', kind: 'regular', tier: 'skilled', trait: 'clever',
    name: L('Gale Boetticher', 'Gale Boetticher'), monogram: 'G',
    description: L(
      'নরম মনের, কৌতূহলী, আর বিজ্ঞান, কফি আর পুরোনো গান নিয়ে অফুরন্ত উৎসাহ। তুমি থাকলে ল্যাবটাও লাইব্রেরির মতো শান্ত লাগে।',
      'Gentle, curious and endlessly excited about science, coffee and old songs. With you around, even a lab feels like a library.',
    ),
    strength: L('ছোট্ট খুঁটিনাটিতেও আনন্দ খুঁজে পাওয়া', 'Finding joy in every tiny detail'),
    weakness: L('নিখুঁত এক কাপ কফি নিয়ে বিশ মিনিট লেকচার দিতে পারো', 'Can lecture for twenty minutes on the perfect cup of coffee'),
    squad: L('আমার সাথে কারাওকে গাইবে কে?', 'Who is singing karaoke with me?'),
  },
  {
    id: 'skinny-pete', kind: 'regular', tier: 'skilled', trait: 'loyal',
    name: L('Skinny Pete', 'Skinny Pete'), monogram: 'SP',
    description: L(
      'লম্বা, নরম গলার, আর হাড়ে হাড়ে বিশ্বস্ত। বন্ধু ডাকলে প্রতিবার হাজির, আর গোপনে দারুণ পিয়ানো বাজাও।',
      'Lanky, soft-spoken and loyal to the bone. You turn up every time a friend calls, and you secretly play the piano beautifully.',
    ),
    strength: L('যা-ই হোক, বন্ধুর পাশে থাকা', 'Sticking by your friends, whatever happens'),
    weakness: L('কথার মাঝখানে নিজের গভীর ভাবনায় হারিয়ে যাও', 'Drifts into deep thoughts in the middle of a sentence'),
    squad: L('আমার Jesse আর Badger কে?', 'Who are my Jesse and Badger?'),
  },
  {
    id: 'skyler', kind: 'regular', tier: 'skilled', trait: 'ambitious',
    name: L('Skyler White', 'Skyler White'), monogram: 'SW',
    description: L(
      'হিসাবে ধারালো, পরিকল্পনায় আরও ধারালো। একবার কাজে নামলে খাতাপত্র সবার চেয়ে ভালো সামলাও, আর গল্পটাকে বিশ্বাসযোগ্য করে তোলো।',
      'Sharp with numbers and sharper with a plan. Once you are in, you keep the books better than anyone and make the story believable.',
    ),
    strength: L('এলোমেলো অবস্থাকে গোছানো হিসাবে বদলে ফেলা', 'Turning chaos into a tidy spreadsheet'),
    weakness: L('অন্যের অজুহাতও নিজে বসে আরও বিশ্বাসযোগ্য করে লিখে দাও', 'Rewrites other people\'s excuses to make them more convincing'),
    squad: L('ফ্যামিলি বিজনেস সামলাতে আমার পাশে কে?', 'Who is helping me run the family business?'),
  },
  {
    id: 'badger', kind: 'regular', tier: 'skilled', trait: 'funny',
    name: L('Badger', 'Badger'), monogram: 'B',
    description: L(
      'বড় বড় আইডিয়া, তার চেয়েও বড় দিবাস্বপ্ন, আর সবসময় শোনানোর জন্য তৈরি একটা সায়েন্স-ফিকশন গল্প। তুমি থাকলে লম্বা রাতও বোরিং হয় না।',
      'Big ideas, bigger daydreams and a sci-fi story always ready to pitch. No long night is ever boring with you around.',
    ),
    strength: L('যেকোনো লম্বা রাতকে মজার বানিয়ে ফেলা', 'Making any long night fun'),
    weakness: L('কেউ না চাইলেও মহাকাশ অভিযানের পুরো স্ক্রিপ্ট শুনিয়ে দাও', 'Pitches a whole space-adventure script nobody asked for'),
    squad: L('আমার Skinny Pete কে?', 'Who is my Skinny Pete?'),
  },
  {
    id: 'lydia', kind: 'regular', tier: 'skilled', trait: 'mysterious',
    name: L('Lydia Rodarte-Quayle', 'Lydia Rodarte-Quayle'), monogram: 'L',
    description: L(
      'নিখুঁত, একটু নার্ভাস, আর সবসময় তিনটা ফোনকল এগিয়ে। তুমি কার পক্ষে, কেউ ঠিক জানে না; মাঝে মাঝে তুমি নিজেও না।',
      'Precise, a little nervous and always three phone calls ahead. Nobody quite knows whose side you are on, sometimes not even you.',
    ),
    strength: L('ছোট্ট খুঁটিনাটিও চোখ এড়ায় না', 'Nothing small ever escapes you'),
    weakness: L('এক কাপ চা অর্ডার করার আগেও বেরোনোর দরজা খুঁজে রাখো', 'Checks every exit before ordering a cup of tea'),
    squad: L('চুপচাপ ক্যাফেতে আমার সাথে দেখা করবে কে?', 'Who will meet me at the café, quietly?'),
  },

  // Beginner: lovable, never insulting
  {
    id: 'walter-jr', kind: 'regular', tier: 'beginner', trait: 'brave',
    name: L('Walter Jr.', 'Walter Jr.'), monogram: 'WJ',
    description: L(
      'সৎ, সোজাসাপ্টা, আর পরিবারের পক্ষে পুরো মন দিয়ে দাঁড়াও। যা ভাবো তা-ই বলো, আর বড়সড় নাশতা তোমার খুব প্রিয়।',
      'Honest, straightforward and fiercely on your family\'s side. You say what you think, and you love a big breakfast.',
    ),
    strength: L('সত্যি কথাটা জোর গলায় বলার সাহস', 'The nerve to say the honest thing out loud'),
    weakness: L('নাশতা বাদ? সেটা নিয়ে কোনো আলোচনাই হবে না', 'Skipping breakfast is not up for discussion'),
    squad: L('আমার Uncle Hank কে?', 'Who is my Uncle Hank?'),
  },
  {
    id: 'old-joe', kind: 'regular', tier: 'beginner', trait: 'clever',
    name: L('Old Joe', 'Old Joe'), monogram: 'OJ',
    description: L(
      'যন্ত্রপাতিতে ভরা একটা জাংকইয়ার্ড আর আইডিয়ায় ভরা একটা মাথা। যত পাগলাটে প্ল্যানই হোক, তুমি বলে দিতে পারো সেটা কাজ করবে কি না।',
      'A junkyard full of parts and a head full of know-how. However wild the plan, you can tell everyone whether it will actually work.',
    ),
    strength: L('কোন পাগলাটে আইডিয়া সত্যি কাজ করবে তা চিনে ফেলা', 'Spotting which wild idea might really work'),
    weakness: L('"কখনো কাজে লাগতে পারে" বলে উঠোনের কিছুই ফেলতে পারো না', 'Cannot throw anything out of the yard, just in case'),
    squad: L('আমার কাছে পরের পাগলাটে প্ল্যানটা কে নিয়ে আসবে?', 'Who is bringing me the next crazy plan?'),
  },
  {
    id: 'marie', kind: 'regular', tier: 'beginner', trait: 'loyal',
    name: L('Marie Schrader', 'Marie Schrader'), monogram: 'MS',
    description: L(
      'বেগুনিতে সাজানো, মনের কথা মুখে বলে দাও, হাজারটা প্রশ্ন করো, আর দরকারের সময় পরিবারের পাশে শক্ত হয়ে দাঁড়াও।',
      'Dressed in purple, you speak your mind, ask a hundred questions, and stand firmly by your family when it really counts.',
    ),
    strength: L('দরকারের সময় পরিবারের পাশে দাঁড়ানো', 'Standing by your family when it counts'),
    weakness: L('তোমার সবকিছুই বেগুনি, যেগুলো বেগুনি হওয়ার কথা না সেগুলোও', 'Everything you own is purple, even things that should not be'),
    squad: L('আমার Skyler কে?', 'Who is my Skyler?'),
  },
  {
    id: 'bogdan', kind: 'regular', tier: 'beginner', trait: 'ambitious',
    name: L('Bogdan', 'Bogdan'), monogram: 'B',
    description: L(
      'গর্বিত মালিক, কড়া বস, আর নিজের ব্যবসা নিয়ে ভীষণ খুঁতখুঁতে। তোমার কামানো প্রথম ডলারটা দেয়ালে ফ্রেমে বাঁধানো।',
      'Proud owner, strict boss and very particular about your business. The first dollar you ever earned hangs framed on the wall.',
    ),
    strength: L('শূন্য থেকে একটা ব্যবসা দাঁড় করানো', 'Building a business from nothing'),
    weakness: L('তোমার ভুরু জোড়াই অর্ধেক কথা বলে দেয়', 'Your eyebrows do half the talking'),
    squad: L('আমার কার ওয়াশে চাকরি চায় কে?', 'Who wants a job at my car wash?'),
  },
  {
    id: 'huell', kind: 'regular', tier: 'beginner', trait: 'funny',
    name: L('Huell', 'Huell'), monogram: 'H',
    description: L(
      'বিশাল, চুপচাপ আর কোনো কিছুতেই বিচলিত নও। প্রায় কিছুই বলো না, তবু তোমার নির্বিকার মুখ দেখেই সবাই হেসে ফেলে।',
      'Big, quiet and completely unbothered. You barely say a word, yet your deadpan face gets everyone laughing.',
    ),
    strength: L('যা-ই ঘটুক, একদম শান্ত থাকা', 'Staying perfectly calm, whatever happens'),
    weakness: L('যেকোনো জায়গায়, যেকোনো কিছুর ওপর ঘুমিয়ে পড়তে পারো', 'Can nap anywhere, on top of anything'),
    squad: L('আজ আমি কার বডিগার্ড?', 'Whose bodyguard am I today?'),
  },
  {
    id: 'jane', kind: 'regular', tier: 'beginner', trait: 'mysterious',
    name: L('Jane Margolis', 'Jane Margolis'), monogram: 'J',
    description: L(
      'শিল্পী মন, একটু আড়াল রাখা, আর কথায় দারুণ চটপটে। নিজের মতো থাকো, আর স্কেচখাতায় নিজের ছোট্ট জগৎ আঁকো।',
      'An artist\'s soul, a little guarded and very quick with words. You keep to yourself and draw your own small worlds in a sketchbook.',
    ),
    strength: L('এমন আইডিয়া, যা আর কারো মাথায় আসে না', 'Ideas nobody else would think of'),
    weakness: L('জানালার পর্দা বন্ধ, স্কেচখাতা আরও বেশি বন্ধ', 'Curtains closed, sketchbook even more so'),
    squad: L('আমার পাশের বাসার প্রতিবেশী কে?', 'Who is my next-door neighbour?'),
  },

  // Dark: cruel, selfish or ready to betray a partner
  {
    id: 'tuco', kind: 'dark', tier: 'legend',
    name: L('Tuco Salamanca', 'Tuco Salamanca'), monogram: 'T',
    description: L(
      'বিস্ফোরক, অনুমান করা অসম্ভব, আর উপেক্ষা করা আরও অসম্ভব। তুমি ঘরে ঢোকার আগেই তোমার মেজাজ ঘরটা ভরিয়ে ফেলে।',
      'Explosive, unpredictable and impossible to ignore. Your temper fills the room before you even walk in.',
    ),
    strength: L('থামানো যায় না এমন শক্তি', 'Pure, unstoppable energy'),
    weakness: L('এক সেকেন্ডের কম সময়ে শান্ত থেকে চিৎকারে', 'Goes from calm to shouting in under a second'),
    squad: L('আমার টেবিলের উল্টো দিকে বসার সাহস কার?', 'Who is brave enough to sit across my table?'),
  },
  {
    id: 'todd', kind: 'dark', tier: 'skilled',
    name: L('Todd', 'Todd'), monogram: 'T',
    description: L(
      'ভদ্র, খুশি করতে ব্যাকুল, আর ভুল জিনিস নিয়ে ভয় পাওয়ার মতো শান্ত। কাজ যা চায়, তুমি কোনো প্রশ্ন ছাড়াই তা-ই করো।',
      'Polite, eager to please and frighteningly calm about all the wrong things. Whatever the job asks, you do it without a single question.',
    ),
    strength: L('যা বলা হয়, ঠিক তা-ই করা', 'Always doing exactly what you are told'),
    weakness: L('যা-ই ঘটুক, মুখে সেই একই নরম হাসি', 'The same mild smile, whatever happens'),
    squad: L('আমার আংকেলের দলে কে কে আছ?', 'Who is joining my uncle\'s crew?'),
  },
  {
    id: 'ted', kind: 'dark', tier: 'beginner',
    name: L('Ted Beneke', 'Ted Beneke'), monogram: 'TB',
    description: L(
      'মিষ্টি হাসি, দামি চেহারা, আর খাতাপত্রে গোপনে লুকোনো একটা বিশাল জগাখিচুড়ি। তোমার আশা, যথেষ্ট হাসলে সমস্যাটা নিজেই চলে যাবে।',
      'A charming smile, an expensive look and a huge mess quietly hidden in the paperwork. You hope that if you smile enough, the problem will go away.',
    ),
    strength: L('প্রতিটা অস্বস্তিকর মিটিংয়ের জন্য একটা হাসি', 'A smile for every awkward meeting'),
    weakness: L('সমস্যা কার্পেটের নিচে লুকাও, আর সেই কার্পেট আরেকটা কার্পেটের নিচে', 'Hides problems under the rug, and the rug under another rug'),
    squad: L('কেউ টের পাওয়ার আগে আমার হিসাব মেলাতে সাহায্য করবে কে?', 'Who will help me fix my books before anyone notices?'),
  },

  // Secret: 100% knowledge in the full journey
  {
    id: 'heisenberg', kind: 'secret',
    name: L('Heisenberg', 'Heisenberg'), monogram: 'H',
    description: L(
      'কালো হ্যাট, কালো চশমা, আর এমন একটা নাম যা শুনলে মরুভূমিও চুপ হয়ে যায়। প্রতিটা উত্তর তুমি জানতে, কারণ গল্পটা তো তুমিই লিখেছ।',
      'A dark hat, dark glasses and a name that makes the whole desert go quiet. You knew every answer, because you wrote the story.',
    ),
    strength: L('প্রতিটা চাল আগে থেকেই জেনে রাখা', 'Knowing every move before it is made'),
    weakness: L('হ্যাটটা কখনো মাথা থেকে নামে না', 'The hat never comes off'),
    squad: L('আমার দলে কে কে আমার আসল নাম জানে?', 'Who in my crew knows my real name?'),
  },
]
