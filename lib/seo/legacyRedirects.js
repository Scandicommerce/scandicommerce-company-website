// @ts-check
/**
 * Build-time redirect map for `next.config.js` (TECHNICAL-SEO-SPEC Task 4).
 *
 * Three sources, in priority order:
 *   1. Slug migration (url-plan.json): every published document whose public
 *      URL changed gets a host-scoped 308 from its old URL to its new URL, on
 *      its own origin; and on the OTHER origin the old URL maps to the sibling
 *      translation (or the section index) so nothing ever chains.
 *   2. Legacy Shopify storefront paths (/pages/*, /products/*, /collections/*,
 *      /blogs/*) — per origin, straight to the final page.
 *   3. A few hand-written duplicates (/prosjekter → /kundecaser, …).
 *
 * All entries are `permanent: true` (308). Matching is case-insensitive.
 * `.no` entries use `missing host=scandicommerce.com` so they also apply on
 * localhost and preview deployments; `.com` entries use `has host`.
 */
const plan = require('./url-plan.json')

const COM_HOST = 'scandicommerce.com'
const NO_HOST = 'scandicommerce.no'
const ORIGIN = { no: `https://${NO_HOST}`, com: `https://${COM_HOST}` }
const LANG_PREFIXED = new Set(['sv', 'da', 'de'])

/** @param {string} p */
function trim(p) {
  return p.replace(/^\/+|\/+$/g, '')
}

/** @param {string} lang @param {string} path */
function pub(lang, path) {
  const p = trim(path)
  if (LANG_PREFIXED.has(lang)) return p ? `/${lang}/${p}` : `/${lang}`
  return p ? `/${p}` : '/'
}

/** @param {string} lang */
function siteOf(lang) {
  return lang === 'no' ? 'no' : 'com'
}

/**
 * Production hosts (apex or www) get an ABSOLUTE destination on the apex origin, so a
 * legacy path requested on the www host is fixed in one hop. Every other host
 * (localhost, *.vercel.app) gets the relative .no rule set.
 * @param {'no'|'com'} site
 * @returns {Array<Partial<Redirect>>} one entry per variant to emit
 */
function hostVariants(site) {
  const hostRe = site === 'com' ? `(www\\.)?${COM_HOST.replace('.', '\\.')}` : `(www\\.)?${NO_HOST.replace('.', '\\.')}`
  const variants = [{ has: [{ type: 'host', value: hostRe }], absolute: ORIGIN[site] }]
  if (site === 'no') {
    variants.push({
      missing: [{ type: 'host', value: `(www\\.)?(${NO_HOST.replace('.', '\\.')}|${COM_HOST.replace('.', '\\.')})` }],
      absolute: '',
    })
  }
  return variants
}

/** @param {string} lang @param {string} path @param {string} [docType] */
function sectionParent(lang, path, docType) {
  const first = trim(path).split('/')[0] || ''
  const no = lang === 'no'
  if (docType === 'caseStudy') return no ? 'kundecaser' : 'work'
  if (docType === 'post' || docType === 'blogPost') return no ? 'blogg' : 'blog'
  if (['blogg', 'blog', 'resources'].includes(first)) return no ? 'blogg' : 'blog'
  if (['kundecaser', 'prosjekter', 'work'].includes(first)) return no ? 'kundecaser' : 'work'
  if (['tjenester', 'services'].includes(first)) return no ? 'tjenester/alle-pakker' : 'services/all-packages'
  return ''
}

/**
 * @typedef {{source: string, destination: string, permanent: boolean, has?: any[], missing?: any[]}} Redirect
 */

