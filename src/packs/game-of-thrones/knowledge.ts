import type { Localized, PackInput } from '../../engine/schema'

/**
 * Knowledge pool: 32 questions, four per season, from easy to real-fan hard.
 * TV series only. Questions ask about houses, sigils, places, swords,
 * alliances and journeys; no question or answer reveals a death or the ending.
 * The full journey uses 14 and quick mode 6; the rest are spares for the swap.
 * All wording is original.
 * Convention: the correct option is written first; options are shuffled at runtime.
 * Every question is listed for review in docs/review-game-of-thrones.md.
 */

type Q = PackInput['knowledge'][number]
const L = (bn: string, en: string): Localized => ({ bn, en })
/** Same text in both languages (names and titles). */
const N = (s: string): Localized => ({ bn: s, en: s })

function q(id: string, stage: number, memory: Localized | null, prompt: Localized, options: Localized[]): Q {
  return { id, stage, ...(memory ? { memory } : {}), prompt, options, answer: 0 }
}

export const knowledge: Q[] = [
  // Season 1: the king rides north
  q('k-direwolf', 1,
    L('মনে আছে, একেবারে প্রথম পর্বেই বরফের মধ্যে পাওয়া সেই ছোট্ট ছানাগুলো, ভাইবোনদের প্রত্যেকের জন্য একটা করে?', 'Remember the little pups found in the snow in the very first episode, one for each of the children?'),
    L('ধূসর direwolf কোন House-এর প্রতীক?', 'Which house has a grey direwolf as its sigil?'),
    [N('Stark'), N('Lannister'), N('Baratheon'), N('Targaryen')]),
  q('k-hand', 1,
    L('রাজা পুরো দরবার নিয়ে Winterfell-এ হাজির হয়েছিলেন, পুরোনো বন্ধুর কাছে একটা বড় অনুরোধ নিয়ে, মনে পড়ে?', 'Remember the king riding into Winterfell with his whole court, bringing a big request for an old friend?'),
    L('King Robert, Ned Stark-কে কোন পদ নিতে বলেন?', 'Which post does King Robert ask Ned Stark to take?'),
    [N('Hand of the King'), N('Master of Coin'), N('Lord Commander of the Kingsguard'), N('Master of Whisperers')]),
  q('k-needle', 1,
    L('বিদায়ের আগে এক ভাই তার ছোট বোনকে দিয়েছিল একটা সরু, হালকা তলোয়ার…', 'Before saying goodbye, a brother gave his little sister a slim, light sword…'),
    L('Arya-র সেই তলোয়ারের নাম কী?', 'What is Arya\'s sword called?'),
    [N('Needle'), N('Longclaw'), N('Oathkeeper'), N('Ice')]),
  q('k-ghost', 1, null,
    L('Jon Snow-র সাদা direwolf-এর নাম কী?', 'What is the name of Jon Snow\'s white direwolf?'),
    [N('Ghost'), N('Summer'), N('Nymeria'), N('Grey Wind')]),

  // Season 2: one throne, many crowns
  q('k-kraken', 2,
    L('অনেক বছর পর Theon যখন নিজের দ্বীপে ফিরল, সেখানকার ঠান্ডা অভ্যর্থনাটা মনে আছে?', 'Remember the chilly welcome Theon got when he finally sailed home to his islands?'),
    L('সোনালি kraken কোন House-এর প্রতীক?', 'Which house has a golden kraken as its sigil?'),
    [N('Greyjoy'), N('Tully'), N('Arryn'), N('Martell')]),
  q('k-wildfire', 2,
    L('Blackwater-এর সেই রাত, যখন নদীর পানিতেই জ্বলে উঠেছিল সবুজ আগুন…', 'That night on the Blackwater, when the river itself burst into green flame…'),
    L('King\'s Landing রক্ষায় Tyrion কোন সবুজ, ভয়ংকর জিনিস কাজে লাগিয়েছিল?', 'What dangerous green substance did Tyrion use to defend King\'s Landing?'),
    [N('Wildfire'), N('Dragonglass'), N('Milk of the poppy'), N('Shade of the evening')]),
  q('k-qarth', 2, null,
    L('Red Waste মরুভূমি পার হয়ে Daenerys কোন শহরে পৌঁছায়?', 'Which city does Daenerys reach after crossing the Red Waste?'),
    [N('Qarth'), N('Meereen'), N('Braavos'), N('Pentos')]),
  q('k-lord-of-light', 2,
    L('লাল পোশাকের এক রহস্যময় নারী, যে আগুনের শিখায় ভবিষ্যৎ দেখার দাবি করে…', 'A mysterious woman in red who claims to see the future in the flames…'),
    L('Melisandre কোন দেবতার সেবা করে?', 'Which god does Melisandre serve?'),
    [N('The Lord of Light'), N('The Many-Faced God'), N('The Drowned God'), N('The Old Gods')]),

  // Season 3: beyond the Wall
  q('k-unsullied', 3,
    L('Astapor-এর কড়া রোদে সারি সারি দাঁড়িয়ে থাকা সেই নীরব সৈন্যরা, মনে আছে?', 'Remember the silent soldiers standing row after row in the Astapor sun?'),
    L('Astapor থেকে Daenerys কোন সেনাবাহিনী পায়?', 'Which army does Daenerys gain in Astapor?'),
    [N('The Unsullied'), N('The Second Sons'), N('The Golden Company'), N('The Night\'s Watch')]),
  q('k-mance', 3, null,
    L('দেয়ালের ওপারের wildling-দের নেতা, King-Beyond-the-Wall কে?', 'Who leads the wildlings as the King-Beyond-the-Wall?'),
    [N('Mance Rayder'), N('Tormund Giantsbane'), N('Craster'), N('Ygritte')]),
  q('k-rose', 3,
    L('Highgarden-এর এক তীক্ষ্ণ বুদ্ধির দাদি, যার মুখের ওপর কথা বলার সাহস কারো নেই…', 'A sharp-witted grandmother from Highgarden whom nobody dares to talk back to…'),
    L('সোনালি গোলাপ কোন House-এর প্রতীক?', 'Which house has a golden rose as its sigil?'),
    [N('Tyrell'), N('Tully'), N('Arryn'), N('Tarly')]),
  q('k-reeds', 3,
    L('উত্তরের পথে Bran-এর সাথে যোগ দিল দুই ভাইবোন, যাদের একজন স্বপ্নে অনেক কিছু দেখত…', 'Two siblings joined Bran on the road north, one of whom saw things in his dreams…'),
    L('এই দুই ভাইবোন কে?', 'Who were these two siblings?'),
    [N('Meera & Jojen Reed'), N('Yara & Theon Greyjoy'), N('Loras & Margaery Tyrell'), N('Jaime & Cersei Lannister')]),

  // Season 4: whispers in the capital
  q('k-hound', 4,
    L('Riverlands-এর লম্বা পথ, এক রাগী বিশালদেহী লোক আর এক ছোট্ট মেয়ে, যারা একে অপরকে মোটেও সহ্য করতে পারে না…', 'A long road through the Riverlands, a grumpy giant of a man and a small girl who cannot stand each other…'),
    L('Arya-র সেই অনিচ্ছুক সঙ্গী কে?', 'Who is Arya\'s reluctant travelling companion?'),
    [N('The Hound'), N('Gendry'), N('Jaqen H\'ghar'), N('Hot Pie')]),
  q('k-oathkeeper', 4,
    L('Jaime একটা ঝকঝকে Valyrian steel-এর তলোয়ার তুলে দিল Brienne-এর হাতে, সাথে রাখার মতো একটা বড় কথাও…', 'Jaime handed Brienne a gleaming Valyrian steel sword, along with a big promise to keep…'),
    L('Brienne তলোয়ারটার কী নাম দেয়?', 'What does Brienne name the sword?'),
    [N('Oathkeeper'), N('Widow\'s Wail'), N('Longclaw'), N('Heartsbane')]),
  q('k-eyrie', 4, null,
    L('King\'s Landing থেকে বের করে এনে Littlefinger, Sansa-কে কোথায় নিয়ে যায়?', 'Where does Littlefinger take Sansa after getting her out of King\'s Landing?'),
    [N('The Eyrie'), N('Riverrun'), N('Dragonstone'), N('Highgarden')]),
  q('k-dorne', 4,
    L('রাজধানীতে এলেন এক নতুন অতিথি, সাপের মতো ক্ষিপ্র, মুখে সবসময় একটা বাঁকা হাসি…', 'A new guest rode into the capital, quick as a snake and always wearing a crooked smile…'),
    L('Oberyn Martell কোন অঞ্চল থেকে এসেছিলেন?', 'Which land does Oberyn Martell come from?'),
    [N('Dorne'), N('The Reach'), N('The Vale'), N('The Stormlands')]),

  // Season 5: across the Narrow Sea
  q('k-braavos', 5,
    L('এক রহস্যময় লোকের দেওয়া একটা লোহার মুদ্রা, আর সমুদ্রের ওপারে যাওয়ার একটা জাহাজ…', 'An iron coin from a mysterious man, and a ship across the sea…'),
    L('Arya সমুদ্র পেরিয়ে কোন শহরে যায়?', 'Which city does Arya sail to?'),
    [N('Braavos'), N('Pentos'), N('Volantis'), N('Oldtown')]),
  q('k-jorah-tyrion', 5,
    L('পথে পথে ঘুরতে থাকা Tyrion হঠাৎ বন্দী হলো, আর তাকে নিয়ে বন্দীকারী রওনা দিল এক রানির কাছে…', 'A wandering Tyrion was suddenly captured, and his captor set off to deliver him to a queen…'),
    L('Tyrion-কে ধরে কে Daenerys-এর কাছে নিয়ে যায়?', 'Who captures Tyrion and brings him to Daenerys?'),
    [N('Jorah Mormont'), N('Daario Naharis'), N('Varys'), N('Grey Worm')]),
  q('k-dorne-trip', 5, null,
    L('Dorne-এর গোপন অভিযানে Jaime-এর সঙ্গী কে?', 'Who goes with Jaime on his secret mission to Dorne?'),
    [N('Bronn'), N('Podrick Payne'), N('Brienne of Tarth'), N('Davos Seaworth')]),
  q('k-hardhome', 5,
    L('Jon জাহাজ ভাসাল দূর উত্তরের এক উপকূলে, পুরোনো শত্রুদের দেয়ালের এপারে আনার আশায়…', 'Jon sailed to a far northern shore, hoping to bring old enemies south of the Wall…'),
    L('জায়গাটার নাম কী?', 'What is that place called?'),
    [N('Hardhome'), N('Eastwatch'), N('Craster\'s Keep'), N('The Fist of the First Men')]),

  // Season 6: old banners rise again
  q('k-vaes-dothrak', 6,
    L('Daenerys আবার ঘোড়সওয়ার যোদ্ধাদের হাতে, আর তাকে নিয়ে যাওয়া হলো তাদের পবিত্র শহরে…', 'Daenerys was in the horse lords\' hands again, taken to their sacred city…'),
    L('সেই পবিত্র শহরের নাম কী?', 'What is that sacred city called?'),
    [N('Vaes Dothrak'), N('Astapor'), N('Yunkai'), N('Qohor')]),
  q('k-citadel', 6,
    L('বই-পাগল Sam অবশেষে পৌঁছাল দুনিয়ার সবচেয়ে বড় লাইব্রেরির শহরে…', 'Book-loving Sam finally reached the city with the greatest library in the world…'),
    L('maester হওয়ার পড়াশোনা করতে Sam কোন শহরে যায়?', 'Which city does Sam go to, to train as a maester?'),
    [N('Oldtown'), N('Braavos'), N('Lannisport'), N('White Harbor')]),
  q('k-mormont', 6, null,
    L('Bear Island-এর ছোট্ট, নির্ভীক Lady Lyanna কোন House-এর?', 'Young, fearless Lady Lyanna of Bear Island belongs to which house?'),
    [N('Mormont'), N('Glover'), N('Karstark'), N('Umber')]),
  q('k-heartsbane', 6,
    L('বাড়ি থেকে চুপিচুপি বেরোনোর সময় Sam সাথে নিয়ে এল পরিবারের সবচেয়ে দামি জিনিসটা…', 'Slipping out of his family home, Sam took its most precious treasure with him…'),
    L('Tarly পরিবারের Valyrian steel-এর তলোয়ারটার নাম কী?', 'What is the Tarly family\'s Valyrian steel sword called?'),
    [N('Heartsbane'), N('Ice'), N('Longclaw'), N('Oathkeeper')]),

  // Season 7: allies at Dragonstone
  q('k-dragonstone', 7,
    L('বহু বছর পর Westeros-এর মাটিতে পা রাখলেন Daenerys, পূর্বপুরুষদের পুরোনো দুর্গে…', 'After many years, Daenerys set foot in Westeros at the old fortress of her ancestors…'),
    L('কোথায় নামলেন তিনি?', 'Where did she land?'),
    [N('Dragonstone'), N('Storm\'s End'), N('Sunspear'), N('Casterly Rock')]),
  q('k-wight', 7,
    L('দেয়ালের ওপারে এক দুঃসাহসী অভিযান, ছোট্ট একটা দল আর চারদিকে তুষারে ঢাকা অসীম মাঠ…', 'A daring mission beyond the Wall: a small band of companions and endless fields of snow…'),
    L('অভিযানের উদ্দেশ্য কী ছিল?', 'What was the mission for?'),
    [L('একটা wight ধরে এনে দক্ষিণের সবাইকে দেখানো', 'Capture a wight to show the south the threat is real'), L('Bran-কে উদ্ধার করে আনা', 'Rescue Bran'), L('হারিয়ে যাওয়া Benjen Stark-কে খুঁজে বের করা', 'Find the missing Benjen Stark'), L('দেয়ালের ফাটল মেরামত করা', 'Repair a crack in the Wall')]),
  q('k-greyscale', 7, null,
    L('Citadel-এ Sam গোপনে Jorah Mormont-এর কোন রোগ সারিয়ে তোলে?', 'At the Citadel, Sam secretly cures Jorah Mormont of which illness?'),
    [N('Greyscale'), L('শীতের জ্বর', 'Winter fever'), L('তুষার-অন্ধত্ব', 'Snow blindness'), L('তুষারে জমে যাওয়া হাত-পা', 'Frostbite')]),
  q('k-longclaw', 7, null,
    L('Jon-এর হাতে আসার আগে Longclaw কোন House-এর তলোয়ার ছিল?', 'Which house did Longclaw belong to before it came to Jon?'),
    [N('Mormont'), N('Stark'), N('Umber'), N('Karstark')]),

  // Season 8: the longest night
  q('k-knighted', 8,
    L('Winterfell-এ আগুনের পাশে এক রাত, যখন বহু বছরের একটা স্বপ্ন হঠাৎ সত্যি হয়ে গেল…', 'One night by the fire at Winterfell, when a lifelong dream suddenly came true…'),
    L('Brienne of Tarth-কে নাইট উপাধি দেন কে?', 'Who knights Brienne of Tarth?'),
    [N('Jaime Lannister'), N('Jon Snow'), N('Davos Seaworth'), N('Podrick Payne')]),
  q('k-pod-song', 8,
    L('বড় লড়াইয়ের আগের রাতে Podrick ধরল এক পুরোনো গান, আর পুরো ঘর চুপ হয়ে গেল…', 'On the night before the great battle, Podrick began an old song and the whole room fell silent…'),
    L('গানটার নাম কী?', 'What was the song?'),
    [N('Jenny of Oldstones'), N('The Rains of Castamere'), N('The Bear and the Maiden Fair'), N('It\'s Always Summer Under the Sea')]),
  q('k-golden-company', 8, null,
    L('Cersei সমুদ্রের ওপার থেকে কোন ভাড়াটে সেনাদল আনায়?', 'Which sellsword army does Cersei bring over from across the sea?'),
    [N('The Golden Company'), N('The Second Sons'), N('The Unsullied'), N('The Brotherhood Without Banners')]),
  q('k-storms-end', 8,
    L('এক বিনয়ী কামারের জীবনে হঠাৎ এল নতুন নাম আর নতুন ঠিকানা…', 'A humble blacksmith suddenly received a new name and a new home…'),
    L('Daenerys, Gendry-কে কোন দুর্গের লর্ড ঘোষণা করেন?', 'Daenerys names Gendry lord of which castle?'),
    [N('Storm\'s End'), N('Casterly Rock'), N('Harrenhal'), N('Riverrun')]),
]
