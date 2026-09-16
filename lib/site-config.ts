/**
 * Site configuration by host.
 *
 * This is the ONLY place in the codebase that knows the production origins.
 * Everything that builds an absolute URL (canonical, hreflang, sitemap,
 * robots, JSON-LD, language switcher) must go through `SITES` / `getSite*`.
 *
 * Model (see TECHNICAL-SEO-SPEC §0 / §3):
 *   scandicommerce.no   nb-NO   Norwegian market site, no path prefix, ever.
 *   scandicommerce.com  en      English international storefront (x-default),
 *                                plus /sv /da /de path-prefixed sub-locales.
 *
 * Sanity `language` ids are: en, no, sv, da, de. Public hreflang codes differ
 * (nb-NO, en, sv-SE, da-DK, de-DE) — see `HREFLANG_BY_LANGUAGE`.
 */

/** Sanity language id used throughout the CMS and the `[lang]` route segment. */
export type Language = 'en' | 'no' | 'sv' | 'da' | 'de'

export type SiteKey = 'no' | 'com'

export interface SiteConfig {
  key: SiteKey
  /** Canonical origin, https, apex, no trailing slash. */
  origin: string
  /** Canonical host (no scheme). */
  host: string
  /** Alternate hosts that must 301 to `host`. */
  legacyHosts: string[]
  defaultLanguage: Language
  /** Sanity languages served by this origin. */
  languages: Language[]
  /** Languages that carry a `/{lang}/` path prefix on this origin. */
  pathPrefixed: Language[]
  htmlLang: string
  ogLocale: string
}

export const SITES: Record<SiteKey, SiteConfig> = {
  no: {
    key: 'no',
    origin: 'https://scandicommerce.no',
    host: 'scandicommerce.no',
    legacyHosts: ['www.scandicommerce.no', 'shopify.scandicommerce.no'],
    defaultLanguage: 'no',
    languages: ['no'],
    pathPrefixed: [],
    htmlLang: 'nb-NO',
    ogLocale: 'nb_NO',
  },
  com: {
    key: 'com',
    origin: 'https://scandicommerce.com',
    host: 'scandicommerce.com',
    legacyHosts: ['www.scandicommerce.com'],
    defaultLanguage: 'en',
    languages: ['en', 'sv', 'da', 'de'],
    pathPrefixed: ['sv', 'da', 'de'],
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
}

export const ALL_LANGUAGES: Language[] = ['en', 'no', 'sv', 'da', 'de']

/** Public hreflang / BCP-47 code per Sanity language id. */
export const HREFLANG_BY_LANGUAGE: Record<Language, string> = {
  no: 'nb-NO',
  en: 'en',
  sv: 'sv-SE',
  da: 'da-DK',
  de: 'de-DE',
}

/** `<html lang>` per Sanity language id. */
export const HTML_LANG_BY_LANGUAGE: Record<Language, string> = {
  no: 'nb-NO',
  en: 'en',
  sv: 'sv-SE',
  da: 'da-DK',
  de: 'de-DE',
}

/** `og:locale` per Sanity language id. */
export const OG_LOCALE_BY_LANGUAGE: Record<Language, string> = {
  no: 'nb_NO',
  en: 'en_US',
  sv: 'sv_SE',
  da: 'da_DK',
  de: 'de_DE',
}

/** Language whose page is the hreflang `x-default`. */
export const X_DEFAULT_LANGUAGE: Language = 'en'

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (ALL_LANGUAGES as string[]).includes(value)
}

/** Norwegian lives on .no; every other language lives on .com. */
export function siteForLanguage(language: string): SiteConfig {
  return language === 'no' ? SITES.no : SITES.com
}

/**
 * Resolve the site from a request host (Host header / URL host).
 * Unknown hosts (localhost, *.vercel.app previews) fall back to `fallback`
 * unless `NEXT_PUBLIC_SITE` pins the deployment to one site.
 */
export function siteForHost(host: string | null | undefined, fallback: SiteKey = 'no'): SiteConfig {
  const h = (host ?? '').toLowerCase().split(':')[0]
  if (h === SITES.com.host || h.endsWith('.scandicommerce.com')) return SITES.com
  if (h === SITES.no.host || h.endsWith('.scandicommerce.no')) return SITES.no
  const pinned = process.env.NEXT_PUBLIC_SITE
  if (pinned === 'com' || pinned === 'no') return SITES[pinned]
  return SITES[fallback]
}

/** True for any host that belongs to one of the two production sites. */
export function isProductionSiteHost(host: string | null | undefined): boolean {
  const h = (host ?? '').toLowerCase().split(':')[0]
  return h === SITES.no.host || h === SITES.com.host ||
    h.endsWith('.scandicommerce.no') || h.endsWith('.scandicommerce.com')
}

/** Site whose canonical host or legacy host matches `host`, or null. */
export function siteByAnyHost(host: string | null | undefined): SiteConfig | null {
  const h = (host ?? '').toLowerCase().split(':')[0]
  for (const site of Object.values(SITES)) {
    if (h === site.host || site.legacyHosts.includes(h)) return site
  }
  return null
}

/** Whether a language is served on the given site. */
export function siteServesLanguage(site: SiteConfig, language: string): boolean {
  return (site.languages as string[]).includes(language)
}
