/**
 * The one place that turns a Sanity document (or a logical path) into a URL.
 *
 * Pure and framework-free so it can be used from server components, client
 * components, middleware and scripts alike.
 *
 * URL shape (TECHNICAL-SEO-SPEC §3, SITE-SEO-ARCHITECTURE §6):
 *   home            /
 *   page            /<slug>                          (slug = full path, lowercase, hyphens)
 *   article         /blogg/<slug>   (.no)   /blog/<slug>   (.com)
 *   case study      /kundecaser/<slug> (.no) /work/<slug>  (.com)
 *   author          /team/<slug>
 *   legal           /legal/<slug>
 *   merch           /merch, /merch/<handle>           (noindex)
 *   sv / da / de    /<lang>/... on .com only
 *
 * Sanity slugs must NOT contain a locale prefix. Legacy slugs that still do
 * (`sv/about`, `se/growth`, `no/merch`) are tolerated by `normalizeSlug`.
 */

import {
  ALL_LANGUAGES,
  HREFLANG_BY_LANGUAGE,
  siteForLanguage,
  type Language,
} from '@/lib/site-config'

/** Country-code segments some legacy slugs were prefixed with. */
const COUNTRY_SEGMENT_TO_LANGUAGE: Record<string, Language> = {
  se: 'sv',
  dk: 'da',
  de: 'de',
}

export const ARTICLE_TYPES = ['post', 'blogPost'] as const
export const CASE_STUDY_TYPES = ['caseStudy'] as const

/** Localized index slug for articles (first segment of an article URL). */
export const BLOG_INDEX_SLUG: Record<Language, string> = {
  no: 'blogg',
  en: 'blog',
  sv: 'blog',
  da: 'blog',
  de: 'blog',
}

/** Localized index slug for case studies. */
export const WORK_INDEX_SLUG: Record<Language, string> = {
  no: 'kundecaser',
  en: 'work',
  sv: 'work',
  da: 'work',
  de: 'work',
}

/** Localized slugs of the conversion pages every template links to. */
export const CONTACT_SLUG: Record<Language, string> = { no: 'kontakt', en: 'contact', sv: 'contact', da: 'contact', de: 'contact' }
export const PACKAGES_SLUG: Record<Language, string> = {
  no: 'tjenester/alle-pakker',
  en: 'services/all-packages',
  sv: 'services/all-packages',
  da: 'services/all-packages',
  de: 'services/all-packages',
}

/** Legacy first segments that used to host articles AND case studies. */
export const LEGACY_ARTICLE_PREFIXES = ['resources'] as const

export const AUTHOR_PREFIX = 'team'
export const LEGAL_PREFIX = 'legal'
export const MERCH_PREFIX = 'merch'

export interface RoutableDoc {
  _type: string
  slug?: string | null
  language?: string | null
  isHomepage?: boolean | null
}

export function trimSlashes(p: string): string {
  return p.replace(/^\/+|\/+$/g, '')
}

/** Lowercase, hyphenated path segment check. */
export function isCleanSegment(segment: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(segment)
}

/**
 * Strip ALL leading locale / country-code segments from a Sanity slug and
 * collapse repeated slashes. Does not change case (the health check reports
 * uppercase slugs so they can be fixed in Sanity).
 */
export function normalizeSlug(rawSlug: string | null | undefined): string {
  const segments = trimSlashes(rawSlug ?? '').split('/').filter(Boolean)
  while (
    segments.length > 0 &&
    ((ALL_LANGUAGES as string[]).includes(segments[0]) || segments[0] in COUNTRY_SEGMENT_TO_LANGUAGE)
  ) {
    segments.shift()
  }
  return segments.join('/')
}

export function isArticleType(type: string): boolean {
  return (ARTICLE_TYPES as readonly string[]).includes(type)
}

export function isCaseStudyType(type: string): boolean {
  return (CASE_STUDY_TYPES as readonly string[]).includes(type)
}

/**
 * Path WITHOUT leading slash and WITHOUT locale prefix for a document,
 * e.g. "", "om-oss", "blogg/vipps-hurtigkasse-shopify-plus", "kundecaser/slikkepott".
 */
export function docPath(doc: RoutableDoc): string {
  const language = (doc.language ?? 'en') as Language
  const slug = normalizeSlug(doc.slug)

  if (doc._type === 'landingPage' || doc.isHomepage || slug === '' || slug === 'home') return ''
  if (isArticleType(doc._type)) {
    const last = slug.split('/').pop() ?? slug
    return `${BLOG_INDEX_SLUG[language] ?? 'blog'}/${last}`
  }
  if (isCaseStudyType(doc._type)) {
    const last = slug.split('/').pop() ?? slug
    return `${WORK_INDEX_SLUG[language] ?? 'work'}/${last}`
  }
  if (doc._type === 'author') return `${AUTHOR_PREFIX}/${slug}`
  if (doc._type === 'legalPage') return `${LEGAL_PREFIX}/${slug}`
  return slug
}

