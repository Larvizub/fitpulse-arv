import { useMemo, useState } from 'react'
import { createTranslator, type Language, type TranslationKey } from '../i18n/translations'

const STORAGE_KEY = 'fitpulse.language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'es'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'es'
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const t = useMemo(() => createTranslator(language), [language])

  function setLanguage(next: Language) {
    setLanguageState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  return {
    language,
    t: (key: TranslationKey) => t(key),
    setLanguage,
  }
}
