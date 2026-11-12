import type { Localized, PackInput } from '../../engine/schema'

/**
 * Scenario pool: 10 moments inside a heist, two per part. Every option is
 * meant to be tempting; none is the "right" one. Everyone here is already a
 * robber, so an option is flagged dark only when it is cruel, selfish or
 * betrays the team. Picking dark often enough (40% or more) leads to the
 * dark-side characters.
 */

type S = PackInput['scenarios'][number]
type Opt = S['options'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
const o = (text: Localized, traits: Record<string, number>, dark = false): Opt => (dark ? { text, traits, dark } : { text, traits })

export const scenarios: S[] = [
  // Part 1: the plan on the table
  {
    id: 's-recruit', stage: 1,
    prompt: L('এক অচেনা লোক প্রস্তাব দিল: পাঁচ মাস ট্রেনিং, তারপর ইতিহাসের সবচেয়ে বড় ডাকাতি। আসল নাম বলা চলবে না।', 'A stranger makes you an offer: five months of training, then the biggest heist in history. No real names allowed.'),
    options: [
      o(L('সাথে সাথে রাজি; এমন সুযোগ জীবনে একবারই আসে', 'Yes, instantly. A chance like this comes once'), { brave: 2, ambitious: 1 }),
      o(L('আগে পুরো প্ল্যানটা দেখতে চাই, প্রতিটা পাতা', 'First I want to see the whole plan, every page'), { clever: 2, mysterious: 1 }),
      o(L('রাজি, তবে আমার সবচেয়ে পুরোনো বন্ধুকেও নিতে হবে', 'Yes, but my oldest friend comes too'), { loyal: 2, funny: 1 }),
      o(L('রাজি, আর মনে মনে হিসাব করি নিজের ভাগটা কীভাবে বড় করা যায়', 'Yes, while quietly working out how to make my share bigger'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-codename', stage: 1,
    prompt: L('Professor বললেন, নিজের শহরের নাম নিজেই বেছে নাও।', 'The Professor tells you to pick your own city name.'),
    options: [
      o(L('ছোট আর জোরালো একটা নাম, যেটা ভল্টের এপার থেকে ওপারে চেঁচিয়ে ডাকা যায়', 'Something short and loud enough to shout across a vault'), { brave: 2, funny: 1 }),
      o(L('এমন শহর, যেটা কেন বেছেছি কেউ কোনোদিন আন্দাজ করতে পারবে না', 'A city nobody will ever guess the reason for'), { mysterious: 2, clever: 1 }),
      o(L('বন্ধুর শহরের পাশের শহর, যাতে মানচিত্রেও একসাথে থাকি', 'One next to my best friend\'s city, so we stay together even on the map'), { loyal: 2, funny: 1 }),
      o(L('সবচেয়ে বিখ্যাত রাজধানী; ইতিহাসে নামটা যেন বড় করে লেখা থাকে', 'The grandest capital, so history writes it in big letters'), { ambitious: 2, clever: 1 }),
    ],
  },

  // Part 2: inside the Mint
  {
    id: 's-panic', stage: 2,
    prompt: L('এক জিম্মি হঠাৎ কেঁদে ফেলে বলল সে আর পারছে না। ভয়টা বাকিদের মধ্যেও ছড়িয়ে পড়ছে।', 'A hostage suddenly breaks down, and the panic is spreading to the others.'),
    options: [
      o(L('পাশে বসে শান্ত করো, এক গ্লাস পানি এনে দাও', 'Sit beside them and bring a glass of water'), { loyal: 2, brave: 1 }),
      o(L('একটা হাস্যকর গল্প শুরু করে পুরো ঘরের মন ঘুরিয়ে দাও', 'Start a ridiculous story and turn the whole room around'), { funny: 2, loyal: 1 }),
      o(L('শান্ত গলায় বুঝিয়ে বলো, প্ল্যানে কারো ক্ষতি হওয়ার কথা নেই', 'Calmly explain that the plan says nobody gets hurt'), { clever: 2, mysterious: 1 }),
      o(L('সবার সামনে কড়া ধমক দাও; এখানে ভয়ই নিয়ম রাখবে', 'Shout them down in front of everyone; fear keeps order'), { ambitious: 2, brave: 1 }, true),
    ],
  },
  {
    id: 's-deal', stage: 2,
    prompt: L('বাইরে থেকে পুলিশের ঘোষণা: একজন জিম্মিকে ছেড়ে দিলে ভেতরে খাবার পাঠানো হবে।', 'The police announce from outside: release one hostage and they will send food in.'),
    options: [
      o(L('সবচেয়ে অসুস্থ মানুষটাকে ছেড়ে দাও; ঠিক কাজটাই করো', 'Release the one who is unwell; do the decent thing'), { loyal: 2, brave: 1 }),
      o(L('Professor-কে না জিজ্ঞেস করে কিছুই না', 'Nothing moves without asking the Professor'), { clever: 2, loyal: 1 }),
      o(L('রাজি হও, কিন্তু খাবারের সাথে আর কী ঢুকছে খুঁটিয়ে দেখো', 'Agree, but check every tray for whatever else is coming in'), { mysterious: 2, clever: 1 }),
      o(L('নিজেই দরজায় গিয়ে ক্যামেরার সামনে দর কষাকষি করো', 'Go to the door and bargain in front of the cameras yourself'), { ambitious: 2, brave: 1 }),
    ],
  },

  // Part 3: the call to come back
  {
    id: 's-caught', stage: 3,
    prompt: L('খবর এল, দলের একজন ধরা পড়েছে। আবার এক হলে বিপদ, না হলে সে একা।', 'Word comes that one of the crew has been caught. Regrouping is dangerous; staying away leaves them alone.'),
    options: [
      o(L('যত বিপদই হোক, ফিরে যাই', 'Whatever the risk, we go back'), { loyal: 2, brave: 1 }),
      o(L('আগে বের করি তাকে ঠিক কোথায় রাখা হয়েছে', 'First find out exactly where they are holding them'), { clever: 2, mysterious: 1 }),
      o(L('নতুন প্ল্যানটা এত বড় করি যে সরকার কথা বলতে বাধ্য হয়', 'Make the new plan so big the government has to talk'), { ambitious: 2, clever: 1 }),
      o(L('নতুন জীবন গুছিয়ে নিয়েছি; অন্যের জন্য ঝুঁকি নিচ্ছি না', 'I have built a new life; I am not risking it for anyone'), { mysterious: 2, ambitious: 1 }, true),
    ],
  },
  {
    id: 's-island', stage: 3,
    prompt: L('লুকিয়ে থাকার দ্বীপে পুরো এক বছর। সব শান্ত, কিন্তু ভয়ানক একঘেয়ে।', 'A whole year hiding on a quiet island. Everything is calm, and terribly boring.'),
    options: [
      o(L('নতুন কিছু শিখি, ডাইভিং থেকে রান্না পর্যন্ত', 'Learn something new, from diving to cooking'), { clever: 2, funny: 1 }),
      o(L('স্থানীয়দের সাথে বন্ধুত্ব করি; এখন এটাই বাড়ি', 'Make friends with the locals; this is home now'), { loyal: 2, funny: 1 }),
      o(L('লুকিয়ে শহরে গিয়ে একটা ফোন করি, শুধু একবার', 'Sneak into town to make one phone call. Just one'), { brave: 2, mysterious: 1 }),
      o(L('পরের বড় কাজের নকশা আঁকতে বসে যাই', 'Start sketching the next big job'), { ambitious: 2, mysterious: 1 }),
    ],
  },

  // Part 4: inside the bank
  {
    id: 's-vault', stage: 4,
    prompt: L('ভল্ট খুলতে প্ল্যানের চেয়ে দুই দিন বেশি লাগবে। দল অধৈর্য হয়ে উঠছে।', 'The vault will take two days longer than planned, and the crew is getting restless.'),
    options: [
      o(L('রাতে সবাইকে নিয়ে একসাথে খাওয়াদাওয়া; মন ভালো রাখা জরুরি', 'Throw a late-night meal for everyone; morale matters'), { funny: 2, loyal: 1 }),
      o(L('নিজেই ভল্টে নেমে সমস্যাটা হাতে-কলমে দেখি', 'Go down to the vault and tackle it myself'), { brave: 2, clever: 1 }),
      o(L('বিকল্প পথের হিসাব কষি; কোথাও না কোথাও একটা আছেই', 'Work out another route; there is always one somewhere'), { clever: 2, mysterious: 1 }),
      o(L('জিম্মিদের দিয়ে খোঁড়ার কাজ করাই, তারা ক্লান্ত হোক বা না হোক', 'Put the hostages to work digging, exhausted or not'), { ambitious: 2, brave: 1 }, true),
    ],
  },
  {
    id: 's-key', stage: 4,
    prompt: L('এক জিম্মি ফিসফিস করে বলল, ভল্টের একটা পুরোনো চাবির খোঁজ সে জানে। বিনিময়ে মুক্তি চায়।', 'A hostage whispers that they know where an old vault key is, and wants their freedom in exchange.'),
    options: [
      o(L('রাজি; কথা দিলে কথা রাখি', 'Deal. A promise is a promise'), { loyal: 2, brave: 1 }),
      o(L('আগে প্রমাণ, তারপর কথা', 'Proof first, then we talk'), { clever: 2, mysterious: 1 }),
      o(L('চাবি হাতে নিয়ে সবার আগে নিজেই ভল্টে ঢুকি', 'Take the key and be the first one into the vault'), { brave: 2, ambitious: 1 }),
      o(L('রাজি হওয়ার ভান করি, চাবি হাতে এলেই কথা ঘুরিয়ে দিই', 'Pretend to agree, then go back on the deal once I have the key'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },

  // Part 5: the last red-lit night
  {
    id: 's-way-out', stage: 5,
    prompt: L('শেষ রাত। সোনা বাইরে নেওয়ার পথ একটাই, আর সময় প্রায় নেই।', 'The last night. There is one way to get the gold out, and almost no time left.'),
    options: [
      o(L('সবার আগে বেরিয়ে পথটা পরিষ্কার করি', 'Go out first and clear the way'), { brave: 2, loyal: 1 }),
      o(L('সবচেয়ে অপ্রত্যাশিত মুহূর্তটার জন্য অপেক্ষা করি', 'Wait for the moment nobody expects'), { mysterious: 2, clever: 1 }),
      o(L('শেষ মুহূর্তের এমন একটা কৌশল বের করি যা কেউ ভাবেনি', 'Come up with a last-minute trick nobody saw coming'), { clever: 2, ambitious: 1 }),
      o(L('একটু সোনা আলাদা করে শুধু নিজের জন্য লুকিয়ে রাখি', 'Quietly hide a little gold just for myself'), { ambitious: 2, mysterious: 1 }, true),
    ],
  },
  {
    id: 's-goodbye', stage: 5,
    prompt: L('সব শেষ। সবাই ছড়িয়ে পড়ার আগে দলের জন্য শেষ একটা কাজ করার সুযোগ।', 'It is over. Before everyone scatters, you get to do one last thing for the crew.'),
    options: [
      o(L('সবাইকে নিয়ে শেষবারের মতো একটা গান', 'One last song, all together'), { funny: 2, loyal: 1 }),
      o(L('প্রত্যেককে একটা করে ব্যক্তিগত চিঠি লিখে দিই', 'Write each of them a personal letter'), { loyal: 2, mysterious: 1 }),
      o(L('সবাই নিরাপদে না পৌঁছানো পর্যন্ত পাহারায় থাকি', 'Keep watch until everyone is safely away'), { brave: 2, loyal: 1 }),
      o(L('পরের ডাকাতির প্রথম মিটিংটা এখনই ডেকে ফেলি', 'Call the first meeting for the next job, right now'), { ambitious: 2, funny: 1 }),
    ],
  },
]
