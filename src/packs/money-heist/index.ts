import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'money-heist',
  status: 'coming-soon',
  order: 4,
  title: { bn: 'Money Heist', en: 'Money Heist' },
  tagline: { bn: 'লাল জাম্পস্যুট পরলে তোমার শহরের নাম কী হতো?', en: 'Put on the red jumpsuit. What is your city name?' },
  icon: { viewBox: '0 0 32 32', markup: '<path d="M6 10 Q16 6 26 10 Q27 20 16 27 Q5 20 6 10Z"/><path d="M11 15 Q13 13 15 15 M17 15 Q19 13 21 15 M12 20 Q16 23 20 20"/>' },
  theme: {
    // The red is lifted from #E0303A so it holds 4.5:1 on the background and surface.
    bg: '#1A0B0E', surface: '#281A1C', line: '#413437', accent: '#E6555D', onAccent: '#1A0B0E',
    text: '#F6E9E9', muted: '#B8ABAC', disabled: '#9E9091',
  },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 50, y: 14 },
    effects: {
      glows: [
        { x: 51, y: 28, w: 80, h: 22, color: '#FF2A3A', strength: 0.22 },
        { x: 81, y: 53, w: 18, h: 9, color: '#FF5A4A', strength: 0.4, mode: 'flicker' },
        { x: 83, y: 8, w: 12, h: 7, color: '#FFE0E0', strength: 0.18 },
      ],
      particles: [{ kind: 'smoke', count: 3 }],
    },
  },
})
