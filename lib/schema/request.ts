import { headers } from 'next/headers'
import { SITES, siteForHost, siteForLanguage, type SiteConfig } from '@/lib/site-config'
import { defaultLanguage, getPathWithoutLang } from '@/sanity/lib/languages'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

export { toAbsoluteUrl } from './urls'

/**
 * Site for the current request. Resolution order:
 *   1. `x-site` header set by middleware (authoritative on production hosts)
 *   2. `x-locale` header (Norwegian → .no, else .com)
 *   3. Host header
 */
export async function getRequestSite(): Promise<SiteConfig> {
  const h = await headers()
  const xSite = h.get('x-site')
  if (xSite === 'no' || xSite === 'com') return SITES[xSite]
  const locale = h.get('x-locale')
  if (locale) return siteForLanguage(locale.split('-')[0].toLowerCase() === 'nb' ? 'no' : locale)
  return siteForHost(h.get('x-forwarded-host') ?? h.get('host'))
}

/** Canonical origin for the current request (never a preview or www host). */
export async function getSchemaSiteOrigin(): Promise<string> {
  const site = await getRequestSite()
  return normalizeSiteOrigin(site.origin) ?? site.origin
}

export async function getSchemaPathnameWithoutLang(): Promise<string> {
  const headersList = await headers()
  const raw = headersList.get('x-pathname') || '/'
  return getPathWithoutLang(raw)
}

/** Canonical page URL for the current request (canonical origin + request path, no query). */
export async function getSchemaPageUrl(): Promise<string> {
  const headersList = await headers()
  const origin = await getSchemaSiteOrigin()
  const xUrl = headersList.get('x-url')
  if (xUrl) {
    try {
      const u = new URL(xUrl)
      if (u.pathname === '/' || u.pathname === '') return `${origin}/`
      return normalizeHttpUrl(`${origin}${u.pathname}`) ?? ''
    } catch {
      /* fall through */
    }
  }
  const path = (await getSchemaPathnameWithoutLang()) || '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (normalizedPath === '/' || normalizedPath === '//') return `${origin}/`
  return normalizeHttpUrl(`${origin}${normalizedPath}`) ?? ''
}

export async function getSchemaLocale(): Promise<string> {
  const headersList = await headers()
  const raw = headersList.get('x-locale')?.trim()
  if (!raw || !/^[a-z]{2}(-[a-z0-9]{1,8})?$/i.test(raw)) return defaultLanguage
  const [lang, region] = raw.split('-')
  const l = lang.toLowerCase()
  return region ? `${l}-${region.toUpperCase()}` : l
}
