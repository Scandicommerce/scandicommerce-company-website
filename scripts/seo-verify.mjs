#!/usr/bin/env node
/**
 * SEO verification (TECHNICAL-SEO-SPEC Task 11). Exit code 1 on any failure.
 *
 *   node scripts/seo-verify.mjs --origin=https://scandicommerce.no --origin=https://scandicommerce.com
 *
 * Options
 *   --origin=<url>         canonical origin to verify (repeatable)
 *   --base=<url>           send requests here instead (local build) with Host header = origin host
 *   --inventory=<glob|csv> GSC Pages.csv export(s); default scripts/seo/inventory/*.csv
 *   --preview-url=<url>    a non-production deployment that must return X-Robots-Tag: noindex
 *   --expect-apex          require www./http:// → apex 301/308 (after the Vercel domain flip)
 *   --crawl-depth=2        internal-link crawl depth from the homepage
 *   --max-pages=400        hard cap on fetched pages
 *   --strict-orphans       fail (not warn) when an indexable page has < 3 inbound internal links
 *   --json=<file>          write the full report as JSON
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import https from 'node:https'

const args = Object.create(null)
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/)
  if (!m) continue
  const [, k, v] = m
  if (k === 'origin') (args.origin ??= []).push(v)
  else args[k] = v ?? true
}
const ORIGINS = (args.origin ?? ['https://scandicommerce.no', 'https://scandicommerce.com']).map((o) => o.replace(/\/+$/, ''))
const BASE = args.base ? String(args.base).replace(/\/+$/, '') : null
const CRAWL_DEPTH = Number(args['crawl-depth'] ?? 2)
const MAX_PAGES = Number(args['max-pages'] ?? 400)
const EXPECT_APEX = Boolean(args['expect-apex'])
const STRICT_ORPHANS = Boolean(args['strict-orphans'])

const SITES = {
  'scandicommerce.no': { language: 'no', foreignVocabulary: /^\/(en|sv|da|de)(\/|$)|^\/(about|contact|work|blog|services|partners|why-shopify|shopify-tco-calculator|resources)(\/|$)/i },
  'scandicommerce.com': { language: 'en', foreignVocabulary: /^\/(no)(\/|$)|^\/(tjenester|kontakt|kundecaser|prosjekter|blogg|om-oss|partnere|hvorfor-shopify|shopify-tco-kalkulator|resources)(\/|$)/i },
}

const failures = []
const warnings = []
const info = []
const fail = (check, msg, ctx) => failures.push({ check, msg, ...(ctx ? { ctx } : {}) })
const warn = (check, msg, ctx) => warnings.push({ check, msg, ...(ctx ? { ctx } : {}) })

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
const cache = new Map()
/** Raw request with manual redirects. Uses node:http(s) so a real Host header can be sent when --base is used. */
function fetchRaw(url, { method = 'GET' } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const target = BASE ? new URL(`${BASE}${u.pathname}${u.search}`) : u
    const lib = target.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        method,
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        headers: {
          host: u.host,
          'x-forwarded-host': u.host,
          'x-forwarded-proto': u.protocol.replace(':', ''),
          'user-agent': 'scandicommerce-seo-verify/1.0 (+https://scandicommerce.no)',
          accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 60_000,
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const location = res.headers.location
          resolve({
            status: res.statusCode ?? 0,
            location: location ? new URL(location, url).toString() : null,
            headers: new Headers(Object.fromEntries(Object.entries(res.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v ?? '']))),
            body: res.statusCode >= 200 && res.statusCode < 300 ? Buffer.concat(chunks).toString('utf8') : '',
          })
        })
      }
    )
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', reject)
    req.end()
  })
}
async function get(url) {
  if (cache.has(url)) return cache.get(url)
  const p = fetchRaw(url).catch((e) => ({ status: 0, location: null, headers: new Headers(), body: '', error: String(e) }))
  cache.set(url, p)
  return p
}
/** Follow redirects manually; returns hops [{url,status,location}] and final response. */
/** Treat https://host and https://host/ as the same URL (Next emits the bare origin as canonical). */
function canon(u) {
  try {
    const x = new URL(u)
    return x.pathname === '/' && !x.search ? x.origin : u
  } catch {
    return u
  }
}
async function follow(url, max = 5) {
  const hops = []
  let current = url
  for (let i = 0; i <= max; i++) {
    const r = await get(current)
    hops.push({ url: current, status: r.status, location: r.location })
    if (r.status >= 300 && r.status < 400 && r.location) {
      current = r.location
      continue
    }
    return { hops, final: r, finalUrl: canon(current) }
  }
  return { hops, final: hops[hops.length - 1], finalUrl: current, chainTooLong: true }
}

