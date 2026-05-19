import { LOCALE_IDS, defaultLanguage } from '@/sanity/lib/languages'

// ============================================
// Env-driven base URLs
// ============================================
// Domain split (production):
//   - NO  → scandicommerce.no  (no /no prefix)
//   - EN  → scandicommerce.com (no /en prefix)
//   - SV / DA / DE → scandicommerce.com ONLY, with /sv /da /de path prefix
//
// Sanity section slugs often use country codes (se/, dk/) — we normalize those
// to language prefixes in URLs when building hreflang / canonical.

const stripTrailingSlash = (s: string): string => s.replace(/\/+$/, '')

const NO_SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL_NO ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    ''
)
const COM_SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL_COM ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    ''
)

/** Locales that must never be served or linked on the .no host. */
const COM_ONLY_LOCALES = new Set(['en', 'sv', 'da', 'de'])

/** First path segment in Sanity slugs → Sanity language id. */
const COUNTRY_SEGMENT_TO_LOCALE: Record<string, string> = {
  se: 'sv',
  dk: 'da',
  de: 'de',
}

/** Locales that use a `/{locale}/` prefix on scandicommerce.com (domain-split mode). */
const LOCALES_WITH_PATH_PREFIX = new Set(['sv', 'da', 'de'])

/** Language used for the hreflang `x-default` attribute. */
export const X_DEFAULT_LANGUAGE = 'en'

export type PathWithoutLang = string

/** True when the configured .no and .com hosts differ. */
export function isDomainSplitActive(): boolean {
  if (!NO_SITE_URL || !COM_SITE_URL) return false
  try {
    return new URL(NO_SITE_URL).host !== new URL(COM_SITE_URL).host
  } catch {
    return false
  }
}

function hostFromBase(base: string): string {
  try {
    return new URL(base).host
  } catch {
    return ''
  }
}

function isNoBase(base: string): boolean {
  const h = hostFromBase(base)
  return h.includes('scandicommerce.no')
}

/** Default base URL when the caller has no specific locale context. */
export function getBaseUrl(): string {
  return COM_SITE_URL || NO_SITE_URL || ''
}

/**
 * Production host for a locale. Non-NO locales always use .com when domain
 * split is active so hreflang never points sv/da/de at scandicommerce.no.
 */
export function getBaseUrlForLocale(locale: string): string {
  if (isDomainSplitActive() && locale !== 'no') {
    return COM_SITE_URL || ''
  }
  if (locale === 'no') {
    return NO_SITE_URL || COM_SITE_URL || ''
  }
  return COM_SITE_URL || NO_SITE_URL || ''
}

/** @deprecated Use path normalization inside buildLocaleUrl. */
export function getHomepagePrefixForLocale(locale: string): string {
  if (!isDomainSplitActive()) return locale === defaultLanguage ? '' : locale
  if (LOCALES_WITH_PATH_PREFIX.has(locale)) return locale
  return ''
}

/**
 * Normalize a Sanity slug path into the public URL path for a locale.
 * Strips ALL leading locale/country-code segments (se/, dk/, sv/, no/, …)
 * and applies the correct prefix for the target locale.
 *
 * Production URL shape:
 *   NO → scandicommerce.no/<path>          (no /no prefix)
 *   EN → scandicommerce.com/<path>         (no /en prefix)
 *   SV/DA/DE → scandicommerce.com/{locale}/<path>
 */
export function pathForPublicUrl(locale: string, rawPath: string): string {
  const segments = rawPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  // Strip ALL leading segments that are locale ids or country codes.
  // Sanity slugs may carry one or both (e.g. "sv/se/contact" or "se/contact").
  while (
    segments.length > 0 &&
    (LOCALE_IDS.includes(segments[0]) || segments[0] in COUNTRY_SEGMENT_TO_LOCALE)
  ) {
    segments.shift()
  }

  const rest = segments.join('/')

  // NO and EN: bare path (their domain already signals the locale)
  if (locale === 'no' || locale === 'en') {
    return rest
  }

  // SV / DA / DE: always /{locale}/...
  if (LOCALES_WITH_PATH_PREFIX.has(locale)) {
    return rest ? `${locale}/${rest}` : locale
  }

  // Fallback for any unknown locale (shouldn't happen in practice)
  if (!isDomainSplitActive()) {
    if (!rest) return locale === defaultLanguage ? '' : locale
    if (locale === defaultLanguage) return rest
    return `${locale}/${rest}`
  }

  return rest
}

/**
 * Build an absolute URL for a (locale, path) pair.
 * Non-NO locales never use the .no host.
 */
export function buildLocaleUrl(locale: string, pathWithoutLang: PathWithoutLang): string {
  if (!LOCALE_IDS.includes(locale)) return ''

  let base = getBaseUrlForLocale(locale)
  if (!base) return ''

  if (isDomainSplitActive() && locale !== 'no' && isNoBase(base)) {
    base = COM_SITE_URL || base
  }

  const path = pathForPublicUrl(locale, pathWithoutLang)
  return path ? `${base}/${path}` : base
}

/**
 * Build hreflang alternates for doc-less routes (same logical path, all locales).
 */
export function getAlternateLanguages(pathWithoutLang: PathWithoutLang): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of LOCALE_IDS) {
    const url = buildLocaleUrl(locale, pathWithoutLang)
    if (url) languages[locale] = url
  }
  if (languages[X_DEFAULT_LANGUAGE]) {
    languages['x-default'] = languages[X_DEFAULT_LANGUAGE]
  } else if (languages[defaultLanguage]) {
    languages['x-default'] = languages[defaultLanguage]
  }
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
  if (LOCALE_IDS.includes(s)) return s
  if (s in COUNTRY_SEGMENT_TO_LOCALE) return COUNTRY_SEGMENT_TO_LOCALE[s]
  return null
}

export function isComOnlyLocale(locale: string): boolean {
  return COM_ONLY_LOCALES.has(locale)
}
