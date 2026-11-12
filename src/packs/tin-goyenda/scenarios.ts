import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 16 detective moments, four per case. Every option is meant
 * to be tempting; none is the "right" one. An option is flagged dark only when
 * it is what a cheating rival would do (copying, misleading, stealing the
 * credit), never anything worse. Picking dark often enough (40% or more)
 * leads to the dark-side character.
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  // Case 1: headquarters under the junk
  {
    id: 's-letter', stage: 1,
    prompt: L('হেডকোয়ার্টারে অচেনা একজনের চিঠি এল। লেখাটা কাঁপা কাঁপা, আর অনুরোধটা কেমন যেন অদ্ভুত।', 'A letter from a stranger lands at headquarters. The handwriting is shaky, and the request is strangely odd.'),
    options: [
      o(L('এখনই সাইকেল নিয়ে ঠিকানায় রওনা দিই', 'Grab the bicycle and head for the address right now'), { brave: 2, ambitious: 1 }),
      o(L('চিঠিটা তিনবার পড়ি; কোন কথাটা খাপ খাচ্ছে না, আগে সেটা খুঁজি', 'Read it three times and find the line that does not fit'), { clever: 2, mysterious: 1 }),
      o(L('আগে মুসা আর রবিনকে খবর দিই; গেলে তিনজন একসাথেই যাব', 'Call Musa and Robin first; if we go, we go as three'), { loyal: 2, funny: 1 }),
      o(L('চিঠির কথা চেপে যাই, একা কেসটা সেরে পুরো কৃতিত্ব নিজের নামে নিই', 'Keep the letter quiet, crack the case alone and take all the credit'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-yard-work', stage: 1,
    prompt: L('মক্কেল অপেক্ষা করছে, ঠিক তখনই মেরিচাচী তোমাকে দেখে ফেললেন। হাতে এক গাদা কাজ।', 'A client is waiting, and right then Meri Chachi spots you with a pile of jobs in hand.'),
    options: [
      o(L('কাজটাকে প্রতিযোগিতা বানিয়ে ফেলি; কে আগে শেষ করে!', 'Turn the chores into a race: who finishes first?'), { ambitious: 2, funny: 1 }),
      o(L('চাচীর সাথে চুক্তি করি: এখন কেস, বিকেলে দ্বিগুণ কাজ', 'Strike a deal with Chachi: the case now, double the chores this afternoon'), { funny: 2, clever: 1 }),
      o(L('আগে চাচীর কাজটা শেষ করি; মক্কেল একটু অপেক্ষা করুক', 'Finish Chachi\'s jobs first; the client can wait a little'), { loyal: 2, clever: 1 }),
      o(L('গোপন সুড়ঙ্গ দিয়ে চুপচাপ বেরিয়ে যাই, কেউ টেরও পাবে না', 'Slip out through the secret tunnel without anyone noticing'), { mysterious: 2, brave: 1 }),
    ],
  },
  {
    id: 's-entrance', stage: 1,
    prompt: L('হেডকোয়ার্টারে ঢোকার জন্য একটা নতুন গোপন পথ বানাতে হবে। তোমার নকশা কী?', 'Headquarters needs a new secret way in. What is your design?'),
    options: [
      o(L('জঞ্জালের নিচ দিয়ে লম্বা একটা পাইপের সুড়ঙ্গ', 'A long pipe tunnel running under the junk'), { mysterious: 2, clever: 1 }),
      o(L('একটা সাংকেতিক টোকা, যেটা শুধু আমরা তিনজন জানি', 'A secret knock that only the three of us know'), { loyal: 2, mysterious: 1 }),
      o(L('অনাহূত কেউ এলে মজার একটা ফাঁদ, যাতে সে চমকে পালায়', 'A funny trap that sends any intruder running'), { funny: 2, clever: 1 }),
      o(L('এমন জমকালো দরজা, যা দেখে সবাই বুঝবে এখানে গোয়েন্দারা থাকে', 'A grand door that tells everyone the detectives live here'), { ambitious: 2, funny: 1 }),
    ],
  },
  {
    id: 's-terry-fence', stage: 1,
    prompt: L('শুঁটকি টেরি ইয়ার্ডের বেড়ার ফাঁক দিয়ে উঁকি দিচ্ছে। তোমাদের নতুন কেসটা সে হাতাতে চায়।', 'Shutki Terry is peeping through a gap in the yard fence. He wants to steal your new case.'),
    options: [
      o(L('ইচ্ছে করে একটা ভুল সূত্র ফেলে রাখি; ও ভুল পথে ছুটুক', 'Leave a fake clue lying around and let him chase the wrong trail'), { clever: 2, funny: 1 }),
      o(L('সোজা গিয়ে মুখোমুখি দাঁড়াই', 'Walk straight over and face him'), { brave: 2, loyal: 1 }),
      o(L('পাত্তা না দিয়ে হেডকোয়ার্টারে চুপচাপ কাজ চালিয়ে যাই', 'Ignore him and keep working quietly in headquarters'), { mysterious: 2, clever: 1 }),
      o(L('ওর বাড়িতে লুকিয়ে ঢুকে আগে ওর নোটগুলোই পড়ে আসি', 'Sneak into his place and read his notes first'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Case 2: chasing clues by bicycle
  {
    id: 's-dry-street', stage: 2,
    prompt: L('সাক্ষী বলছে কাল রাতে খুব বৃষ্টি হয়েছিল, অথচ রাস্তা একদম খটখটে শুকনো।', 'The witness swears it poured all night, yet the street is bone dry.'),
    options: [
      o(L('কিছু না বলে খাতায় টুকে রাখি; মিথ্যাটাই একটা সূত্র', 'Say nothing and note it down; the lie itself is a clue'), { clever: 2, mysterious: 1 }),
      o(L('ভদ্রভাবে কিন্তু সরাসরি জিজ্ঞেস করি, রাস্তা শুকনো কেন', 'Ask politely but directly why the street is dry'), { brave: 2, clever: 1 }),
      o(L('একটা মজার গল্প জুড়ে সাক্ষীকে সহজ করি, যাতে মুখ খোলে', 'Crack a joke to relax the witness and get them talking'), { funny: 2, loyal: 1 }),
      o(L('খবরটা নিয়ে সবার আগে পুলিশের কাছে ছুটি; প্রথম কৃতিত্বটা আমার চাই', 'Race to the police first; I want the first credit'), { ambitious: 2, brave: 1 }),
    ],
  },
  {
    id: 's-flat-tyre', stage: 2,
    prompt: L('শহর থেকে অনেক দূরে মুসার সাইকেলের চাকা পাংচার। সন্ধ্যা নামছে, আর সন্দেহভাজনের গাড়ি দূরে মিলিয়ে যাচ্ছে।', 'Far out of town, Musa\'s bicycle gets a flat. Dusk is falling, and the suspect\'s car is disappearing down the road.'),
    options: [
      o(L('মুসার সাথে থাকি; দুজনে মিলে সাইকেল ঠেলে ফিরি', 'Stay with Musa and push the bikes back together'), { loyal: 2, funny: 1 }),
      o(L('আমি একাই এগিয়ে যাই, সূত্রটা হাতছাড়া করা যাবে না', 'Ride on alone; we cannot lose the trail'), { brave: 2, ambitious: 1 }),
      o(L('ইয়ার্ডে শেখা একটা কায়দায় পথেই চাকাটা সারিয়ে ফেলি', 'Patch the tyre on the spot with a trick learned in the yard'), { clever: 2, loyal: 1 }),
      o(L('গাড়িটা কোন দিকে গেল চুপচাপ খেয়াল করি, কাল সেখানেই ওত পাতব', 'Quietly note where the car turns, and lie in wait there tomorrow'), { mysterious: 2, clever: 1 }),
    ],
  },
  {
    id: 's-library', stage: 2,
    prompt: L('লাইব্রেরির পুরোনো এক খবরের কাগজে কেসের দারুণ একটা সূত্র পাওয়া গেছে। লাইব্রেরি বন্ধ হবে দশ মিনিট পর।', 'An old newspaper in the library holds a great clue to the case, and the library closes in ten minutes.'),
    options: [
      o(L('ঝড়ের বেগে পড়ে দরকারি কথাগুলো মুখস্থ করে ফেলি', 'Speed-read it and memorise everything that matters'), { ambitious: 2, clever: 1 }),
      o(L('লাইব্রেরিয়ানকে হাসিয়ে আরও দশ মিনিট আদায় করি', 'Charm the librarian into ten more minutes'), { funny: 2, clever: 1 }),
      o(L('হাতে লিখে কপি করি, যাতে বন্ধুরাও পরে পড়তে পারে', 'Copy it out by hand so my friends can read it later'), { loyal: 2, clever: 1 }),
      o(L('কাগজটা ভুল তাকে লুকিয়ে রাখি, যাতে টেরির দল খুঁজে না পায়', 'Hide the paper on the wrong shelf so Terry\'s gang cannot find it'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-lost-prize', stage: 2,
    prompt: L('শহরে ঘোষণা হলো: হারানো একটা জিনিস যে খুঁজে দেবে, সে পাবে পুরস্কার। টেরির দলও মাঠে নেমেছে।', 'The town announces a prize for whoever finds a lost item. Terry\'s gang has joined the hunt too.'),
    options: [
      o(L('ভোর হওয়ার আগেই খোঁজ শুরু করি; আগে পৌঁছানোই আসল', 'Start before dawn; getting there first is everything'), { ambitious: 2, brave: 1 }),
      o(L('পাড়ার ছেলেমেয়েদের দলে টানি; যত চোখ, তত সুবিধা', 'Rope in the neighbourhood kids; more eyes, better odds'), { loyal: 2, funny: 1 }),
      o(L('ভাবি, এমন জায়গা কোথায় যেখানে কেউ খোঁজার কথা ভাববে না', 'Think about the one place nobody would think to look'), { clever: 2, mysterious: 1 }),
      o(L('একটা গুজব ছড়িয়ে দিই, যাতে টেরির দল ভুল জায়গায় খোঁড়াখুঁড়ি করে', 'Spread a rumour so Terry\'s gang digs in the wrong place'), { mysterious: 2, ambitious: 1 }, true),
    ],
  },

  // Case 3: the foggy shore
  {
    id: 's-give-up', stage: 3,
    prompt: L('তিন দিন ধরে কোনো অগ্রগতি নেই। এক বন্ধু বলছে, "চল, কেসটা ছেড়ে দিই।"', 'Three days without progress. A friend says, "Let\'s just drop this case."'),
    options: [
      o(L('সবাইকে আইসক্রিম খাইয়ে মন ভালো করি, তারপর নতুন করে শুরু', 'Treat everyone to ice cream, then start fresh'), { funny: 2, loyal: 1 }),
      o(L('"আর একটা রাত। এবার আমি আগে যাব।"', '"One more night. This time I go first."'), { brave: 2, ambitious: 1 }),
      o(L('মেঝেতে সব সূত্র আবার বিছিয়ে বসি; কিছু একটা নিশ্চয়ই চোখ এড়িয়েছে', 'Spread every clue on the floor again; we must have missed something'), { clever: 2, ambitious: 1 }),
      o(L('বলি, তুই যা-ই ঠিক করিস, আমি তোর পাশেই আছি', 'Tell them that whatever they decide, I am right beside them'), { loyal: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-cliff-path', stage: 3,
    prompt: L('জোয়ার আসছে। রাতের অন্ধকারে খাড়া পাহাড়ের গা ঘেঁষে একটা শর্টকাট আছে, কিন্তু পথটা ঝুঁকির।', 'The tide is coming in. There is a shortcut along the cliff face in the dark, but it is risky.'),
    options: [
      o(L('টর্চ হাতে শর্টকাটটাই ধরি', 'Take the shortcut, torch in hand'), { brave: 2, ambitious: 1 }),
      o(L('ঘুরপথটাই নিই, তবে সবাই একসাথে', 'Take the long way round, all together'), { loyal: 2, clever: 1 }),
      o(L('জোয়ারের সময়টা হিসাব করি; তৃতীয় একটা পথ নিশ্চয়ই আছে', 'Work out the tide times; there has to be a third way'), { clever: 2, mysterious: 1 }),
      o(L('টেরির দলের লণ্ঠনের পিছু পিছু যাই, শেষ মুহূর্তে ওদের টপকে যাব', 'Trail Terry\'s gang by their lantern, then overtake them at the very end'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-sea-light', stage: 3,
    prompt: L('কুয়াশার ভেতর সাগর থেকে একটা আলো জ্বলছে-নিভছে, যেন কোনো সংকেত।', 'Through the fog, a light out at sea blinks on and off, like a signal.'),
    options: [
      o(L('আলোর ছন্দটা লিখে ফেলি; এটা নিশ্চয়ই কোনো সংকেত-ভাষা', 'Write down the pattern; it has to be a code'), { clever: 2, mysterious: 1 }),
      o(L('টর্চ জ্বেলে পাল্টা সংকেত পাঠাই, দেখি কী হয়', 'Flash the torch back and see what happens'), { brave: 2, funny: 1 }),
      o(L('পাথরের আড়ালে লুকিয়ে দেখি, তীর থেকে কে উত্তর দেয়', 'Hide behind the rocks and watch who answers from the shore'), { mysterious: 2, clever: 1 }),
      o(L('বুড়ো জেলের কাছে গিয়ে সবকিছু খুলে বলি, তার সাহায্য চাই', 'Tell the old fisherman everything and ask for his help'), { loyal: 2, funny: 1 }),
    ],
  },
  {
    id: 's-stolen-notes', stage: 3,
    prompt: L('টেরি তোমাদের নোট নকল করে পুলিশের সামনে দাবি করছে, রহস্যটা নাকি সে-ই সমাধান করেছে।', 'Terry copied your notes and is telling the police he solved the mystery.'),
    options: [
      o(L('শান্তভাবে খাতা খুলে তারিখসহ প্রতিটা নোট দেখাই', 'Calmly open the notebook and show every dated note'), { clever: 2, loyal: 1 }),
      o(L('হেসে উড়িয়ে দিই; কেস তো এখনো শেষই হয়নি', 'Laugh it off; the case is not even finished yet'), { funny: 2, mysterious: 1 }),
      o(L('চ্যালেঞ্জ দিই: পরের সূত্রটা যে আগে ভাঙবে, জিত তার', 'Challenge him: whoever cracks the next clue first wins'), { ambitious: 2, brave: 1 }),
      o(L('শোধ নিই: চুপচাপ ওর ব্যাগে একটা ভুয়া সূত্র ঢুকিয়ে দিই', 'Pay him back by slipping a fake clue into his bag'), { mysterious: 2, ambitious: 1 }, true),
    ],
  },

  // Case 4: the mystery house on the cliff
  {
    id: 's-locked-room', stage: 4,
    prompt: L('পাহাড়চূড়ার পুরোনো বাড়ির একটা ঘর ভেতর থেকে বন্ধ, চাবিটাও ভেতরে। অথচ ঘরে কেউ নেই।', 'A room in the old house on the cliff is bolted from inside, the key is inside too, and yet nobody is there.'),
    options: [
      o(L('কবজা, জানালা, মেঝে খুঁটিয়ে দেখি; বন্ধ ঘরের সবসময় একটা কৌশল থাকে', 'Check the hinges, window and floor; a locked room always has a trick'), { clever: 2, mysterious: 1 }),
      o(L('বাইরের কার্নিশ বেয়ে জানালা পর্যন্ত উঠে যাই', 'Climb along the outside ledge to the window'), { brave: 2, ambitious: 1 }),
      o(L('চুপচাপ লুকিয়ে অপেক্ষা করি, কে ফিরে আসে দেখি', 'Hide and wait quietly to see who comes back'), { mysterious: 2, clever: 1 }),
      o(L('বাড়ির বুড়ো কেয়ারটেকারের সাথে চা খেতে খেতে গল্প জমাই', 'Chat with the old caretaker over a cup of tea'), { funny: 2, loyal: 1 }),
    ],
  },
  {
    id: 's-footsteps', stage: 4,
    prompt: L('মাঝরাতে ওপরতলা থেকে পায়ের শব্দ। পাশ থেকে মুসা ফিসফিস করে উঠল, "খাইছে!"', 'Footsteps upstairs at midnight. Beside you, Musa whispers, "Khaise!"'),
    options: [
      o(L('আমি আগে উঠি, তোমরা পেছনে থাকো', 'I go up first; you stay behind me'), { brave: 2, loyal: 1 }),
      o(L('মুসার হাত ধরে সবাই একসাথে উঠি', 'Hold Musa\'s hand and we all go up together'), { loyal: 2, funny: 1 }),
      o(L('পাল্টা একটা ভূতুড়ে আওয়াজ করি; দেখি "ভূত" নিজেই ভয় পায় কি না', 'Make a spooky noise back and see if the "ghost" gets scared'), { funny: 2, brave: 1 }),
      o(L('পায়ের শব্দ গুনে বের করি, ঠিক কোন ঘরে সে আছে', 'Count the steps and work out exactly which room it is in'), { clever: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-reveal', stage: 4,
    prompt: L('রহস্যের সমাধান হয়ে গেছে, অপরাধী কে তুমি জানো। এবার সবাইকে জানানোর পালা।', 'The mystery is solved and you know who did it. Now it is time to tell everyone.'),
    options: [
      o(L('এমন ফাঁদ পাতি যাতে অপরাধী নিজেই ধরা দেয়', 'Set a trap so the culprit gives himself away'), { mysterious: 2, clever: 1 }),
      o(L('তিনজনে ভাগ করে বলি; প্রত্যেকে গল্পের এক টুকরো', 'Split the telling: each of us explains one piece'), { loyal: 2, funny: 1 }),
      o(L('সবার সামনে অপরাধীর মুখোমুখি দাঁড়িয়ে নিজেই বলি', 'Face the culprit in front of everyone and say it myself'), { brave: 2, ambitious: 1 }),
      o(L('শুধু নিজের নাম দিয়ে পুরো গল্পটা পত্রিকায় পাঠিয়ে দিই', 'Send the whole story to the newspaper with only my name on it'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-old-chest', stage: 4,
    prompt: L('বাড়ির গোপন কুঠুরিতে পুরোনো একটা সিন্দুক পাওয়া গেল। বাড়ির মালিকের বহুদিনের হারানো পারিবারিক জিনিস।', 'In a hidden cubbyhole of the house you find an old chest: the owner\'s long-lost family heirloom.'),
    options: [
      o(L('এখনই মালিকের হাতে ফিরিয়ে দিই', 'Return it to the owner right away'), { loyal: 2, brave: 1 }),
      o(L('আগে জানতে চাই, কে এটা লুকিয়েছিল আর কেন', 'First find out who hid it, and why'), { mysterious: 2, clever: 1 }),
      o(L('হেডকোয়ার্টারে ফিরে জম্পেশ একটা উৎসব করি', 'Head back to headquarters and throw a proper celebration'), { funny: 2, loyal: 1 }),
      o(L('আজ চুপ থাকি, কাল সাংবাদিকদের সামনে বলি আমি একাই খুঁজে পেয়েছি', 'Stay quiet today, then tell the reporters tomorrow I found it alone'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
]
