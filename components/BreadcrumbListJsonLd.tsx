import SchemaMarkup from '@/components/SchemaMarkup'
import { buildBreadcrumbListSchema } from '@/lib/schema/breadcrumb'
import { getBreadcrumbHomeLabel } from '@/lib/schema/breadcrumbLabels'
import { getSchemaLocale, getSchemaPathnameWithoutLang, getSchemaSiteOrigin } from '@/lib/schema/request'

/** Renders nothing on locale home (empty path after stripping `[lang]`). */
export default async function BreadcrumbListJsonLd() {
  const origin = await getSchemaSiteOrigin()
  const pathRaw = await getSchemaPathnameWithoutLang()
  const pathTrim = pathRaw.replace(/^\/+|\/+$/g, '')
  if (!pathTrim) return null

  const locale = await getSchemaLocale()
  const breadcrumbSchema = buildBreadcrumbListSchema({
    origin,
    pathWithoutLang: pathTrim,
    homeLabel: getBreadcrumbHomeLabel(locale),
  })
  if (!breadcrumbSchema) return null
  return <SchemaMarkup schema={breadcrumbSchema} />
}
