import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { client } from '@/sanity/lib/client'
import { siteSettingsRobotsQuery } from '@/sanity/lib/queries'
import { SITES, siteForHost } from '@/lib/site-config'

export const dynamic = 'force-dynamic'

type RobotsRow = { language?: string; noIndexEntireSite?: boolean }

async function isSiteWideNoIndex(): Promise<boolean> {
  try {
    const rows = await client.fetch<RobotsRow[]>(
      siteSettingsRobotsQuery,
      {},
      { next: { revalidate: 60, tags: ['site-settings'] } }
    )
    return Array.isArray(rows) && rows.some((r) => r.noIndexEntireSite === true)
  } catch (err) {
    console.error('[robots] failed to read siteSettings robots flag', err)
    return false
  }
}

/**
 * robots.txt per origin (TECHNICAL-SEO-SPEC Task 5).
 *
 * - Preview / development deployments block everything.
 * - Production allows everything except app/studio internals and lists the
 *   sitemap of the origin that served the request (never the other domain).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const site = siteForHost(host)
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
  const isCanonicalHost = !host || host.split(':')[0] === SITES.no.host || host.split(':')[0] === SITES.com.host
  const blocked = !isProduction || !isCanonicalHost || (await isSiteWideNoIndex())

  if (blocked) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio', '/_next/', '/admin'],
      },
    ],
    sitemap: `${site.origin}/sitemap.xml`,
    host: site.origin,
  }
}
