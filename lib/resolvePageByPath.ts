import { client } from '@/sanity/lib/client'
import {
  resolvePageByPathQuery,
  resolveBlogPostBySlugQuery,
  resolvePackageDetailBySlugQuery,
  RESOLVE_PAGE_TYPES,
} from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export type ResolvedPage =
  | { type: string; slug?: string }
  | { type: 'blogPost'; slug: string }
  | { type: 'packageDetailPage'; slug: string }
  | null

/**
 * Resolve URL path (without locale) + language to a Sanity document type and optional slug.
 * Path examples: "about", "om-oss", "services/all_packages", "resources/my-article".
 */
export async function resolvePageByPath(
  path: string,
  language: string
): Promise<ResolvedPage> {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const pathWithLocale = `${language}/${path}`
  // language must be the 2nd arg to getQueryParams — passing it inside the object causes
  // addLanguageParam to overwrite it with the default language (en), breaking non-English routes.
  const params = getQueryParams({ path, pathWithLocale }, language)
  const fullMatch = await client.fetch<{ _type: string; _id: string } | null>(
    resolvePageByPathQuery,
    { ...params, pageTypes: RESOLVE_PAGE_TYPES },
    { next: { revalidate: 0 } }
  )

  if (fullMatch?._type) {
    // Detail page types need the full path as slug so their query (slug.current == $slug) works correctly
    const needsSlug = fullMatch._type === 'packageDetailPage' || fullMatch._type === 'blogPost'
    return { type: fullMatch._type, slug: needsSlug ? path : undefined }
  }

  // Detail pages: try last segment as slug (e.g. resources/article-slug -> blogPost, services/all_packages/package-slug -> packageDetailPage)
  const lastSegment = segments[segments.length - 1]
  if (segments.length >= 2) {
    const blogPost = await client.fetch<{ _type: string; _id: string } | null>(
      resolveBlogPostBySlugQuery,
      getQueryParams({ slug: lastSegment }, language),
      { next: { revalidate: 0 } }
    )
    if (blogPost?._type) return { type: 'blogPost', slug: lastSegment }

    if (segments.length >= 3) {
      const pkg = await client.fetch<{ _type: string; _id: string } | null>(
        resolvePackageDetailBySlugQuery,
        getQueryParams({ slug: lastSegment }, language),
        { next: { revalidate: 0 } }
      )
      if (pkg?._type) return { type: 'packageDetailPage', slug: lastSegment }
    }
  }

  return null
}
