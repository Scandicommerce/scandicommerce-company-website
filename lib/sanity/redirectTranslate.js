// @ts-check
/**
 * Path translation via Sanity CDN (plain JS for next.config require + middleware).
 */

const LOCALE_IDS = ['en', 'no', 'sv', 'da', 'de']
const COUNTRY_SEGMENTS = /** @type {Record<string, boolean>} */ ({ se: true, dk: true, de: true })

/**
 * Strip all leading locale-id and country-code segments from a Sanity slug.
 * e.g. "se/contact" → "contact", "sv/se/contact" → "contact".
 * @param {string} slug
 * @returns {string}
 */
function stripLocalePrefix(slug) {
  const parts = slug.split('/')
  while (parts.length > 1 && (LOCALE_IDS.includes(parts[0]) || parts[0] in COUNTRY_SEGMENTS)) {
    parts.shift()
  }
  return parts.join('/')
}

/**
 * Static slug translation fallback for pages whose Sanity translation.metadata
 * may not be linked (e.g. the blog index page which has different slugs per locale).
 * Keyed as `{sourceLang}:{slug}` → map of targetLang → translated slug.
 */
const STATIC_SLUG_MAP = {
  'en:blog':  { no: 'blogg', sv: 'blogg', da: 'blog', de: 'blog' },
  'no:blogg': { en: 'blog',  sv: 'blogg', da: 'blog', de: 'blog' },
  'sv:blogg': { en: 'blog',  no: 'blogg', da: 'blog', de: 'blog' },
  'da:blog':  { en: 'blog',  no: 'blogg', sv: 'blogg', de: 'blog' },
  'de:blog':  { en: 'blog',  no: 'blogg', sv: 'blogg', da: 'blog' },
}

const PAGE_TYPES_WITH_SLUG = [
  'aboutPage',
  'contactPage',
  'workPage',
  'partnersPage',
  'blogPage',
  'allPackagesPage',
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
  'merchPage',
  'packageDetailPage',
]

const RESOLVE_PAGE_QUERY = `*[_type in $pageTypes && (slug.current == $path || slug.current == $pathWithLocale) && (language == $language || !defined(language))] | order(defined(language) desc) [0]{ _type, _id }`

const TRANSLATED_SLUG_QUERY = `*[_type == "translation.metadata" && references($docId)][0]{ "slug": translations[_key == $targetLang][0].value->slug.current }`

/**
 * @param {string} p
 * @returns {string}
 */
function normalizePath(p) {
  return p.replace(/^\/+|\/+$/g, '')
}

/**
 * Compare paths ignoring leading slashes and _ vs - in segments.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function pathsEquivalent(a, b) {
  const na = normalizePath(a).replace(/_/g, '-')
  const nb = normalizePath(b).replace(/_/g, '-')
  return Boolean(na && nb && na === nb)
}

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
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value))
  }

  try {
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?${search}`
    )
    if (!res.ok) return null
    /** @type {{ result?: unknown }} */
    const json = await res.json()
    return json.result ?? null
  } catch {
    return null
  }
}

/**
 * @param {string} currentPath
 * @param {string} currentLang
 * @param {string} targetLang
 * @returns {Promise<string | null>}
 */
async function translatePath(currentPath, currentLang, targetLang) {
  const path = normalizePath(currentPath)
  if (!path || currentLang === targetLang) return null

  // Static fallback first for known slug differences (e.g. blog ↔ blogg)
  const staticKey = `${currentLang}:${path}`
  if (STATIC_SLUG_MAP[staticKey]?.[targetLang]) {
    return STATIC_SLUG_MAP[staticKey][targetLang]
  }

  const resolved = /** @type {{ _id?: string } | null} */ (
    await sanityCdnFetch(RESOLVE_PAGE_QUERY, {
      path,
      pathWithLocale: `${currentLang}/${path}`,
      language: currentLang,
      pageTypes: PAGE_TYPES_WITH_SLUG,
    })
  )
  if (!resolved?._id) return null

  const translation = /** @type {{ slug?: string } | null} */ (
    await sanityCdnFetch(TRANSLATED_SLUG_QUERY, {
      docId: resolved._id,
      targetLang,
    })
  )

  const raw = translation?.slug ? normalizePath(translation.slug) : ''
  if (!raw) return null
  const slug = stripLocalePrefix(raw)
  return slug || null
}

/**
 * True when a redirect would replace a Norwegian slug with its English sibling
 * on scandicommerce.no (e.g. /tjenester/alle-pakker → /services/all-packages).
 *
 * @param {string} sourcePath
 * @param {string} destination
 * @returns {Promise<boolean>}
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

  if (!destClean || pathsEquivalent(sourceClean, destClean)) return false
  // Relative destinations apply to the current host (.no). Absolute must stay on .no.
  if (destHost && !destHost.includes('scandicommerce.no')) return false

  const enSlug = await translatePath(sourceClean, 'no', 'en')
  return Boolean(enSlug && pathsEquivalent(enSlug, destClean))
}

module.exports = {
  translatePath,
  isNoSlugEnglishificationRedirect,
  normalizePath,
  stripLocalePrefix,
}
