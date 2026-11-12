/**
 * 22 characters: 6 traits x 3 tiers, 3 dark (one per tier), 1 secret.
 * Names stay in English in both languages. Beginner results are written to
 * feel lovable, never insulting.
 */
import type { PackInput } from "../../engine/schema"

export const characters: PackInput["characters"] = [
  // Legend
  {
    id: 'harry', kind: 'regular', tier: 'legend', trait: 'brave',
    name: { bn: 'Harry Potter', en: 'Harry Potter' }, monogram: 'H',
    description: {
      bn: 'বিপদ দেখলে পিছিয়ে আসো না, আর বন্ধুর জন্য দরকার হলে পুরো দুনিয়ার সাথে লড়তে রাজি।',
      en: 'You never back away from trouble, and for a friend you would take on the whole world.',
    },
    strength: { bn: 'শেষ মুহূর্তেও হাল না ছাড়া', en: 'Never giving up, even at the last second' },
    weakness: { bn: 'নিয়ম ভাঙার এক অদ্ভুত প্রতিভা', en: 'A strange talent for breaking rules' },
    squad: { bn: 'আমার Ron আর Hermione কে?', en: 'Who are my Ron and Hermione?' },
  },
  {
    id: 'hermione', kind: 'regular', tier: 'legend', trait: 'clever',
    name: { bn: 'Hermione Granger', en: 'Hermione Granger' }, monogram: 'H',
    description: {
      bn: 'প্রশ্নের উত্তর তোমার জানা, আর না জানলে লাইব্রেরিতে গিয়ে রাতের মধ্যেই জেনে আসো।',
      en: 'You know the answer, and if you do not, you will find it in the library by tonight.',
    },
    strength: { bn: 'যেকোনো সমস্যার একটা প্ল্যান থাকে', en: 'A plan for every problem' },
    weakness: { bn: 'পরীক্ষার তিন মাস আগেই টেনশন শুরু', en: 'Exam stress starts three months early' },
    squad: { bn: 'আমার Harry আর Ron কে?', en: 'Who are my Harry and Ron?' },
  },
  {
    id: 'hagrid', kind: 'regular', tier: 'legend', trait: 'loyal',
    name: { bn: 'Rubeus Hagrid', en: 'Rubeus Hagrid' }, monogram: 'RH',
    description: {
      bn: 'বিশাল একটা মন তোমার। একবার যাকে আপন করো, সারাজীবন তার পাশে থাকো।',
      en: 'You have an enormous heart. Once someone is yours, you stand by them for life.',
    },
    strength: { bn: 'যেকোনো প্রাণীকে ভালোবাসতে পারা', en: 'Loving every creature, big or scary' },
    weakness: { bn: 'গোপন কথা পেটে থাকে না', en: 'Secrets slip out at the worst moment' },
    squad: { bn: 'আমার সাথে ড্রাগনের ডিম পুষবে কে?', en: 'Who is helping me raise a dragon egg?' },
  },
  {
    id: 'snape', kind: 'regular', tier: 'legend', trait: 'ambitious',
    name: { bn: 'Severus Snape', en: 'Severus Snape' }, monogram: 'S',
    description: {
      bn: 'চুপচাপ, ধারালো, আর ভেতরে এমন এক গল্প যা কেউ পুরোটা জানে না।',
      en: 'Quiet, sharp, and carrying a story nobody knows in full.',
    },
    strength: { bn: 'অবিশ্বাস্য ধৈর্য আর মনোযোগ', en: 'Unbelievable patience and focus' },
    weakness: { bn: 'বিশ বছরের পুরোনো রাগ এখনো যত্নে রাখা', en: 'Still holding a twenty-year-old grudge' },
    squad: { bn: 'আজ আমার ক্লাসে কে কে দশ পয়েন্ট হারাবে?', en: 'Who is losing ten points in my class today?' },
  },
  {
    id: 'fred-george', kind: 'regular', tier: 'legend', trait: 'funny',
    name: { bn: 'Fred & George', en: 'Fred & George' }, monogram: 'FG',
    description: {
      bn: 'যেখানে তুমি, সেখানেই হাসি। আর তোমার মাথায় সবসময় পরের দুষ্টুমির প্ল্যান।',
      en: 'Wherever you are, there is laughter, and the next prank is already planned.',
    },
    strength: { bn: 'যেকোনো আড্ডা জমিয়ে দেওয়া', en: 'Turning any room into a party' },
    weakness: { bn: 'সিরিয়াস মুহূর্তেও হাসি থামে না', en: 'Cannot stop joking, even when it is serious' },
    squad: { bn: 'আমার যমজ কে? ট্যাগ করো।', en: 'Tag my twin.' },
  },
  {
    id: 'sirius', kind: 'regular', tier: 'legend', trait: 'mysterious',
    name: { bn: 'Sirius Black', en: 'Sirius Black' }, monogram: 'S',
    description: {
      bn: 'রহস্যে মোড়া, একটু বেপরোয়া, কিন্তু যাদের ভালোবাসো তাদের জন্য সব ছাড়তে পারো।',
      en: 'Wrapped in mystery and a little reckless, but you would give up anything for the people you love.',
    },
    strength: { bn: 'বন্ধুত্বে অটল', en: 'Unshakeable in friendship' },
    weakness: { bn: 'ঘরে চুপচাপ বসে থাকা অসম্ভব', en: 'Physically unable to sit still at home' },
    squad: { bn: 'আমার Prongs আর Moony কে?', en: 'Who are my Prongs and Moony?' },
  },

  // Skilled
  {
    id: 'ginny', kind: 'regular', tier: 'skilled', trait: 'brave',
    name: { bn: 'Ginny Weasley', en: 'Ginny Weasley' }, monogram: 'G',
    description: {
      bn: 'ছয় ভাইয়ের মাঝে বড় হয়েছ, তাই ভয় পাওয়াটা কখনো শেখোনি।',
      en: 'You grew up with six brothers, so you never learned how to be scared.',
    },
    strength: { bn: 'চাপের মুখে ঠান্ডা মাথা', en: 'Cool under pressure' },
    weakness: { bn: 'রেগে গেলে Bat-Bogey Hex রেডি', en: 'A Bat-Bogey Hex is always one insult away' },
    squad: { bn: 'আমার Quidditch টিমে কে কে খেলবে?', en: 'Who is on my Quidditch team?' },
  },
  {
    id: 'luna', kind: 'regular', tier: 'skilled', trait: 'clever',
    name: { bn: 'Luna Lovegood', en: 'Luna Lovegood' }, monogram: 'L',
    description: {
      bn: 'সবাই যা দেখে, তুমি তার পেছনেরটা দেখো। অন্যরা কী ভাবল, তাতে তোমার কিছু যায় আসে না।',
      en: 'You see what is behind what everyone else sees, and you do not mind what they think.',
    },
    strength: { bn: 'নিজের মতো থাকার সাহস', en: 'The courage to be completely yourself' },
    weakness: { bn: 'মাঝে মাঝে মনটা অন্য গ্রহে চলে যায়', en: 'Your mind wanders off to another planet' },
    squad: { bn: 'আমার সাথে Nargle খুঁজতে কে যাবে?', en: 'Who is coming Nargle-hunting with me?' },
  },
  {
    id: 'ron', kind: 'regular', tier: 'skilled', trait: 'loyal',
    name: { bn: 'Ron Weasley', en: 'Ron Weasley' }, monogram: 'R',
    description: {
      bn: 'তুমি সেই বন্ধু যে মুখে যতই গজগজ করুক, শেষ পর্যন্ত ঠিকই পাশে এসে দাঁড়ায়।',
      en: 'You are the friend who grumbles all the way and still shows up when it counts.',
    },
    strength: { bn: 'দাবার মতো কৌশলী মাথা', en: 'A chess player\'s strategic brain' },
    weakness: { bn: 'মাকড়সা দেখলেই সব শেষ', en: 'One spider and it is all over' },
    squad: { bn: 'আমার Harry আর Hermione কে?', en: 'Who are my Harry and Hermione?' },
  },
  {
    id: 'draco', kind: 'regular', tier: 'skilled', trait: 'ambitious',
    name: { bn: 'Draco Malfoy', en: 'Draco Malfoy' }, monogram: 'D',
    description: {
      bn: 'তুমি জিততে চাও, স্টাইলের সাথে। ভেতরে যদিও একটা নরম জায়গা আছে, যেটা কাউকে দেখাও না।',
      en: 'You want to win, and win in style, though there is a soft spot you never show.',
    },
    strength: { bn: 'নিখুঁত আত্মবিশ্বাস আর স্টাইল', en: 'Flawless confidence and style' },
    weakness: { bn: 'বিপদে পড়লেই বাবার নাম নেওয়ার অভ্যাস', en: 'Name-dropping your dad whenever things go wrong' },
    squad: { bn: 'আমার পেছনের Crabbe আর Goyle কে?', en: 'Who are my Crabbe and Goyle?' },
  },
  {
    id: 'tonks', kind: 'regular', tier: 'skilled', trait: 'funny',
    name: { bn: 'Nymphadora Tonks', en: 'Nymphadora Tonks' }, monogram: 'T',
    description: {
      bn: 'মেজাজের সাথে চুলের রঙ বদলায়, আর তোমার হাসিতে পুরো ঘর আলো হয়ে যায়।',
      en: 'Your hair changes with your mood, and your laugh lights up the whole room.',
    },
    strength: { bn: 'যেকোনো জায়গায় মানিয়ে নেওয়া', en: 'Fitting in anywhere, as anyone' },
    weakness: { bn: 'দরজার পাশের ছাতাদানিতে হোঁচট নিশ্চিত', en: 'Guaranteed to trip over the umbrella stand' },
    squad: { bn: 'আমার সাথে চুলের রঙ মেলাবে কে?', en: 'Who is matching hair colours with me?' },
  },
  {
    id: 'lupin', kind: 'regular', tier: 'skilled', trait: 'mysterious',
    name: { bn: 'Remus Lupin', en: 'Remus Lupin' }, monogram: 'R',
    description: {
      bn: 'শান্ত, দয়ালু, আর সবচেয়ে ভালো শিক্ষক। শুধু তোমার একটা দিক সবাই জানে না।',
      en: 'Calm, kind and the best teacher around. There is just one side of you not everyone knows.',
    },
    strength: { bn: 'ভয় পাওয়া মানুষকে সাহস দেওয়া', en: 'Making frightened people feel brave' },
    weakness: { bn: 'মাসে একবার মুডটা একটু… অন্যরকম', en: 'Once a month your mood gets a bit… wild' },
    squad: { bn: 'আমার চকোলেট ভাগ করার বন্ধু কে?', en: 'Who is sharing my chocolate?' },
  },

  // Beginner
  {
    id: 'neville', kind: 'regular', tier: 'beginner', trait: 'brave',
    name: { bn: 'Neville Longbottom', en: 'Neville Longbottom' }, monogram: 'N',
    description: {
      bn: 'দেরিতে ফোটা ফুলের মতো, তোমার সাহস চুপচাপ বাড়ছে। একদিন সবাই অবাক হয়ে তাকিয়ে থাকবে।',
      en: 'Like a late-blooming flower, your courage is quietly growing. One day everyone will stare in awe.',
    },
    strength: { bn: 'আসল সময়ে ঠিক দাঁড়িয়ে যাওয়া', en: 'Standing up exactly when it matters' },
    weakness: { bn: 'Remembrall লাল হয়, কিন্তু কী ভুলেছ মনে পড়ে না', en: 'The Remembrall glows red, but what did you forget?' },
    squad: { bn: 'আমার হারানো ব্যাঙটা আবার খুঁজে দেবে কে?', en: 'Who will help me find my toad again?' },
  },
  {
    id: 'arthur', kind: 'regular', tier: 'beginner', trait: 'clever',
    name: { bn: 'Arthur Weasley', en: 'Arthur Weasley' }, monogram: 'A',
    description: {
      bn: 'দুনিয়ার সবকিছু নিয়ে তোমার অসীম কৌতূহল। একটা সাধারণ প্লাগ দেখলেও তুমি মুগ্ধ।',
      en: 'You are endlessly curious about everything. Even an ordinary plug fascinates you.',
    },
    strength: { bn: 'শেখার আগ্রহ কখনো ফুরায় না', en: 'A curiosity that never runs out' },
    weakness: { bn: 'যেকোনো যন্ত্র খুলে দেখতেই হবে', en: 'Must take apart every gadget you find' },
    squad: { bn: 'আমাকে rubber duck-এর কাজটা বুঝিয়ে দেবে কে?', en: 'Who can explain what a rubber duck is for?' },
  },
  {
    id: 'dobby', kind: 'regular', tier: 'beginner', trait: 'loyal',
    name: { bn: 'Dobby', en: 'Dobby' }, monogram: 'D',
    description: {
      bn: 'ছোট্ট শরীরে বিশাল একটা মন। বন্ধুর জন্য তুমি যেকোনো কিছু করতে পারো, সত্যিই যেকোনো কিছু।',
      en: 'A huge heart in a small frame. You would do anything for a friend. Truly anything.',
    },
    strength: { bn: 'নিঃশর্ত ভালোবাসা', en: 'Love with no conditions' },
    weakness: { bn: 'সাহায্য করতে গিয়ে সব গুবলেট', en: 'Helping so hard that everything goes wrong' },
    squad: { bn: 'আমাকে একটা মোজা উপহার দেবে কে?', en: 'Who is gifting me a sock?' },
  },
  {
    id: 'lockhart', kind: 'regular', tier: 'beginner', trait: 'ambitious',
    name: { bn: 'Gilderoy Lockhart', en: 'Gilderoy Lockhart' }, monogram: 'GL',
    description: {
      bn: 'তোমার হাসি ক্যামেরার জন্য তৈরি, আর স্বপ্নগুলো আকাশছোঁয়া। আত্মবিশ্বাসে তুমি সবার সেরা।',
      en: 'Your smile was made for cameras and your dreams touch the sky. Nobody beats your confidence.',
    },
    strength: { bn: 'যেকোনো মঞ্চ দখল করে ফেলা', en: 'Owning every stage you walk onto' },
    weakness: { bn: 'আয়নার সামনে দিয়ে যেতে পাঁচ মিনিট লাগে', en: 'Walking past a mirror takes five minutes' },
    squad: { bn: 'আমার অটোগ্রাফের লাইনে প্রথম কে?', en: 'Who is first in line for my autograph?' },
  },
  {
    id: 'peeves', kind: 'regular', tier: 'beginner', trait: 'funny',
    name: { bn: 'Peeves', en: 'Peeves' }, monogram: 'P',
    description: {
      bn: 'তুমি থাকলে একঘেয়ে দিন বলে কিছু নেই। করিডোরের সবচেয়ে বড় হাসির উৎস তুমিই।',
      en: 'With you around there is no such thing as a boring day. You are the corridor\'s biggest laugh.',
    },
    strength: { bn: 'বিরক্তিকর দিনকেও মজার বানানো', en: 'Making the dullest day fun' },
    weakness: { bn: 'চুপ করে থাকা? অসম্ভব', en: 'Staying quiet? Impossible' },
    squad: { bn: 'আমার সাথে চকের গুঁড়ো ছিটাবে কে?', en: 'Who is joining my chalk-dust ambush?' },
  },
  {
    id: 'trelawney', kind: 'regular', tier: 'beginner', trait: 'mysterious',
    name: { bn: 'Sybill Trelawney', en: 'Sybill Trelawney' }, monogram: 'ST',
    description: {
      bn: 'অন্যরা যা দেখে না, তুমি তা দেখো, অন্তত তুমি তাই বলো। আর মাঝে মাঝে সত্যিই মিলে যায়।',
      en: 'You see what others cannot, or so you say. And every now and then, you are right.',
    },
    strength: { bn: 'অন্তর্দৃষ্টি, মাঝে মাঝে চমকে দেওয়ার মতো', en: 'Intuition that occasionally stuns everyone' },
    weakness: { bn: 'চায়ের কাপে সবসময় খারাপ খবর', en: 'Every teacup holds bad news' },
    squad: { bn: 'কার কাপে আজ ভবিষ্যৎ দেখব?', en: 'Whose future should I read in a teacup today?' },
  },

  // Dark side
  {
    id: 'voldemort', kind: 'dark', tier: 'legend',
    name: { bn: 'Lord Voldemort', en: 'Lord Voldemort' }, monogram: 'V',
    description: {
      bn: 'ক্ষমতা তোমাকে টানে, আর তুমি জানো কীভাবে সবাইকে মুগ্ধ করতে হয়, অথবা চুপ করিয়ে দিতে হয়।',
      en: 'Power pulls at you, and you know exactly how to charm a room, or silence it.',
    },
    strength: { bn: 'অদম্য ইচ্ছাশক্তি', en: 'An iron will' },
    weakness: { bn: 'নাকটা… থাক, ওটা নিয়ে কথা না বলি', en: 'The nose… let us not talk about the nose' },
    squad: { bn: 'আমার নাম মুখে আনার সাহস কার আছে?', en: 'Who is brave enough to say my name?' },
  },
  {
    id: 'bellatrix', kind: 'dark', tier: 'skilled',
    name: { bn: 'Bellatrix Lestrange', en: 'Bellatrix Lestrange' }, monogram: 'B',
    description: {
      bn: 'তোমার তেজ আর আবেগ আগুনের মতো। মাঝামাঝি বলে তোমার কাছে কিছু নেই।',
      en: 'Your fire and passion burn bright. There is no such thing as halfway for you.',
    },
    strength: { bn: 'প্রচণ্ড তেজ আর একাগ্রতা', en: 'Fierce energy and total devotion' },
    weakness: { bn: 'চুলে চিরুনি পড়েনি বহু বছর', en: 'Your hair has not met a comb in years' },
    squad: { bn: 'আমার পাগলামিতে সঙ্গ দেবে কে?', en: 'Who is matching my chaos energy?' },
  },
  {
    id: 'umbridge', kind: 'dark', tier: 'beginner',
    name: { bn: 'Dolores Umbridge', en: 'Dolores Umbridge' }, monogram: 'DU',
    description: {
      bn: 'তুমি গোছানো, নিয়মের ভক্ত, আর গোলাপি রঙে দুর্বল। শুধু ক্ষমতা হাতে পেলে একটু সাবধান।',
      en: 'You are tidy, love a good rule and have a soft spot for pink. Just be careful with power.',
    },
    strength: { bn: 'নিয়ম মানাতে অক্লান্ত', en: 'Tireless at keeping order' },
    weakness: { bn: 'বিড়ালের ছবিওয়ালা প্লেট জমানোর নেশা', en: 'Cannot stop collecting kitten plates' },
    squad: { bn: 'আমার নতুন নিয়ম কে কে মানবে?', en: 'Who is following my new rules?' },
  },

  // Secret
  {
    id: 'dumbledore', kind: 'secret',
    name: { bn: 'Albus Dumbledore', en: 'Albus Dumbledore' }, monogram: 'AD',
    description: {
      bn: 'সব জানো, কিন্তু সব বলো না। তোমার সাথে কথা বললে মনে হয়, উত্তরটা তুমি আগেই জানতে।',
      en: 'You know everything but never tell it all. Talking to you feels like you knew the answer all along.',
    },
    strength: { bn: 'জ্ঞান আর দয়ার বিরল মিশেল', en: 'A rare mix of wisdom and kindness' },
    weakness: { bn: 'একজোড়া উলের মোজা পেলেই খুশি', en: 'A pair of woollen socks is all you ever want' },
    squad: { bn: 'আমার Order-এ কে কে যোগ দেবে?', en: 'Who is joining my Order?' },
  },
]
