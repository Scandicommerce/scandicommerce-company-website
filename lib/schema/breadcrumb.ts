import type { BreadcrumbListItem, JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { humanizeSegment } from './breadcrumbLabels'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

export interface BreadcrumbTitleOverrides {
  byPosition?: Record<number, string>
  byLastSegment?: Record<string, string>
}

export interface BreadcrumbSchemaInput {
  origin: string
  pathWithoutLang: string
  homeLabel?: string
  overrides?: BreadcrumbTitleOverrides
}

export function buildBreadcrumbListSchema(input: BreadcrumbSchemaInput): JsonLdObject | null {
  const { origin, pathWithoutLang, homeLabel = 'Home', overrides } = input
  const homeUrl = normalizeSiteOrigin(origin)
  if (!homeUrl) return null

  const trimmed = pathWithoutLang.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return null

  const segments = trimmed.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const itemListElement: BreadcrumbListItem[] = []

  const homeItemUrl = normalizeHttpUrl(`${homeUrl}/`)
  if (!homeItemUrl) return null

  itemListElement.push({
    '@type': 'ListItem',
    position: 1,
    name: homeLabel,
    item: homeItemUrl,
  })

  let cumulativeEncoded = ''
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const enc = encodeURIComponent(seg)
    cumulativeEncoded = cumulativeEncoded ? `${cumulativeEncoded}/${enc}` : enc
    const position = i + 2
    const fromOverridePos = overrides?.byPosition?.[position]
    const fromOverrideLast =
      i === segments.length - 1 && seg ? overrides?.byLastSegment?.[seg] : undefined
    const name = fromOverridePos || fromOverrideLast || humanizeSegment(seg)

    const itemUrl = normalizeHttpUrl(`${homeUrl}/${cumulativeEncoded}`)
    if (!itemUrl) return null

    itemListElement.push({
      '@type': 'ListItem',
      position,
      name,
      item: itemUrl,
    })
  }

  return {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}
