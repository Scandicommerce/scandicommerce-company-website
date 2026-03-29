/**
 * Normalize and validate http(s) URLs for JSON-LD (absolute only, no javascript/data, finite parsing).
 */
export function normalizeHttpUrl(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  try {
    const href = t.startsWith('//') ? `https:${t}` : t
    const u = new URL(href)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    if (!u.hostname) return null
    const pathname = u.pathname || '/'
    const path =
      pathname === '/' || pathname === ''
        ? ''
        : pathname.length > 1 && pathname.endsWith('/')
          ? pathname.slice(0, -1)
          : pathname
    return `${u.origin}${path}${u.search}`
  } catch {
    return null
  }
}

/** Site origin only, e.g. https://example.com (no trailing slash on path). */
export function normalizeSiteOrigin(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  try {
    const u = new URL(t.startsWith('//') ? `https:${t}` : t)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    if (!u.hostname) return null
    return u.origin
  } catch {
    return null
  }
}

/**
 * Resolve a path or URL against the site origin; returns normalized https? URL or undefined.
 */
export function toAbsoluteUrl(
  origin: string,
  hrefOrPath: string | null | undefined
): string | undefined {
  const base = normalizeSiteOrigin(origin)
  if (!base || !hrefOrPath?.trim()) return undefined
  const raw = hrefOrPath.trim()
  const direct = normalizeHttpUrl(raw.startsWith('//') ? `https:${raw}` : raw)
  if (direct) return direct
  const path = raw.startsWith('/') ? raw : `/${raw}`
  return normalizeHttpUrl(`${base}${path}`) ?? undefined
}
