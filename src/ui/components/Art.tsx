import type { CSSProperties } from 'react'
import type { SvgArt } from '../../engine/schema'

interface ArtProps {
  art: SvgArt
  className?: string
  style?: CSSProperties
  strokeWidth?: number
  slice?: boolean
}

/**
 * Renders pack line art. Markup comes from bundled pack source files (never
 * from user input), so injecting it is safe. Draws in currentColor.
 */
export function Art({ art, className, style, strokeWidth = 1.25, slice = false }: ArtProps) {
  return (
    <svg
      viewBox={art.viewBox}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: art.markup }}
    />
  )
}
