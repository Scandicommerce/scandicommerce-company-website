import SchemaMarkup from '@/components/SchemaMarkup'
import { buildBreadcrumbListSchema } from '@/lib/schema/breadcrumb'
import { fetchBreadcrumbTitleMap, sanityLanguageForBreadcrumb } from '@/lib/schema/breadcrumbSanity'
import { getBreadcrumbHomeLabel } from '@/lib/schema/breadcrumbLabels'
import { shouldSuppressMarketingJsonLd } from '@/lib/schema'
import {
  getSchemaLocale,
  getSchemaPathnameWithoutLang,
  getSchemaSiteOrigin,
} from '@/lib/schema/request'

/** Subpages only: cumulative URLs per segment; names from Sanity when slug matches, else label map / humanized slug. */
export default async function BreadcrumbListJsonLd() {
  if (await shouldSuppressMarketingJsonLd()) return null
  const origin = await getSchemaSiteOrigin()
  const pathRaw = await getSchemaPathnameWithoutLang()
  const pathTrim = pathRaw.replace(/^\/+|\/+$/g, '')
  if (!pathTrim) return null

  const locale = await getSchemaLocale()
  const sanityLang = sanityLanguageForBreadcrumb(locale)
  const titleBySlug = await fetchBreadcrumbTitleMap(pathTrim, locale)

  const breadcrumbSchema = buildBreadcrumbListSchema({
    origin,
    pathWithoutLang: pathTrim,
    homeLabel: getBreadcrumbHomeLabel(locale),
    titleBySlug,
    sanityLanguage: sanityLang,
  })
  if (!breadcrumbSchema) return null
  return <SchemaMarkup schema={breadcrumbSchema} />
}
