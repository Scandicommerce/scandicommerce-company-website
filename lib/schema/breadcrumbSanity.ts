import { client } from '@/sanity/lib/client'
import { breadcrumbTitlesQuery, RESOLVE_PAGE_TYPES } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { defaultLanguage, LOCALE_IDS } from '@/sanity/lib/languages'

const BREADCRUMB_TYPES = [...RESOLVE_PAGE_TYPES, 'blogPost', 'post']

/** Map header locale / BCP47 to Sanity `language` field on documents. */
export function sanityLanguageForBreadcrumb(locale: string): string {
  const p = locale.toLowerCase().split('-')[0] || ''
  if (p === 'nb' || p === 'nn') return 'no'
  if (LOCALE_IDS.includes(p)) return p
  return defaultLanguage
}

/**
 * Slug → display title for breadcrumb items (cumulative path, `no/path`-style slug, or leaf slug).
 */
export async function fetchBreadcrumbTitleMap(
  pathWithoutLang: string,
  locale: string
): Promise<Map<string, string>> {
  const segments = pathWithoutLang.split('/').filter(Boolean)
  if (!segments.length) return new Map()

  const lang = sanityLanguageForBreadcrumb(locale)
  const candidates = new Set<string>()
  for (let i = 0; i < segments.length; i++) {
    const cumulative = segments.slice(0, i + 1).join('/')
    candidates.add(cumulative)
    candidates.add(`${lang}/${cumulative}`)
  }
  candidates.add(segments[segments.length - 1])

  const slugs = [...candidates]
  if (!slugs.length) return new Map()

  try {
    const rows = await client.fetch<Array<{ slug?: string; title?: string | null }>>(
      breadcrumbTitlesQuery,
      getQueryParams({ slugs, types: BREADCRUMB_TYPES }, lang),
      { next: { revalidate: 120 } }
    )
    const map = new Map<string, string>()
    for (const row of rows ?? []) {
      const s = row.slug?.trim()
      const t = row.title?.trim()
      if (s && t && !map.has(s)) map.set(s, t)
    }
    return map
  } catch {
    return new Map()
  }
}
