import type { Article, Organization, Person, WithContext } from 'schema-dts'
import { toSchemaDateTime } from '@/lib/schema/dates'
import { toPlainTextForSchema } from '@/lib/schema/plainText'
import { organizationSchemaId } from '@/lib/schema/organization'
import { ORGANIZATION_BRAND_NAME } from '@/lib/schema/organizationConfig'
import type { JsonLdObject } from '@/lib/schema/types'
import { normalizeHttpUrl, normalizeSiteOrigin, toAbsoluteUrl } from '@/lib/schema/urls'

export function buildArticleJsonLd(input: {
  origin: string
  pageUrl: string
  headline: string
  description?: string | null
  datePublished?: string | null
  dateModified?: string | null
  imageUrl?: string | null
  authorName?: string | null
  authorUrl?: string | null
  inLanguage?: string | null
}): JsonLdObject | null {
  const o = normalizeSiteOrigin(input.origin)
  const url = normalizeHttpUrl(input.pageUrl)
  if (!o || !url || !input.headline?.trim()) return null

  const orgId = organizationSchemaId(o)
  const publisher: Organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: ORGANIZATION_BRAND_NAME,
  }

  const authorUrlNormalized = input.authorUrl?.trim()
    ? normalizeHttpUrl(input.authorUrl.trim())
    : undefined

  const author: Person | Organization = input.authorName?.trim()
    ? ({
        '@type': 'Person',
        name: input.authorName.trim(),
        ...(authorUrlNormalized ? { url: authorUrlNormalized } : {}),
      } satisfies Person)
    : ({
        '@type': 'Organization',
        '@id': orgId,
        name: ORGANIZATION_BRAND_NAME,
      } satisfies Organization)

  const published = toSchemaDateTime(input.datePublished ?? undefined)
  const modified = toSchemaDateTime(input.dateModified ?? undefined)

  const article: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline.trim(),
    url,
    author,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(input.inLanguage?.trim() && { inLanguage: input.inLanguage.trim() }),
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
  }

  const absImage = toAbsoluteUrl(o, input.imageUrl ?? undefined)
  if (absImage) article.image = absImage

  const desc = input.description?.trim()
    ? toPlainTextForSchema(input.description.trim(), 5000)
    : undefined
  if (desc) article.description = desc

  return article as unknown as JsonLdObject
}
