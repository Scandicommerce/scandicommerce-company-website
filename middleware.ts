import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_IDS, defaultLanguage } from '@/sanity/lib/languages'

function firstSegment(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || ''
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

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  response.headers.set('x-url', request.url)

  if (pathname === '/' || pathname === '') {
    const preferLang = request.cookies.get('language')?.value?.toLowerCase()
    const lang = preferLang && LOCALE_IDS.includes(preferLang) ? preferLang : defaultLanguage
    return NextResponse.redirect(new URL(`/${lang}`, request.url))
  }

  // Redirect paths without locale prefix to /en/... (e.g. /about -> /en/about)
  if (!hasLocale && seg) {
    const preferLang = request.cookies.get('language')?.value?.toLowerCase()
    const lang = preferLang && LOCALE_IDS.includes(preferLang) ? preferLang : defaultLanguage
    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|images|.*\\..*).*)'],
}
