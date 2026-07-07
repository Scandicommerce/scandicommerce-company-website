/**
 * Append Sanity CDN transform params to an image URL:
 * modern format (webp/avif via auto=format), sane compression, and an
 * explicit width so the CDN serves a right-sized image instead of the
 * original upload. No-ops for non-Sanity URLs and SVGs (not transformable).
 */
export function sanityImg(url: string | undefined, width?: number): string | undefined {
  if (!url || !url.includes('cdn.sanity.io') || url.endsWith('.svg')) return url
  const sep = url.includes('?') ? '&' : '?'
  const w = width ? `&w=${width}&fit=max` : ''
  return `${url}${sep}auto=format&q=75${w}`
}
