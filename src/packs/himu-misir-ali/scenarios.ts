import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 16 night moments, four per chapter. This is the heart of the
 * pack: logic against wonder. Misir Ali explains everything, Himu refuses to,
 * and most scenes ask which side of you answers first. Every option is meant
 * to be tempting; none is the "right" one. An option is flagged dark only when
 * it is cold or selfish (at most one per scenario), never anything worse.
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  // Chapter 1: evening at the tea stall
  {
    id: 's-rain-stranger', stage: 1,
    prompt: L('চায়ের দোকানে এক অচেনা লোক তোমার নাম ধরে ডাকল। বলল, আকাশ যতই পরিষ্কার থাকুক, আজ রাত বারোটায় বৃষ্টি নামবে।', 'At the tea stall a stranger calls you by name. However clear the sky, he says, it will rain tonight at twelve.'),
    options: [
      o(L('জিজ্ঞেস করি, আমার নাম সে জানল কীভাবে; কোথাও একটা ব্যাখ্যা আছেই', 'Ask how he knows my name; there is an explanation somewhere'), { clever: 2, brave: 1 }),
      o(L('হেসে মাথা নাড়ি: "তাহলে বারোটায় ভিজতে বেরোব"', 'Smile and nod: "Then I will be out walking in it at twelve"'), { mysterious: 2, funny: 1 }),
      o(L('তাকে এক কাপ চা খাওয়াই, আর তার পুরো গল্পটা শুনি', 'Buy him a cup of tea and hear his whole story'), { loyal: 2, mysterious: 1 }),
      o(L('চায়ের বিল বাজি ধরি: বৃষ্টি নামবেই না', 'Bet him the tea bill that it will not rain'), { funny: 2, ambitious: 1 }),
    ],
  },
  {
    id: 's-palm', stage: 1,
    prompt: L('বেঞ্চের কোণে বসা এক বুড়ো হাত দেখতে চাইলেন। বললেন, তোমার কপালে নাকি অদ্ভুত কিছু লেখা আছে।', 'An old man on the corner of the bench asks to see your palm. Something unusual is written in your fate, he says.'),
    options: [
      o(L('হাতটা বাড়িয়ে দিই; ভবিষ্যৎ নিজেই চমকে দিক', 'Hold out my hand and let the future surprise me'), { mysterious: 2, brave: 1 }),
      o(L('হাত দিই, আর খেয়াল করি তিনি আমার জামা-জুতো দেখে কী কী আন্দাজ করছেন', 'Hold it out, and watch what he guesses from my clothes and shoes'), { clever: 2, funny: 1 }),
      o(L('গম্ভীর মুখে উল্টো তাঁর হাতটাই দেখে দিই', 'Read his palm instead, with a perfectly straight face'), { funny: 2, brave: 1 }),
      o(L('শুধু একটা প্রশ্ন করি: বড় হয়ে নাম করব তো?', 'Ask just one thing: will I make a name for myself?'), { ambitious: 2, funny: 1 }),
    ],
  },
  {
    id: 's-old-house', stage: 1,
    prompt: L('দোকানের পুরোনো খবরের কাগজে ছোট্ট এক খবর: পুরান ঢাকার এক পোড়ো বাড়িতে রোজ রাতে আলো জ্বলে, অথচ সেখানে কেউ থাকে না।', 'A small item in the stall\'s old newspaper: every night a light comes on in an empty house in old Dhaka, though nobody lives there.'),
    options: [
      o(L('আজ রাতেই গিয়ে নিজের চোখে দেখে আসি', 'Go tonight and see it with my own eyes'), { brave: 2, mysterious: 1 }),
      o(L('খবরটা কেটে রাখি, একটা ফাইল খুলি; এমন খবর আরও আসবে, তখন মিলিয়ে দেখব', 'Cut it out and start a file; more will come, and the pattern will show'), { clever: 2, mysterious: 1 }),
      o(L('ভূতের গলায় খবরটা জোরে পড়ে শোনাই দোকানের সবাইকে', 'Read it aloud to the whole stall in a ghostly voice'), { funny: 2, brave: 1 }),
      o(L('ভাবি, আলোটা হয়তো কারো জন্য অপেক্ষা করছে, আর মনটা কেমন করে ওঠে', 'Wonder if the light is waiting for someone, and feel a strange ache'), { mysterious: 2, loyal: 1 }),
    ],
  },
  {
    id: 's-tea-bill', stage: 1,
    prompt: L('চা শেষ, বিল দেওয়ার সময়। হঠাৎ টের পেলে, সাথে একটা টাকাও নেই।', 'Tea finished, time to pay, and you suddenly realise you do not have a single taka on you.'),
    options: [
      o(L('দোকানিকে কথা দিই কাল সকালেই দেব, আর সত্যিই সবার আগে আসি', 'Promise to pay first thing tomorrow, and really be there first'), { loyal: 2, brave: 1 }),
      o(L('এমন একটা গল্প শোনাই যে দোকানি বিলের কথাই ভুলে যান', 'Tell him a story so good he forgets about the bill'), { funny: 2, mysterious: 1 }),
      o(L('এক ঘণ্টা দোকান সামলে দিই, তিনি একটু জিরিয়ে নিন', 'Run the stall for an hour so he can rest, and earn it'), { ambitious: 2, loyal: 1 }),
      o(L('তিনি অন্যদিকে ফিরতেই চুপচাপ উঠে পড়ি; এক কাপ চায়ে কী আসে যায়', 'Slip away while he turns around; what is one cup of tea'), { mysterious: 2, brave: 1 }, true),
    ],
  },

  // Chapter 2: walking the empty lanes
  {
    id: 's-no-destination', stage: 2,
    prompt: L('রাত বারোটা পেরিয়েছে। কোথাও যাওয়ার নেই, তবু হাঁটছ। সামনে গলিটা দুই ভাগ হয়ে গেছে।', 'It is past midnight. You have nowhere to go, and you are walking anyway. Ahead, the lane splits in two.'),
    options: [
      o(L('যে গলিতে একটাও বাতি নেই, সেদিকেই যাই', 'Take the lane with no streetlight at all'), { brave: 2, mysterious: 1 }),
      o(L('দূর থেকে বাঁশির সুর আসছে, সেটা ধরে হাঁটি', 'Follow the sound of a flute somewhere far off'), { mysterious: 2, loyal: 1 }),
      o(L('যে পথটা ঘুরে বড় রাস্তায় মেশে, সেটা নিই; ঘোরাঘুরি ভালো, তবে মানচিত্রটা মাথায় থাকুক', 'Take the one that loops back to the main road; wandering is fine, but keep the map in my head'), { clever: 2, brave: 1 }),
      o(L('পয়সা ছুড়ে নিয়ম বানাই: হেড হলে বাঁয়ে, টেল হলে আরেক কাপ চা', 'Toss a coin: heads goes left, tails means another cup of tea'), { funny: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-patrol', stage: 2,
    prompt: L('টহল পুলিশের গাড়ি থামল পাশে: "এত রাতে কোথায় যাচ্ছেন?"', 'A night patrol pulls up beside you: "Where are you off to at this hour?"'),
    options: [
      o(L('শান্ত হেসে বলি, "কোথাও না, এমনি হাঁটছি"', 'Smile calmly: "Nowhere at all, just walking"'), { mysterious: 2, funny: 1 }),
      o(L('গুছিয়ে সব খুলে বলি, পরিচয়পত্র দেখাই, ভদ্রভাবে তাঁদের নামও জেনে নিই', 'Explain clearly, show my ID, and politely ask their names too'), { clever: 2, loyal: 1 }),
      o(L('বলি, আপনাদের ক্লান্ত দেখাচ্ছে; চলুন মোড়ের দোকানে এক কাপ চা খাই', 'Tell them they look tired, and invite them for tea at the corner stall'), { funny: 2, loyal: 1 }),
      o(L('এক বড় আত্মীয়ের নাম বলে দিই, যাতে আর কোনো প্রশ্ন না করে', 'Drop the name of an important relative so the questions stop'), { ambitious: 2, brave: 1 }, true),
    ],
  },
  {
    id: 's-stray-dog', stage: 2,
    prompt: L('একটা নেড়ি কুকুর তিনটা গলি ধরে তোমার পিছু পিছু আসছে।', 'A stray dog has followed you for three lanes now.'),
    options: [
      o(L('একটা নাম দিই, একটা বনরুটি কিনে দিই; এখন আমরা দুজন', 'Give it a name and buy it a bun; now there are two of us'), { loyal: 2, funny: 1 }),
      o(L('ভাবি, ও হয়তো আমাকে কোথাও নিয়ে যেতে চায়; ওর পিছু নিই', 'Maybe it wants to lead me somewhere; follow it instead'), { mysterious: 2, brave: 1 }),
      o(L('খেয়াল করি কোন গলিটা ও এড়িয়ে যাচ্ছে, আর কারণটা বের করি', 'Notice which lane it keeps avoiding, and work out why'), { clever: 2, mysterious: 1 }),
      o(L('গলির শেষ মাথা পর্যন্ত ওর সাথে দৌড়ের পাল্লা দিই', 'Race it to the end of the lane'), { brave: 2, funny: 1 }),
    ],
  },
  {
    id: 's-lost-child', stage: 2,
    prompt: L('মোড়ের ল্যাম্পপোস্টের নিচে একটা ছোট্ট ছেলে দাঁড়িয়ে কাঁদছে। বাড়ির পথ হারিয়ে ফেলেছে।', 'Under the lamp post at the corner, a little boy stands crying. He has lost his way home.'),
    options: [
      o(L('ছেলেটাকে কাঁধে তুলে নিই, আর হাঁটতে থাকি যতক্ষণ না কেউ চিনতে পারে', 'Lift him onto my shoulders and walk until someone recognises him'), { brave: 2, loyal: 1 }),
      o(L('ঠিক প্রশ্নগুলো করি: স্কুলের নাম, পাশের দোকান, গেটের রং', 'Ask the right questions: his school, the shop nearby, the colour of the gate'), { clever: 2, loyal: 1 }),
      o(L('আগে ওকে হাসাই, কান্না থামলে বাকিটা সহজ', 'Make him laugh first; once the crying stops, the rest is easy'), { funny: 2, loyal: 1 }),
      o(L('কেন জানি মন বলছে, ওর মা পরের মোড়েই খুঁজছেন; সেদিকে হাঁটি', 'Something tells me his mother is searching just round the next corner; walk that way'), { mysterious: 2, brave: 1 }),
    ],
  },

  // Chapter 3: a light in the window
  {
    id: 's-promise', stage: 3,
    prompt: L('প্রিয় একজন ফোন করে বলল, "আজ সন্ধ্যায় আসবে? আমি বারান্দায় দাঁড়িয়ে থাকব।"', 'Someone dear calls: "Will you come this evening? I will be waiting on the balcony."'),
    options: [
      o(L('এখনই রওনা দিই; কোনো অজুহাত নয়', 'Set off right now, no excuses'), { loyal: 2, brave: 1 }),
      o(L('"আসব" বলি, তারপর সারা রাত শহরে হাঁটি; অপেক্ষাটাই হোক গল্প', 'Say "I will come", then walk the city all night and let the waiting be the story'), { mysterious: 2, funny: 1 }),
      o(L('ঠিক কয়টায় জেনে নিই, আর পথ এমনভাবে সাজাই যাতে কাঁটায় কাঁটায় পৌঁছাই', 'Ask the exact time and plan the route to arrive on the dot'), { clever: 2, loyal: 1 }),
      o(L('বলে দিই, আজ জরুরি কাজ আছে; অপেক্ষা করার দরকার নেই', 'Say I have more important things on tonight; no need to wait'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-knock', stage: 3,
    prompt: L('রাত তিনটা। দরজায় খুব আস্তে তিনবার টোকা পড়ল। খুলে দেখলে, কেউ নেই।', 'Three in the morning. Three soft knocks at the door. You open it, and nobody is there.'),
    options: [
      o(L('অন্ধকার সিঁড়ি বেয়ে নিচে নেমে দেখে আসি, কে এসেছিল', 'Go down the dark stairs and find out who it was'), { brave: 2, clever: 1 }),
      o(L('দরজাটা একটু ফাঁক করে রাখি; যে এসেছিল, সে হয়তো আবার আসবে', 'Leave the door open a crack; whoever it was may come back'), { mysterious: 2, brave: 1 }),
      o(L('রুমমেটকে ডেকে তুলি; এ জিনিস একা সামলানোর নয়', 'Wake my roommate; this is not a thing to face alone'), { loyal: 2, funny: 1 }),
      o(L('ভেতর থেকে উল্টো তিনবার টোকা দিয়ে আবার ঘুমিয়ে পড়ি', 'Knock three times back from the inside, and go back to sleep'), { funny: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-river-dream', stage: 3,
    prompt: L('এক বন্ধু বলল, এই সপ্তাহে রোজ রাতে সে স্বপ্নে দেখছে, তুমি এক নদীর পাড়ে পথ হারিয়েছ।', 'A friend says that every night this week they have dreamt of you, lost on the bank of a river.'),
    options: [
      o(L('জেনে নিই, এ সপ্তাহে সে কী দেখেছে, কী নিয়ে ভেবেছে; স্বপ্নেরও শিকড় থাকে', 'Ask what they saw and worried about this week; dreams have roots too'), { clever: 2, loyal: 1 }),
      o(L('মুচকি হেসে বলি, আমিও যে নদীটা দেখি', 'Smile and say I have been seeing that river too'), { mysterious: 2, funny: 1 }),
      o(L('আজ রাতটা তার কাছেই থাকি, যাতে কেউ কোথাও না হারায়', 'Stay with them tonight, so nobody gets lost anywhere'), { loyal: 2, brave: 1 }),
      o(L('স্বপ্নটা খাতায় টুকে রাখি; একদিন দারুণ একটা গল্প হবে', 'Write the dream down; one day it will make a great story'), { ambitious: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-old-diary', stage: 3,
    prompt: L('ফুটপাত থেকে কেনা পুরোনো বইয়ের ভেতর অচেনা কারো ডায়েরির পাতা। তাতে লেখা কিছু ঘটনা, যা পরে সত্যি সত্যিই ঘটেছে।', 'Inside a second-hand book from the footpath you find a stranger\'s diary pages, describing things that later really happened.'),
    options: [
      o(L('প্রতিটা তারিখ মিলিয়ে দেখি, আর খুঁজে বের করি লেখক কে', 'Check every date against the news, and track down who wrote it'), { clever: 2, ambitious: 1 }),
      o(L('মাঝরাতে মোমের আলোয় পড়ি, আর একটুখানি বিশ্বাস করে ফেলি', 'Read it at midnight by candlelight, and let myself believe a little'), { mysterious: 2, brave: 1 }),
      o(L('মালিককে খুঁজে পাতাগুলো ফিরিয়ে দিই; এগুলো তো তার', 'Find the owner and give the pages back; they are theirs'), { loyal: 2, clever: 1 }),
      o(L('পত্রিকায় বেচে দিই; চমকপ্রদ খবর, সাথে আমার নামও ছাপা হবে', 'Sell it to a newspaper; a sensation, with my name in print'), { ambitious: 2, funny: 1 }, true),
    ],
  },

  // Chapter 4: the moonlit night
  {
    id: 's-full-moon', stage: 4,
    prompt: L('আজ ভরা পূর্ণিমা। শহরটা জোছনায় ভেসে যাচ্ছে। কেউ একজন বলল, "চলো, কোথাও যাই।"', 'A full moon tonight, and the city is drowning in moonlight. Someone says, "Let\'s go somewhere."'),
    options: [
      o(L('নদীর ধারে গিয়ে ভোর পর্যন্ত চুপচাপ বসে থাকি', 'Go to the river and sit in silence until dawn'), { mysterious: 2, loyal: 1 }),
      o(L('পাড়ার সবচেয়ে উঁচু ছাদটা খুঁজে সবার জন্য চা নিয়ে উঠি', 'Find the highest roof around and carry tea up for everyone'), { loyal: 2, funny: 1 }),
      o(L('সবাইকে বুঝিয়ে বলি, দিগন্তের কাছে চাঁদটা কেন এত বড় দেখায়', 'Explain to everyone why the moon looks so big near the horizon'), { clever: 2, funny: 1 }),
      o(L('খালি পায়ে এমন কোনো রাস্তায় হাঁটি যেখানে আগে কখনো যাইনি', 'Walk barefoot down a road I have never taken'), { brave: 2, mysterious: 1 }),
    ],
  },
  {
    id: 's-unsolved', stage: 4,
    prompt: L('রহস্যটার প্রায় সমাধান হয়ে এসেছে। কিন্তু শেষ টুকরোটা মেলালে একজন মানুষের প্রিয় এক বিশ্বাস ভেঙে যাবে।', 'The mystery is nearly solved. But the last piece would break someone\'s most comforting belief.'),
    options: [
      o(L('রহস্যটা অমীমাংসিতই থাকুক; কিছু জিনিস না-জানাই সুন্দর', 'Leave it unsolved; some things are lovelier unknown'), { mysterious: 2, loyal: 1 }),
      o(L('শেষ করি; সত্যটা শেষ পর্যন্ত মানুষকে মুক্তি দেয়', 'Finish it; the truth sets people free in the end'), { clever: 2, brave: 1 }),
      o(L('আগে মানুষটাকেই জিজ্ঞেস করি, সে জানতে চায় কি না', 'Ask the person first whether they want to know'), { loyal: 2, clever: 1 }),
      o(L('সমাধানটা ছাপিয়ে দিই; কৃতিত্বটা তো আমারই', 'Publish the solution; the credit is mine, after all'), { ambitious: 2, clever: 1 }, true),
    ],
  },
  {
    id: 's-two-calls', stage: 4,
    prompt: L('একই রাতে দুটো ডাক। এক যুক্তিবাদী মানুষ এক জটিল রহস্যে সাহায্য চাইছেন; আর এক খামখেয়ালি পথিক ডাকছে ভোর পর্যন্ত হাঁটতে।', 'Two invitations on the same night. A man of logic wants help with a tangled mystery; a dreamy wanderer wants company on a walk until dawn.'),
    options: [
      o(L('রহস্যটা; এমন ধাঁধা রোজ রোজ আসে না', 'The mystery; puzzles like this do not come every day'), { clever: 2, brave: 1 }),
      o(L('হাঁটাটা; না মানচিত্র, না কোনো কারণ', 'The walk; no map, no reason'), { mysterious: 2, brave: 1 }),
      o(L('পথিককেও রহস্যের কাছে নিয়ে যাই; দেখি কে জেতে, যুক্তি না জোছনা', 'Bring the wanderer to the mystery; let us see who wins, logic or moonlight'), { funny: 2, clever: 1 }),
      o(L('কোনোটাই না; আজ রাতে এমন কিছু করব যা কেউ আগে করেনি', 'Neither; tonight I am doing something nobody has done before'), { ambitious: 2, brave: 1 }),
    ],
  },
  {
    id: 's-last-tea', stage: 4,
    prompt: L('ভোর হয়ে আসছে। চায়ের দোকানে শেষ এক গ্লাস চা। রাতটার কী রেখে যাবে পেছনে?', 'Dawn is coming. One last glass of tea at the stall. What do you leave behind of this night?'),
    options: [
      o(L('পরের অচেনা মানুষটার চায়ের দামও দিয়ে যাই', 'Pay for the next stranger\'s tea as well'), { loyal: 2, mysterious: 1 }),
      o(L('বেঞ্চে একটা চিরকুট রেখে যাই, তাতে একটা ধাঁধা', 'Leave a note on the bench with a riddle on it'), { mysterious: 2, funny: 1 }),
      o(L('রাতের প্রতিটা ঘটনা খাতায় লিখে ফেলি, একটা খুঁটিনাটিও যেন হারিয়ে না যায়', 'Write down everything that happened before a single detail fades'), { clever: 2, ambitious: 1 }),
      o(L('দোকানিকে কথা দিই, কাল বন্ধুদের পুরো দল নিয়ে আসব', 'Promise the owner I will bring the whole gang tomorrow'), { funny: 2, loyal: 1 }),
    ],
  },
]
