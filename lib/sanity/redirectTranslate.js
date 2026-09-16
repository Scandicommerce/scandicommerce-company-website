// @ts-check
/**
 * Path translation via the Sanity CDN (plain JS so it can be required from
 * next.config.js and imported by the edge middleware).
 *
 * The static `lib/seo/url-plan.json` covers everything published at the time
 * of the URL migration; these lookups are the dynamic fallback for content
 * published afterwards.
 */

const LOCALE_IDS = ['en', 'no', 'sv', 'da', 'de']
const COUNTRY_SEGMENTS = /** @type {Record<string, boolean>} */ ({ se: true, dk: true, de: true })
const BLOG_INDEX = /** @type {Record<string, string>} */ ({ no: 'blogg', en: 'blog', sv: 'blog', da: 'blog', de: 'blog' })
const WORK_INDEX = /** @type {Record<string, string>} */ ({ no: 'kundecaser', en: 'work', sv: 'work', da: 'work', de: 'work' })

/**
 * Strip all leading locale-id and country-code segments from a Sanity slug.
 * @param {string} slug
 */
function stripLocalePrefix(slug) {
  const parts = slug.split('/')
  while (parts.length > 1 && (LOCALE_IDS.includes(parts[0]) || parts[0] in COUNTRY_SEGMENTS)) {
    parts.shift()
  }
  return parts.join('/')
}

/** @param {string} p */
function normalizePath(p) {
  return p.replace(/^\/+|\/+$/g, '')
}

/**
 * Public path (no locale prefix) for a document of `type` with `slug` in `lang`.
 * Mirrors `docPath` in lib/routes.ts.
 * @param {string} type @param {string} slug @param {string} lang
 */
function shapePath(type, slug, lang) {
  const s = stripLocalePrefix(normalizePath(slug))
  const last = s.split('/').pop() || s
  if (type === 'landingPage' || s === '' || s === 'home' || s === '/') return ''
  if (type === 'post' || type === 'blogPost') return `${BLOG_INDEX[lang] || 'blog'}/${last}`
  if (type === 'caseStudy') return `${WORK_INDEX[lang] || 'work'}/${last}`
  if (type === 'author') return `team/${s}`
  if (type === 'legalPage') return `legal/${s}`
  return s
}

const PAGE_TYPES_WITH_SLUG = [
  'aboutPage', 'contactPage', 'workPage', 'partnersPage', 'blogPage', 'allPackagesPage',
  'migratePage', 'shopifyPosPage', 'shopifyPosInfoPage', 'shopifyXAiPage', 'shopifyXPimPage',
  'whyShopifyPage', 'shopifyPlatformPage', 'vippsHurtigkassePage', 'shopifyTcoCalculatorPage',
  'shopifyDevelopmentPage', 'merchPage', 'packageDetailPage', 'landingPage',
  'pillarPage', 'integrationPage', 'migrationPage',
]
const ARTICLE_TYPES = ['post', 'blogPost', 'caseStudy']

const RESOLVE_PAGE_QUERY = `*[_type in $pageTypes && lower(slug.current) in [$path, $pathWithLocale] && (language == $language || !defined(language))] | order(defined(language) desc) [0]{ _type, _id }`
const RESOLVE_ARTICLE_QUERY = `*[_type in $types && lower(slug.current) == $slug && (language == $language || !defined(language))] | order(defined(language) desc) [0]{ _type, _id, "slug": slug.current }`
const TRANSLATED_QUERY = `*[_type == "translation.metadata" && references($docId)][0]{ "slug": translations[_key == $targetLang][0].value->slug.current, "type": translations[_key == $targetLang][0].value->_type }`

/**
 * @param {string} query
 * @param {Record<string, string | string[]>} params
 * @returns {Promise<unknown>}
 */
async function sanityCdnFetch(query, params) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) return null
  const search = new URLSearchParams({ query })
  for (const [key, value] of Object.entries(params)) search.set(`$${key}`, JSON.stringify(value))
  try {
    const res = await fetch(`https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?${search}`)
    if (!res.ok) return null
    /** @type {{ result?: unknown }} */
    const json = await res.json()
    return json.result ?? null
  } catch {
    return null
  }
}

