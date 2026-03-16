'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Suspense,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  languages,
  defaultLanguage,
  getLangFromPath,
  getPathWithoutLang,
  isLocaleId,
} from '@/sanity/lib/languages'

interface Language {
  id: string
  title: string
  isDefault?: boolean
}

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (lang: string) => void
  availableLanguages: Language[]
  getLanguageTitle: (id: string) => string
  localizedHref: (href: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/** scandicommerce.no → "no", everything else (incl. localhost) → "en" */
function getDomainDefaultLocale(): string {
  if (typeof window !== 'undefined' && window.location.hostname.includes('scandicommerce.no')) {
    return 'no'
  }
  return 'en'
}

const LOCALE_DOMAINS: Record<string, string> = {
  en: 'scandicommerce.com',
  no: 'scandicommerce.no',
}

function isProductionHost(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.includes('scandicommerce')
}

const defaultContextValue: LanguageContextType = {
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  availableLanguages: languages,
  getLanguageTitle: (id: string) => languages.find((l) => l.id === id)?.title ?? id,
  localizedHref: (href: string) => href,
}

function LanguageUrlSync({ onValue }: { onValue: (v: LanguageContextType) => void }) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const [currentLanguage, setCurrentLanguageState] = useState<string>(defaultLanguage)
  const [isInitialized, setIsInitialized] = useState(false)

  const firstSeg = pathname.replace(/^\/+/, '').split('/')[0] || ''
  const hasLocaleInPath = firstSeg !== '' && isLocaleId(firstSeg.toLowerCase())
  const langFromPath = hasLocaleInPath ? firstSeg.toLowerCase() : null

  // Clean path without any locale prefix (used for slug resolution)
  const cleanPath = hasLocaleInPath ? getPathWithoutLang(pathname) : pathname

  // --- Init: determine language from path or domain ---
  useEffect(() => {
    if (!isInitialized) {
      const lang = langFromPath ?? getDomainDefaultLocale()
      setCurrentLanguageState(lang)
      if (typeof window !== 'undefined') localStorage.setItem('language', lang)
      setIsInitialized(true)
    }
  }, [isInitialized, langFromPath])

  // --- Sync on navigation: path with locale wins, else domain default ---
  useEffect(() => {
    if (!isInitialized) return
    const lang = langFromPath ?? getDomainDefaultLocale()
    if (lang !== currentLanguage) {
      setCurrentLanguageState(lang)
      if (typeof window !== 'undefined') localStorage.setItem('language', lang)
    }
  }, [pathname, isInitialized, langFromPath, currentLanguage])

  // --- Switch language ---
  const setLanguage = useCallback(
    async (lang: string) => {
      setCurrentLanguageState(lang)
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang)
        document.cookie = `language=${lang}; path=/; max-age=31536000`
      }

      const domainDefault = getDomainDefaultLocale()
      const currentCleanPath = cleanPath === '/' ? '' : cleanPath.replace(/^\//, '')

      // Resolve slug in target language
      let resolvedSlug: string | null = null
      if (currentCleanPath && currentLanguage !== lang) {
        try {
          const res = await fetch(
            `/api/translate-slug?currentPath=${encodeURIComponent(currentCleanPath)}&currentLang=${encodeURIComponent(currentLanguage)}&targetLang=${encodeURIComponent(lang)}`
          )
          const data: { slug: string | null } = await res.json()
          resolvedSlug = data.slug
        } catch {
          // Fall through
        }
      }

      const targetPath = resolvedSlug ? `/${resolvedSlug}` : (cleanPath || '/')

      // Production: switch domain (full navigation, not client-side push)
      if (isProductionHost() && LOCALE_DOMAINS[lang]) {
        window.location.href = `https://${LOCALE_DOMAINS[lang]}${targetPath}`
        return
      }

      // Localhost / dev: use prefix-based routing
      if (lang === domainDefault) {
        router.push(targetPath)
      } else {
        router.push(`/${lang}${targetPath === '/' ? '' : targetPath}`)
      }
    },
    [pathname, cleanPath, currentLanguage, router]
  )

  const getLanguageTitle = useCallback(
    (id: string) => languages.find((lang) => lang.id === id)?.title || id,
    []
  )

  /**
   * Build href for internal links.
   * Production: always clean paths (domain = language, no prefix).
   * Localhost: clean for domain default, prefixed for other locales.
   */
  const localizedHref = useCallback(
    (href: string): string => {
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return href
      }
      try {
        const [pathPart, qs] = href.split('?')
        let clean = (pathPart || '/').replace(/^\/+/, '')
        const query = qs ? `?${qs}` : ''

        // Strip any existing locale prefix the caller may have left in the href
        const hrefFirstSeg = clean.split('/')[0] || ''
        if (isLocaleId(hrefFirstSeg.toLowerCase())) {
          clean = clean.substring(hrefFirstSeg.length).replace(/^\/+/, '')
        }

        // Production: never add locale prefix (domain IS the language)
        if (isProductionHost()) {
          return clean ? `/${clean}${query}` : `/${query}`
        }

        // Localhost: prefix only for non-default locales
        const domainDefault = getDomainDefaultLocale()
        if (currentLanguage === domainDefault) {
          return clean ? `/${clean}${query}` : `/${query}`
        }
        return clean
          ? `/${currentLanguage}/${clean}${query}`
          : `/${currentLanguage}${query}`
      } catch {
        return href
      }
    },
    [currentLanguage]
  )

  useEffect(() => {
    onValue({
      currentLanguage,
      setLanguage,
      availableLanguages: languages,
      getLanguageTitle,
      localizedHref,
    })
  }, [currentLanguage, setLanguage, getLanguageTitle, localizedHref, onValue])

  return null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [contextValue, setContextValue] = useState<LanguageContextType>(defaultContextValue)

  return (
    <LanguageContext.Provider value={contextValue}>
      <Suspense fallback={null}>
        <LanguageUrlSync onValue={setContextValue} />
      </Suspense>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
