import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  SITES,
  isLanguage,
  isProductionSiteHost,
  siteByAnyHost,
  siteForLanguage,
  siteServesLanguage,
  type Language,
  type SiteConfig,
} from '@/lib/site-config'
import { LEGACY_ARTICLE_PREFIXES, absoluteUrl, publicPath, trimSlashes } from '@/lib/routes'
import {
  findDocByCurrentPath,
  findDocByLegacyPath,
  languagesForPath,
  sectionParentPath,
  siblingPath,
} from '@/lib/seo/urlPlan'
import { resolveDocument, translatePath } from '@/lib/sanity/redirectTranslate'

/**
 * Edge middleware — host, locale and path normalisation (TECHNICAL-SEO-SPEC Task 4).
 *
 * Order of operations for production hosts:
 *   1. legacy host → canonical apex host (only when SEO_ENFORCE_APEX_HOST=true,
 *      because Vercel's own domain redirect must be flipped first or the two
 *      redirects loop)
 *   2. Sanity-managed redirects (exact path match)
 *   3. locale prefix / country-code prefix stripping (incl. /da/da/ doubles)
 *   4. lowercase
 *   5. legacy shapes (/resources/<slug>) and cross-language paths → canonical
 *      URL on the right origin, in ONE 308
 *   6. rewrite to the internal /{lang}/… route with x-locale / x-site / x-url headers
 *
 * Non-production hosts (localhost, *.vercel.app) keep prefix-based routing
 * for every language so previews stay usable; they are noindex anyway.
 */

const LOCALE_SEGMENTS = new Set<string>(['en', 'no', 'sv', 'da', 'de'])
const COUNTRY_SEGMENTS: Record<string, Language> = { se: 'sv', dk: 'da' }
const PERMANENT = 308

