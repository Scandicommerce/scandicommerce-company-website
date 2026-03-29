import { normalizeHttpUrl } from './urls'

/** Org / ProfessionalService copy. Social: `NEXT_PUBLIC_ORGANIZATION_SAME_AS` (comma-separated https URLs). */
export const ORGANIZATION_NAME = 'Scandi Commerce'

export const ORGANIZATION_DESCRIPTION =
  'Shopify Plus partner helping merchants design, build, and grow ecommerce on Shopify.'

export const PROFESSIONAL_SERVICE_AREAS = [
  { '@type': 'Country', name: 'Norway' },
  { '@type': 'Country', name: 'Sweden' },
  { '@type': 'Country', name: 'Denmark' },
] as const

export function parseSameAsFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORGANIZATION_SAME_AS
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((s) => normalizeHttpUrl(s.trim()))
    .filter((s): s is string => Boolean(s))
}
