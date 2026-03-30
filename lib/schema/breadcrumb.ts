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
  /** Sanity slug → title (cumulative path, `lang/path`, or leaf slug). */
  titleBySlug?: ReadonlyMap<string, string>
  /** Sanity `language` id (e.g. no, en) for `no/...` slug keys. */
  sanityLanguage?: string
  overrides?: BreadcrumbTitleOverrides
}

function resolveBreadcrumbSegmentName(
  segmentIndex: number,
  segments: string[],
  titleBySlug: ReadonlyMap<string, string> | undefined,
  sanityLanguage: string,
  position: number,
  overrides: BreadcrumbTitleOverrides | undefined,
  segment: string
): string {
  const fromOverridePos = overrides?.byPosition?.[position]
  const fromOverrideLast =
    segmentIndex === segments.length - 1 && segment
      ? overrides?.byLastSegment?.[segment]
      : undefined
  if (fromOverridePos?.trim()) return fromOverridePos.trim()
  if (fromOverrideLast?.trim()) return fromOverrideLast.trim()

  const cumulative = segments.slice(0, segmentIndex + 1).join('/')
  const tryKeys = [cumulative, `${sanityLanguage}/${cumulative}`]
  if (segmentIndex === segments.length - 1) tryKeys.push(segment)
  for (const k of tryKeys) {
    const t = titleBySlug?.get(k)
    if (t?.trim()) return t.trim()
  }

  return humanizeSegment(segment)
}

export function buildBreadcrumbListSchema(input: BreadcrumbSchemaInput): JsonLdObject | null {
  const {
    origin,
    pathWithoutLang,
    homeLabel = 'Home',
    titleBySlug,
    sanityLanguage = 'en',
    overrides,
  } = input
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
    const name = resolveBreadcrumbSegmentName(
      i,
      segments,
      titleBySlug,
      sanityLanguage,
      position,
      overrides,
      seg
    )

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