// ---------------------------------------------------------------------------
// HTML parsing (regex based; the pages are server-rendered)
// ---------------------------------------------------------------------------
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
  return m ? decodeEntities(m[2] ?? m[3] ?? m[4] ?? '') : null
}
function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}
function parseHtml(html) {
  const head = html.split(/<\/head>/i)[0] ?? html
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0])
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0])
  const canonical = links.filter((l) => /rel\s*=\s*["']?canonical/i.test(l)).map((l) => attr(l, 'href'))
  const alternates = links
    .filter((l) => /rel\s*=\s*["']?alternate/i.test(l) && /hreflang/i.test(l))
    .map((l) => ({ hreflang: attr(l, 'hreflang'), href: attr(l, 'href') }))
  const meta = (n) => metas.filter((m) => new RegExp(`(name|property)\\s*=\\s*["']${n}["']`, 'i').test(m)).map((m) => attr(m, 'content'))
  const title = (head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '').trim()
  const jsonLd = [...html.matchAll(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => ({ href: attr(m[0], 'href'), crossLocale: /data-cross-locale/i.test(m[0]), tag: m[0] }))
  const switcherRegion = /data-language-switcher/i.test(html)
  return {
    canonical: canonical[0] ?? null,
    canonicalCount: canonical.length,
    alternates,
    robots: meta('robots')[0] ?? null,
    xRobots: null,
    description: meta('description')[0] ?? null,
    ogUrl: meta('og:url')[0] ?? null,
    ogImage: meta('og:image')[0] ?? null,
    title,
    jsonLd,
    anchors,
    switcherRegion,
    lang: html.match(/<html[^>]*\slang\s*=\s*["']([^"']+)["']/i)?.[1] ?? null,
  }
}
const isNoindex = (robots, xRobots) => /noindex/i.test(robots ?? '') || /noindex/i.test(xRobots ?? '')

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------
function loadInventory() {
  const spec = args.inventory ?? 'scripts/seo/inventory'
  const files = []
  for (const s of String(spec).split(',')) {
    if (existsSync(s) && statSync(s).isDirectory()) {
      for (const f of readdirSync(s)) if (f.endsWith('.csv')) files.push(path.join(s, f))
    } else if (existsSync(s)) files.push(s)
  }
  const urls = new Set()
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split(/\r?\n/).slice(1)
    for (const line of lines) {
      const first = line.split(',')[0]?.replace(/^"|"$/g, '').trim()
      if (first && /^https?:\/\//.test(first)) urls.add(first)
    }
  }
  return { files, urls: [...urls] }
}
function siteFor(origin) {
  return SITES[new URL(origin).host]
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------
async function checkSitemap(origin) {
  const url = `${origin}/sitemap.xml`
  const r = await get(url)
  if (r.status !== 200) return fail('sitemap', `sitemap.xml returned ${r.status}`, { url }), []
  const urlBlocks = [...r.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1])
  const entries = urlBlocks.map((b) => ({
    loc: decodeEntities(b.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ''),
    alternates: [...b.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((m) => ({ hreflang: m[1], href: decodeEntities(m[2]) })),
    lastmod: b.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null,
    hasPriority: /<priority>/.test(b),
    hasChangefreq: /<changefreq>/.test(b),
  }))
  if (!entries.length) fail('sitemap', 'sitemap.xml has no <url> entries', { url })
  const site = siteFor(origin)
  for (const e of entries) {
    if (!e.loc.startsWith(origin + '/') && e.loc !== origin) fail('sitemap.origin', `sitemap lists a URL from another origin`, { url: e.loc })
    if (e.hasPriority || e.hasChangefreq) fail('sitemap.fields', 'sitemap must not contain <priority>/<changefreq>', { url: e.loc })
    if (!e.lastmod) warn('sitemap.lastmod', 'missing <lastmod>', { url: e.loc })
    const p = new URL(e.loc).pathname
    if (p !== p.toLowerCase()) fail('locale.case', 'sitemap URL contains uppercase', { url: e.loc })
    if (p.length > 1 && p.endsWith('/')) fail('trailing-slash', 'sitemap URL has a trailing slash', { url: e.loc })
    if (site?.foreignVocabulary.test(p)) fail('locale.hygiene', 'sitemap URL uses another language’s vocabulary or a locale prefix that must not exist on this host', { url: e.loc })
    if (/^\/(merch|sitemap)(\/|$)/.test(p)) fail('noindex.sitemap', 'noindex page listed in sitemap', { url: e.loc })
  }
  info.push({ origin, sitemapUrls: entries.length })
  return entries
}

async function checkPage(url, { fromSitemap = false, origin }) {
  const { hops, final, finalUrl } = await follow(url)
  if (fromSitemap && hops.length > 1) fail('sitemap.redirect', `sitemap URL redirects (${hops.map((h) => h.status).join('→')})`, { url, finalUrl })
  if (final.status !== 200) {
    fail(fromSitemap ? 'sitemap.status' : 'page.status', `expected 200, got ${final.status}`, { url, finalUrl })
    return null
  }
  const page = parseHtml(final.body)
  page.xRobots = final.headers.get('x-robots-tag')
  page.url = finalUrl
  const p = new URL(finalUrl).pathname
  const shouldBeNoindex = /^\/(merch|sitemap)(\/|$)/.test(p)
  const noindex = isNoindex(page.robots, page.xRobots)

  if (shouldBeNoindex && !noindex) fail('noindex.coverage', 'must be noindex', { url: finalUrl })
  if (!shouldBeNoindex && noindex && fromSitemap) fail('noindex.sitemap', 'indexable sitemap URL is noindex', { url: finalUrl })

  // canonical
  if (!page.canonical) fail('canonical.missing', 'no <link rel=canonical>', { url: finalUrl })
  else {
    if (page.canonicalCount > 1) fail('canonical.duplicate', `${page.canonicalCount} canonical tags`, { url: finalUrl })
    if (!noindex && canon(page.canonical) !== finalUrl) fail('canonical.self', `canonical ≠ URL (${page.canonical})`, { url: finalUrl })
    if (!page.canonical.startsWith(origin)) fail('canonical.origin', `canonical points to another origin (${page.canonical})`, { url: finalUrl })
    if (page.ogUrl && page.ogUrl !== page.canonical) fail('og.url', `og:url (${page.ogUrl}) ≠ canonical`, { url: finalUrl })
  }
  // metadata
  if (!page.title) fail('meta.title', 'empty <title>', { url: finalUrl })
  else if (page.title.length > 70) warn('meta.title.length', `title is ${page.title.length} chars`, { url: finalUrl, title: page.title })
  if (!noindex) {
    if (!page.description) fail('meta.description', 'missing meta description', { url: finalUrl })
    else if (page.description.length > 160) fail('meta.description.length', `description is ${page.description.length} chars (>155)`, { url: finalUrl })
    if (!page.ogImage) fail('og.image', 'missing og:image', { url: finalUrl })
  }
  // hreflang keys
  for (const a of page.alternates) {
    if (!/^(x-default|nb-NO|en|sv-SE|da-DK|de-DE)$/.test(a.hreflang ?? '')) fail('hreflang.code', `unexpected hreflang code ${a.hreflang}`, { url: finalUrl })
  }
  if (noindex && page.alternates.length) fail('hreflang.noindex', 'noindex page emits hreflang', { url: finalUrl })
  // structured data
  let orgSeen = false
  for (const raw of page.jsonLd) {
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      fail('jsonld.parse', 'JSON-LD does not parse', { url: finalUrl })
      continue
    }
    const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed]
    for (const n of nodes) {
      const type = Array.isArray(n['@type']) ? n['@type'] : [n['@type']]
      if (type.includes('Organization') && typeof n['@id'] === 'string' && n['@id'].endsWith('#organization')) {
        orgSeen = true
        if (n.url !== origin) fail('jsonld.organization.url', `Organization.url (${n.url}) ≠ serving origin`, { url: finalUrl })
      }
    }
  }
  if (!noindex && !orgSeen) fail('jsonld.organization', 'no Organization node', { url: finalUrl })
  // html lang
  const expectedLang = siteFor(origin)?.language === 'no' ? /^nb/ : /^(en|sv|da|de)/
  if (page.lang && !expectedLang.test(page.lang)) fail('html.lang', `<html lang="${page.lang}"> does not match the host`, { url: finalUrl })
  return page
}

function checkHreflangReciprocity(pages) {
  const byUrl = new Map(pages.filter(Boolean).map((p) => [p.url, p]))
  for (const p of pages.filter(Boolean)) {
    if (!p.alternates.length) continue
    const set = new Set(p.alternates.map((a) => a.href))
    if (!set.has(p.url) && !set.has(p.url + '/')) fail('hreflang.self', 'cluster does not include the page itself', { url: p.url })
    const xd = p.alternates.find((a) => a.hreflang === 'x-default')
    if (xd && !/scandicommerce\.com\//.test(xd.href + '/')) fail('hreflang.xdefault', 'x-default must be the English page on .com', { url: p.url, xdefault: xd.href })
    for (const a of p.alternates) {
      if (a.hreflang === 'x-default' || a.href === p.url) continue
      const target = byUrl.get(a.href)
      if (!target) {
        // fetched lazily below
        continue
      }
      const back = new Set(target.alternates.map((x) => x.href))
      if (!back.has(p.url) && !back.has(p.url + '/')) fail('hreflang.reciprocal', `${a.href} does not link back`, { url: p.url })
      for (const h of set) if (!back.has(h)) fail('hreflang.symmetric', `cluster differs from ${a.href}`, { url: p.url })
    }
  }
}

async function checkInventory(origin, urls) {
  const host = new URL(origin).host
  const mine = urls.filter((u) => {
    const h = new URL(u).host
    return h === host || h === `www.${host}`
  })
  let ok = 0
  for (const u of mine) {
    if (BASE && /^\/(merch|products)\//.test(new URL(u).pathname)) continue // Shopify products need store credentials; not testable locally
    const isWww = new URL(u).host.startsWith('www.')
    if (isWww && !EXPECT_APEX) continue // host flip not enforced yet
    const { hops, final, finalUrl, chainTooLong } = await follow(u)
    const redirects = hops.filter((h) => h.status >= 300 && h.status < 400)
    if (chainTooLong || final.status !== 200) fail('inventory.status', `ends in ${final.status}`, { url: u, finalUrl, hops: hops.map((h) => `${h.status} ${h.url}`) })
    else if (redirects.length > 1) fail('inventory.chain', `${redirects.length} redirect hops`, { url: u, hops: hops.map((h) => `${h.status} ${h.url}`) })
    else if (redirects.length === 1 && ![301, 308].includes(redirects[0].status)) fail('inventory.redirect-type', `redirect is ${redirects[0].status}, expected 301/308`, { url: u })
    else if (redirects.length === 1 && !finalUrl.startsWith('https://scandicommerce.')) fail('inventory.redirect-target', `redirects off-site to ${finalUrl}`, { url: u })
    else if (redirects.length === 1 && new URL(finalUrl).pathname === '/' && new URL(u).pathname !== '/' && !/^\/(pages\/(gdpr|apa-nzpa|canadian-laws-compliance|us-laws-compliance))/.test(new URL(u).pathname)) warn('inventory.homepage-fallback', 'redirects to the homepage', { url: u, finalUrl })
    else ok++
  }
  info.push({ origin, inventoryChecked: mine.length, inventoryOk: ok })
}

async function checkHostNormalization(origin) {
  if (!EXPECT_APEX) return
  const u = new URL(origin)
  const probePath = siteFor(origin)?.language === 'no' ? '/om-oss' : '/about'
  const variants = [`https://www.${u.host}${probePath}`]
  if (!BASE) variants.push(`http://${u.host}/`, `http://www.${u.host}${probePath}`) // TLS redirect is Vercel's, not testable locally
  for (const variant of variants) {
    const r = await get(variant)
    if (!(r.status === 301 || r.status === 308)) fail('host.normalize', `expected 301/308, got ${r.status}`, { url: variant })
    else if (!r.location || !r.location.startsWith(origin + '/') && r.location !== origin + '/' && r.location !== origin) fail('host.normalize', `redirects to ${r.location}`, { url: variant })
    else {
      const expectedPath = new URL(variant).pathname
      if (new URL(r.location).pathname !== expectedPath) fail('host.normalize.path', `path not preserved (${r.location})`, { url: variant })
    }
  }
}

async function checkRobots(origin) {
  const r = await get(`${origin}/robots.txt`)
  if (r.status !== 200) return fail('robots', `robots.txt ${r.status}`, { url: `${origin}/robots.txt` })
  if (!r.body.includes(`Sitemap: ${origin}/sitemap.xml`)) fail('robots.sitemap', 'robots.txt does not list this origin’s sitemap', { url: `${origin}/robots.txt`, body: r.body.slice(0, 300) })
  if (/Disallow:\s*\/\s*$/m.test(r.body)) fail('robots.blocked', 'robots.txt disallows everything on production', { url: `${origin}/robots.txt` })
}

async function checkPreview(previewUrl) {
  const r = await get(previewUrl)
  const x = r.headers.get('x-robots-tag') ?? ''
  if (!/noindex/i.test(x)) fail('preview.noindex', `preview deployment missing X-Robots-Tag: noindex (got "${x}")`, { url: previewUrl })
  const rob = await get(new URL('/robots.txt', previewUrl).toString())
  if (!/Disallow:\s*\/\s*$/m.test(rob.body)) fail('preview.robots', 'preview robots.txt does not disallow all', { url: previewUrl })
}

async function crawlInternalLinks(origin, seedPages) {
  const site = siteFor(origin)
  const otherHosts = Object.keys(SITES).filter((h) => h !== new URL(origin).host)
  const queue = [{ url: origin, depth: 0 }]
  const seen = new Set([origin])
  const inbound = new Map()
  let fetched = 0
  const pagesByUrl = new Map(seedPages.filter(Boolean).map((p) => [p.url, p]))
  while (queue.length && fetched < MAX_PAGES) {
    const { url, depth } = queue.shift()
    let page = pagesByUrl.get(url)
    if (!page) {
      const { final, finalUrl, hops } = await follow(url)
      fetched++
      if (final.status !== 200) continue
      if (new URL(finalUrl).origin !== origin) continue // moved to the other site; reported by links.redirect
      page = parseHtml(final.body)
      page.url = finalUrl
      pagesByUrl.set(finalUrl, page)
    }
    for (const a of page.anchors) {
      if (!a.href || a.href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(a.href)) continue
      let abs
      try {
        abs = new URL(a.href, page.url)
      } catch {
        continue
      }
      abs.hash = ''
      const isInternal = abs.origin === origin
      const isSister = otherHosts.includes(abs.host) || otherHosts.some((h) => abs.host === `www.${h}`)
      if (isSister) {
        if (!a.crossLocale) fail('links.cross-origin', `link to the other domain without data-cross-locale (${abs.href})`, { url: page.url })
        continue
      }
      if (!isInternal) continue
      if (a.href.startsWith('http') && !a.crossLocale && !/^https:\/\/scandicommerce\.(no|com)/.test(a.href)) fail('links.absolute', `absolute internal link ${a.href}`, { url: page.url })
      const p = abs.pathname
      if (p !== p.toLowerCase()) fail('links.case', `internal link with uppercase ${p}`, { url: page.url })
      if (site.foreignVocabulary.test(p)) fail('links.mixed-language', `internal link uses another language’s path (${p})`, { url: page.url })
      const key = abs.toString()
      inbound.set(key, (inbound.get(key) ?? 0) + (key === page.url ? 0 : 1))
      if (!seen.has(key) && depth < CRAWL_DEPTH && !/^\/(merch|api|studio)(\/|$)/.test(p)) {
        seen.add(key)
        queue.push({ url: key, depth: depth + 1 })
      }
    }
  }
  // every internal link must resolve 200 without redirect
  let checked = 0
  for (const target of seen) {
    if (target === origin) continue
    if (checked++ > MAX_PAGES) break
    const r = await get(target)
    if (r.status >= 300 && r.status < 400) fail('links.redirect', `internal link redirects (${r.status} → ${r.location})`, { url: target })
    else if (r.status !== 200) fail('links.status', `internal link returns ${r.status}`, { url: target })
  }
  // orphan detection (SITE-SEO-ARCHITECTURE §8): indexable sitemap pages with < 3 inbound links
  for (const p of seedPages.filter(Boolean)) {
    if (isNoindex(p.robots, p.xRobots)) continue
    const n = inbound.get(p.url) ?? 0
    if (n < 3) (STRICT_ORPHANS ? fail : warn)('links.orphan', `${n} inbound internal links (need ≥3)`, { url: p.url })
  }
  info.push({ origin, crawled: fetched, internalUrls: seen.size })
}

// ---------------------------------------------------------------------------
async function main() {
  const inventory = loadInventory()
  info.push({ inventoryFiles: inventory.files, inventoryUrls: inventory.urls.length, base: BASE, expectApex: EXPECT_APEX })
  for (const origin of ORIGINS) {
    console.log(`\n▶ ${origin}${BASE ? ` (via ${BASE})` : ''}`)
    await checkRobots(origin)
    const entries = await checkSitemap(origin)
    const pages = []
    for (const e of entries) pages.push(await checkPage(e.loc, { fromSitemap: true, origin }))
    // sitemap alternates must match page alternates
    const byUrl = new Map(pages.filter(Boolean).map((p) => [p.url, p]))
    for (const e of entries) {
      const p = byUrl.get(e.loc)
      if (!p) continue
      const a = new Set(e.alternates.map((x) => `${x.hreflang}|${x.href}`))
      const b = new Set(p.alternates.map((x) => `${x.hreflang}|${x.href}`))
      if (a.size !== b.size || [...a].some((x) => !b.has(x))) fail('hreflang.sitemap', 'sitemap alternates differ from page alternates', { url: e.loc })
    }
    // fetch alternates on the other origin for reciprocity
    for (const p of pages.filter(Boolean)) {
      for (const a of p.alternates) {
        if (a.hreflang === 'x-default' || byUrl.has(a.href)) continue
        const otherOrigin = new URL(a.href).origin
        const other = await checkPage(a.href, { origin: otherOrigin })
        if (other) byUrl.set(other.url, other)
        else fail('hreflang.target', `alternate ${a.href} is not a 200 page`, { url: p.url })
      }
    }
    checkHreflangReciprocity([...byUrl.values()])
    await checkInventory(origin, inventory.urls)
    await checkHostNormalization(origin)
    await crawlInternalLinks(origin, pages)
    // noindex pages that must exist
    for (const p of ['/merch', '/sitemap']) {
      const r = await follow(`${origin}${p}`)
      if (r.final.status === 200) {
        const pg = parseHtml(r.final.body)
        if (!isNoindex(pg.robots, r.final.headers.get('x-robots-tag'))) fail('noindex.coverage', `${p} is indexable`, { url: `${origin}${p}` })
      } else warn('noindex.coverage', `${p} returned ${r.final.status}`, { url: `${origin}${p}` })
    }
  }
  if (args['preview-url']) await checkPreview(String(args['preview-url']))

  // ---- report
  const byCheck = {}
  for (const f of failures) (byCheck[f.check] ??= []).push(f)
  console.log('\n══════════ SEO VERIFY ══════════')
  for (const i of info) console.log('ℹ', JSON.stringify(i))
  for (const [check, list] of Object.entries(byCheck)) {
    console.log(`\n✖ ${check} (${list.length})`)
    for (const f of list.slice(0, 25)) console.log(`   ${f.msg}${f.ctx?.url ? `  ← ${f.ctx.url}` : ''}${f.ctx?.hops ? `\n      ${f.ctx.hops.join(' → ')}` : ''}`)
    if (list.length > 25) console.log(`   … ${list.length - 25} more`)
  }
  const wByCheck = {}
  for (const w of warnings) (wByCheck[w.check] ??= []).push(w)
  for (const [check, list] of Object.entries(wByCheck)) {
    console.log(`\n⚠ ${check} (${list.length})`)
    for (const w of list.slice(0, 15)) console.log(`   ${w.msg}${w.ctx?.url ? `  ← ${w.ctx.url}` : ''}`)
    if (list.length > 15) console.log(`   … ${list.length - 15} more`)
  }
  console.log(`\n${failures.length} failure(s), ${warnings.length} warning(s)`)
  if (args.json) writeFileSync(String(args.json), JSON.stringify({ failures, warnings, info }, null, 2))
  process.exit(failures.length ? 1 : 0)
}
main().catch((e) => {
  console.error(e)
  process.exit(2)
})
