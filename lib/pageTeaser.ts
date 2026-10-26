import { resolvePageByPath } from '@/lib/resolvePageByPath'
import { trimSlashes } from '@/lib/routes'
import { coalescePageSeo, getPageSeo } from '@/lib/sanity/pageSeo'

export interface PageTeaserText {
  title: string
  description: string
}

/**
 * Title and description for linking to another page, read from that page's
 * SEO fields in Sanity. Empty strings when the page is not published (yet),
 * so callers can fall back to their own copy.
 */
export async function getPageTeaserText(path: string, language: string): Promise<PageTeaserText> {
  const resolved = await resolvePageByPath(trimSlashes(path), language).catch(() => null)
  if (!resolved) return { title: '', description: '' }
  const doc = await getPageSeo({ type: resolved.type, slug: resolved.slug ?? resolved.canonicalPath, language })
  const seo = coalescePageSeo(doc, null)
  return { title: seo.metaTitle, description: seo.metaDescription }
}