/** @returns {Redirect[]} */
function slugMigrationRedirects() {
  /** @type {Redirect[]} */
  const out = []
  /** @type {Set<string>} */
  const seen = new Set()
  const push = (/** @type {'no'|'com'} */ site, /** @type {string} */ source, /** @type {string} */ destination) => {
    const src = source.toLowerCase()
    if (!src || src === destination || src === '/') return
    const k = `${site}:${src}`
    if (seen.has(k)) return
    seen.add(k)
    for (const v of hostVariants(site)) {
      const { absolute, ...cond } = v
      out.push({ source: src, destination: `${absolute}${destination}`, permanent: true, ...cond })
    }
  }
  const byGroup = plan.clusters

  for (const doc of plan.documents) {
    if (!doc.language) continue
    const lang = doc.language
    const site = siteOf(lang)
    const oldPath = doc.oldPublicPath
    const newPath = doc.newPublicPath || pub(lang, doc.newPath)
    if (oldPath !== newPath) push(site, oldPath, newPath)

    // Same old path requested on the other origin → sibling in that origin's default language.
    const otherSite = site === 'no' ? 'com' : 'no'
    const otherLang = otherSite === 'no' ? 'no' : 'en'
    const cluster = doc.group ? byGroup[doc.group] || {} : {}
    const sibling = cluster[otherLang]
    const strippedOld = trim(oldPath).replace(/^(sv|da|de)(\/|$)/, '')
    if (strippedOld && (lang === 'no' || lang === 'en')) {
      const targetOld = sibling != null ? pub(otherLang, sibling) : pub(otherLang, sectionParent(otherLang, strippedOld, doc.type))
      if (`/${strippedOld}` !== targetOld) push(otherSite, `/${strippedOld}`, targetOld)
      // …and the same for the NEW path shape (Norwegian path on .com and vice versa)
      const strippedNew = trim(newPath)
      const targetNew = sibling != null ? pub(otherLang, sibling) : pub(otherLang, sectionParent(otherLang, strippedNew, doc.type))
      if (strippedNew && `/${strippedNew}` !== targetNew) push(otherSite, `/${strippedNew}`, targetNew)
    }
  }
  return out
}

/**
 * Legacy Shopify-storefront URL shapes. Keys are the old path; values are
 * [Norwegian target, English target] (paths without locale prefix).
 * @type {Record<string, [string, string]>}
 */
const SHOPIFY_LEGACY = {
  '/pages/about-us': ['om-oss', 'about'],
  '/pages/apa-nzpa': ['om-oss', 'about'],
  '/pages/canadian-laws-compliance': ['om-oss', 'about'],
  '/pages/gdpr': ['om-oss', 'about'],
  '/pages/us-laws-compliance': ['om-oss', 'about'],
  '/pages/contact': ['kontakt', 'contact'],
  '/pages/partners': ['partnere', 'partners'],
  '/pages/projects': ['kundecaser', 'work'],
  '/pages/services': ['tjenester/alle-pakker', 'services/all-packages'],
  '/pages/articles': ['blogg', 'blog'],
  '/pages/why-shopify': ['hvorfor-shopify', 'why-shopify'],
  '/pages/shopify-x-ai': ['shopify/shopify-x-ki', 'shopify/shopify-x-ai'],
  '/pages/shopify-x-pim': ['shopify-pim', 'shopify-pim'],
  '/pages/shopify-tco-calculator': ['shopify-tco-kalkulator', 'shopify-tco-calculator'],
  '/pages/shopify-pos': ['shopify/shopify-pos', 'shopify/shopify-pos'],
  '/pages/pos-venteliste': ['tjenester/shopify-pos', 'services/shopify-pos'],
  '/pages/shopify': ['tjenester/utvikling', 'services/shopify-development'],
  '/pages/shopify-migration': ['tjenester/shopify-migrering', 'services/migrate'],
  '/pages/vipps-express': ['shopify/vipps-hurtigkasse', 'shopify/vipps-hurtigkasse'],
  '/collections/frontpage': ['tjenester/alle-pakker', 'services/all-packages'],
  '/collections/packages': ['tjenester/alle-pakker', 'services/all-packages'],
  '/collections/all': ['merch', 'merch'],
  '/collections/merch': ['merch', 'merch'],
  '/products/foundation': ['tjenester/alle-pakker', 'services/all-packages'],
  '/tjenester/alle-pakker/foundation': ['tjenester/alle-pakker', 'services/all-packages'],
  '/services/all-packages/foundation': ['tjenester/alle-pakker', 'services/all-packages'],
  '/products/growth': ['tjenester/alle-pakker/growth', 'services/all-packages/growth'],
  '/products/premium': ['tjenester/alle-pakker/premium', 'services/all-packages/premium'],
  '/products/enterprise': ['tjenester/alle-pakker/enterprise', 'services/all-packages/enterprise'],
  '/blogs/news': ['blogg', 'blog'],
  '/blogs/cro': ['blogg', 'blog'],
  '/blogs/how-we-work': ['blogg', 'blog'],
  '/blogs/e-commerce-strategy-growth': ['blogg', 'blog'],
  '/blogs/shopify-optimization-performance': ['blogg', 'blog'],
  '/blogs/shopify-optimization-performance/shopify-plus-vs-standard-when-to-upgrade-your-store-2025-guide': [
    'blogg/shopify-plus-vs-standard',
    'blog/shopify-plus-vs-standard-when-to-upgrade-your-store-2025-guide',
  ],
  '/blogs/shopify-optimization-performance/shopify-functions-vs-apps-why-merchants-are-making-the-wrong-choice-2025': [
    'blogg/shopify-functions-vs-apps',
    'blog/shopify-functions-vs-apps-why-merchants-are-making-the-wrong-choice-2025',
  ],
  '/blogs/cro/5-checkout-optimization-tricks-that-boost-your-sales': [
    'blogg/5-checkout-optimization-tricks',
    'blog/5-checkout-optimization-tricks-that-boost-your-sales',
  ],
  '/blogs/e-commerce-strategy-growth/headed-vs-headless-commerce-why-most-businesses-should-think-twice-about-going-headless': [
    'blogg/headed-vs-headless-commerce',
    'blog/headed-vs-headless-commerce-why-most-businesses-should-think-twice-about-going-headless',
  ],
  '/blogs/how-we-work/fra-24nettbutikk-og-wix-til-effektiv-b2b-drift-pa-shopify': [
    'blogg/fra-24nettbutikk-til-effektiv-b2b-drift-pa-shopify',
    'blog/from-24nettbutikk-to-efficient-b2b-operations-on-shopify',
  ],
  '/blogs/how-we-work/level-up-fra-hobby-til-utfordrer': [
    'blogg/level-up-fra-hobby-til-utfordrer',
    'blog/level-up-from-hobby-to-challenger',
  ],
  '/blogs/how-we-work/slik-jobber-vi-med-shopify-plus-kunder': [
    'blogg/slik-jobber-vi-med-shopify-plus-kunder',
    'blog/how-we-work-with-shopify-plus-clients',
  ],
  '/cdn/shop/:path*': ['', ''],
  // Duplicate page pairs (TECHNICAL-SEO-SPEC §12.4)
  '/prosjekter': ['kundecaser', 'work'],
  '/blog-page': ['blogg', 'blog'],
  '/book-call': ['kontakt', 'contact'],
  '/get-started': ['tjenester/alle-pakker', 'services/all-packages'],
  '/read': ['blogg', 'blog'],
  '/arbejde': ['kundecaser', 'work'],
}

