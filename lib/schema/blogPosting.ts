import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { toSchemaDateTime } from './dates'
import { toPlainTextForSchema } from './plainText'
import { organizationSchemaId } from './organization'
import { ORGANIZATION_BRAND_NAME, ORGANIZATION_LOGO_PATH } from './organizationConfig'
import { normalizeHttpUrl, normalizeSiteOrigin, toAbsoluteUrl } from './urls'

const BLOG_POSTING_DEFAULT_LANGUAGE = 'nb-NO'

/** Single natural-language `keywords` string for BlogPosting (avoid comma-separated tag soup). */
export function blogPostingKeywordsSentenceFromTopics(
  topics: string[] | null | undefined
): string | undefined {
  const t = (topics ?? []).map((x) => x.trim()).filter(Boolean)
  if (!t.length) return undefined
  const phrase =
    t.length === 1
      ? t[0]!
      : `${t.slice(0, -1).join(', ')}, and ${t[t.length - 1]!}`
  return `This article discusses ${phrase} for merchants in Norway and the wider Nordics. scandicommerce connects these themes to delivery work on headed Shopify Online Store themes and headless commerce with Sanity, the Shopify Storefront API, and Hydrogen, including automation with Klaviyo and Make.`
}

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
}

export function estimateWordCountFromSections(
  introduction: string | null | undefined,
  sections:
    | Array<{
        content?: string | null
        proTip?: { title?: string | null; content?: string | null } | null
      }>
    | null
    | undefined
): number | undefined {
  const parts: string[] = []
  if (introduction) parts.push(introduction)
  for (const s of sections ?? []) {
    if (s?.content) parts.push(s.content)
    if (s?.proTip?.title) parts.push(s.proTip.title)
    if (s?.proTip?.content) parts.push(s.proTip.content)
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
  } = input

  const o = normalizeSiteOrigin(origin)
  const canonical = normalizeHttpUrl(url)
  if (!o || !canonical || !headline?.trim()) return null

  const published = toSchemaDateTime(datePublished ?? undefined)
  const modified = toSchemaDateTime(dateModified ?? undefined)

  const orgId = organizationSchemaId(o)
  const logoUrl = normalizeHttpUrl(`${o}${ORGANIZATION_LOGO_PATH}`)

  const publisher: JsonLdObject = {
    '@type': 'Organization',
    '@id': orgId,
    name: ORGANIZATION_BRAND_NAME,
  }
  if (logoUrl) {
    publisher.logo = {
      '@type': 'ImageObject',
      url: logoUrl,
    }
  }

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'BlogPosting',
    headline: headline.trim(),
    url: canonical,
    author: {
      '@type': 'Organization',
      '@id': orgId,
      name: ORGANIZATION_BRAND_NAME,
    },
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    inLanguage: inLanguage?.trim() || BLOG_POSTING_DEFAULT_LANGUAGE,
  }

  const absImage = toAbsoluteUrl(o, imageUrl ?? undefined)
  if (absImage) {
    schema.image = absImage
  }

  const desc = description?.trim() ? toPlainTextForSchema(description.trim(), 5000) : undefined
  if (desc) schema.description = desc

  if (published) schema.datePublished = published
  if (modified) schema.dateModified = modified

  const kw = (keywords ?? []).map((k) => k.trim()).filter(Boolean)
  const kwSentence = blogPostingKeywordsSentenceFromTopics(kw)
  if (kwSentence) schema.keywords = kwSentence

  if (typeof wordCount === 'number' && Number.isInteger(wordCount) && wordCount > 0) {
    schema.wordCount = wordCount
  }

  return schema
}
