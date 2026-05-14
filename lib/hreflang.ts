import { LOCALE_IDS, defaultLanguage } from '@/sanity/lib/languages'

// ============================================
// Env-driven base URLs
// ============================================
// Supports two modes:
//   1. Single-domain  – `NEXT_PUBLIC_SITE_URL` set, no domain split. All
//      locales live on the same host with `/{locale}` path prefixes (used in
//      dev / preview / staging).
//   2. Domain-split   – `NEXT_PUBLIC_SITE_URL_NO` and `NEXT_PUBLIC_SITE_URL_COM`
//      set to different hosts. Norwegian content is canonical on the .no
//      domain (no path prefix). English content is canonical on the .com
//      domain (no path prefix). SV/DA/DE live on the .com domain WITH their
//      locale path prefix.
//
// Production defaults to https://scandicommerce.com / https://scandicommerce.no
// when nothing is set, so an unconfigured deployment still produces correct
// hreflang URLs rather than blank ones.

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

/** Locale → production host (no scheme or path). Drives both canonical and hreflang URLs. */
const LOCALE_HOSTS: Record<string, string> = {
  en: COM_SITE_URL,
  no: NO_SITE_URL,
  sv: COM_SITE_URL,
  da: COM_SITE_URL,
  de: COM_SITE_URL,
}

/**
 * URL path prefix that disambiguates a locale's homepage on a shared host.
 *
 * Section-page slugs in Sanity already encode this prefix (e.g. the Swedish
 * "About" page has slug `se/about`), so for non-homepage URLs we trust the
 * slug verbatim. Homepage docs all carry slug `/` regardless of language, so
 * we inject the prefix here for SV/DA/DE to avoid collisions on
 * `scandicommerce.com/`.
 *
 * Uses the slug's country-code convention (`se`, `dk`) rather than the
 * Sanity language id (`sv`, `da`) so homepage URLs match the section URLs.
 */
const LOCALE_HOMEPAGE_PREFIX: Record<string, string> = {
  en: '',
  no: '',
  sv: 'se',
  da: 'dk',
  de: 'de',
}

/** True when the configured .no and .com hosts differ (i.e. production domain split is active). */
export function isDomainSplitActive(): boolean {
  if (!NO_SITE_URL || !COM_SITE_URL) return false
  try {
    return new URL(NO_SITE_URL).host !== new URL(COM_SITE_URL).host
  } catch {
    return false
  }
}

/** Default base URL when the caller has no specific locale context. Prefers the .com host. */
export function getBaseUrl(): string {
  return COM_SITE_URL || NO_SITE_URL || ''
}

/** Base URL (host + scheme, no trailing slash) for a specific locale. */
export function getBaseUrlForLocale(locale: string): string {
  return LOCALE_HOSTS[locale] || COM_SITE_URL || NO_SITE_URL || ''
}

/** Homepage path prefix for a locale (e.g. "" for en/no, "se" for sv). Internal helper for hreflang. */
export function getHomepagePrefixForLocale(locale: string): string {
  return LOCALE_HOMEPAGE_PREFIX[locale] ?? ''
}

/**
 * Build an absolute URL for a (locale, path-without-locale) pair.
 *
 * - `pathWithoutLang` is the route path WITHOUT a leading locale segment,
 *   e.g. "" for the homepage, "about", "se/about", "resources/my-post".
 *   Leading/trailing slashes are tolerated. The path is trusted verbatim:
 *   the caller is responsible for any locale-prefix logic via `slugForRoute`
 *   in `@/lib/seo/buildHreflang`.
 * - Locale routing is purely host-based: NO → .no host, everything else → .com host.
 * - Returns "" if no base URL is configured (caller should omit the field).
 */
export function buildLocaleUrl(locale: string, pathWithoutLang: PathWithoutLang): string {
  const base = getBaseUrlForLocale(locale)
  if (!base) return ''
  const cleaned = pathWithoutLang.replace(/^\/+|\/+$/g, '')
  return cleaned ? `${base}/${cleaned}` : base
}

/** Language used for the hreflang `x-default` attribute. EN per project decision. */
export const X_DEFAULT_LANGUAGE = 'en'

// ============================================
// Legacy single-domain helpers (kept for callers that need a quick
// "all-locales, same-path" alternate map — e.g. routes without a Sanity doc
// behind them). Prefer `buildHreflangFromTranslations` from `lib/seo/buildHreflang`
// for any document-backed page.
// ============================================

export type PathWithoutLang = string

/**
 * Build a `Record<locale, absoluteUrl>` for the supplied path. Use ONLY for
 * doc-less routes (e.g. /sitemap, /shopify/shopify_migration without a doc).
 * For any page backed by a Sanity document, use `buildHreflangFromTranslations`
 * which respects per-locale slugs and translation existence.
 *
 * For sv/da/de this prepends the homepage prefix (`se`, `dk`, `de`) so
 * doc-less routes still get language-specific URLs.
 */
export function getAlternateLanguages(pathWithoutLang: PathWithoutLang): Record<string, string> {
  const cleaned = pathWithoutLang.replace(/^\/+|\/+$/g, '')
  const languages: Record<string, string> = {}
  for (const locale of LOCALE_IDS) {
    const prefix = getHomepagePrefixForLocale(locale)
    const localePath = prefix && cleaned ? `${prefix}/${cleaned}` : (prefix || cleaned)
    const url = buildLocaleUrl(locale, localePath)
    if (url) languages[locale] = url
  }
  if (languages[X_DEFAULT_LANGUAGE]) {
    languages['x-default'] = languages[X_DEFAULT_LANGUAGE]
  } else if (defaultLanguage && languages[defaultLanguage]) {
    languages['x-default'] = languages[defaultLanguage]
  }
  return languages
}

/**
 * Helper for legacy `generateMetadata` call sites. Equivalent to
 * `getAlternateLanguages`. Prefer `buildHreflangFromTranslations` for any
 * page backed by a Sanity document.
 */
export function getAlternateLanguagesForMetadata(
  pathWithoutLang: PathWithoutLang
): Record<string, string> {
  return getAlternateLanguages(pathWithoutLang)
}
