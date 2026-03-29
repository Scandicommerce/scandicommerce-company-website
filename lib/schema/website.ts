import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { ORGANIZATION_NAME } from './constants'
import { organizationSchemaId } from './organization'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

/** Gate for `WebSite.potentialAction` / SearchAction — only when a real search results route exists. */
export const SITE_SEARCH_ROUTE_ENABLED = false as const

export interface WebSiteSchemaInput {
  origin: string
  url: string
  inLanguage?: string
}

export function buildWebSiteSchema(input: WebSiteSchemaInput): JsonLdObject | null {
  const { origin, url, inLanguage } = input
  const o = normalizeSiteOrigin(origin)
  const page = normalizeHttpUrl(url)
  if (!o || !page) return null

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'WebSite',
    '@id': `${o}/#website`,
    url: page,
    name: ORGANIZATION_NAME,
    publisher: { '@id': organizationSchemaId(o) },
  }

  if (inLanguage?.trim()) schema.inLanguage = inLanguage.trim()

  return schema
}
