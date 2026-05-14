import type { ResolvedPage } from '@/lib/resolvePageByPath'

/** Same slug convention as `generateMetadata` in `app/[lang]/[...slug]/page.tsx`. */
export function resolveRouteSeoSlug(
  resolved: NonNullable<ResolvedPage>,
  pathTrim: string
): string {
  if ('slug' in resolved && resolved.slug) return resolved.slug
  return pathTrim
}
