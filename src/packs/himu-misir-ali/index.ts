import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'himu-misir-ali',
  status: 'coming-soon',
  order: 2,
  title: { bn: 'হিমু ও মিসির আলি', en: 'Himu & Misir Ali' },
  tagline: { bn: 'হলুদ পাঞ্জাবি নাকি যুক্তির খাতা, তুমি কোন দিকে?', en: 'The yellow panjabi or the logician’s notebook?' },
  icon: { viewBox: '0 0 32 32', markup: '<path d="M21 6 a10 10 0 1 0 5 14 a8 8 0 1 1 -5 -14z"/>' },
  theme: {
    bg: '#101832', surface: '#1E263E', line: '#393F55', accent: '#F2C94C', onAccent: '#101832',
    text: '#F1EEE4', muted: '#B2B2B2', disabled: '#97989D',
  },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 55, y: 12 },
    effects: {
      stars: [{ x: 45, y: 3, size: 1.5 }, { x: 60, y: 8, size: 2 }, { x: 95, y: 18, size: 1.5 }],
      steam: [{ x: 87, y: 49 }, { x: 31, y: 73 }],
      glows: [
        { x: 79, y: 10, w: 30, h: 17, color: '#FFF1C2', strength: 0.35 },
        { x: 93, y: 45, w: 10, h: 6, color: '#FFC060', strength: 0.5, mode: 'flicker' },
      ],
      particles: [{ kind: 'leaves', count: 6 }],
    },
  },
})
