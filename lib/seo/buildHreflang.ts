import { isLanguage, X_DEFAULT_LANGUAGE, type Language } from '@/lib/site-config'
import { absoluteUrl, docPath, hreflangCode, normalizeSlug } from '@/lib/routes'
import type { PageSeoTranslation } from '@/lib/sanity/pageSeo'
import { findDocByLegacyPath } from '@/lib/seo/urlPlan'

/** Sibling path, mapped to its post-migration shape when Sanity still carries the old slug. */
function siblingPath(doc: { _type: string; slug?: string; isHomepage?: boolean }, lang: Language): string {
  const p = docPath({ ...doc, language: lang }).toLowerCase()
  const planned = findDocByLegacyPath(lang, p)
  return planned ? planned.newPath.toLowerCase() : p
}

/**
 * Canonical + hreflang cluster for a page, derived from its
 * `translation.metadata` siblings (TECHNICAL-SEO-SPEC Task 3).
 *
 * Rules enforced here:
 *   - the canonical is the self-referencing URL on the origin that serves the
 *     language (Norwegian → .no, everything else → .com);
 *   - every cluster lists every member including itself;
 *   - only siblings that exist (published) and are indexable are emitted;
 *   - `x-default` is the English page; if there is no English page the
 *     cluster has no x-default (never point x-default at a non-English page);
 *   - a page with no translations emits no hreflang at all.
 */
export function buildHreflangFromTranslations({
  translations,
  currentLanguage,
  currentDoc,
  currentPath,
  explicitCanonical,
}: {
  translations: PageSeoTranslation[] | null | undefined
  currentLanguage: string
  currentDoc?: { _type: string; slug?: string; isHomepage?: boolean } | null
  currentPath?: string
  explicitCanonical?: string
}): { canonical?: string; languages: Record<string, string> } {
  const byLanguage: Partial<Record<Language, string>> = {}

  // The route already resolved the canonical path (lowercase, prefix-aware);
  // prefer it over the raw Sanity slug so a not-yet-renamed slug never leaks
  // into the canonical. Fall back to the document when no path is given.
  const currentPathResolved = (
    currentPath !== undefined
      ? normalizeSlug(currentPath)
      : currentDoc
        ? docPath({ ...currentDoc, language: currentLanguage })
        : ''
  ).toLowerCase()

  const currentUrl = isLanguage(currentLanguage)
    ? absoluteUrl(currentLanguage, currentPathResolved)
    : undefined
  if (currentUrl && isLanguage(currentLanguage)) byLanguage[currentLanguage] = currentUrl

  if (Array.isArray(translations)) {
    for (const t of translations) {
      if (!t?.doc) continue
      const lang = t.doc.language || t._key
      if (!isLanguage(lang) || lang === currentLanguage) continue
      if (t.doc.noIndex) continue
      byLanguage[lang] = absoluteUrl(lang, siblingPath(t.doc, lang))
    }
  }

  const languages: Record<string, string> = {}
  for (const [lang, url] of Object.entries(byLanguage)) {
    if (url) languages[hreflangCode(lang)] = url
  }
  const xDefault = byLanguage[X_DEFAULT_LANGUAGE]
  if (xDefault) languages['x-default'] = xDefault

  const memberCount = Object.keys(byLanguage).length
  const finalLanguages = memberCount > 1 ? languages : {}

  const canonical = explicitCanonical?.trim() ? explicitCanonical.trim() : currentUrl || undefined

  return { canonical, languages: finalLanguages }
}

/** @deprecated use `docPath` from `@/lib/routes`. */
export function slugForRoute(doc: {
  _type: string
  slug?: string
  isHomepage?: boolean
  language?: string
}): string {
  return docPath(doc)
}