/**
 * Resolve the document at `pathWithoutLang` in `lang` (any routable type).
 * Accepts current shapes (`blogg/<slug>`, `kundecaser/<slug>`) and the legacy
 * `resources/<slug>` shape. Case-insensitive.
 * @param {string} pathWithoutLang @param {string} lang
 * @returns {Promise<{ _id: string, _type: string, path: string } | null>}
 */
async function resolveDocument(pathWithoutLang, lang) {
  const path = normalizePath(pathWithoutLang).toLowerCase()
  if (!path) return null
  const segments = path.split('/')
  const first = segments[0]
  const last = segments[segments.length - 1]
  const articleFirst = [BLOG_INDEX[lang], WORK_INDEX[lang], 'resources'].filter(Boolean)
  if (segments.length === 2 && articleFirst.includes(first)) {
    const types = first === WORK_INDEX[lang] ? ['caseStudy'] : first === BLOG_INDEX[lang] ? ['post', 'blogPost'] : ARTICLE_TYPES
    const doc = /** @type {{ _id?: string, _type?: string, slug?: string } | null} */ (
      await sanityCdnFetch(RESOLVE_ARTICLE_QUERY, { types, slug: last, language: lang })
    )
    if (doc?._id && doc._type) return { _id: doc._id, _type: doc._type, path: shapePath(doc._type, doc.slug || last, lang) }
    return null
  }
  const page = /** @type {{ _id?: string, _type?: string } | null} */ (
    await sanityCdnFetch(RESOLVE_PAGE_QUERY, { path, pathWithLocale: `${lang}/${path}`, language: lang, pageTypes: PAGE_TYPES_WITH_SLUG })
  )
  if (page?._id && page._type) return { _id: page._id, _type: page._type, path }
  return null
}

/**
 * Path (no locale prefix) of the translation of `pathWithoutLang` from
 * `currentLang` into `targetLang`, or null when none is published.
 * @param {string} currentPath @param {string} currentLang @param {string} targetLang
 * @returns {Promise<string | null>}
 */
async function translatePath(currentPath, currentLang, targetLang) {
  if (!normalizePath(currentPath) || currentLang === targetLang) return null
  const resolved = await resolveDocument(currentPath, currentLang)
  if (!resolved) return null
  const translation = /** @type {{ slug?: string, type?: string } | null} */ (
    await sanityCdnFetch(TRANSLATED_QUERY, { docId: resolved._id, targetLang })
  )
  if (!translation?.slug) return null
  return shapePath(translation.type || resolved._type, translation.slug, targetLang)
}

/**
 * True when a redirect would replace a Norwegian slug with its English sibling
 * on scandicommerce.no (e.g. /tjenester/alle-pakker → /services/all-packages).
 * @param {string} sourcePath @param {string} destination
 */
async function isNoSlugEnglishificationRedirect(sourcePath, destination) {
  const sourceClean = normalizePath(sourcePath)
  if (!sourceClean) return false
  let destClean = ''
  let destHost = ''
  try {
    if (destination.startsWith('http')) {
      const u = new URL(destination)
      destClean = normalizePath(u.pathname)
      destHost = u.host
    } else {
      destClean = normalizePath(destination)
    }
  } catch {
    return false
  }
  if (!destClean || sourceClean.replace(/_/g, '-') === destClean.replace(/_/g, '-')) return false
  if (destHost && !destHost.includes('scandicommerce.no')) return false
  const enPath = await translatePath(sourceClean, 'no', 'en')
  return Boolean(enPath && enPath.replace(/_/g, '-') === destClean.replace(/_/g, '-'))
}

module.exports = {
  translatePath,
  resolveDocument,
  shapePath,
  isNoSlugEnglishificationRedirect,
  normalizePath,
  stripLocalePrefix,
}
