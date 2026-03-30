import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { organizationSchemaId } from './organization'
import { ORGANIZATION_BRAND_NAME } from './organizationConfig'
import { normalizeHttpUrl, normalizeSiteOrigin, toAbsoluteUrl } from './urls'
import { toPlainTextForSchema } from './plainText'

const PERSON_DESCRIPTION_MAX = 4000

const COMPANY_CONTEXT_BLURB =
  'a Shopify Plus partner agency headquartered in Oslo, Norway, that serves brands across Norway and the Nordics with both headed Shopify Online Store themes and headless commerce using Sanity, the Shopify Storefront API, Hydrogen, Klaviyo, and Make'

function personNodeFragmentId(name: string, personIndex: number): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `person-${base || 'member'}-${personIndex}`
}

function parseSpecialtiesToKnowsAbout(specialties: string | null | undefined): string[] {
  if (!specialties?.trim()) return []
  return specialties
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildPersonDescription(
  name: string,
  role: string,
  specialtiesText: string | null | undefined
): string {
  const rolePart = role.trim() || 'a team member'
  const spec = specialtiesText?.trim() ?? ''
  const base = `${name} is ${rolePart} at ${ORGANIZATION_BRAND_NAME}, ${COMPANY_CONTEXT_BLURB}.`
  if (!spec) return toPlainTextForSchema(base, PERSON_DESCRIPTION_MAX)
  return toPlainTextForSchema(
    `${base} In daily work ${name} focuses on ${spec}, helping clients connect growth goals to concrete Shopify, CRO, SEO, and automation outcomes.`,
    PERSON_DESCRIPTION_MAX
  )
}

export interface TeamMemberForSchema {
  name?: string | null
  role?: string | null
  /** Comma-separated specialties (maps to `knowsAbout` and description). */
  specialties?: string | null
  imageUrl?: string | null
}

export interface BuildPersonSchemaOptions {
  origin: string
  /** Canonical URL of the about page that lists the team (each Person `url`). */
  personListingPageUrl: string
  personIndex: number
}

export function buildPersonSchemaForTeamMember(
  input: TeamMemberForSchema,
  options: BuildPersonSchemaOptions
): JsonLdObject | null {
  const name = input.name?.trim()
  if (!name) return null

  const o = normalizeSiteOrigin(options.origin)
  if (!o) return null

  const listing = normalizeHttpUrl(options.personListingPageUrl)
  if (!listing) return null

  const { personIndex } = options
  const role = input.role?.trim() ?? ''
  const knowsAbout = parseSpecialtiesToKnowsAbout(input.specialties)

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'Person',
    '@id': `${listing}#${personNodeFragmentId(name, personIndex)}`,
    name,
    description: buildPersonDescription(name, role, input.specialties),
    worksFor: {
      '@type': 'Organization',
      '@id': organizationSchemaId(o),
      name: ORGANIZATION_BRAND_NAME,
    },
    url: listing,
  }

  if (role) schema.jobTitle = role

  const img = toAbsoluteUrl(o, input.imageUrl ?? undefined)
  if (img) schema.image = img

  if (knowsAbout.length) {
    const phrase =
      knowsAbout.length === 1
        ? knowsAbout[0]!
        : `${knowsAbout.slice(0, -1).join(', ')}, and ${knowsAbout[knowsAbout.length - 1]!}`
    schema.knowsAbout = [
      `${name} centers their practice on ${phrase} while representing scandicommerce in Oslo, Norway, for Nordic e-commerce brands, spanning headed Shopify storefronts and headless programs with Sanity, the Shopify Storefront API, Hydrogen, Klaviyo, and Make.`,
    ]
  }

  return schema
}

export interface BuildPersonSchemasForTeamOptions {
  origin: string
  personListingPageUrl: string
}

export function buildPersonSchemasForTeam(
  members: TeamMemberForSchema[],
  options: BuildPersonSchemasForTeamOptions
): JsonLdObject[] {
  const o = normalizeSiteOrigin(options.origin)
  const listing = normalizeHttpUrl(options.personListingPageUrl)
  if (!o || !listing || !members.length) return []
  return members
    .map((m, i) =>
      buildPersonSchemaForTeamMember(m, {
        origin: options.origin,
        personListingPageUrl: options.personListingPageUrl,
        personIndex: i,
      })
    )
    .filter((node): node is JsonLdObject => node != null)
}
