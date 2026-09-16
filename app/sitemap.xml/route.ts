import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { SITES, X_DEFAULT_LANGUAGE, isLanguage, siteForHost, siteForLanguage, type Language } from '@/lib/site-config'
import { docPath, absoluteUrl, hreflangCode, isNoIndexPath } from '@/lib/routes'
import { findDocByLegacyPath } from '@/lib/seo/urlPlan'

/** Canonical path for a doc, mapped through the URL plan while a slug rename is still unpublished. */
function canonicalPathFor(m: { _type: string; slug: string; isHomepage?: boolean }, lang: Language): string {
  const p = docPath({ ...m, language: lang }).toLowerCase()
  const planned = findDocByLegacyPath(lang, p)
  return planned ? planned.newPath.toLowerCase() : p
}

export const dynamic = 'force-dynamic'

/**
 * One sitemap per origin (TECHNICAL-SEO-SPEC Task 7).
 *
 * - Only URLs of the origin that served the request.
 * - hreflang alternates per URL, mirroring `buildHreflangFromTranslations`.
 * - Excludes noindex documents, merch, the human /sitemap page, drafts.
 * - `<lastmod>` from Sanity `_updatedAt`; no `<priority>` / `<changefreq>`.
 */

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const XHTML_NS = 'http://www.w3.org/1999/xhtml'

const INDEXABLE_TYPES = [
  'landingPage',
  'aboutPage',
  'contactPage',
  'workPage',
  'partnersPage',
  'blogPage',
  'allPackagesPage',
  'packageDetailPage',
  'migratePage',
  'shopifyPosPage',
  'shopifyPosInfoPage',
  'shopifyXAiPage',
  'shopifyXPimPage',
  'whyShopifyPage',
  'shopifyPlatformPage',
  'vippsHurtigkassePage',
  'shopifyTcoCalculatorPage',
  'shopifyDevelopmentPage',
  'post',
  'blogPost',
  'caseStudy',
  'author',
  'legalPage',
  'pillarPage',
  'integrationPage',
  'migrationPage',
]

const sitemapDocsQuery = groq`
  *[
    _type in $types
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && seoExtended.noIndex != true
    && seo.noIndex != true
    && !defined(seoExtended.canonical)
  ] {
    _id,
    _type,
    language,
    "slug": slug.current,
    "isHomepage": coalesce(isHomepage, false),
    _updatedAt,
    "group": *[_type == "translation.metadata" && references(^._id)][0]._id
  }
`

interface SitemapDoc {
  _id: string
  _type: string
  language?: string | null
  slug: string
  isHomepage?: boolean
  _updatedAt?: string
  group?: string | null
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function lastmod(updated?: string): string | null {
  if (!updated) return null
  const d = new Date(updated)
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

export async function GET() {
  const h = await headers()
  const site = siteForHost(h.get('x-forwarded-host') ?? h.get('host'))

  let docs: SitemapDoc[] = []
  try {
    docs = await client.fetch<SitemapDoc[]>(sitemapDocsQuery, { types: INDEXABLE_TYPES }, { next: { revalidate: 3600 } })
  } catch (err) {
    console.error('[sitemap] Sanity fetch failed', err)
  }

  // Cluster by translation group (or own id when untranslated).
  const clusters = new Map<string, SitemapDoc[]>()
  for (const doc of docs) {
    const key = doc.group ?? doc._id
    if (!clusters.has(key)) clusters.set(key, [])
    clusters.get(key)!.push(doc)
  }

  const entries: string[] = []
  const seenLoc = new Set<string>()

  for (const members of clusters.values()) {
    // Alternates: one URL per language among indexable, published members.
    const alternates: Partial<Record<Language, string>> = {}
    for (const m of members) {
      if (!isLanguage(m.language)) continue
      const p = canonicalPathFor(m, m.language)
      if (isNoIndexPath(p)) continue
      alternates[m.language] = absoluteUrl(m.language, p)
    }

    for (const m of members) {
      // Language-neutral docs (authors) are served on both origins.
      const languagesToEmit: Language[] = isLanguage(m.language)
        ? [m.language]
        : m._type === 'author'
          ? [site.defaultLanguage]
          : []
      for (const lang of languagesToEmit) {
        if (siteForLanguage(lang).key !== site.key) continue
        const p = canonicalPathFor(m, lang)
        if (isNoIndexPath(p)) continue
        const loc = absoluteUrl(lang, p)
        if (seenLoc.has(loc)) continue
        seenLoc.add(loc)

        const lines = ['  <url>', `    <loc>${escapeXml(loc)}</loc>`]
        const clusterSize = Object.keys(alternates).length
        if (isLanguage(m.language) && clusterSize > 1) {
          for (const [l, href] of Object.entries(alternates)) {
            if (!href) continue
            lines.push(`    <xhtml:link rel="alternate" hreflang="${hreflangCode(l)}" href="${escapeXml(href)}" />`)
          }
          const xDefault = alternates[X_DEFAULT_LANGUAGE]
          if (xDefault) lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}" />`)
        }
        const lm = lastmod(m._updatedAt)
        if (lm) lines.push(`    <lastmod>${lm}</lastmod>`)
        lines.push('  </url>')
        entries.push(lines.join('\n'))
      }
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">`,
    ...entries,
    '</urlset>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
      'X-Sitemap-Origin': site.origin,
      Vary: 'Host',
    },
  })
}

