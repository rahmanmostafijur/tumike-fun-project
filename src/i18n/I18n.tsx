import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Localized } from '../engine/schema'
import { getLang, setLang as storeLang, type Lang } from '../storage/storage'
import { strings, type StringKey } from './strings'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** Converts ASCII digits in a string or number to Bangla digits. */
export function toBnDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] ?? d)
}

export function fill(template: string, vars: Readonly<Record<string, string | number>> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** UI string with {placeholders}. Numbers are localised automatically. */
  t: (key: StringKey, vars?: Readonly<Record<string, string | number>>) => string
  /** Picks the current language from pack copy. */
  loc: (text: Localized) => string
  /** Number in the current language's digits. */
  num: (n: number | string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => getLang() ?? 'bn')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    storeLang(next)
  }, [])

  const value = useMemo<I18nValue>(() => {
    const num = (n: number | string) => (lang === 'bn' ? toBnDigits(n) : String(n))
    return {
      lang,
      setLang,
      num,
      loc: (text) => text[lang],
      t: (key, vars = {}) => {
        const localized = Object.fromEntries(
          Object.entries(vars).map(([k, v]) => [k, typeof v === 'number' ? num(v) : v]),
        )
        return fill(strings[key][lang], localized)
      },
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
