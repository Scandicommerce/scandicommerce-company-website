import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS } from '@/sanity/lib/languages'
import { isComOnlyLocale, segmentToLanguageId } from '@/lib/hreflang'

const COM_HOST = 'scandicommerce.com'
const NO_HOST = 'scandicommerce.no'

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.nextUrl.host
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
