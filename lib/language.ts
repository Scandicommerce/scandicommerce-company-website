import { headers, cookies } from 'next/headers'
import { defaultLanguage, isLocaleId } from '@/sanity/lib/languages'

/**
 * Get the current language from path params ([lang]), cookies, or default (server-side).
 * Use in pages under app/[lang]/... via params.lang.
 * Locale is normalized to lowercase so /EN/... and /en/... both resolve to "en".
 */
export function getLanguageFromParams(params: { lang?: string }): string {
  const raw = params?.lang
  const lang = typeof raw === 'string' ? raw.toLowerCase() : ''
  if (lang && isLocaleId(lang)) {
    return lang
  }
  return defaultLanguage
}

/**
 * Get the current language from URL search params, cookies, or default (server-side).
 * Used when path-based lang is not available (e.g. legacy ?lang= or non-[lang] routes).
 */
export async function getServerLanguage(): Promise<string> {
  try {
    const headersList = await headers()

    // x-locale is set by middleware based on domain (most reliable source)
    const xLocale = headersList.get('x-locale')
    if (xLocale && isLocaleId(xLocale)) {
      return xLocale
    }

    // Fallback: try to extract from pathname
    const pathname = headersList.get('x-pathname') || headersList.get('x-url') || ''
    const pathSegment = pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || ''
    if (pathSegment && isLocaleId(pathSegment)) {
      return pathSegment
    }
  } catch {
    // Fallback to default
  }
  return defaultLanguage
}

/**
 * Get language from search params (for use in page components).
 * Prefer getLanguageFromParams(params) for path-based app/[lang]/... pages.
 */
export function getLanguageFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }): string {
  const lang = searchParams?.lang
  if (typeof lang === 'string' && isLocaleId(lang)) {
    return lang
  }
  return defaultLanguage
}
