#!/usr/bin/env node
/**
 * Content ↔ URL health check driven by Sanity (SITE-SEO-ARCHITECTURE §13 note:
 * "use the Sanity MCP to ensure the website is functional with no 404s").
 *
 *   node scripts/seo-health-check.mjs [--base=http://localhost:3000] [--drafts] [--json=report.json]
 *
 * For every published, indexable document it computes the canonical URL the
 * frontend must serve, fetches it and asserts 200 + self-canonical. It also
 * reports taxonomy violations in slugs, missing SEO fields, translation
 * clusters with missing siblings, and documents with fewer than two related
 * pages (orphan candidates). Exit 1 on any 404 / canonical mismatch.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import http from 'node:http'
import https from 'node:https'

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true] }))
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fk1tt27l'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const BASE = args.base ? String(args.base).replace(/\/+$/, '') : null

const ORIGIN = { no: 'https://scandicommerce.no', com: 'https://scandicommerce.com' }
const LANGS = ['en', 'no', 'sv', 'da', 'de']
const COUNTRY = { se: 'sv', dk: 'da', de: 'de' }
const BLOG = { no: 'blogg', en: 'blog', sv: 'blog', da: 'blog', de: 'blog' }
const WORK = { no: 'kundecaser', en: 'work', sv: 'work', da: 'work', de: 'work' }
const TYPES = ['landingPage','aboutPage','contactPage','workPage','partnersPage','blogPage','allPackagesPage','packageDetailPage','migratePage','shopifyPosPage','shopifyPosInfoPage','shopifyXAiPage','shopifyXPimPage','whyShopifyPage','shopifyPlatformPage','vippsHurtigkassePage','shopifyTcoCalculatorPage','shopifyDevelopmentPage','post','blogPost','caseStudy','author','legalPage','pillarPage','integrationPage','migrationPage','merchPage']

const strip = (slug) => { const s = (slug ?? '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean); while (s.length && (LANGS.includes(s[0]) || s[0] in COUNTRY)) s.shift(); return s.join('/') }
function docPath(d) {
  const lang = d.language ?? 'en'
  const s = strip(d.slug)
  const last = s.split('/').pop() ?? s
  if (d._type === 'landingPage' || d.isHomepage || s === '' || s === 'home') return ''
  if (d._type === 'post' || d._type === 'blogPost') return `${BLOG[lang]}/${last}`
  if (d._type === 'caseStudy') return `${WORK[lang]}/${last}`
  if (d._type === 'author') return `team/${s}`
  if (d._type === 'legalPage') return `legal/${s}`
  return s
}
function publicUrl(lang, p) {
  const origin = lang === 'no' ? ORIGIN.no : ORIGIN.com
  const prefixed = ['sv', 'da', 'de'].includes(lang)
  const path = prefixed ? (p ? `/${lang}/${p}` : `/${lang}`) : p ? `/${p}` : ''
  return `${origin}${path}`
}
async function groq(query) {
  const url = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Sanity ${r.status}`)
  return (await r.json()).result
}
/** Request with a real Host header (node:http so --base can spoof the production host). */
function head(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const target = BASE ? new URL(`${BASE}${u.pathname}${u.search}`) : u
    const lib = target.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        method: 'GET',
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        headers: { host: u.host, 'x-forwarded-host': u.host, 'x-forwarded-proto': 'https', 'user-agent': 'scandicommerce-seo-health/1.0' },
        timeout: 60_000,
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const body = res.statusCode === 200 ? Buffer.concat(chunks).toString('utf8') : ''
          const canonical = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? body.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ?? null
          const noindex = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(body)
          resolve({ status: res.statusCode ?? 0, location: res.headers.location ?? null, canonical, noindex })
        })
      }
    )
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', reject)
    req.end()
  })
}

/** URL plan (lib/seo/url-plan.json): old public path → new path, so a pending slug rename is reported as info, not error. */
const plan = existsSync('lib/seo/url-plan.json') ? JSON.parse(readFileSync('lib/seo/url-plan.json', 'utf8')) : { documents: [] }
const legacyToNew = new Map()
for (const d of plan.documents) {
  if (d.oldSlug === d.newSlug) continue
  const langs = d.language ? [d.language] : ['no', 'en']
  for (const lang of langs) {
    legacyToNew.set(`${lang}:${strip(d.oldPublicPath).toLowerCase()}`, d.newPath)
    legacyToNew.set(`${lang}:${docPath({ _type: d.type, slug: d.oldSlug, language: lang }).toLowerCase()}`, d.newPath)
  }
}
function expectedPath(d, lang) {
  const p = docPath({ ...d, language: lang })
  const renamed = legacyToNew.get(`${lang}:${p.toLowerCase()}`)
  return { path: renamed ?? p, pendingRename: Boolean(renamed) }
}

const issues = []
const push = (level, check, msg, ctx) => issues.push({ level, check, msg, ...ctx })

