import { normalizeHttpUrl } from './urls'

/** Verified company profile; append Instagram etc. via NEXT_PUBLIC_ORGANIZATION_SAME_AS. */
const ORGANIZATION_SAME_AS_PRESET = [
  'https://www.linkedin.com/company/scandicommerce',
] as const

export function parseSameAsFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORGANIZATION_SAME_AS
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((s) => normalizeHttpUrl(s.trim()))
    .filter((s): s is string => Boolean(s))
}

export function getOrganizationSameAs(): string[] {
  const preset = ORGANIZATION_SAME_AS_PRESET.map((u) => normalizeHttpUrl(u)).filter(
    (u): u is string => Boolean(u)
  )
  return [...new Set([...preset, ...parseSameAsFromEnv()])]
}
