/**
 * Reads a page document's `sections[]` page-builder array, dropping malformed entries.
 */
export type SanitySectionItem = { _type: string; _key: string } & Record<string, unknown>

export function normalizeDocumentSections(doc: object | null | undefined): SanitySectionItem[] {
  if (!doc) return []
  const raw = (doc as Record<string, unknown>).sections
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is SanitySectionItem => {
    return Boolean(item && typeof item === 'object' && '_type' in item && '_key' in item)
  })
}
