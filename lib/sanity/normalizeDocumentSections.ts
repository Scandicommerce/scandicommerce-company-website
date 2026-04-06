/**
 * Prefer Sanity `sections[]` when present; otherwise build ordered blocks from legacy root fields.
 */
export type SanitySectionItem = { _type: string; _key: string } & Record<string, unknown>

export function normalizeDocumentSections(
  doc: object | null | undefined,
  legacyOrder: ReadonlyArray<{ key: string; type: string }>
): SanitySectionItem[] {
  if (!doc) return []
  const d = doc as Record<string, unknown>
  const raw = d.sections
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter((item): item is SanitySectionItem => {
      return Boolean(item && typeof item === 'object' && '_type' in item && '_key' in item)
    }) as SanitySectionItem[]
  }

  const out: SanitySectionItem[] = []
  for (const { key, type } of legacyOrder) {
    const data = d[key]
    if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data as object).length > 0) {
      out.push({
        _key: `legacy-${key}`,
        _type: type,
        ...(data as Record<string, unknown>),
      })
    }
  }
  return out
}
