import type { ResolvedPage } from '@/lib/resolvePageByPath'
import type { Post } from '@/lib/blogBuilder'
import { getBlogPostBySlugCached, getPostBySlugCached } from '@/lib/sanity/cachedDocuments'
import type { PageSeoDoc } from '@/lib/sanity/pageSeo'
import { buildArticleJsonLd } from '@/lib/seo/articleJsonLd'
import { ALL_PACKAGES_FAQ_JSON_LD_ITEMS } from '@/lib/schema/allPackagesFaqSchema'
import { buildFaqPageSchema, type FaqItem } from '@/lib/schema/faq'
import { getSchemaInLanguageTag } from '@/lib/schema/inLanguage'
import type { LegacyBlogPostDocumentForJsonLd } from '@/lib/schema/routeBlogPostingJsonLd'
import { SCHEMA_ORG_CONTEXT } from '@/lib/schema/types'
import type { JsonLdObject } from '@/lib/schema/types'
import { toPlainTextForSchema } from '@/lib/schema/plainText'

const SIMPLE_STRUCT_TYPES = new Set([
  'Service',
  'AboutPage',
  'ContactPage',
  'CollectionPage',
])

function normalizeFaqRows(
  rows: PageSeoDoc['faqItems']
): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = []
  for (const r of rows ?? []) {
    if (!r) continue
    const q = typeof r.question === 'string' ? r.question.trim() : ''
    const a = typeof r.answer === 'string' ? r.answer.trim() : ''
    if (q && a) out.push({ question: q, answer: a })
  }
  return out
}

function buildSimpleStructuredType(
  type: string,
  pageUrl: string,
  pageTitle: string,
  description?: string | null
): JsonLdObject | null {
  if (!SIMPLE_STRUCT_TYPES.has(type)) return null
  return {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': type,
    name: pageTitle,
    url: pageUrl,
    ...(description?.trim() && {
      description: toPlainTextForSchema(description.trim(), 5000),
    }),
  }
}

/**
 * Per-page JSON-LD driven by `seoExtended.structuredDataType` plus CMS FAQ rows
 * projected on `pageSeoQuery` / `pageSeoBySlugQuery` as `faqItems`.
 */
export async function buildRouteStructuredSchemasFromPageDoc(opts: {
  origin: string
  pageUrl: string
  language: string
  pathTrim: string
  resolved: ResolvedPage | null
  pageDoc: PageSeoDoc | null
}): Promise<JsonLdObject[]> {
  const { origin, pageUrl, language, resolved, pageDoc } = opts
  const schemas: JsonLdObject[] = []

  const structured =
    (pageDoc?.seoExtended?.structuredDataType as string | undefined) ?? 'none'
  if (!structured || structured === 'none') return schemas

  const pageTitle = pageDoc?.pageTitle?.trim() || 'scandicommerce'
  const metaDesc =
    pageDoc?.seoExtended?.metaDescription?.trim() ||
    pageDoc?.seo?.metaDescription?.trim() ||
    null

  if (structured === 'Article') {
    if (resolved?.type === 'blogPost' && resolved.slug) {
      const post = (await getBlogPostBySlugCached(
        resolved.slug,
        language
      )) as LegacyBlogPostDocumentForJsonLd | null
      const docLang = post?.language || language
      const node = buildArticleJsonLd({
        origin,
        pageUrl,
        headline: post?.title?.trim() || pageTitle,
        description: post?.metaDescription ?? post?.description ?? metaDesc,
        datePublished: post?.publishedAt ?? post?._createdAt ?? undefined,
        dateModified: post?._updatedAt ?? undefined,
        imageUrl: post?.featuredImage || post?.image || null,
        authorName: post?.author?.name ?? null,
        authorUrl: null,
        inLanguage: getSchemaInLanguageTag(typeof docLang === 'string' ? docLang : language),
      })
      if (node) schemas.push(node)
    } else if (resolved?.type === 'post' && resolved.slug) {
      const post = (await getPostBySlugCached(
        resolved.slug,
        language
      )) as Post | null
      const docLang = post?.language || language
      const node = buildArticleJsonLd({
        origin,
        pageUrl,
        headline: post?.title?.trim() || pageTitle,
        description: post?.metaDescription ?? post?.excerpt ?? metaDesc,
        datePublished: post?.publishedAt ?? undefined,
        dateModified: post?._updatedAt ?? undefined,
        imageUrl: post?.image ?? null,
        authorName: null,
        authorUrl: null,
        inLanguage: getSchemaInLanguageTag(typeof docLang === 'string' ? docLang : language),
      })
      if (node) schemas.push(node)
    }
    return schemas
  }

  if (structured === 'FAQPage') {
    let items: FaqItem[] = normalizeFaqRows(pageDoc?.faqItems)
    if (!items.length && resolved?.type === 'allPackagesPage') {
      items = [...ALL_PACKAGES_FAQ_JSON_LD_ITEMS]
    }
    const faq = buildFaqPageSchema(items, pageUrl)
    if (faq) schemas.push(faq)
    return schemas
  }

  const simple = buildSimpleStructuredType(structured, pageUrl, pageTitle, metaDesc)
  if (simple) schemas.push(simple)

  return schemas
}