/**
 * Public path (leading slash, with `/sv` `/da` `/de` prefix where required).
 * `pathWithoutLang` may or may not have a leading slash.
 */
export function publicPath(language: string, pathWithoutLang: string): string {
  const site = siteForLanguage(language)
  const clean = normalizeSlug(pathWithoutLang)
  const prefixed = (site.pathPrefixed as string[]).includes(language)
  if (prefixed) return clean ? `/${language}/${clean}` : `/${language}`
  return clean ? `/${clean}` : '/'
}

/** Absolute canonical URL for (language, pathWithoutLang). */
export function absoluteUrl(language: string, pathWithoutLang: string): string {
  const site = siteForLanguage(language)
  const p = publicPath(language, pathWithoutLang)
  // Next.js (trailingSlash: false) emits the homepage canonical as the bare origin.
  return p === '/' ? site.origin : `${site.origin}${p}`
}

/** Absolute canonical URL for a document. */
export function docUrl(doc: RoutableDoc): string {
  return absoluteUrl((doc.language ?? 'en') as Language, docPath(doc))
}

/** Public path for a document (relative, within its own origin). */
export function docHref(doc: RoutableDoc): string {
  return publicPath((doc.language ?? 'en') as Language, docPath(doc))
}

/**
 * Href for an internal link from a page in `pageLanguage` to `doc`.
 * Same language → relative path. Different language → absolute URL on the
 * right origin (flagged by callers with `data-cross-locale` so the verifier
 * can tell deliberate cross-language links from mistakes).
 */
export function hrefFor(doc: RoutableDoc, pageLanguage: string): string {
  const docLanguage = doc.language ?? pageLanguage
  return docLanguage === pageLanguage ? docHref(doc) : docUrl({ ...doc, language: docLanguage })
}

export function articleHref(slug: string, language: string): string {
  return docHref({ _type: 'post', slug, language })
}

export function caseStudyHref(slug: string, language: string): string {
  return docHref({ _type: 'caseStudy', slug, language })
}

export function authorHref(slug: string, language: string): string {
  return docHref({ _type: 'author', slug, language })
}

export function blogIndexHref(language: string): string {
  return publicPath(language, BLOG_INDEX_SLUG[language as Language] ?? 'blog')
}

export function workIndexHref(language: string): string {
  return publicPath(language, WORK_INDEX_SLUG[language as Language] ?? 'work')
}

/**
 * CMS-entered links are often typed without a leading slash ("book-call",
 * "tjenester/alle-pakker"), which the browser resolves relative to the current
 * page and 404s. Normalise anything that is not absolute, an anchor or a scheme.
 */
export function ensureInternalHref(href: string | null | undefined): string {
  const h = (href ?? '').trim()
  if (!h) return '#'
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(h)) return h
  return `/${h}`
}

export function contactHref(language: string): string {
  return publicPath(language, CONTACT_SLUG[language as Language] ?? 'contact')
}

export function packagesHref(language: string): string {
  return publicPath(language, PACKAGES_SLUG[language as Language] ?? 'services/all-packages')
}

export function hreflangCode(language: string): string {
  return HREFLANG_BY_LANGUAGE[language as Language] ?? language
}

/**
 * Classify a path (without locale prefix) by its first segment.
 * Used by the catch-all route to resolve only the right document types.
 */
export function classifyPath(pathWithoutLang: string, language: string): {
  kind: 'home' | 'article' | 'case' | 'legacy-article' | 'author' | 'legal' | 'merch' | 'page'
  first: string
  rest: string
  last: string
} {
  const clean = trimSlashes(pathWithoutLang)
  const segments = clean.split('/').filter(Boolean)
  const first = segments[0] ?? ''
  const rest = segments.slice(1).join('/')
  const last = segments[segments.length - 1] ?? ''
  if (!clean) return { kind: 'home', first, rest, last }
  if (segments.length >= 2) {
    if (first === BLOG_INDEX_SLUG[language as Language]) return { kind: 'article', first, rest, last }
    if (first === WORK_INDEX_SLUG[language as Language]) return { kind: 'case', first, rest, last }
    if ((LEGACY_ARTICLE_PREFIXES as readonly string[]).includes(first)) {
      return { kind: 'legacy-article', first, rest, last }
    }
    if (first === AUTHOR_PREFIX) return { kind: 'author', first, rest, last }
    if (first === LEGAL_PREFIX) return { kind: 'legal', first, rest, last }
  }
  if (first === MERCH_PREFIX) return { kind: 'merch', first, rest, last }
  return { kind: 'page', first, rest, last }
}

/** True when the path is one that must be noindex (merch, human sitemap). */
export function isNoIndexPath(pathWithoutLang: string): boolean {
  const clean = trimSlashes(pathWithoutLang)
  return clean === MERCH_PREFIX || clean.startsWith(`${MERCH_PREFIX}/`) || clean === 'sitemap'
}
