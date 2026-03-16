import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS } from '@/sanity/lib/languages'

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

/** Locale → production domain (only en/no have dedicated domains) */
const LOCALE_DOMAINS: Record<string, string> = {
  en: 'scandicommerce.com',
  no: 'scandicommerce.no',
}

function isProductionHost(host: string): boolean {
  return host.includes('scandicommerce')
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.nextUrl.host
  const seg = firstSegment(pathname)
  const segLower = seg.toLowerCase()
  const hasLocale = LOCALE_IDS.includes(segLower)
  const defaultLocale = getDefaultLocale(host)

  if (hasLocale) {
    const cleanPath = stripLocalePrefix(pathname, seg)

    // Production: locale prefixes don't exist in URLs → redirect to correct domain
    if (isProductionHost(host) && LOCALE_DOMAINS[segLower]) {
      const targetDomain = LOCALE_DOMAINS[segLower]
      return NextResponse.redirect(new URL(`https://${targetDomain}${cleanPath}`))
    }

    // Localhost / dev: strip default locale prefix, keep non-default working
    if (segLower === defaultLocale) {
      return NextResponse.redirect(new URL(cleanPath, request.url))
    }
    if (seg !== segLower) {
      return NextResponse.redirect(new URL(`/${segLower}${cleanPath === '/' ? '' : cleanPath}`, request.url))
    }
    const response = NextResponse.next()
    response.headers.set('x-locale', segLower)
    response.headers.set('x-pathname', pathname)
    response.headers.set('x-url', request.url)
    return response
  }

  // No locale in URL → rewrite to /{defaultLocale}{path} (browser URL stays clean)
  const rewritePath = pathname === '/' || pathname === '' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  const response = NextResponse.rewrite(new URL(rewritePath, request.url))
  response.headers.set('x-locale', defaultLocale)
  response.headers.set('x-pathname', pathname)
  response.headers.set('x-url', request.url)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|images|.*\\..*).*)'],
}
