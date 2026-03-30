import { estimateWordCountFromPostContent, type Post } from '@/lib/blogBuilder'
import { buildBlogPostingSchema, estimateWordCountFromSections } from './blogPosting'
import { getSchemaInLanguageTag } from './inLanguage'
import type { JsonLdObject } from './types'

/** Shape returned by `blogPostBySlugQuery` (fields used for BlogPosting JSON-LD). */
export interface LegacyBlogPostDocumentForJsonLd {
  _createdAt?: string | null
  _updatedAt?: string | null
  language?: string | null
  title?: string | null
  description?: string | null
  metaDescription?: string | null
  category?: string | null
  tags?: (string | null)[] | null
  publishedAt?: string | null
  image?: string | null
  featuredImage?: string | null
  introduction?: string | null
  sections?: Array<{
    content?: string | null
    proTip?: { title?: string | null; content?: string | null } | null
  }> | null
}

export function buildBlogPostingJsonLdFromLegacyBlogPost(
  post: LegacyBlogPostDocumentForJsonLd | null,
  opts: { origin: string; pageUrl: string; routeLang: string }
): JsonLdObject | null {
  if (!post?.title?.trim()) return null
  const { origin, pageUrl, routeLang } = opts
  const docLang = post.language || routeLang
  const wordCount = estimateWordCountFromSections(
    post.introduction,
    post.sections ?? undefined
  )
  const tagKeywords = (post.tags ?? []).filter(
    (t): t is string => Boolean(t && String(t).trim())
  )
  const schemaKeywords = [...tagKeywords, post.category].filter(
    (k): k is string => Boolean(k && String(k).trim())
  )
  return buildBlogPostingSchema({
    origin,
    url: pageUrl,
    headline: post.title,
    description: post.metaDescription ?? post.description ?? null,
    datePublished: post.publishedAt ?? post._createdAt ?? undefined,
    dateModified: post._updatedAt ?? undefined,
    imageUrl: post.featuredImage || post.image || null,
    keywords: schemaKeywords.length ? schemaKeywords : undefined,
    inLanguage: getSchemaInLanguageTag(
      typeof docLang === 'string' ? docLang : routeLang
    ),
    wordCount: wordCount ?? undefined,
  })
}

export function buildBlogPostingJsonLdFromPostBuilder(
  post: Post | null,
  opts: { origin: string; pageUrl: string; routeLang: string }
): JsonLdObject | null {
  if (!post?.title?.trim()) return null
  const { origin, pageUrl, routeLang } = opts
  const docLang = post.language || routeLang
  const keywords =
    post.tags
      ?.map((t) => t.label)
      .filter((label): label is string =>
        Boolean(label && String(label).trim())
      ) ?? []
  const wordCount = estimateWordCountFromPostContent(post)
  return buildBlogPostingSchema({
    origin,
    url: pageUrl,
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? null,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post._updatedAt ?? undefined,
    imageUrl: post.image ?? null,
    keywords: keywords.length ? keywords : undefined,
    inLanguage: getSchemaInLanguageTag(
      typeof docLang === 'string' ? docLang : routeLang
    ),
    wordCount: wordCount ?? undefined,
  })
}
