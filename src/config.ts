/**
 * App identity. Change the name or URL here and nowhere else.
 */
export const APP = {
  /** Wordmark shown on the landing page and on every card. */
  wordmark: 'তুমি কে?',
  name: { bn: 'তুমি কে?', en: 'Tumi Ke?' },
  /** Monogram pressed into the wax seal on the reveal letter. */
  monogram: 'তু',
  siteUrl: 'https://tumike.app',
} as const

/** Pack opened by default (and whose background is preloaded). */
export const DEFAULT_PACK_ID = 'harry-potter'

/** Host part of the site URL, for display on cards ("tumike.app"). */
export const SITE_HOST = APP.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