/** Old merch product handles (Shopify /products/<handle> → /merch/<handle>). */
const MERCH_HANDLES = [
  'premium-unisex-pullover-hoodie-justhoods-jh001',
  'organic-unisex-crewneck-sweatshirt',
  'polycotton-unisex-crewneck-t-shirt',
  'premium-unisex-crewneck-t-shirt-bella-canvas-3001',
  'classic-baby-long-sleeve-bodysuit',
  'classic-unisex-crewneck-t-shirt-gildan-64000',
  'premium-unisex-pullover-hoodie-laneseven-ls13001',
  'classic-baby-short-sleeve-bodysuit',
  'organic-baby-short-sleeve-bodysuit-sols-organic-bambino-01192',
  'premium-unisex-v-neck-t-shirt',
  'white-17oz-stainless-steel-water-bottle',
  'flexi-case',
  'classic-unisex-pullover-hoodie-gildan-18500',
  'heavyweight-unisex-crewneck-t-shirt-gildan-5000',
  'white-15oz-stainless-steel-travel-mug',
  'classic-unisex-crewneck-sweatshirt-gildan-18000',
  '11oz-ceramic-mug',
  'eco-conscious-unisex-microfleece-zip-vest-sustainably-crafted-from-100-recycled-polyester-in-vibrant-hues',
]

/** @returns {Redirect[]} */
function shopifyLegacyRedirects() {
  /** @type {Redirect[]} */
  const out = []
  for (const [source, [noTarget, enTarget]] of Object.entries(SHOPIFY_LEGACY)) {
    for (const v of hostVariants('com')) {
      const { absolute, ...cond } = v
      out.push({ source, destination: `${absolute}${pub('en', enTarget)}`, permanent: true, ...cond })
    }
    for (const v of hostVariants('no')) {
      const { absolute, ...cond } = v
      out.push({ source, destination: `${absolute}${pub('no', noTarget)}`, permanent: true, ...cond })
    }
  }
  for (const handle of MERCH_HANDLES) {
    out.push({ source: `/products/${handle}`, destination: `/merch/${handle}`, permanent: true })
  }
  return out
}

/** @returns {Redirect[]} */
function legacyRedirects() {
  return [...slugMigrationRedirects(), ...shopifyLegacyRedirects()]
}

module.exports = { legacyRedirects, SHOPIFY_LEGACY, MERCH_HANDLES }
