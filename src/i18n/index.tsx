import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import eu from './locales/eu.json'
import es from './locales/es.json'

type Lang = 'eu' | 'es'
type Dict = Record<string, string>

const dicts: Record<Lang, Dict> = { eu, es }

interface I18nContextValue {
  lang: Lang
  t: (key: string) => string
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('eu')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useMemo(() => {
    const d = dicts[lang]
    return (key: string) => d[key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('I18nProvider missing')
  return ctx
}
