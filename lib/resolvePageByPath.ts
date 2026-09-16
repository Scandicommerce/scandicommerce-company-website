import { sanityPageFetch } from '@/sanity/lib/fetch'
import {
  resolvePageByPathQuery,
  resolvePostBySlugQuery,
  resolveBlogPostBySlugQuery,
  resolvePackageDetailBySlugQuery,
  resolveCaseStudyBySlugQuery,
  resolveAuthorBySlugQuery,
  RESOLVE_PAGE_TYPES,
} from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { classifyPath, docPath, normalizeSlug, trimSlashes } from '@/lib/routes'
import { findArticleByOldLeaf, findDocByCurrentPath } from '@/lib/seo/urlPlan'

export type ResolvedPage = {
  type: string
  /** Slug the page component should load with (leaf slug for detail types, full path otherwise). */
  slug?: string
  /** Canonical path (no leading slash, no locale prefix) for this document in this language. */
  canonicalPath: string
} | null

type Hit = { _type: string; _id: string; slug?: string } | null
const TEMPLATE_TYPES = new Set(['pillarPage', 'integrationPage', 'migrationPage'])
const NO_STORE = { next: { revalidate: 0 } }

async function findArticle(slug: string, language: string): Promise<Hit> {
  const params = getQueryParams({ slug }, language)
  const post = await sanityPageFetch<Hit>(resolvePostBySlugQuery, params, NO_STORE)
  if (post?._type) return { ...post, slug: post.slug ?? slug }
  const blogPost = await sanityPageFetch<Hit>(resolveBlogPostBySlugQuery, params, NO_STORE)
  if (blogPost?._type) return { ...blogPost, slug: blogPost.slug ?? slug }
  return null
}

async function findCaseStudy(slug: string, language: string): Promise<Hit> {
  const hit = await sanityPageFetch<Hit>(resolveCaseStudyBySlugQuery, getQueryParams({ slug }, language), NO_STORE)
  return hit?._type ? { ...hit, slug: hit.slug ?? slug } : null
}

/**
 * Resolve a URL path (without locale prefix) + language to a Sanity document.
 *
 * Path shapes (lib/routes.ts):
 *   blogg|blog/<slug>        → post | blogPost
 *   kundecaser|work/<slug>   → caseStudy
 *   resources/<slug>         → legacy: post | blogPost | caseStudy (caller redirects)
 *   team/<slug>              → author
 *   <full slug>              → any page type (slug.current == path)
 *   …/<leaf>                 → packageDetailPage (3+ segments, legacy fallback)
 *
 * The returned `canonicalPath` lets the caller 308 when the request used a
 * legacy prefix, the wrong section, or different casing.
 */
export async function resolvePageByPath(path: string, language: string): Promise<ResolvedPage> {
  const clean = trimSlashes(path)
  const segments = clean.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const { kind, last } = classifyPath(clean, language)

  if (kind === 'article' || kind === 'case' || kind === 'legacy-article') {
    const article = kind !== 'case' ? await findArticle(last, language) : null
    if (article?._type) {
      const slug = article.slug ?? last
      return { type: article._type, slug, canonicalPath: docPath({ _type: article._type, slug, language }).toLowerCase() }
    }
    const cs = kind !== 'article' ? await findCaseStudy(last, language) : null
    if (cs?._type) {
      const slug = cs.slug ?? last
      return { type: 'caseStudy', slug, canonicalPath: docPath({ _type: 'caseStudy', slug, language }).toLowerCase() }
    }
    // Transitional: the URL plan renamed this slug but Sanity still carries the old one.
    const planned = findDocByCurrentPath(language, clean) ?? findArticleByOldLeaf(language, last)
    if (planned && planned.oldSlug !== planned.newSlug && ['post', 'blogPost', 'caseStudy'].includes(planned.type)) {
      const oldLeaf = planned.oldSlug.split('/').pop() ?? planned.oldSlug
      const hit = planned.type === 'caseStudy' ? await findCaseStudy(oldLeaf, language) : await findArticle(oldLeaf, language)
      if (hit?._type) return { type: hit._type, slug: hit.slug ?? oldLeaf, canonicalPath: planned.newPath.toLowerCase() }
    }
    if (kind !== 'legacy-article') return null
  }

  if (kind === 'author') {
    const authorDoc = await sanityPageFetch<Hit>(resolveAuthorBySlugQuery, { slug: last }, NO_STORE)
    if (authorDoc?._type) return { type: 'author', slug: last, canonicalPath: `team/${last}` }
    return null
  }

  // Section pages: the Sanity slug is the full path. Also accept legacy
  // locale-prefixed slugs (`sv/about`) until the content migration is verified.
  const params = getQueryParams({ path: clean, pathWithLocale: `${language}/${clean}` }, language)
  const fullMatch = await sanityPageFetch<Hit>(
    resolvePageByPathQuery,
    { ...params, pageTypes: RESOLVE_PAGE_TYPES },
    NO_STORE
  )
  if (fullMatch?._type) {
    const needsSlug = fullMatch._type === 'packageDetailPage' || TEMPLATE_TYPES.has(fullMatch._type)
    const canonicalPath = normalizeSlug(fullMatch.slug ?? clean).toLowerCase()
    return { type: fullMatch._type, slug: needsSlug ? normalizeSlug(fullMatch.slug ?? clean) : undefined, canonicalPath }
  }

  // Transitional fallback: the URL plan knows the NEW path of every document;
  // if Sanity still carries the OLD slug (migration drafts not yet published),
  // resolve through it so nothing 404s between deploy and publish.
  const planned = findDocByCurrentPath(language, clean)
  if (planned && planned.oldSlug !== planned.newSlug && !(planned.type === 'post' || planned.type === 'blogPost' || planned.type === 'caseStudy' || planned.type === 'author')) {
    const legacyMatch = await sanityPageFetch<Hit>(
      resolvePageByPathQuery,
      { ...getQueryParams({ path: planned.oldSlug, pathWithLocale: planned.oldSlug }, language), pageTypes: RESOLVE_PAGE_TYPES },
      NO_STORE
    )
    if (legacyMatch?._type) {
      const needsSlug = legacyMatch._type === 'packageDetailPage' || TEMPLATE_TYPES.has(legacyMatch._type)
      return { type: legacyMatch._type, slug: needsSlug ? (legacyMatch.slug ?? planned.oldSlug) : undefined, canonicalPath: planned.newPath }
    }
  }

  // Legacy fallback: package detail by leaf slug under a 3+ segment path.
  if (segments.length >= 3) {
    const pkg = await sanityPageFetch<Hit>(resolvePackageDetailBySlugQuery, getQueryParams({ slug: last }, language), NO_STORE)
    if (pkg?._type) return { type: 'packageDetailPage', slug: pkg.slug ?? last, canonicalPath: normalizeSlug(pkg.slug ?? clean).toLowerCase() }
  }

  return null
}
