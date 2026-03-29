import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { toSchemaDateTime } from './dates'
import { toPlainTextForSchema } from './plainText'
import { organizationSchemaId } from './organization'
import { normalizeHttpUrl, normalizeSiteOrigin, toAbsoluteUrl } from './urls'

export interface BlogPostingSchemaInput {
  origin: string
  url: string
  headline: string
  description?: string | null
  datePublished?: string | null
  dateModified?: string | null
  imageUrl?: string | null
  keywords?: string[] | null
  inLanguage?: string | null
  wordCount?: number | null
  authorName?: string | null
}

export function estimateWordCountFromSections(
  introduction: string | null | undefined,
  sections: Array<{ content?: string | null }> | null | undefined
): number | undefined {
  const parts: string[] = []
  if (introduction) parts.push(introduction)
  for (const s of sections ?? []) {
    if (s?.content) parts.push(s.content)
  }
  const text = parts.join(' ')
  if (!text.trim()) return undefined
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return words > 0 ? words : undefined
}

export function buildBlogPostingSchema(input: BlogPostingSchemaInput): JsonLdObject | null {
  const {
    origin,
    url,
    headline,
    description,
    datePublished,
    dateModified,
    imageUrl,
    keywords,
    inLanguage,
    wordCount,
    authorName,
  } = input

  const o = normalizeSiteOrigin(origin)
  const canonical = normalizeHttpUrl(url)
  if (!o || !canonical || !headline?.trim()) return null

  const published = toSchemaDateTime(datePublished ?? undefined)
  const modified = toSchemaDateTime(dateModified ?? undefined)

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${canonical}#blogposting`,
    headline: headline.trim(),
    url: canonical,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    publisher: {
      '@type': 'Organization',
      '@id': organizationSchemaId(o),
    },
  }

  const absImage = toAbsoluteUrl(o, imageUrl ?? undefined)
  if (absImage) {
    schema.image = [{ '@type': 'ImageObject', url: absImage }]
  }

  const desc = description?.trim() ? toPlainTextForSchema(description.trim(), 5000) : undefined
  if (desc) schema.description = desc

  if (published) schema.datePublished = published
  if (modified) schema.dateModified = modified

  if (inLanguage?.trim()) schema.inLanguage = inLanguage.trim()

  const kw = (keywords ?? []).map((k) => k.trim()).filter(Boolean)
  if (kw.length) schema.keywords = kw.join(', ')

  if (typeof wordCount === 'number' && Number.isInteger(wordCount) && wordCount > 0) {
    schema.wordCount = wordCount
  }

  if (authorName?.trim()) {
    schema.author = {
      '@type': 'Person',
      name: authorName.trim(),
    }
  }

  return schema
}
