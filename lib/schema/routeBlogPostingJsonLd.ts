import { estimateWordCountFromPostContent, type Post } from '@/lib/blogBuilder'
import { buildBlogPostingSchema } from './blogPosting'
import { getSchemaInLanguageTag } from './inLanguage'
import type { JsonLdObject } from './types'

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