// ---------------------------------------------------------------------------
// Sanity-managed redirects (fetched at request time with in-memory cache)
// ---------------------------------------------------------------------------
type RedirectEntry = { destination: string; permanent: boolean }
let _redirectMap: Map<string, RedirectEntry> | null = null
let _lastFetch = 0
const REDIRECT_TTL = 60_000

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
    const res = await fetch(`https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`)
    if (!res.ok) throw new Error(`Sanity ${res.status}`)
    const { result } = (await res.json()) as {
      result: Array<{ source: string; destination: string; permanent: boolean }>
    }
    const map = new Map<string, RedirectEntry>()
    for (const r of result ?? []) {
      if (typeof r.source === 'string' && r.source.startsWith('/') && typeof r.destination === 'string') {
        map.set(r.source.toLowerCase().replace(/\/+$/, '') || '/', {
          destination: r.destination,
          permanent: r.permanent !== false,
        })
      }
    }
    _redirectMap = map
    _lastFetch = now
    return map
  } catch {
    return _redirectMap ?? new Map()
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip every leading locale / country segment; return the language of the first one. */
function stripLocalePrefixes(pathname: string): { prefixLang: Language | null; rest: string } {
  const segments = trimSlashes(pathname).split('/').filter(Boolean)
  let prefixLang: Language | null = null
  while (segments.length > 0) {
    const s = segments[0].toLowerCase()
    if (LOCALE_SEGMENTS.has(s)) {
      if (!prefixLang && isLanguage(s)) prefixLang = s
      segments.shift()
      continue
    }
    if (s in COUNTRY_SEGMENTS) {
      if (!prefixLang) prefixLang = COUNTRY_SEGMENTS[s]
      segments.shift()
      continue
    }
    break
  }
  return { prefixLang, rest: segments.join('/') }
}

function isLegacyArticlePath(path: string): boolean {
  const first = trimSlashes(path).split('/')[0]?.toLowerCase() ?? ''
  return (LEGACY_ARTICLE_PREFIXES as readonly string[]).includes(first) && path.split('/').length >= 2
}

function withHeaders(response: NextResponse, locale: string, site: SiteConfig, publicPathname: string): NextResponse {
  response.headers.set('x-locale', locale)
  response.headers.set('x-site', site.key)
  response.headers.set('x-pathname', publicPathname)
  response.headers.set('x-url', `${site.origin}${publicPathname}`)
  return response
}

function internalRewrite(request: NextRequest, locale: string, site: SiteConfig, rest: string): NextResponse {
  const internal = rest ? `/${locale}/${rest}` : `/${locale}`
  const url = request.nextUrl.clone()
  url.pathname = internal
  const publicPathname = publicPath(locale, rest)
  return withHeaders(NextResponse.rewrite(url), locale, site, publicPathname)
}

function redirectTo(target: string, request: NextRequest, status = PERMANENT): NextResponse {
  const url = new URL(target)
  url.search = request.nextUrl.search
  return NextResponse.redirect(url, status)
}

/**
 * Canonical (language, path) for a requested path in a given language.
 * Returns null when nothing is known about the path (let the app 404).
 */
async function canonicalise(
  rest: string,
  language: Language
): Promise<{ language: Language; path: string } | null> {
  const lower = rest.toLowerCase()
  const current = findDocByCurrentPath(language, lower)
  if (current) return { language, path: current.newPath }
  const legacy = findDocByLegacyPath(language, lower)
  if (legacy) return { language, path: legacy.newPath }
  if (isLegacyArticlePath(lower)) {
    const doc = await resolveDocument(lower, language)
    if (doc) return { language, path: doc.path }
    return { language, path: sectionParentPath(language, lower) }
  }
  return null
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host)
    .toLowerCase()
    .split(':')[0]
  const production = isProductionSiteHost(host)
  const site = siteByAnyHost(host) ?? (process.env.NEXT_PUBLIC_SITE === 'com' ? SITES.com : SITES.no)

  // 1. Legacy host (www.) → canonical host. Opt-in, see header comment. The
  //    host fix is folded into whatever redirect the path needs so a legacy
  //    URL on the legacy host is still ONE hop; otherwise it is applied last.
  const legacyHost = production && host !== site.host && process.env.SEO_ENFORCE_APEX_HOST === 'true'

  // 2. Sanity-managed redirects.
  const redirectMap = await getRedirectMap()
  const hit = redirectMap.get(pathname.toLowerCase().replace(/\/+$/, '') || '/')
  if (hit) {
    const base = production ? `${site.origin}/` : request.url
    const target = hit.destination.startsWith('http') ? hit.destination : new URL(hit.destination, base).toString()
    return redirectTo(target, request, hit.permanent ? PERMANENT : 307)
  }

  const { prefixLang, rest } = stripLocalePrefixes(pathname)
  const lower = rest.toLowerCase()

  // ---- Non-production hosts: prefix routing for every language, no cross-domain moves.
  if (!production) {
    const locale: Language = prefixLang ?? site.defaultLanguage
    const localeSite = siteForLanguage(locale)
    if (prefixLang && (rest !== lower || pathname !== `/${prefixLang}${rest ? `/${rest}` : ''}`)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${prefixLang}${lower ? `/${lower}` : ''}`
      return NextResponse.redirect(url, PERMANENT)
    }
    if (rest !== lower) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lower}`
      return NextResponse.redirect(url, PERMANENT)
    }
    const response = internalRewrite(request, locale, localeSite, lower)
    // previews/localhost: x-url still points at the canonical origin so JSON-LD/canonicals are right
    return response
  }

  // ---- Production hosts.
  // 3./5. Work out which language this request is really for.
  let language: Language | null = prefixLang && siteServesLanguage(siteForLanguage(prefixLang), prefixLang) ? prefixLang : null
  if (!language) {
    // No (valid) prefix: default language of this host, unless the path is
    // unmistakably another language's page (Norwegian path on .com, …).
    const candidates = languagesForPath(lower)
    const own =
      candidates.find((c) => c.language === site.defaultLanguage) ??
      candidates.find((c) => siteServesLanguage(site, c.language))
    if (own) language = own.language
    else if (candidates.length) {
      // Prefer the sibling in this site's default language, else move domains.
      const foreign = candidates[0]
      const sib = siblingPath(foreign.doc, site.defaultLanguage)
      if (sib !== null) return redirectTo(absoluteUrl(site.defaultLanguage, sib), request)
      const translated = foreign.legacy ? null : await translatePath(lower, foreign.language, site.defaultLanguage)
      if (translated) return redirectTo(absoluteUrl(site.defaultLanguage, translated), request)
      return redirectTo(absoluteUrl(foreign.language, foreign.doc.newPath), request)
    } else language = site.defaultLanguage
  }

  // A prefixed language that this host does not serve → move to the right origin.
  const targetSite = siteForLanguage(language)
  const canonical = await canonicalise(lower, language)
  const finalPath = canonical ? canonical.path : lower
  const targetUrl = absoluteUrl(language, finalPath)
  const currentUrl = `${site.origin}${pathname === '/' ? '' : pathname}`

  if (targetSite.key !== site.key) {
    // e.g. /en/about on .no, /no/kontakt on .com. Prefer the translation for
    // this host's default language when the visitor clearly wanted this host.
    return redirectTo(targetUrl, request)
  }

  if (targetUrl !== currentUrl) {
    // prefix stripped, casing fixed, legacy shape or renamed slug
    return redirectTo(targetUrl, request)
  }

  if (legacyHost) return redirectTo(targetUrl, request)

  // 6. Canonical request: rewrite to the internal locale route.
  return internalRewrite(request, language, site, trimSlashes(finalPath))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|studio|images|fonts|gif|icons|opengraph-image|twitter-image|icon|apple-icon|manifest|.*\\..*).*)',
  ],
}
