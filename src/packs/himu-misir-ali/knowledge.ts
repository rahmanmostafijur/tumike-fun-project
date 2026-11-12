import type { Localized, PackInput } from '../../engine/schema'

/**
 * Knowledge pool: 12 questions over the four chapters (3 each), from easy to
 * real-reader hard. Facts in these books are easy to get wrong, so the pool
 * keeps to things every reader knows; the pack's heart is in the scenarios.
 * The full journey asks 8 and quick mode 3; the rest are spares for the swap.
 * All wording is original; nothing is quoted from the books.
 * Convention: the correct option is written first; options are shuffled at runtime.
 * Every question is listed with its confidence in docs/review-himu-misir-ali.md.
 */

type Q = PackInput['knowledge'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })

function q(id: string, stage: number, memory: Localized | null, prompt: Localized, options: Localized[]): Q {
  return { id, stage, ...(memory ? { memory } : {}), prompt, options, answer: 0 }
}

export const knowledge: Q[] = [
  // Chapter 1: evening at the tea stall
  q('k-panjabi', 1,
    L('মনে আছে, বইয়ের পাতা থেকে উঠে আসা সেই রঙটা, যেটা দেখলে আজও রাস্তায় কাউকে দেখে চমকে উঠি?', 'Remember the colour that walked off the page, the one that still makes us look twice at strangers on the street?'),
    L('হিমুর পাঞ্জাবির রং কী?', 'What colour is Himu\'s panjabi?'),
    [L('হলুদ', 'Yellow'), L('নীল', 'Blue'), L('সাদা', 'White'), L('সবুজ', 'Green')]),
  q('k-author', 1, null,
    L('হিমু আর মিসির আলি, দুজনকেই কে সৃষ্টি করেছেন?', 'Who created both Himu and Misir Ali?'),
    [L('হুমায়ূন আহমেদ', 'Humayun Ahmed'), L('মুহম্মদ জাফর ইকবাল', 'Muhammed Zafar Iqbal'), L('সমরেশ মজুমদার', 'Samaresh Majumdar'), L('সুনীল গঙ্গোপাধ্যায়', 'Sunil Gangopadhyay')]),
  q('k-barefoot', 1,
    L('গরম পিচের রাস্তা হোক বা বৃষ্টিভেজা গলি, লোকটা হাঁটে আপন খেয়ালে…', 'Hot tar or a rain-soaked lane, he walks wherever his fancy takes him…'),
    L('হিমু সাধারণত কীভাবে ঢাকার রাস্তায় হাঁটে?', 'How does Himu usually walk the streets of Dhaka?'),
    [L('খালি পায়ে', 'Barefoot'), L('চকচকে চামড়ার জুতা পায়ে', 'In polished leather shoes'), L('কেডস পায়ে', 'In canvas sneakers'), L('গামবুট পায়ে', 'In rubber boots')]),

  // Chapter 2: walking the empty lanes
  q('k-pocket', 2,
    L('টাকা নেই, মানিব্যাগ নেই, আর রাখার জায়গাও নেই, তবু হিমুর কোনো চিন্তা নেই…', 'No money, no wallet, and nowhere to keep them anyway, and Himu could not care less…'),
    L('হিমুর পাঞ্জাবিতে কোন জিনিসটা থাকে না?', 'What does Himu\'s panjabi famously not have?'),
    [L('পকেট', 'Pockets'), L('বোতাম', 'Buttons'), L('কলার', 'A collar'), L('হাতা', 'Sleeves')]),
  q('k-misir-subject', 2, null,
    L('মিসির আলি বিশ্ববিদ্যালয়ে কোন বিষয় পড়ান?', 'What subject does Misir Ali teach at the university?'),
    [L('মনোবিজ্ঞান', 'Psychology'), L('দর্শন', 'Philosophy'), L('ইতিহাস', 'History'), L('পদার্থবিজ্ঞান', 'Physics')]),
  q('k-rupa-sari', 2,
    L('বারান্দায় একটা মেয়ে দাঁড়িয়ে, কারো আসার পথ চেয়ে, পরনে এমন এক রঙের শাড়ি যা পাঠকের মনে গেঁথে আছে…', 'A girl on the balcony, watching the road for someone, in a sari whose colour every reader remembers…'),
    L('রূপাকে কোন রঙের শাড়িতে সবচেয়ে বেশি মনে পড়ে?', 'Which colour sari is Rupa best remembered in?'),
    [L('নীল', 'Blue'), L('লাল', 'Red'), L('হলুদ', 'Yellow'), L('সবুজ', 'Green')]),

  // Chapter 3: a light in the window
  q('k-moyurakkhi', 3,
    L('মন খারাপ হলে হিমু চোখ বুজে এক নদীর কাছে চলে যায়, যেখানে আর কেউ যেতে পারে না…', 'When the world gets too loud, Himu closes his eyes and goes to a river nobody else can reach…'),
    L('হিমুর মনের সেই নদীর নাম কী?', 'What is the name of the river in Himu\'s mind?'),
    [L('ময়ূরাক্ষী', 'Moyurakkhi'), L('মধুমতী', 'Modhumoti'), L('ইছামতী', 'Ichhamoti'), L('কপোতাক্ষ', 'Kopotakkho')]),
  q('k-mahapurush', 3,
    L('ছেলেকে নিয়ে এক বাবার অদ্ভুত, বিশাল এক স্বপ্ন ছিল, আর সেই স্বপ্নের নিয়মগুলো হিমু আজও মনে রাখে…', 'A father had a strange, enormous dream for his son, and Himu still remembers its rules…'),
    L('হিমুর বাবা ছেলেকে কী বানাতে চেয়েছিলেন?', 'What did Himu\'s father want him to become?'),
    [L('মহাপুরুষ', 'A mahapurush, a great soul'), L('নামকরা ডাক্তার', 'A famous doctor'), L('বড় ব্যবসায়ী', 'A big businessman'), L('দেশের সেরা উকিল', 'The best lawyer in the country')]),
  q('k-badal', 3, null,
    L('হিমুর পরিবারের কে তাকে মন-প্রাণ দিয়ে ভক্তি করে, আর তার মতোই হতে চায়?', 'Who in Himu\'s family adores him and tries to become just like him?'),
    [L('বাদল', 'Badal'), L('শুভ্র', 'Shuvro'), L('বাকের', 'Baker'), L('আনিস', 'Anis')]),

  // Chapter 4: the moonlit night
  q('k-himalay', 4,
    L('ছোট্ট ডাকনামের আড়ালে আছে বিশাল এক নাম, বাবা ভেবেচিন্তে রেখেছিলেন…', 'Behind the short nickname is a grand full name, chosen by his father with great care…'),
    L('হিমুর পুরো নাম কী?', 'What is Himu\'s full name?'),
    [L('হিমালয়', 'Himalay'), L('হিমাদ্রি', 'Himadri'), L('হিমেল', 'Himel'), L('হিমাংশু', 'Himangshu')]),
  q('k-debi', 4,
    L('এক তরুণী, রাতের অদ্ভুত সব অভিজ্ঞতা, আর যুক্তি হাতে এক মানুষ: এভাবেই মিসির আলির সাথে আমাদের প্রথম দেখা…', 'A young woman, strange experiences at night, and a man armed with logic: that is how we first met Misir Ali…'),
    L('মিসির আলিকে নিয়ে লেখা প্রথম উপন্যাস কোনটি?', 'Which was the first Misir Ali novel?'),
    [L('দেবী', 'Debi'), L('নিশীথিনী', 'Nishithini'), L('অনীশ', 'Onish'), L('বৃহন্নলা', 'Brihonnola')]),
  q('k-chemistry', 4, null,
    L('লেখক হওয়ার আগে হুমায়ূন আহমেদ ঢাকা বিশ্ববিদ্যালয়ে কোন বিষয় পড়াতেন?', 'Before writing took over, what did Humayun Ahmed teach at Dhaka University?'),
    [L('রসায়ন', 'Chemistry'), L('মনোবিজ্ঞান', 'Psychology'), L('পদার্থবিজ্ঞান', 'Physics'), L('বাংলা সাহিত্য', 'Bangla literature')]),
]
