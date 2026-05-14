import SchemaMarkup from '@/components/SchemaMarkup'
import { buildOrganizationAndProfessionalService } from '@/lib/schema/organization'
import { shouldSuppressMarketingJsonLd } from '@/lib/schema/marketingSchema'
import { getSchemaSiteOrigin, getSchemaLocale } from '@/lib/schema/request'
import { toSanityLanguageId } from '@/lib/language'
import { getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildOrganizationJsonLdFromSiteSettings } from '@/lib/seo/jsonLdOrganizationFromSiteSettings'
import type { JsonLdObject } from '@/lib/schema/types'

/** Organization JSON-LD from `siteSettings` when populated; else legacy ProfessionalService + Organization graph. */
export default async function OrganizationJsonLd() {
  if (await shouldSuppressMarketingJsonLd()) return null
  const origin = await getSchemaSiteOrigin()
  if (!origin) return null

  const language = toSanityLanguageId(await getSchemaLocale())
  const settings = await getSiteSettings(language)
  const fromCms = buildOrganizationJsonLdFromSiteSettings(origin, settings)
  const fallback = buildOrganizationAndProfessionalService(origin)

  const nodes: JsonLdObject[] = []
  if (fromCms) nodes.push(fromCms)
  else if (fallback) nodes.push(fallback)

  if (!nodes.length) return null
  return <SchemaMarkup schema={nodes.length === 1 ? nodes[0]! : nodes} />
}
