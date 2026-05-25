import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS } from '@/sanity/lib/languages'
import { isComOnlyLocale, segmentToLanguageId } from '@/lib/hreflang'
import { isNoSlugEnglishificationRedirect, translatePath } from '@/lib/translatePath'

const COM_HOST = 'scandicommerce.com'
const NO_HOST = 'scandicommerce.no'

// Static slug redirect maps: English slugs that must be rewritten on .no, and vice versa.
// Used to redirect without a Sanity lookup (covers pages with different slugs per locale).
const STATIC_SLUG_NO_REDIRECT: Record<string, string> = { blog: 'blogg' }
const STATIC_SLUG_EN_REDIRECT: Record<string, string> = { blogg: 'blog' }

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

/** Normalize path for comparison (no leading/trailing slashes). */
function normalizePath(p: string): string {
  return p.replace(/^\/+|\/+$/g, '')
}

/**
 * When redirecting .com → .no (or the reverse), replace the English slug with
 * the localized slug from Sanity when the destination still mirrors the source.
 */
async function localizeCrossDomainRedirect(
  targetUrl: string,
  sourcePathname: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (sourceLang === targetLang) return targetUrl

  let target: URL
  try {
    target = new URL(targetUrl)
  } catch {
    return targetUrl
  }

  const sourceClean = normalizePath(sourcePathname)
  const destClean = normalizePath(target.pathname)
  if (!sourceClean || destClean !== sourceClean) return targetUrl

  const translated = await translatePath(sourceClean, sourceLang, targetLang)
  if (!translated) return targetUrl

  target.pathname = `/${translated}`
  return target.toString()
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.nextUrl.host

  // --- Sanity-managed redirects (checked before any locale logic) ---
  const redirectMap = await getRedirectMap()
  const hit = redirectMap.get(pathname)
  if (hit) {
    let target = hit.destination.startsWith('http')
      ? hit.destination
      : new URL(hit.destination, request.url).toString()

    // Never replace a valid Norwegian slug with its English equivalent on .no
    if (
      isNoHost(host) &&
      (await isNoSlugEnglishificationRedirect(pathname, target))
    ) {
      // Skip this redirect — continue to locale rewrite below
    } else {
      // .com → .no (or .no → .com): swap slug when destination path matches source
      const targetHost = new URL(target).host
      if (isComHost(host) && isNoHost(targetHost)) {
        target = await localizeCrossDomainRedirect(target, pathname, 'en', 'no')
      } else if (isNoHost(host) && isComHost(targetHost)) {
        target = await localizeCrossDomainRedirect(target, pathname, 'no', 'en')
      }

      return NextResponse.redirect(target, hit.permanent ? 308 : 307)
    }
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
      const sourceLang = isNoHost(host) ? 'no' : 'en'
      const targetLang = segLower
      let finalPath = cleanPath

      if (sourceLang !== targetLang && cleanPath !== '/') {
        const translated = await translatePath(
          normalizePath(cleanPath),
          sourceLang,
          targetLang
        )
        if (translated) finalPath = `/${translated}`
      }

      return NextResponse.redirect(new URL(`https://${targetDomain}${finalPath}`))
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

  // On production: redirect statically-known wrong-locale slugs (e.g. /blog on .no → /blogg).
  // Only covers cases where the same slug differs between EN and NO — avoids any Sanity lookup.
  if (isProductionHost(host)) {
    const bare = normalizePath(pathname)
    if (bare) {
      const noMatch = STATIC_SLUG_NO_REDIRECT[bare]
      if (isNoHost(host) && noMatch) {
        return NextResponse.redirect(new URL(`/${noMatch}`, request.url), 308)
      }
      const enMatch = STATIC_SLUG_EN_REDIRECT[bare]
      if (isComHost(host) && enMatch) {
        return NextResponse.redirect(new URL(`/${enMatch}`, request.url), 308)
      }
    }
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
