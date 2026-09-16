/**
 * Locale ↔ URL helpers (compatibility layer).
 *
 * All origins come from `lib/site-config.ts`; all path shapes come from
 * `lib/routes.ts`. This module only keeps the historical function names used
 * around the app. Prefer importing from `@/lib/routes` in new code.
 */
import {
  ALL_LANGUAGES,
  SITES,
  X_DEFAULT_LANGUAGE as X_DEFAULT,
  siteForLanguage,
  type Language,
} from '@/lib/site-config'
import { absoluteUrl, normalizeSlug, publicPath, hreflangCode } from '@/lib/routes'

export const X_DEFAULT_LANGUAGE: string = X_DEFAULT

export type PathWithoutLang = string

/** Country-code segments → Sanity language id (legacy URL shapes). */
const COUNTRY_SEGMENT_TO_LOCALE: Record<string, Language> = {
  se: 'sv',
  dk: 'da',
  de: 'de',
}

/** Locales that must never be served or linked on the .no host. */
const COM_ONLY_LOCALES = new Set<string>(SITES.com.languages)

/** Always true: the two production origins are distinct. */
export function isDomainSplitActive(): boolean {
  return true
}

/** Default origin for callers without locale context (.com is x-default). */
export function getBaseUrl(): string {
  return SITES.com.origin
}

export function getBaseUrlForLocale(locale: string): string {
  return siteForLanguage(locale).origin
}

/**
 * Normalize a Sanity slug path into the public URL path (no leading slash)
 * for a locale: strips legacy locale/country prefixes and applies the
 * `/sv` `/da` `/de` prefix on .com.
 */
export function pathForPublicUrl(locale: string, rawPath: string): string {
  return publicPath(locale, normalizeSlug(rawPath)).replace(/^\/+/, '')
}

/** Absolute URL for a (locale, path) pair. Empty string for unknown locales. */
export function buildLocaleUrl(locale: string, pathWithoutLang: PathWithoutLang): string {
  if (!(ALL_LANGUAGES as string[]).includes(locale)) return ''
  return absoluteUrl(locale, pathWithoutLang)
}

/**
 * hreflang alternates for doc-less routes that exist identically in every
 * locale (keys are public hreflang codes, e.g. `nb-NO`).
 */
export function getAlternateLanguages(pathWithoutLang: PathWithoutLang): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of ALL_LANGUAGES) {
    const url = buildLocaleUrl(locale, pathWithoutLang)
    if (url) languages[hreflangCode(locale)] = url
  }
  const xDefault = buildLocaleUrl(X_DEFAULT, pathWithoutLang)
  if (xDefault) languages['x-default'] = xDefault
  return languages
}

export function getAlternateLanguagesForMetadata(
  pathWithoutLang: PathWithoutLang
): Record<string, string> {
  return getAlternateLanguages(pathWithoutLang)
}

/** Map first URL segment (country or locale code) → language id for middleware. */
export function segmentToLanguageId(segment: string): string | null {
  const s = segment.toLowerCase()
  if ((ALL_LANGUAGES as string[]).includes(s)) return s
  if (s in COUNTRY_SEGMENT_TO_LOCALE) return COUNTRY_SEGMENT_TO_LOCALE[s]
  return null
}

export function isComOnlyLocale(locale: string): boolean {
  return COM_ONLY_LOCALES.has(locale)
}
