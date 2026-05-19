/**
 * Resolve a public URL path in another locale via Sanity (translation.metadata).
 * Used by middleware (cross-domain redirects) and /api/translate-slug.
 */

const PAGE_TYPES_WITH_SLUG = [
    'aboutPage',
    'contactPage',
    'workPage',
    'partnersPage',
    'blogPage',
    'allPackagesPage',
    'migratePage',
    'shopifyPosPage',
    'shopifyPosInfoPage',
    'shopifyXAiPage',
    'shopifyXPimPage',
    'whyShopifyPage',
    'shopifyPlatformPage',
    'vippsHurtigkassePage',
    'shopifyTcoCalculatorPage',
    'shopifyDevelopmentPage',
    'merchPage',
    'packageDetailPage',
  ] as const
  
  const RESOLVE_PAGE_QUERY = `*[_type in $pageTypes && (slug.current == $path || slug.current == $pathWithLocale) && (language == $language || !defined(language))] | order(defined(language) desc) [0]{ _type, _id }`
  
  const TRANSLATED_SLUG_QUERY = `*[_type == "translation.metadata" && references($docId)][0]{ "slug": translations[_key == $targetLang][0].value->slug.current }`
  
  async function sanityCdnFetch<T>(
    query: string,
    params: Record<string, string | string[]>
  ): Promise<T | null> {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    if (!projectId || !dataset) return null
  
    const search = new URLSearchParams({ query })
    for (const [key, value] of Object.entries(params)) {
      search.set(`$${key}`, JSON.stringify(value))
    }
  
    try {
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?${search}`
      )
      if (!res.ok) return null
      const json = (await res.json()) as { result: T }
      return json.result ?? null
    } catch {
      return null
    }
  }
  
  /**
   * Given a path without locale prefix (e.g. "services/all-packages"), return the
   * equivalent slug in `targetLang`, or null when no translation exists.
   */
  export async function translatePath(
    currentPath: string,
    currentLang: string,
    targetLang: string
  ): Promise<string | null> {
    const path = currentPath.replace(/^\/+|\/+$/g, '')
    if (!path || currentLang === targetLang) return null
  
    const resolved = await sanityCdnFetch<{ _type: string; _id: string } | null>(
      RESOLVE_PAGE_QUERY,
      {
        path,
        pathWithLocale: `${currentLang}/${path}`,
        language: currentLang,
        pageTypes: [...PAGE_TYPES_WITH_SLUG],
      }
    )
    if (!resolved?._id) return null
  
    const translation = await sanityCdnFetch<{ slug: string | null } | null>(
      TRANSLATED_SLUG_QUERY,
      { docId: resolved._id, targetLang }
    )
  
    const slug = translation?.slug?.replace(/^\/+|\/+$/g, '')
    return slug || null
  }
  