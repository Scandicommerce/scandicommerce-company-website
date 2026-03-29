import { headers } from 'next/headers'
import { getBaseUrl } from '@/lib/hreflang'
import { defaultLanguage, getPathWithoutLang } from '@/sanity/lib/languages'
import { normalizeHttpUrl, normalizeSiteOrigin } from './urls'

export { toAbsoluteUrl } from './urls'

export async function getSchemaSiteOrigin(): Promise<string> {
  const headersList = await headers()
  const xUrl = headersList.get('x-url')
  if (xUrl) {
    try {
      return normalizeSiteOrigin(new URL(xUrl).origin) ?? ''
    } catch {
      /* fall through */
    }
  }
  const fromEnv = getBaseUrl()
  if (fromEnv) return normalizeSiteOrigin(fromEnv) ?? ''
  if (process.env.VERCEL_URL) {
    return normalizeSiteOrigin(`https://${process.env.VERCEL_URL}`) ?? ''
  }
  return ''
}

export async function getSchemaPathnameWithoutLang(): Promise<string> {
  const headersList = await headers()
  const raw = headersList.get('x-pathname') || '/'
  return getPathWithoutLang(raw)
}

export async function getSchemaPageUrl(): Promise<string> {
  const headersList = await headers()
  const xUrl = headersList.get('x-url')
  if (xUrl) {
    try {
      const u = new URL(xUrl)
      const built = `${u.origin}${u.pathname}${u.search}`
      return normalizeHttpUrl(built) ?? ''
    } catch {
      /* fall through */
    }
  }
  const origin = await getSchemaSiteOrigin()
  const path = (await getSchemaPathnameWithoutLang()) || '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!origin) return ''
  const joined = `${origin}${normalizedPath === '//' ? '/' : normalizedPath}`
  return normalizeHttpUrl(joined) ?? ''
}

export async function getSchemaLocale(): Promise<string> {
  const headersList = await headers()
  const raw = headersList.get('x-locale')?.trim()
  if (!raw || !/^[a-z]{2}(-[a-z0-9]{1,8})?$/i.test(raw)) return defaultLanguage
  const [lang, region] = raw.split('-')
  const l = lang.toLowerCase()
  return region ? `${l}-${region.toUpperCase()}` : l
}
