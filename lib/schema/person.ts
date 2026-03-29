import type { JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { organizationSchemaId } from './organization'
import { normalizeSiteOrigin, toAbsoluteUrl } from './urls'

function personNodeFragmentId(name: string, personIndex: number): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base || 'member'}-${personIndex}`
}

export interface TeamMemberForSchema {
  name?: string | null
  role?: string | null
  imageUrl?: string | null
}

export function buildPersonSchemaForTeamMember(
  input: TeamMemberForSchema,
  options: { origin: string; personIndex: number }
): JsonLdObject | null {
  const name = input.name?.trim()
  if (!name) return null

  const o = normalizeSiteOrigin(options.origin)
  if (!o) return null

  const { personIndex } = options

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'Person',
    '@id': `${o}/#${personNodeFragmentId(name, personIndex)}`,
    name,
    worksFor: { '@id': organizationSchemaId(o) },
  }

  const job = input.role?.trim()
  if (job) schema.jobTitle = job

  const img = toAbsoluteUrl(o, input.imageUrl ?? undefined)
  if (img) schema.image = { '@type': 'ImageObject', url: img }

  return schema
}

export function buildPersonSchemasForTeam(
  members: TeamMemberForSchema[],
  origin: string
): JsonLdObject[] {
  if (!normalizeSiteOrigin(origin) || !members.length) return []
  return members
    .map((m, i) => buildPersonSchemaForTeamMember(m, { origin, personIndex: i }))
    .filter((node): node is JsonLdObject => node != null)
}
