import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'tin-goyenda',
  status: 'coming-soon',
  order: 1,
  title: { bn: 'তিন গোয়েন্দা', en: 'Tin Goyenda' },
  tagline: { bn: 'তিন কিশোর গোয়েন্দার দলে তুমি কোন জন?', en: 'Which of the three young detectives are you?' },
  icon: { viewBox: '0 0 32 32', markup: '<circle cx="13" cy="13" r="7"/><path d="M18.5 18.5 L26 26"/>' },
  theme: {
    bg: '#0C1F24', surface: '#1B2C31', line: '#354549', accent: '#F0A545', onAccent: '#0C1F24',
    text: '#EAF3EF', muted: '#ACB8B6', disabled: '#919E9E',
  },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 45, y: 12 },
    effects: {
      stars: [{ x: 60, y: 4, size: 1.5 }, { x: 70, y: 9, size: 2 }, { x: 92, y: 14, size: 1.5 }, { x: 40, y: 3, size: 1.5 }],
      glows: [
        { x: 53, y: 55, w: 8, h: 5, color: '#FFC46B', strength: 0.55, mode: 'flicker' },
        { x: 78, y: 59, w: 18, h: 8, color: '#FFB45A', strength: 0.32 },
        { x: 30, y: 80, w: 9, h: 5, color: '#FFE7A8', strength: 0.45 },
        { x: 82, y: 8, w: 12, h: 7, color: '#FFF1CF', strength: 0.2 },
      ],
    },
  },
})
