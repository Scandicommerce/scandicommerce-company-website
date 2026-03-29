import SchemaMarkup from '@/components/SchemaMarkup'
import { buildOrganizationAndProfessionalService } from '@/lib/schema/organization'
import { shouldSuppressMarketingJsonLd } from '@/lib/schema/marketingSchema'
import { getSchemaSiteOrigin } from '@/lib/schema/request'

/** Organization + ProfessionalService in one @graph (root layout; skipped on /studio). */
export default async function OrganizationJsonLd() {
  if (await shouldSuppressMarketingJsonLd()) return null
  const origin = await getSchemaSiteOrigin()
  const schema = buildOrganizationAndProfessionalService(origin)
  if (!schema) return null
  return <SchemaMarkup schema={schema} />
}
