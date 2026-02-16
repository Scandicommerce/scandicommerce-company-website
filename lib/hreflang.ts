import { LOCALE_IDS, defaultLanguage } from '@/sanity/lib/languages'

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : ''

/**
 * Base URL for the site (no trailing slash). Used for absolute alternate URLs.
 * Set NEXT_PUBLIC_SITE_URL in .env (e.g. https://scandicommerce.com).
 */
export function getBaseUrl(): string {
  return BASE_URL
}

/**
 * Path without leading locale segment. Examples:
 * - "" for homepage
 * - "about" for /[lang]/about
 * - "resources/blog" for /[lang]/resources/blog
 * - "resources/my-post" for /[lang]/resources/[slug]
 */
export type PathWithoutLang = string

/**
 * Build alternate language URLs for hreflang (Next.js metadata.alternates.languages).
 * Use for every [lang] page so search engines can discover all language versions.
 *
 * @param pathWithoutLang - Path without leading locale, e.g. "" for home, "about", "resources/my-slug"
 * @returns Record of locale id -> absolute URL (including x-default for default language)
 */
export function getAlternateLanguages(pathWithoutLang: PathWithoutLang): Record<string, string> {
  if (!BASE_URL) {
    return {}
  }
  const path = pathWithoutLang.replace(/^\/+/, '')
  const pathSegment = path ? `/${path}` : ''
  const languages: Record<string, string> = {}
  for (const locale of LOCALE_IDS) {
    languages[locale] = `${BASE_URL}/${locale}${pathSegment}`
  }
  languages['x-default'] = `${BASE_URL}/${defaultLanguage}${pathSegment}`
  return languages
}

/**
 * Helper for generateMetadata: merge hreflang alternates into existing metadata.
 * Use when a page already has generateMetadata and you only need to add alternates.
 *
 * @example
 * return {
 *   ...existingMetadata,
 *   alternates: { languages: getAlternateLanguagesForMetadata('about') },
 * }
 */
export function getAlternateLanguagesForMetadata(
  pathWithoutLang: PathWithoutLang
): Record<string, string> {
  return getAlternateLanguages(pathWithoutLang)
}
