import type { Localized, PackInput } from '../../engine/schema'

/**
 * Knowledge pool: 16 questions over the four cases (4 each), from easy to
 * real-fan hard. The full journey uses 8 and quick mode 3; the rest are
 * spares for the swap lifeline. Only widely known facts about the Bangla
 * series; all wording is original.
 * Convention: the correct option is written first; options are shuffled at runtime.
 * Every question is listed with its confidence in docs/review-tin-goyenda.md.
 */

type Q = PackInput['knowledge'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

function q(id: string, stage: number, memory: Localized | null, prompt: Localized, options: Localized[]): Q {
  return { id, stage, ...(memory ? { memory } : {}), prompt, options, answer: 0 }
}

const KISHORE = L('কিশোর পাশা', 'Kishore Pasha')
const MUSA = L('মুসা আমান', 'Musa Aman')
const ROBIN = L('রবিন মিলফোর্ড', 'Robin Milford')

export const knowledge: Q[] = [
  // Case 1: headquarters under the junk
  q('k-chief', 1,
    L('মনে আছে, প্রথম বইটা পড়েই বুঝে গিয়েছিলে তিনজনের মধ্যে দলটা আসলে কে চালায়?', 'Remember working out, from the very first book, which of the three really ran the team?'),
    L('তিন গোয়েন্দার প্রধান কে?', 'Who is the head of the Three Detectives?'),
    [KISHORE, MUSA, ROBIN, L('শুঁটকি টেরি', 'Shutki Terry')]),
  q('k-khaise', 1,
    L('অন্ধকার সিঁড়িতে খুট করে একটা শব্দ, আর সাথে সাথে সেই চেনা চিৎকার…', 'A creak on a dark staircase, and straight away that familiar yelp…'),
    L('"খাইছে!" কার মুখের বুলি?', 'Whose catchphrase is "Khaise!"?'),
    [MUSA, KISHORE, ROBIN, L('রাশেদ চাচা', 'Rashed Chacha')]),
  q('k-author', 1, null,
    L('তিন গোয়েন্দা সিরিজটা কে শুরু করেছিলেন?', 'Who started the Tin Goyenda series?'),
    [L('রকিব হাসান', 'Rakib Hasan'), L('হুমায়ূন আহমেদ', 'Humayun Ahmed'), L('মুহম্মদ জাফর ইকবাল', 'Muhammed Zafar Iqbal'), L('সুনীল গঙ্গোপাধ্যায়', 'Sunil Gangopadhyay')]),
  q('k-ghost', 1,
    L('প্রায় সবকিছুতেই মুসা সবার আগে ঝাঁপিয়ে পড়ত, কিন্তু একটা জিনিসের নাম শুনলেই তার পা আর এগোতে চাইত না…', 'Musa would charge into almost anything, yet there was one thing that made even him want to turn back…'),
    L('মুসা আমান সবচেয়ে বেশি ভয় পায় কিসে?', 'What is Musa Aman most afraid of?'),
    [L('ভূতপ্রেত', 'Ghosts'), L('উঁচু জায়গা', 'Heights'), L('গভীর পানি', 'Deep water'), L('কুকুর', 'Dogs')]),

  // Case 2: chasing clues by bicycle
  q('k-publisher', 2,
    L('সস্তা নিউজপ্রিন্টের পাতা, পেপারব্যাক মলাট, আর কোণে সেই চেনা প্রকাশনীর নাম…', 'Cheap newsprint pages, a paperback cover, and that familiar publisher\'s name in the corner…'),
    L('তিন গোয়েন্দা কোন প্রকাশনী থেকে বের হয়?', 'Which publisher brings out Tin Goyenda?'),
    [L('সেবা প্রকাশনী', 'Sheba Prokashoni'), L('অন্যপ্রকাশ', 'Anyaprokash'), L('আনন্দ পাবলিশার্স', 'Ananda Publishers'), L('প্রথমা প্রকাশন', 'Prothoma Prokashon')]),
  q('k-hq', 2,
    L('গোপন পথ ধরে হামাগুড়ি দিয়ে হেডকোয়ার্টারে ঢোকা, মনে মনে তুমিও কতবার ঢুকেছ?', 'Crawling along that secret passage into headquarters: how many times did you do it in your head?'),
    L('তিন গোয়েন্দার হেডকোয়ার্টার কোথায়?', 'Where is the Three Detectives\' headquarters?'),
    [
      L('স্যালভেজ ইয়ার্ডে জঞ্জালের নিচে লুকানো পুরোনো একটা মোবাইল হোম', 'An old mobile home hidden under the junk in the salvage yard'),
      L('কিশোরের বাড়ির চিলেকোঠা', 'The attic of Kishore\'s house'),
      L('স্কুল লাইব্রেরির পেছনের একটা ঘর', 'A back room of the school library'),
      L('সাগরপাড়ের পরিত্যক্ত বাতিঘর', 'An abandoned lighthouse by the sea'),
    ]),
  q('k-card', 2,
    L('নতুন কোনো কেসের শুরুতেই হাতে ধরিয়ে দেওয়া হতো ছোট্ট একটা কার্ড…', 'A small card, handed over at the start of every new case…'),
    L('তিন গোয়েন্দার কার্ডে কোন চিহ্ন থাকে?', 'What symbol is on the Three Detectives\' card?'),
    [L('তিনটা প্রশ্নবোধক চিহ্ন', 'Three question marks'), L('একটা আতশ কাচ', 'A magnifying glass'), L('তিনটা তারা', 'Three stars'), L('একটা চাবি', 'A key')]),
  q('k-town', 2, null,
    L('তিন গোয়েন্দা ক্যালিফোর্নিয়ার কোন শহরে থাকে?', 'Which California town do the Three Detectives live in?'),
    [L('রকি বীচ', 'Rocky Beach'), L('সানি ব্রুক', 'Sunny Brook'), L('পাইন হারবার', 'Pine Harbour'), L('সিলভার বে', 'Silver Bay')]),

  // Case 3: the foggy shore
  q('k-roots', 3, null,
    L('কিশোর পাশার শিকড় কোন দেশে?', 'Where are Kishore Pasha\'s roots?'),
    [L('বাংলাদেশ', 'Bangladesh'), L('আয়ারল্যান্ড', 'Ireland'), L('মেক্সিকো', 'Mexico'), L('জাপান', 'Japan')]),
  q('k-robin-role', 3,
    L('তিনটা ছেলে, তিন রকম মাথা, আর প্রত্যেকের কাজটা যেন মাপমতো বানানো…', 'Three boys, three very different minds, and each with a job that fit him like a glove…'),
    L('দলে রবিন মিলফোর্ডের দায়িত্ব কী?', 'What is Robin Milford\'s job on the team?'),
    [L('নথি গবেষক', 'Records and research'), L('সহকারী গোয়েন্দা', 'Second detective'), L('গোয়েন্দাপ্রধান', 'Chief detective'), L('দলের গাড়িচালক', 'The team\'s driver')]),
  q('k-yard', 3,
    L('জঞ্জালের পাহাড়, পুরোনো লোহার গন্ধ, আর কাজ ধরিয়ে দেওয়ার জন্য ওত পেতে থাকা এক চাচী…', 'Mountains of junk, the smell of old iron, and an aunt lying in wait with a job for you…'),
    L('স্যালভেজ ইয়ার্ডটা কার?', 'Whose salvage yard is it?'),
    [L('কিশোরের চাচা রাশেদ পাশার', 'Kishore\'s uncle, Rashed Pasha'), L('মুসার বাবার', 'Musa\'s father'), L('রবিনের বাবার', 'Robin\'s father'), L('রকি বীচের মেয়রের', 'The mayor of Rocky Beach')]),
  q('k-terry', 3,
    L('বইয়ের পর বইয়ে ঘুরেফিরে আসত একটা নাম, পাঠকেরা যেটা কখনো ভোলেনি…', 'One name kept turning up, book after book, and readers never forgot it…'),
    L('শুঁটকি টেরি তিন গোয়েন্দার কে?', 'Who is Shutki Terry to the Three Detectives?'),
    [
      L('হিংসুটে প্রতিদ্বন্দ্বী, সারাক্ষণ পেছনে লেগে থাকে', 'A jealous rival who is always after them'),
      L('রকি বীচের পুলিশপ্রধান', 'Rocky Beach\'s police chief'),
      L('মুসার চাচাতো ভাই', 'Musa\'s cousin'),
      L('স্যালভেজ ইয়ার্ডের কর্মচারী', 'A worker at the salvage yard'),
    ]),

  // Case 4: the mystery house on the cliff
  q('k-lip', 4,
    L('কেসে জট পাকলেই দলের প্রধানের একটা অভ্যাস দেখে বোঝা যেত, মাথা এখন পুরোদমে চলছে…', 'When a case got knotted, one habit of the team\'s leader told you his brain was in top gear…'),
    L('গভীর চিন্তায় ডুবে গেলে কিশোর কী করে?', 'What does Kishore do when he is deep in thought?'),
    [L('নিচের ঠোঁটে চিমটি কাটে', 'Pinches his lower lip'), L('নখ কামড়ায়', 'Bites his nails'), L('শিস দেয়', 'Whistles'), L('মাথার চুল টানে', 'Tugs at his hair')]),
  q('k-director', 4, null,
    L('তিন গোয়েন্দার পরিচিত বিখ্যাত চিত্রপরিচালকের নাম কী?', 'What is the name of the famous film director the Three Detectives know?'),
    [L('ডেভিস ক্রিস্টোফার', 'Davis Christopher'), L('হেনরি ওয়াটসন', 'Henry Watson'), L('পিটার ক্লার্ক', 'Peter Clarke'), L('জন ম্যাথিউস', 'John Matthews')]),
  q('k-rolls', 4,
    L('রকি বীচের রাস্তায় ঝকঝকে এক বিলাসী গাড়ি, সামনে শোফার, পেছনের সিটে তিন কিশোর গোয়েন্দা…', 'A gleaming luxury car on the roads of Rocky Beach, a chauffeur in front and three young detectives in the back…'),
    L('শোফার-চালিত কোন বিলাসী গাড়িতে চড়ে তিন গোয়েন্দা মাঝে মাঝে তদন্তে যেত?', 'Which chauffeur-driven luxury car did the Three Detectives sometimes ride to a case?'),
    [L('রোলস রয়েস', 'Rolls-Royce'), L('ক্যাডিলাক', 'Cadillac'), L('মার্সিডিজ বেঞ্জ', 'Mercedes-Benz'), L('বেন্টলি', 'Bentley')]),
  q('k-police-chief', 4, null,
    L('রকি বীচের পুলিশপ্রধানের নাম কী?', 'What is the name of Rocky Beach\'s police chief?'),
    [L('ইয়ান ফ্লেচার', 'Ian Fletcher'), L('ডেভিড মরগান', 'David Morgan'), L('রিচার্ড কলিন্স', 'Richard Collins'), L('টমাস হার্পার', 'Thomas Harper')]),
]
