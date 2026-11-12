import { defineTeaser } from '../../engine/schema'
import background from './background.webp'

export default defineTeaser({
  id: 'game-of-thrones',
  status: 'coming-soon',
  order: 5,
  title: { bn: 'Game of Thrones', en: 'Game of Thrones' },
  tagline: { bn: 'দেয়ালের এপারে না ওপারে, তুমি কোন ঘরের?', en: 'North of the Wall or south: which house are you?' },
  icon: { viewBox: '0 0 32 32', markup: '<path d="M7 27 V12 H11 V8 H15 V12 H17 V8 H21 V12 H25 V27Z"/><path d="M14 27 V21 Q16 18 18 21 V27"/>' },
  theme: {
    bg: '#0D1318', surface: '#1C2126', line: '#363B3F', accent: '#A9CFE0', onAccent: '#0D1318',
    text: '#EAF1F5', muted: '#ACB3B7', disabled: '#92989D',
  },
  background: {
    src: background,
    width: 941,
    height: 1672,
    rest: { x: 50, y: 12 },
    effects: {
      glows: [
        { x: 81, y: 58, w: 7, h: 5, color: '#FFB050', strength: 0.55, mode: 'flicker' },
        { x: 89, y: 68, w: 14, h: 7, color: '#FF9A40', strength: 0.42 },
        { x: 27, y: 17, w: 7, h: 4, color: '#FFC46B', strength: 0.5, mode: 'flicker' },
        { x: 86, y: 8, w: 22, h: 12, color: '#E8F2FF', strength: 0.22 },
      ],
      particles: [{ kind: 'snow', count: 36 }],
    },
  },
})
