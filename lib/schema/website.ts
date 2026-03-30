import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import {
  ORGANIZATION_BRAND_NAME,
  WEB_SITE_ALTERNATE_NAME,
  WEB_SITE_DESCRIPTION,
  WEB_SITE_IN_LANGUAGE,
} from './organizationConfig'
import { organizationSchemaId } from './organization'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

/**
 * Enable only when a real `/search` page exists; otherwise Google may flag SearchAction as invalid.
 * Set via env after shipping search: `NEXT_PUBLIC_SITE_SEARCH_ENABLED=true`
 */
export const SITE_SEARCH_ROUTE_ENABLED = process.env.NEXT_PUBLIC_SITE_SEARCH_ENABLED === 'true'

export interface WebSiteSchemaInput {
  origin: string
  url: string
}

function buildSearchActionBlock(origin: string): JsonLdObject | undefined {
  if (!SITE_SEARCH_ROUTE_ENABLED) return undefined
  const target = normalizeHttpUrl(`${origin}/search?q={search_term_string}`)
  if (!target) return undefined
  return {
    '@type': 'SearchAction',
    target,
    'query-input': 'required name=search_term_string',
  }
}

export function buildWebSiteSchema(input: WebSiteSchemaInput): JsonLdObject | null {
  const { origin, url } = input
  const o = normalizeSiteOrigin(origin)
  const page = normalizeHttpUrl(url)
  if (!o || !page) return null

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'WebSite',
    '@id': `${o}/#website`,
    name: ORGANIZATION_BRAND_NAME,
    alternateName: WEB_SITE_ALTERNATE_NAME,
    description: WEB_SITE_DESCRIPTION,
    url: page,
    publisher: { '@id': organizationSchemaId(o) },
    inLanguage: [...WEB_SITE_IN_LANGUAGE],
  }

  const searchAction = buildSearchActionBlock(o)
  if (searchAction) schema.potentialAction = searchAction

  return schema
}
