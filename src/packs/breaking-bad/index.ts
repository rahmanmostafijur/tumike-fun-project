import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'breaking-bad',
  status: 'coming-soon',
  order: 3,
  title: { bn: 'Breaking Bad', en: 'Breaking Bad' },
  tagline: { bn: 'মরুভূমির ল্যাবে তুমি কে হতে?', en: 'Who would you be in the desert lab?' },
  icon: { viewBox: '0 0 32 32', markup: '<path d="M12 5 H20 M13 5 V13 L7 24 Q6 27 9 27 H23 Q26 27 25 24 L19 13 V5"/><path d="M10 20 H22"/>' },
  theme: {
    bg: '#0F1A12', surface: '#1D2820', line: '#38413A', accent: '#C9D24A', onAccent: '#0F1A12',
    text: '#EEF1DF', muted: '#B0B5A6', disabled: '#959B8D',
  },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 55, y: 15 },
    effects: {
      glows: [
        { x: 13, y: 78, w: 12, h: 7, color: '#5FE0F0', strength: 0.45 },
        { x: 82, y: 62, w: 16, h: 6, color: '#FFC46B', strength: 0.4, mode: 'flicker' },
        { x: 83, y: 13, w: 22, h: 12, color: '#F4F2C8', strength: 0.22 },
      ],
    },
  },
})
