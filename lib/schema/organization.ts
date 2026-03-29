import {
  SCHEMA_ORG_CONTEXT,
  type JsonLdObject,
  type SchemaOrgImageObject,
} from './types'
import {
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_NAME,
  PROFESSIONAL_SERVICE_AREAS,
  parseSameAsFromEnv,
} from './constants'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

export function organizationSchemaId(origin: string): string {
  return `${origin}/#organization`
}

function professionalServiceSchemaId(origin: string): string {
  return `${origin}/#professional-service`
}

function logoImage(origin: string): SchemaOrgImageObject | null {
  const url = normalizeHttpUrl(`${origin}/images/mainLogoIcon.svg`)
  if (!url) return null
  return { '@type': 'ImageObject', url }
}

export function buildOrganizationAndProfessionalService(origin: string): JsonLdObject | null {
  const o = normalizeSiteOrigin(origin)
  if (!o) return null

  const logo = logoImage(o)
  if (!logo) return null

  const sameAs = parseSameAsFromEnv()

  const organization: JsonLdObject = {
    '@type': 'Organization',
    '@id': organizationSchemaId(o),
    name: ORGANIZATION_NAME,
    url: o,
    logo,
    description: ORGANIZATION_DESCRIPTION,
  }

  if (sameAs.length) organization.sameAs = sameAs

  const professionalService: JsonLdObject = {
    '@type': 'ProfessionalService',
    '@id': professionalServiceSchemaId(o),
    name: ORGANIZATION_NAME,
    url: o,
    image: logo,
    description: ORGANIZATION_DESCRIPTION,
    parentOrganization: { '@id': organizationSchemaId(o) },
    areaServed: [...PROFESSIONAL_SERVICE_AREAS],
  }

  return {
    '@context': SCHEMA_ORG_CONTEXT,
    '@graph': [organization, professionalService],
  }
}
