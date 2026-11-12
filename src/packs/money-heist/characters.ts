/**
 * 22 characters: 6 traits x 3 tiers, 3 dark (one per tier), 1 secret.
 * Everyone here is a robber, so "dark" means cruel, selfish or ready to betray
 * the team, never just breaking the law. Names stay in English in both
 * languages. Beginner results are written to feel lovable, never insulting.
 */
import type { Localized, PackInput } from '../../engine/schema'

type C = PackInput['characters'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

export const characters: C[] = [
  // Legend
  {
    id: 'tokyo', kind: 'regular', tier: 'legend', trait: 'brave',
    name: L('Tokyo', 'Tokyo'), monogram: 'T',
    description: L(
      'আগে লাফ দাও, ভাবনাটা পথেই সেরে নাও। সব যখন ভেঙে পড়ছে, তুমি তখন বিপদের দিকেই দৌড়াচ্ছ।',
      'You jump first and think on the way. When everything falls apart, you are already running towards the trouble.',
    ),
    strength: L('সবার আগে ঝাঁপিয়ে পড়ার সাহস', 'The nerve to go in first'),
    weakness: L('"একটু অপেক্ষা করো" কথাটা কানেই ঢোকে না', '"Just wait a second" never quite reaches your ears'),
    squad: L('আমার Rio আর Nairobi কে?', 'Who are my Rio and Nairobi?'),
  },
  {
    id: 'lisbon', kind: 'regular', tier: 'legend', trait: 'clever',
    name: L('Lisbon', 'Lisbon'), monogram: 'L',
    description: L(
      'মানুষকে তুমি কেস ফাইলের মতো পড়ে ফেলো। টেবিলের যেদিকেই বসো, তোমার ধার কমে না।',
      'You read people like case files, and whichever side of the table you sit on, you stay just as sharp.',
    ),
    strength: L('মুখ দেখেই মিথ্যা ধরে ফেলা', 'Catching a lie from a face'),
    weakness: L('কাজের ঘোরে কফি প্রতিবার ঠান্ডা হয়ে যায়', 'Your coffee goes cold mid-case, every single time'),
    squad: L('আমার Professor কে?', 'Who is my Professor?'),
  },
  {
    id: 'nairobi', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: L('Nairobi', 'Nairobi'), monogram: 'N',
    description: L(
      'দলটাকে তুমিই এক রাখো। সবাইকে বকাঝকা করো, তারপর একে একে খোঁজ নাও কে কেমন আছে।',
      'You hold the crew together. You scold everyone, then check on every single one of them.',
    ),
    strength: L('যেকোনো দলকে পরিবার বানিয়ে ফেলা', 'Turning any team into a family'),
    weakness: L('সবকিছুর কোয়ালিটি কন্ট্রোল নিজের হাতে চাই', 'Insists on quality-checking absolutely everything'),
    squad: L('আমার Helsinki আর Tokyo কে?', 'Who are my Helsinki and Tokyo?'),
  },
  {
    id: 'palermo', kind: 'regular', tier: 'legend', trait: 'ambitious',
    name: L('Palermo', 'Palermo'), monogram: 'P',
    description: L(
      'বড় প্ল্যান, তার চেয়েও বড় ভাষণ। ঘরের সবচেয়ে কঠিন কাজটা তোমার চাই, আর সবাই যেন জানে কাজটা তুমিই করেছ।',
      'Big plans, bigger speeches. You want the hardest job in the room, and you want everyone to know you did it.',
    ),
    strength: L('অসম্ভব প্ল্যানকে সম্ভব করার জেদ', 'The stubbornness to make an impossible plan work'),
    weakness: L('নেতৃত্ব অন্য কারো হাতে গেলেই মুখ ভার', 'Sulks the moment someone else is in charge'),
    squad: L('সবচেয়ে কঠিন প্ল্যানটা আমার সাথে কে বানাবে?', 'Who is designing the impossible plan with me?'),
  },
  {
    id: 'denver', kind: 'regular', tier: 'legend', trait: 'funny',
    name: L('Denver', 'Denver'), monogram: 'D',
    description: L(
      'তুমি পৌঁছানোর আগেই তোমার হাসি পৌঁছে যায়। জোরালো, উষ্ণ, আর ভেতরটা যতটা দেখাও তার চেয়ে অনেক নরম।',
      'Your laugh arrives before you do. Loud, warm, and much softer inside than you let anyone see.',
    ),
    strength: L('সবচেয়ে টেনশনের মুহূর্তেও হাসাতে পারা', 'Making people laugh at the tensest moment'),
    weakness: L('তোমার হাসি পুরো বিল্ডিং শুনতে পায়', 'The whole building can hear your laugh'),
    squad: L('আমার হাসি সহ্য করতে পারবে কে কে?', 'Who can put up with my laugh?'),
  },
  {
    id: 'berlin', kind: 'regular', tier: 'legend', trait: 'mysterious',
    name: L('Berlin', 'Berlin'), monogram: 'B',
    description: L(
      'রুচিশীল, ওপরে বরফশীতল, ভেতরটা পড়া অসম্ভব। ঘরের সবাই তোমাকেই দেখছে, আর তুমি সেটা ভালোই জানো।',
      'Elegant, ice-cold on the surface and impossible to read. Everyone in the room is watching you, and you know it.',
    ),
    strength: L('চাপের মধ্যেও একদম ঠান্ডা মাথা', 'A perfectly cool head under pressure'),
    weakness: L('একটা নাটকীয় ভাষণ ছাড়া কোনো কাজ শেষ হয় না', 'Cannot finish a task without a dramatic speech'),
    squad: L('আমার দলে থাকার যোগ্য কে কে?', 'Who is worthy of my crew?'),
  },

  // Skilled
  {
    id: 'stockholm', kind: 'regular', tier: 'skilled', trait: 'brave',
    name: L('Stockholm', 'Stockholm'), monogram: 'S',
    description: L(
      'তুমি প্ল্যানের অংশ ছিলে না, তবু সীমানা পার হয়ে এমন সাহস খুঁজে পেলে যা কেউ আশা করেনি, তুমি নিজেও না।',
      'You were never part of the plan, yet you crossed the line and found a courage nobody expected, not even you.',
    ),
    strength: L('ভয় পেয়েও সামনে এগিয়ে যাওয়া', 'Stepping forward while still scared'),
    weakness: L('ঘরের সবচেয়ে অপ্রত্যাশিত মানুষটার প্রেমে পড়া', 'Falling for the least likely person in the room'),
    squad: L('আমার Denver কে?', 'Who is my Denver?'),
  },
  {
    id: 'rio', kind: 'regular', tier: 'skilled', trait: 'clever',
    name: L('Rio', 'Rio'), monogram: 'R',
    description: L(
      'ঘরের সবচেয়ে ছোট, অথচ প্রতিটা তার আর সিগন্যাল তোমার চেনা। বাকিরা যখন ঘাবড়ে যায়, তুমি তখন যন্ত্র সারাও।',
      'The youngest in the room and the one who knows every wire and signal. You fix the tech while the others panic.',
    ),
    strength: L('যেকোনো গ্যাজেট দুই মিনিটে বশে আনা', 'Taming any gadget in two minutes'),
    weakness: L('প্রেমে পড়লে প্ল্যানের নিয়ম মনে থাকে না', 'Forgets every rule the moment you fall in love'),
    squad: L('আমার Tokyo কে?', 'Who is my Tokyo?'),
  },
  {
    id: 'helsinki', kind: 'regular', tier: 'skilled', trait: 'loyal',
    name: L('Helsinki', 'Helsinki'), monogram: 'H',
    description: L(
      'বিশাল, চুপচাপ আর নরম মনের। তুমি পাশে দাঁড়ালেই মানুষ নিরাপদ বোধ করে।',
      'Big, quiet and gentle. People feel safe the moment you stand beside them.',
    ),
    strength: L('বিপদে সবার আগে ঢাল হয়ে দাঁড়ানো', 'Being the shield when things go wrong'),
    weakness: L('ভেতরের নরম মনটা কিছুতেই লুকোতে পারো না', 'Your soft heart shows, every time'),
    squad: L('আজ আমি কার কার পাহারায়?', 'Whose back am I watching today?'),
  },
  {
    id: 'alicia', kind: 'regular', tier: 'skilled', trait: 'ambitious',
    name: L('Alicia Sierra', 'Alicia Sierra'), monogram: 'AS',
    description: L(
      'ধারালো, নাছোড়বান্দা, আর যে ভাবছে সে এগিয়ে আছে, তার চেয়ে সবসময় তিন চাল এগিয়ে।',
      'Sharp, relentless, and always three moves ahead of whoever thinks they are ahead.',
    ),
    strength: L('কোনোদিন হাল না ছাড়ার জেদ', 'A refusal to ever let go'),
    weakness: L('"শান্ত হও" বললে আরও রেগে যাও', 'Being told to calm down only makes it worse'),
    squad: L('বুদ্ধির খেলায় কে আমাকে হারাবে ভাবছ?', 'Who thinks they can outsmart me?'),
  },
  {
    id: 'bogota', kind: 'regular', tier: 'skilled', trait: 'funny',
    name: L('Bogotá', 'Bogotá'), monogram: 'B',
    description: L(
      'সহজ হাসি, স্থির হাত, আর প্রতিটা দাগের পেছনে একটা গল্প। কঠিন কাজকেও তুমি আরামের মতো দেখাও।',
      'An easy laugh, steady hands and a story behind every scar. You make hard work look relaxed.',
    ),
    strength: L('কঠিন কাজেও ঠান্ডা হাত আর মুখে হাসি', 'Cool hands and a grin on the hardest job'),
    weakness: L('নিজের প্রেমের গল্প শোনাতে ভালোবাসো, বারবার', 'Loves retelling your own love stories, again and again'),
    squad: L('রাতের শিফটে গল্প করতে করতে কাজ করবে কে?', 'Who is working the night shift with me?'),
  },
  {
    id: 'marseille', kind: 'regular', tier: 'skilled', trait: 'mysterious',
    name: L('Marseille', 'Marseille'), monogram: 'M',
    description: L(
      'কথা কম, স্নায়ু শক্ত। যেখানে দরকার ঠিক সেখানে হাজির হও, আর কোনো ভাষণ ছাড়াই চলে যাও।',
      'Few words, steady nerves. You turn up exactly where you are needed and leave without a speech.',
    ),
    strength: L('কথা কম, কাজ নিখুঁত', 'Few words, flawless work'),
    weakness: L('তোমার নীরবতা মাঝে মাঝে বন্ধুদের টেনশনে ফেলে', 'Your silences sometimes worry your friends'),
    squad: L('কোনো প্রশ্ন ছাড়াই আমার পেছনে দাঁড়াবে কে?', 'Who has my back, no questions asked?'),
  },

  // Beginner: lovable, never insulting
  {
    id: 'manila', kind: 'regular', tier: 'beginner', trait: 'brave',
    name: L('Manila', 'Manila'), monogram: 'M',
    description: L(
      'শহরের সবচেয়ে বিপজ্জনক জায়গায় তুমি হেসে ঢুকে পড়লে, সাথে একটা নিখুঁত গল্প। প্রথম দিনের ভয়, শেষ দিনের সাহস।',
      'You walked into the most dangerous building in the city with a smile and a perfect cover story. First-day nerves, last-day courage.',
    ),
    strength: L('যেকোনো ঘরে অভিনয় করে মিশে যাওয়া', 'Blending into any room with a perfect cover'),
    weakness: L('পুরোনো বন্ধুকে দেখলেই অভিনয় ভুলে যাও', 'Forgets the cover story the second an old friend walks in'),
    squad: L('আমার ছোটবেলার সবচেয়ে কাছের বন্ধু কে?', 'Who is my childhood best friend?'),
  },
  {
    id: 'benjamin', kind: 'regular', tier: 'beginner', trait: 'clever',
    name: L('Benjamín', 'Benjamín'), monogram: 'B',
    description: L(
      'শান্ত, কাজের মানুষ, হাতে জাদু। দলে হয়তো নতুন, কিন্তু কিছুতেই ঘাবড়াও না।',
      'Calm, practical and good with your hands. You may be new to the crew, but nothing rattles you.',
    ),
    strength: L('হাতের কাছে যা আছে তা দিয়েই সমাধান', 'Fixing it with whatever is lying around'),
    weakness: L('কেউ না চাইলেও সবাইকে বাবার মতো উপদেশ দাও', 'Hands out fatherly advice whether anyone asked or not'),
    squad: L('আজ কার আমার উপদেশ দরকার?', 'Who needs my advice today?'),
  },
  {
    id: 'moscow', kind: 'regular', tier: 'beginner', trait: 'loyal',
    name: L('Moscow', 'Moscow'), monogram: 'M',
    description: L(
      'উষ্ণ, স্থির, একটু পুরোনো ধাঁচের। তুমি সবাইকে শান্ত রাখো, আর আপনজনের জন্য পাহাড়ও খুঁড়ে ফেলতে পারো।',
      'Warm, steady and a little old-fashioned. You keep everyone calm, and you would dig through a mountain for your people.',
    ),
    strength: L('ধৈর্য ধরে শেষ পর্যন্ত খুঁড়ে যাওয়া', 'The patience to keep digging'),
    weakness: L('সন্তানকে নিয়ে দুশ্চিন্তা কখনো থামে না', 'Never stops worrying about your kid'),
    squad: L('আমার দলের ছোটরা কোথায়?', 'Where are the kids of my crew?'),
  },
  {
    id: 'angel', kind: 'regular', tier: 'beginner', trait: 'ambitious',
    name: L('Ángel', 'Ángel'), monogram: 'A',
    description: L(
      'যাদের তুমি শ্রদ্ধা করো, তাদের কাছে নিজেকে প্রমাণ করতে চাও, আর সেজন্য খুব, খুব চেষ্টা করো।',
      'You want to prove yourself to the people you admire, and you try very, very hard.',
    ),
    strength: L('কাজের প্রতি দারুণ নিষ্ঠা', 'Real dedication to the job'),
    weakness: L('মনের কথা বলতে বড্ড দেরি করে ফেলো', 'Takes far too long to say how you feel'),
    squad: L('কেউ বিশ্বাস না করলে আমাকে বিশ্বাস করবে কে?', 'Who believes me when nobody else does?'),
  },
  {
    id: 'matias', kind: 'regular', tier: 'beginner', trait: 'funny',
    name: L('Matías', 'Matías'), monogram: 'M',
    description: L(
      'হাসিখুশি, উৎসাহী, আর একটু এলোমেলো। পুরো প্রশ্ন শোনার আগেই তুমি "হ্যাঁ" বলে ফেলো।',
      'Cheerful, eager and a little chaotic. You say yes before you have heard the whole question.',
    ),
    strength: L('যেকোনো কাজে হাসিমুখে হাত লাগানো', 'Pitching in on anything with a grin'),
    weakness: L('পুরো প্ল্যান শোনার আগেই কাজে নেমে পড়ো', 'Starts before hearing the whole plan'),
    squad: L('আমার সাথে মজার ভুলগুলো করবে কে?', 'Who is making happy mistakes with me?'),
  },
  {
    id: 'oslo', kind: 'regular', tier: 'beginner', trait: 'mysterious',
    name: L('Oslo', 'Oslo'), monogram: 'O',
    description: L(
      'বিশাল, নীরব আর ভরসার মানুষ। তুমি কী ভাবছ কেউ জানে না, কিন্তু তুমি আছ বলে সবাই খুশি।',
      'Big, silent and dependable. Nobody knows what you are thinking, but everyone is glad you are there.',
    ),
    strength: L('কথায় না, কাজে বিশ্বাস জেতা', 'Winning trust with actions, not words'),
    weakness: L('সারা দিনে বড়জোর দুটো শব্দ', 'About two words a day, on a chatty day'),
    squad: L('আমার নীরবতা বুঝবে কে?', 'Who understands my silences?'),
  },

  // Dark: cruel, selfish or ready to betray the team
  {
    id: 'gandia', kind: 'dark', tier: 'legend',
    name: L('Gandía', 'Gandía'), monogram: 'G',
    description: L(
      'শক্ত, নিয়মে বাঁধা আর ভয়হীন। জেতার জন্য এমন কোনো সীমা নেই যা তুমি পার হবে না।',
      'Tough, disciplined and fearless, with no line you will not cross to win.',
    ),
    strength: L('চাপের মধ্যে অটল থাকা', 'Unshakable under pressure'),
    weakness: L('"দয়া" শব্দটা অভিধান থেকে কেটে দিয়েছ', 'You crossed "mercy" out of your dictionary'),
    squad: L('আমার কাছ থেকে পালাতে পারবে ভাবছে কে?', 'Who thinks they can outrun me?'),
  },
  {
    id: 'tamayo', kind: 'dark', tier: 'skilled',
    name: L('Tamayo', 'Tamayo'), monogram: 'T',
    description: L(
      'লড়াই জেতার চেয়ে প্রেস কনফারেন্স জেতা তোমার কাছে বেশি জরুরি। ভাবমূর্তিই সব।',
      'Winning the press conference matters more to you than winning the fight. Image is everything.',
    ),
    strength: L('ক্যামেরার সামনে দারুণ আত্মবিশ্বাস', 'Total confidence in front of a camera'),
    weakness: L('দোষটা সবসময় অন্য কারো', 'It is always someone else\'s fault'),
    squad: L('আজকের প্রেস কনফারেন্সে কে কে আসছ?', 'Who is coming to my press conference?'),
  },
  {
    id: 'arturo', kind: 'dark', tier: 'beginner',
    name: L('Arturo', 'Arturo'), monogram: 'A',
    description: L(
      'আগে নিজেকে বাঁচাও, আর সেটা জোর গলায়। তবু কীভাবে যেন প্রতিবার টিকে যাও, আর প্রতিটা বিষয়ে তোমার একটা মত থাকেই।',
      'You look out for number one, loudly. Somehow you always survive, and you always have an opinion.',
    ),
    strength: L('যেকোনো বিপদ থেকে কোনোভাবে বেরিয়ে আসা', 'Somehow always making it out'),
    weakness: L('এমন বীরত্বের গল্প শোনাও যা কখনো ঘটেনি', 'Tells heroic stories that never quite happened'),
    squad: L('আমার মোটিভেশনাল স্পিচ শুনতে কে কে আসবে?', 'Who is coming to my motivational talk?'),
  },

  // Secret: 100% knowledge in the full journey
  {
    id: 'professor', kind: 'secret',
    name: L('The Professor', 'The Professor'), monogram: 'P',
    description: L(
      'এটা তুমি মাসখানেক আগেই দেখে ফেলেছিলে। প্রতিটা চাল, প্রতিটা ভুল, প্রতিটা বেরোনোর রাস্তা: সব তোমার নোটবুকে লেখা।',
      'You saw this coming months ago. Every move, every mistake, every way out: already in your notebook.',
    ),
    strength: L('প্রতিটা সম্ভাবনার জন্য আলাদা প্ল্যান', 'A plan for every possibility'),
    weakness: L('প্রতিটা বাক্যের আগে চশমা ঠিক করো', 'Pushes up your glasses before every sentence'),
    squad: L('আমার দলে কার কোন শহরের নাম?', 'Which city name does each of my friends get?'),
  },
]
