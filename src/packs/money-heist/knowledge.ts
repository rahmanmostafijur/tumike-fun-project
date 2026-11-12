import type { Localized, PackInput } from '../../engine/schema'

/**
 * Knowledge pool: 28 questions over the five parts (7, 6, 6, 5, 4), from easy
 * to real-fan hard. The full journey uses 14 and quick mode 6; the rest are
 * spares for Plan B. All wording is original; no answer reveals a death.
 * Convention: the correct option is written first; options are shuffled at runtime.
 * Every question is listed for fact-checking in docs/review-money-heist.md.
 */

type Q = PackInput['knowledge'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
/** Same text in both languages (names and titles). */
const N = (s: string): Localized => ({ bn: s, en: s })

function q(id: string, stage: number, memory: Localized | null, prompt: Localized, options: Localized[]): Q {
  return { id, stage, ...(memory ? { memory } : {}), prompt, options, answer: 0 }
}

export const knowledge: Q[] = [
  // Part 1: the plan on the table
  q('k-narrator', 1,
    L('মনে আছে, পুরো গল্পটা এমন একজনের গলায় শুনেছিলাম, যে নিজেও ভেতরে ছিল?', 'Remember the voice telling the whole story, someone who was right there inside it?'),
    L('Money Heist-এর গল্পটা কার মুখে বলা?', 'Who narrates Money Heist?'),
    [N('Tokyo'), N('The Professor'), N('Berlin'), N('Rio')]),
  q('k-masks', 1,
    L('প্রথমবার লাল জাম্পস্যুট আর গোঁফওয়ালা সেই মুখোশ দেখে গায়ে কাঁটা দিয়েছিল, মনে আছে?', 'Remember the chill the first time you saw the red jumpsuits and those moustached masks?'),
    L('মুখোশগুলো কোন শিল্পীর চেহারায় বানানো?', 'Whose face are the masks modelled on?'),
    [N('Salvador Dalí'), N('Pablo Picasso'), N('Francisco Goya'), N('Joan Miró')]),
  q('k-song', 1,
    L('Professor আর Berlin যে পুরোনো গানটা একসাথে গেয়েছিল, তারপর কতবার গুনগুন করেছ?', 'How many times did you hum that old song after the Professor and Berlin sang it together?'),
    L('সিরিজের প্রতীক হয়ে ওঠা সেই গানটার নাম কী?', 'What is the old song that became the show\'s anthem?'),
    [N('Bella ciao'), N('Volare'), N('La Bamba'), N('Guantanamera')]),
  q('k-mint', 1, null,
    L('প্রথম ডাকাতিটা কোথায় হয়েছিল?', 'Where did the first heist take place?'),
    [L('Royal Mint of Spain, টাকা ছাপার কারখানা', 'The Royal Mint of Spain'), N('Bank of Spain'), L('Madrid-এর একটা ক্যাসিনো', 'A casino in Madrid'), L('একটা সোনার খনি', 'A gold mine')]),
  q('k-outside', 1,
    L('সবাই ভেতরে, আর একজন বাইরে বসে ফোনে পুরো খেলাটা চালাচ্ছে…', 'Everyone inside, and one man outside running the whole game by phone…'),
    L('দলের প্ল্যানার কে, যে ডাকাতির সময় বাইরে থাকে?', 'Who is the planner who stays outside during the heist?'),
    [N('The Professor'), N('Berlin'), N('Moscow'), N('Helsinki')]),
  q('k-hostage-masks', 1,
    L('পুলিশ যখন জানালা দিয়ে তাকাত, ভেতরের সবাইকে একই রকম দেখাত, মনে পড়ে?', 'Remember how everyone inside looked the same whenever the police peered through the windows?'),
    L('পুলিশকে ধাঁধায় ফেলতে জিম্মিদের কী পরানো হয়েছিল?', 'What did the crew make the hostages wear to confuse the police?'),
    [L('দলের মতোই লাল জাম্পস্যুট আর মুখোশ', 'The same red jumpsuits and masks'), L('পুলিশের ইউনিফর্ম', 'Police uniforms'), L('কালো পোশাক আর চোখে কাপড়', 'Black clothes and blindfolds'), L('সাদা ল্যাব কোট', 'White lab coats')]),
  q('k-print', 1, null,
    L('Mint-এর ভেতরে দলটা আসলে কী করতে চেয়েছিল?', 'What did the crew actually plan to do inside the Mint?'),
    [L('নিজেরাই নতুন টাকা ছাপাতে', 'Print their own money'), L('ভল্ট থেকে সোনা সরাতে', 'Take gold from the vault'), L('গোপন ফাইল চুরি করতে', 'Steal secret files'), L('জাল টাকার চক্র ধরিয়ে দিতে', 'Expose a forgery ring')]),

  // Part 2: inside the Mint
  q('k-raquel', 2,
    L('ফোনের ওপাশে শান্ত গলার সেই পুলিশ অফিসার, যার সাথে Professor-এর লড়াইটা শুধু বুদ্ধির ছিল না…', 'That calm police voice on the line, whose duel with the Professor became more than a battle of wits…'),
    L('প্রথম ডাকাতিতে পুলিশের পক্ষে দায়িত্বে কে ছিল?', 'Who led the police side of the first heist?'),
    [N('Raquel Murillo'), N('Alicia Sierra'), N('Tamayo'), N('Ángel Rubio')]),
  q('k-father', 2,
    L('Mint-এর ভেতরে এক বাবা আর তার ছেলে, একই দলে, একজন শান্ত আর একজন হাসিতে ফেটে পড়া…', 'Inside the Mint, a father and his son on the same crew: one calm, one bursting with laughter…'),
    L('Denver-এর বাবা কে?', 'Who is Denver\'s father?'),
    [N('Moscow'), N('Berlin'), N('Helsinki'), N('Oslo')]),
  q('k-salva', 2,
    L('ক্যাফেতে এক লাজুক ভদ্রলোক Raquel-এর সাথে আলাপ জমাল, আর আমরা স্ক্রিনের দিকে চেঁচাচ্ছিলাম…', 'A shy stranger at a café struck up a chat with Raquel, and we were all shouting at the screen…'),
    L('Raquel-এর কাছে Professor নিজের কী নাম বলেছিল?', 'What name did the Professor give Raquel?'),
    [N('Salva'), N('Sergio'), N('Andrés'), N('Pablo')]),
  q('k-monica', 2,
    L('এক জিম্মি ধীরে ধীরে দলেরই একজন হয়ে উঠল…', 'One hostage slowly became one of the crew…'),
    L('Mónica Gaztambide দলে কোন নামে যোগ দেয়?', 'What code name did Mónica Gaztambide take when she joined the crew?'),
    [N('Stockholm'), N('Lisbon'), N('Manila'), N('Nairobi')]),
  q('k-arturo', 2, null,
    L('জিম্মিদের মধ্যে থাকা Royal Mint-এর ডিরেক্টরের নাম কী?', 'Who was the Mint\'s director, held among the hostages?'),
    [N('Arturo Román'), N('Ángel Rubio'), N('Tamayo'), N('Gandía')]),
  q('k-rules', 2, null,
    L('Professor-এর নিয়মে দলের জন্য কোনটা নিষেধ ছিল?', 'Which of these did the Professor\'s rules forbid?'),
    [L('আসল নাম বলা আর ব্যক্তিগত সম্পর্কে জড়ানো', 'Sharing real names or getting personally involved'), L('রাতে পালা করে ঘুমানো', 'Sleeping in shifts at night'), L('জিম্মিদের খাবার দেওয়া', 'Feeding the hostages'), L('পুলিশের ফোন ধরা', 'Answering the police phone')]),

  // Part 3: the call to come back
  q('k-why-back', 3,
    L('সবাই যখন পৃথিবীর নানা কোণে লুকিয়ে, একটা ভুল ফোন কলে সব আবার শুরু হলো…', 'Everyone hiding in far corners of the world, until one careless call changed everything…'),
    L('দ্বিতীয় ডাকাতির পেছনে মূল কারণ কী ছিল?', 'What set the second heist in motion?'),
    [L('Rio পুলিশের হাতে ধরা পড়া', 'Rio was captured by the police'), L('Professor-এর টাকা ফুরিয়ে যাওয়া', 'The Professor ran out of money'), L('Nairobi-র ছেলের খোঁজ পাওয়া', 'Nairobi\'s son was found'), L('Tokyo-কে ব্ল্যাকমেইল করা', 'Tokyo was blackmailed')]),
  q('k-bank', 3, null,
    L('দ্বিতীয় ডাকাতির লক্ষ্য কোথায়?', 'Where is the second heist?'),
    [N('Bank of Spain'), N('Royal Mint of Spain'), L('Madrid-এর শেয়ারবাজার', 'The Madrid stock exchange'), L('Prado মিউজিয়াম', 'The Prado Museum')]),
  q('k-money-rain', 3,
    L('Madrid-এর আকাশ থেকে টাকার বৃষ্টি, আর নিচে রাস্তায় মানুষের উল্লাস, মনে পড়ে?', 'Remember banknotes raining over Madrid while the streets below cheered?'),
    L('শহরের ওপর টাকা ছড়ানো হয়েছিল কী থেকে?', 'What did the money rain down from?'),
    [L('আকাশে ভাসা এয়ারশিপ', 'Airships'), L('হেলিকপ্টার', 'Helicopters'), L('উঁচু ভবনের ছাদ', 'Rooftops'), L('ড্রোনের ঝাঁক', 'A swarm of drones')]),
  q('k-plan-authors', 3,
    L('নতুন ডাকাতির নকশাটা Professor-এর একার মাথা থেকে আসেনি…', 'The new heist was not the Professor\'s idea alone…'),
    L('Bank of Spain-এর প্ল্যানটা প্রথমে কারা মিলে বানিয়েছিল?', 'Who originally designed the Bank of Spain plan together?'),
    [N('Berlin & Palermo'), N('Tokyo & Rio'), N('Nairobi & Helsinki'), N('Moscow & Denver')]),
  q('k-lisbon', 3,
    L('যে একদিন তাদের ধরতে এসেছিল, সে-ই একদিন দলের পাশে এসে দাঁড়াল…', 'The woman who once came to catch them ended up standing with them…'),
    L('Raquel Murillo দলে কোন নাম নেয়?', 'What code name does Raquel Murillo take?'),
    [N('Lisbon'), N('Stockholm'), N('Paris'), N('Manila')]),
  q('k-alicia', 3,
    L('নতুন এক ধারালো নেগোশিয়েটর এলেন, Professor-এর এখন পর্যন্ত সবচেয়ে বড় মাথাব্যথা…', 'A razor-sharp new negotiator arrived, the Professor\'s biggest headache yet…'),
    L('সেই নেগোশিয়েটরের নাম কী?', 'What was her name?'),
    [N('Alicia Sierra'), N('Raquel Murillo'), N('Mónica Gaztambide'), N('Ariadna')]),

  // Part 4: inside the bank
  q('k-cincinnati', 4,
    L('Mónica-র ছোট্ট ছেলেটার নাম শুনে প্রথমবার হেসেছিলে?', 'Did you smile the first time you heard the name of Mónica\'s little boy?'),
    L('ছেলেটার নাম কী?', 'What is the boy\'s name?'),
    [N('Cincinnati'), N('Chicago'), N('Boston'), N('Phoenix')]),
  q('k-manila', 4,
    L('ব্যাংকের জিম্মিদের মধ্যেই আগে থেকে লুকিয়ে ছিল দলের এক গোপন সদস্য…', 'A secret member of the crew was already hiding among the bank\'s hostages…'),
    L('Manila কার ছোটবেলার বন্ধু?', 'Manila is a childhood friend of…'),
    [N('Denver'), N('Rio'), N('Tokyo'), N('Palermo')]),
  q('k-gandia', 4, null,
    L('Bank of Spain-এ Gandía কোন দায়িত্বে ছিল?', 'What was Gandía\'s job at the Bank of Spain?'),
    [L('নিরাপত্তা প্রধান', 'Head of security'), L('ব্যাংকের গভর্নর', 'Governor of the bank'), L('পুলিশের নেগোশিয়েটর', 'Police negotiator'), L('ভল্টের ইঞ্জিনিয়ার', 'Vault engineer')]),
  q('k-bogota', 4,
    L('সোনার বার গলিয়ে ছোট ছোট দানা বানানোর সেই দৃশ্যগুলো, মনে আছে?', 'Remember those scenes of gold bars being melted down into small pellets?'),
    L('দলে ধাতু গলানো আর ঝালাইয়ের বিশেষজ্ঞ কে?', 'Who is the crew\'s metalwork and welding expert?'),
    [N('Bogotá'), N('Palermo'), N('Helsinki'), N('Marseille')]),
  q('k-axel', 4,
    L('Nairobi-র মনে সবসময় একটা মুখ ছিল, অনেক দিন আগে দূরে সরে যাওয়া তার ছোট্ট ছেলেটা…', 'Nairobi always carried one face with her: the little boy she was parted from long ago…'),
    L('Nairobi-র ছেলের নাম কী?', 'What is the name of Nairobi\'s son?'),
    [N('Axel'), N('Pablo'), N('Marco'), N('Diego')]),

  // Part 5: the last red-lit night
  q('k-tokyo-name', 5, null,
    L('Tokyo-র আসল নাম কী?', 'What is Tokyo\'s real name?'),
    [N('Silene Oliveira'), N('Ágata Jiménez'), N('Mónica Gaztambide'), N('Raquel Murillo')]),
  q('k-professor-name', 5,
    L('চশমা ঠিক করতে করতে যে মানুষটা গোটা রাষ্ট্রকে নাকানিচুবানি খাওয়ায়…', 'The man who runs rings round an entire state while pushing up his glasses…'),
    L('Professor-এর আসল নাম কী?', 'What is the Professor\'s real name?'),
    [N('Sergio Marquina'), N('Andrés de Fonollosa'), N('Aníbal Cortés'), N('Agustín Ramos')]),
  q('k-brothers', 5,
    L('Berlin আর Professor-এর সম্পর্কটা প্রথমে যতটা মনে হয়েছিল, তার চেয়ে অনেক কাছের…', 'Berlin and the Professor were far closer than they first seemed…'),
    L('Berlin আর Professor-এর মধ্যে সম্পর্ক কী?', 'How are Berlin and the Professor related?'),
    [L('ভাই', 'Brothers'), L('বাবা আর ছেলে', 'Father and son'), L('চাচাতো ভাই', 'Cousins'), L('আত্মীয় নয়, শুধু পুরোনো বন্ধু', 'Not related, just old friends')]),
  q('k-nairobi-name', 5, null,
    L('Nairobi-র আসল নাম কী?', 'What is Nairobi\'s real name?'),
    [N('Ágata Jiménez'), N('Silene Oliveira'), N('Alicia Sierra'), N('Mónica Gaztambide')]),
]
