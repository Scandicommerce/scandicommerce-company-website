import { headers } from 'next/headers'

/** Skip global org JSON-LD on Sanity Studio (`/studio`). */
export async function shouldSuppressMarketingJsonLd(): Promise<boolean> {
  const h = await headers()
  const xUrl = h.get('x-url')
  if (xUrl) {
    try {
      if (isStudioPath(new URL(xUrl).pathname)) return true
    } catch {
      /* ignore */
    }
  }
  const xPath = h.get('x-pathname') || ''
  if (xPath && isStudioPath(xPath)) return true
  return false
}

function isStudioPath(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '') || '/'
  return p === '/studio' || p.startsWith('/studio/')
}
