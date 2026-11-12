const PATHS = {
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  x: 'M7 7l10 10M17 7L7 17',
  arrowLeft: 'M15 5l-7 7 7 7',
  arrowRight: 'M9 5l7 7-7 7',
  cards: 'M5 7.5A1.5 1.5 0 0 1 6.5 6h8A1.5 1.5 0 0 1 16 7.5v12a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 19.5zM9 3h8.5A1.5 1.5 0 0 1 19 4.5V17',
  share: 'M12 3.5V15M7.5 8L12 3.5 16.5 8M5 13.5v5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5',
  download: 'M12 4v11.5M7.5 11L12 15.5 16.5 11M5 20h14',
  replay: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7',
  fifty: 'M3.5 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0M12.5 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0M13 17.5l7-11',
  freeze: 'M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5',
  swap: 'M6 8h12l-3.5-3.5M18 16H6l3.5 3.5',
  lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  tag: 'M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0zM8 8h.01',
  book: 'M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5zM12 6v13.5',
  home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5',
  alert: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M12 7.5V13M12 16.5v.01',
  quill: 'M20 4c-6.5.5-11.5 5.5-12.5 12L6 20l4-1.5c6.5-1 11.5-6 10-14.5M8.5 15.5l5.5-5.5',
  sparkle: 'M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z',
} as const

export type IconName = keyof typeof PATHS

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

/** Inline stroke icons. Decorative by default; label the parent control instead. */
export function Icon({ name, size = 22, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

export const ICON_PATHS = PATHS
