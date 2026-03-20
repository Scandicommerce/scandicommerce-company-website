import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import {
  sitemapPagesAllLocalesQuery,
  sitemapBlogPostsAllLocalesQuery,
  sitemapPostsAllLocalesQuery,
} from '@/sanity/lib/queries'
import { getBaseUrl } from '@/lib/hreflang'
import { LOCALE_IDS, defaultLanguage } from '@/sanity/lib/languages'
import { getShopifyProducts } from '@/lib/shopify'

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const XHTML_NS = 'http://www.w3.org/1999/xhtml'

interface SitemapEntry {
  _id: string
  language: string
  slug: string
  _type: string
  _updatedAt?: string
}

function getBaseId(id: string): string {
  return id.replace(/-[a-z]{2}$/, '')
}

function getPath(entry: { _type: string; slug: string }): string {
  if (entry._type === 'blogPost' || entry._type === 'post') return `resources/${entry.slug}`
  return entry.slug
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(updated?: string): string {
  if (updated) {
    const d = new Date(updated)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  return new Date().toISOString().slice(0, 10)
}

export async function GET() {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="' +
        SITEMAP_NS +
        '"></urlset>',
      {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    )
  }

  const [pages, blogPosts, posts, shopifyProducts] = await Promise.all([
    client.fetch<SitemapEntry[]>(sitemapPagesAllLocalesQuery, {}, { next: { revalidate: 3600 } }),
    client.fetch<SitemapEntry[]>(sitemapBlogPostsAllLocalesQuery, {}, { next: { revalidate: 3600 } }),
    client.fetch<SitemapEntry[]>(sitemapPostsAllLocalesQuery, {}, { next: { revalidate: 3600 } }),
    getShopifyProducts().catch(() => []),
  ])

  // Group by base id so we can output hreflang alternates per logical page
  const alternates = new Map<string, Record<string, { path: string; lastmod: string }>>()

  const addEntry = (entry: SitemapEntry, path: string) => {
    const baseId = getBaseId(entry._id)
    if (!alternates.has(baseId)) alternates.set(baseId, {})
    const rec = alternates.get(baseId)!
    rec[entry.language] = {
      path,
      lastmod: formatLastmod(entry._updatedAt),
    }
  }

  for (const entry of pages || []) {
    const path =
      entry._type === 'landingPage' && (entry.slug === '' || entry.slug === 'home')
        ? ''
        : getPath(entry)
    addEntry(entry, path)
  }

  for (const entry of blogPosts || []) {
    addEntry(entry, getPath(entry))
  }

  for (const entry of posts || []) {
    addEntry(entry, getPath(entry))
  }

  // Static routes: home and sitemap (same path for all locales)
  const staticRoutes: Record<string, { path: string; changefreq: string; priority: string }> = {
    __home: { path: '', changefreq: 'daily', priority: '1.0' },
    __sitemap: { path: 'sitemap', changefreq: 'weekly', priority: '0.5' },
  }

  const productHandles =
    shopifyProducts
      ?.filter((p) => p.collections?.length > 0)
      .map((p) => p.handle) ?? []

  const today = new Date().toISOString().slice(0, 10)
  const urlEntries: Array<{
    locale: string
    path: string
    lastmod: string
    changefreq: string
    priority: string
    alternates: Record<string, { path: string; lastmod: string }>
  }> = []

  // Static: home and sitemap (one logical “page” per locale with same path in all locales)
  const hasHomeFromCms = Array.from(alternates.values()).some((langToPath) =>
    Object.values(langToPath).some((v) => v.path === '')
  )
  for (const [, { path, changefreq, priority }] of Object.entries(staticRoutes)) {
    if (path === '' && hasHomeFromCms) continue
    const alt: Record<string, { path: string; lastmod: string }> = {}
    for (const loc of LOCALE_IDS) {
      alt[loc] = { path, lastmod: today }
    }
    for (const loc of LOCALE_IDS) {
      urlEntries.push({
        locale: loc,
        path,
        lastmod: today,
        changefreq,
        priority,
        alternates: alt,
      })
    }
  }

  // Sanity pages and blog posts (grouped by base id)
  for (const [, langToPath] of alternates) {
    const locales = Object.keys(langToPath)
    if (locales.length === 0) continue
    const lastmod = Object.values(langToPath).map((v) => v.lastmod).sort().reverse()[0] ?? today
    const changefreq = 'weekly'
    const priority = '0.8'
    for (const [locale, { path }] of Object.entries(langToPath)) {
      urlEntries.push({
        locale,
        path,
        lastmod,
        changefreq,
        priority,
        alternates: Object.fromEntries(
          Object.entries(langToPath).map(([loc, v]) => [loc, { path: v.path, lastmod: v.lastmod }])
        ),
      })
    }
  }

  // Products: path merch/{handle} for all locales (same path, no translation)
  for (const handle of productHandles) {
    const path = `merch/${handle}`
    const alt: Record<string, { path: string; lastmod: string }> = {}
    for (const loc of LOCALE_IDS) {
      alt[loc] = { path, lastmod: today }
    }
    for (const loc of LOCALE_IDS) {
      urlEntries.push({
        locale: loc,
        path,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.6',
        alternates: alt,
      })
    }
  }

  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">`,
  ]

  for (const { locale, path, lastmod, changefreq, priority, alternates: alt } of urlEntries) {
    const pathSegment = path ? `/${path}` : ''
    const loc = `${baseUrl}/${locale}${pathSegment}`
    xmlLines.push('  <url>')
    xmlLines.push(`    <loc>${escapeXml(loc)}</loc>`)
    for (const [lang, { path: p }] of Object.entries(alt)) {
      const href = `${baseUrl}/${lang}${p ? `/${p}` : ''}`
      xmlLines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`)
    }
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}/${defaultLanguage}${pathSegment}`)}" />`)
    xmlLines.push(`    <lastmod>${lastmod}</lastmod>`)
    xmlLines.push(`    <changefreq>${changefreq}</changefreq>`)
    xmlLines.push(`    <priority>${priority}</priority>`)
    xmlLines.push('  </url>')
  }

  xmlLines.push('</urlset>')

  return new NextResponse(xmlLines.join('\n'), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
