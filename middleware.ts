import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS } from '@/sanity/lib/languages'

function firstSegment(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || ''
}

/** Default locale by host: scandicommerce.no → no, otherwise en */
function getDefaultLocale(host: string): string {
  return host.includes('scandicommerce.no') ? 'no' : 'en'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const seg = firstSegment(pathname)
  const segLower = seg.toLowerCase()
  const hasLocale = LOCALE_IDS.includes(segLower)

  // Redirect uppercase locale to lowercase (e.g. /EN/about -> /en/about)
  if (hasLocale && seg !== segLower) {
    const rest = pathname.slice(seg.length) || ''
    return NextResponse.redirect(new URL(`/${segLower}${rest}`, request.url))
  }

  // Path already has a valid locale prefix — continue and set x-locale for root layout
  if (hasLocale) {
    const response = NextResponse.next()
    response.headers.set('x-locale', segLower)
    response.headers.set('x-pathname', pathname)
    response.headers.set('x-url', request.url)
    return response
  }

  // No locale in path: rewrite to /{defaultLocale}{pathname} so the browser URL stays clean
  const defaultLocale = getDefaultLocale(request.nextUrl.host)
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
