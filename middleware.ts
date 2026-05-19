import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS } from '@/sanity/lib/languages'
import { isComOnlyLocale, segmentToLanguageId } from '@/lib/hreflang'

const COM_HOST = 'scandicommerce.com'
const NO_HOST = 'scandicommerce.no'

// ---------------------------------------------------------------------------
// Sanity-managed redirects (fetched at request time with in-memory cache)
// ---------------------------------------------------------------------------
type RedirectEntry = { destination: string; permanent: boolean }
let _redirectMap: Map<string, RedirectEntry> | null = null
let _lastFetch = 0
const REDIRECT_TTL = 60_000 // 60 s

async function getRedirectMap(): Promise<Map<string, RedirectEntry>> {
  const now = Date.now()
  if (_redirectMap && now - _lastFetch < REDIRECT_TTL) return _redirectMap

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) return _redirectMap ?? new Map()

  try {
    const query = encodeURIComponent(
      '*[_type == "redirect" && isEnabled == true]{source, destination, "permanent": coalesce(permanent, true)}'
    )
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`
    )
    if (!res.ok) throw new Error(`Sanity ${res.status}`)
    const { result } = (await res.json()) as { result: Array<{ source: string; destination: string; permanent: boolean }> }

    const map = new Map<string, RedirectEntry>()
    for (const r of result ?? []) {
      if (typeof r.source === 'string' && r.source.startsWith('/') && typeof r.destination === 'string') {
        map.set(r.source, { destination: r.destination, permanent: r.permanent !== false })
      }
    }
    _redirectMap = map
    _lastFetch = now
    return map
  } catch {
    return _redirectMap ?? new Map()
  }
}

function firstSegment(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || ''
}

/** scandicommerce.no → "no", everything else → "en" */
function getDefaultLocale(host: string): string {
  return host.includes('scandicommerce.no') ? 'no' : 'en'
}

/** /en/about → /about, /en → / */
function stripLocalePrefix(pathname: string, seg: string): string {
  const after = pathname.slice(1 + seg.length)
  return after ? `/${after}` : '/'
}

/** Locale → production domain (only en/no have dedicated bare domains) */
const LOCALE_DOMAINS: Record<string, string> = {
  en: COM_HOST,
  no: NO_HOST,
}

function isProductionHost(host: string): boolean {
  return host.includes('scandicommerce')
}

function isNoHost(host: string): boolean {
  return host.includes('scandicommerce.no')
}

function isComHost(host: string): boolean {
  return host.includes('scandicommerce.com')
}

/** Build target path on .com for sv/da/de (always /{locale}/...). */
function comLocalePath(locale: string, restSegments: string): string {
  const rest = restSegments.replace(/^\/+|\/+$/g, '')
  if (!rest) return `/${locale}`
  return `/${locale}/${rest}`
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.nextUrl.host
  
  // --- Sanity-managed redirects (checked before any locale logic) ---
  const redirectMap = await getRedirectMap()
  const hit = redirectMap.get(pathname)
  if (hit) {
    const target = hit.destination.startsWith('http')
      ? hit.destination
      : new URL(hit.destination, request.url).toString()
    return NextResponse.redirect(target, hit.permanent ? 308 : 307)
  }
  const seg = firstSegment(pathname)
  const segLower = seg.toLowerCase()
  const hasLocale = LOCALE_IDS.includes(segLower)
  const defaultLocale = getDefaultLocale(host)
  const mappedLang = segmentToLanguageId(segLower)

  // --- scandicommerce.no: never serve SV/DA/DE (or se/dk country slugs) ---
  if (isProductionHost(host) && isNoHost(host) && mappedLang && isComOnlyLocale(mappedLang)) {
    const rest = pathname.replace(/^\/[^/]+/, '').replace(/^\//, '')
    const target = `https://${COM_HOST}${comLocalePath(mappedLang, rest)}`
    return NextResponse.redirect(new URL(target))
  }

  // --- scandicommerce.com: normalize country slug segments to /{locale}/ ---
  if (isProductionHost(host) && isComHost(host) && mappedLang && isComOnlyLocale(mappedLang) && mappedLang !== 'en') {
    if (segLower !== mappedLang) {
      const rest = pathname.replace(/^\/[^/]+/, '').replace(/^\//, '')
      const target = `https://${COM_HOST}${comLocalePath(mappedLang, rest)}`
      return NextResponse.redirect(new URL(target))
    }
  }

  if (hasLocale) {
    const cleanPath = stripLocalePrefix(pathname, seg)

    // Production: en/no locale prefixes in URL → redirect to bare domain path
    if (isProductionHost(host) && LOCALE_DOMAINS[segLower]) {
      const targetDomain = LOCALE_DOMAINS[segLower]
      return NextResponse.redirect(new URL(`https://${targetDomain}${cleanPath}`))
    }

    // Dev: normalize case on /[locale]/...
    if (seg !== segLower) {
      return NextResponse.redirect(
        new URL(`/${segLower}${cleanPath === '/' ? '' : cleanPath}`, request.url)
      )
    }
    const response = NextResponse.next()
    response.headers.set('x-locale', segLower)
    response.headers.set('x-pathname', pathname)
    response.headers.set('x-url', request.url)
    return response
  }

  // No locale in URL → rewrite to /{defaultLocale}{path}
  const rewritePath =
    pathname === '/' || pathname === '' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  const response = NextResponse.rewrite(new URL(rewritePath, request.url))
  response.headers.set('x-locale', defaultLocale)
  response.headers.set('x-pathname', pathname)
  response.headers.set('x-url', request.url)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|images|.*\\..*).*)'],
}