const docs = await groq(`*[_type in ${JSON.stringify(TYPES)} && defined(slug.current) && !(_id in path("drafts.**"))]{
  _id, _type, language, "slug": slug.current, "isHomepage": coalesce(isHomepage,false), _updatedAt,
  "noIndex": coalesce(seoExtended.noIndex, false),
  "canonicalOverride": seoExtended.canonical,
  "metaTitle": coalesce(seoExtended.metaTitle, seo.metaTitle, pageTitle, title, name),
  "metaDescription": coalesce(seoExtended.metaDescription, seo.metaDescription, excerpt, description),
  "relatedCount": count(coalesce(relatedPages, [])),
  "group": *[_type == "translation.metadata" && references(^._id)][0]._id,
  "groupMembers": *[_type == "translation.metadata" && references(^._id)][0].translations[]{ _key, "published": defined(value->_id) }
}`)
console.log(`${docs.length} published documents`)

let fetched = 0
for (const d of docs) {
  // taxonomy
  const s = d.slug ?? ''
  if (s !== '/' && (/[A-Z_\s]/.test(s) || /^(en|no|sv|da|de|se|dk)\//.test(s))) {
    const planned = plan.documents.find((x) => x.id === d._id && x.oldSlug === s && x.newSlug !== s)
    push(planned ? 'warn' : 'error', 'slug.taxonomy', `slug "${s}" violates lowercase/hyphen/no-prefix rules${planned ? ` (rename to "${planned.newSlug}" drafted)` : ''}`, { id: d._id, type: d._type })
  }
  if (s.split('/').length > 3) push('error', 'slug.depth', `slug "${s}" has more than 3 segments`, { id: d._id })
  // seo fields
  if (!d.metaTitle) push('warn', 'seo.title', 'no title', { id: d._id, type: d._type, slug: s })
  else if (d.metaTitle.length > 60 && !/scandicommerce/i.test(d.metaTitle)) push('warn', 'seo.title.length', `title ${d.metaTitle.length} chars`, { id: d._id, slug: s })
  if (!d.metaDescription) push('warn', 'seo.description', 'no meta description', { id: d._id, type: d._type, slug: s })
  else if (d.metaDescription.length > 155) push('warn', 'seo.description.length', `description ${d.metaDescription.length} chars`, { id: d._id, slug: s })
  if (['pillarPage', 'integrationPage', 'migrationPage'].includes(d._type) && d.relatedCount < 2) push('error', 'links.related', `${d.relatedCount} related pages (need ≥2)`, { id: d._id, slug: s })
  else if (!['author', 'legalPage', 'merchPage', 'landingPage'].includes(d._type) && d.relatedCount < 2) push('warn', 'links.related', `${d.relatedCount} related pages (need ≥2)`, { id: d._id, type: d._type, slug: s })
  // translation clusters with unpublished siblings
  for (const m of d.groupMembers ?? []) if (m && m.published === false) push('info', 'i18n.unpublished-sibling', `sibling ${m._key} is a draft`, { id: d._id, slug: s })
  // live check
  if (d.noIndex || d._type === 'merchPage') continue
  const langs = d.language ? [d.language] : ['no', 'en']
  for (const lang of langs) {
    const { path, pendingRename } = expectedPath(d, lang)
    if (pendingRename) push('info', 'slug.rename-pending', `slug rename to "${path}" is drafted but not published`, { id: d._id, slug: s })
    const url = publicUrl(lang, path)
    const r = await head(url)
    fetched++
    const canonical = r.canonical && r.canonical.replace(/\/$/, '')
    if (r.status !== 200) push('error', 'url.status', `${r.status}${r.location ? ` → ${r.location}` : ''}`, { id: d._id, type: d._type, url })
    else if (canonical && canonical !== url.replace(/\/$/, '') && !d.canonicalOverride) push('error', 'url.canonical', `canonical ${r.canonical}`, { id: d._id, url })
    else if (r.noindex) push('warn', 'url.noindex', 'page is noindex', { id: d._id, url })
  }
}

const errors = issues.filter((i) => i.level === 'error')
const warns = issues.filter((i) => i.level === 'warn')
const infos = issues.filter((i) => i.level === 'info')
const group = (list) => list.reduce((acc, i) => ((acc[i.check] ??= []).push(i), acc), {})
console.log(`\nchecked ${fetched} URLs`)
for (const [k, list] of Object.entries(group(errors))) { console.log(`\n✖ ${k} (${list.length})`); for (const i of list.slice(0, 30)) console.log(`   ${i.msg}  ← ${i.url ?? i.slug ?? i.id}`) }
for (const [k, list] of Object.entries(group(warns))) { console.log(`\n⚠ ${k} (${list.length})`); for (const i of list.slice(0, 15)) console.log(`   ${i.msg}  ← ${i.url ?? i.slug ?? i.id}`); if (list.length > 15) console.log(`   … ${list.length - 15} more`) }
console.log(`\n${errors.length} error(s), ${warns.length} warning(s), ${infos.length} info`)
if (args.json) writeFileSync(String(args.json), JSON.stringify({ errors, warns, infos }, null, 2))
process.exit(errors.length ? 1 : 0)
