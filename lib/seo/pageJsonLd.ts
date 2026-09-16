import { resolvePageByPath } from '@/lib/resolvePageByPath'
import type { ResolvedPage } from '@/lib/resolvePageByPath'
import {
  getAboutPageDocumentCached,
  getBlogPostBySlugCached,
  getCaseStudyBySlugCached,
  getPostBySlugCached,
} from '@/lib/sanity/cachedDocuments'
import { getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import type { PageSeoDoc } from '@/lib/sanity/pageSeo'
import { buildRouteStructuredSchemasFromPageDoc } from '@/lib/seo/buildRouteStructuredSchemas'
import { buildOrganizationJsonLdFromSiteSettings } from '@/lib/seo/jsonLdOrganizationFromSiteSettings'
import { toSanityLanguageId } from '@/lib/language'
import { buildAboutPagePersonJsonLd } from '@/lib/schema/aboutPagePersonJsonLd'
import { buildBreadcrumbListSchema } from '@/lib/schema/breadcrumb'
import { getBreadcrumbHomeLabel } from '@/lib/schema/breadcrumbLabels'
import { fetchBreadcrumbTitleMap, sanityLanguageForBreadcrumb } from '@/lib/schema/breadcrumbSanity'
import { ALL_PACKAGES_FAQ_JSON_LD_ITEMS } from '@/lib/schema/allPackagesFaqSchema'
import { toSchemaDateTime } from '@/lib/schema/dates'
import { buildFaqPageSchema } from '@/lib/schema/faq'
import { getSchemaInLanguageTag } from '@/lib/schema/inLanguage'
import { shouldSuppressMarketingJsonLd } from '@/lib/schema/marketingSchema'
import { buildLocalBusinessNode, buildOrganizationNode, organizationSchemaId } from '@/lib/schema/organization'
import { ORGANIZATION_BRAND_NAME, ORGANIZATION_SERVICE_PACKAGES } from '@/lib/schema/organizationConfig'
import { toPlainTextForSchema } from '@/lib/schema/plainText'
import {
  getRequestSite,
  getSchemaLocale,
  getSchemaPageUrl,
  getSchemaPathnameWithoutLang,
  getSchemaSiteOrigin,
} from '@/lib/schema/request'
import {
  buildBlogPostingJsonLdFromLegacyBlogPost,
  buildBlogPostingJsonLdFromPostBuilder,
} from '@/lib/schema/routeBlogPostingJsonLd'
import type { JsonLdObject } from '@/lib/schema/types'
import { buildWebSiteSchema } from '@/lib/schema/website'
import { normalizeHttpUrl } from '@/lib/schema/urls'

/**
 * Builds the complete JSON-LD `@graph` for the current request
 * (TECHNICAL-SEO-SPEC §12.1: one graph per page, no duplicates).
 *
 * Node inventory:
 *   - Organization (sitewide) — CMS overrides merged over the static profile
 *   - ProfessionalService/LocalBusiness — .no homepage + contact page
 *   - WebSite — homepages
 *   - BreadcrumbList — every sub-page
 *   - Service (+ Offer) — service and package pages
 *   - Article (+ about → client Organization) — case studies
 *   - BlogPosting / Article — posts
 *   - Person — about page team
 *   - FAQPage — any page with FAQ rows
 */

const SERVICE_PAGE_TYPES = new Set([
  'allPackagesPage',
  'packageDetailPage',
  'migratePage',
  'shopifyPosPage',
  'shopifyDevelopmentPage',
  'vippsHurtigkassePage',
  'integrationPage',
  'migrationPage',
])

const LOCAL_BUSINESS_TYPES = new Set(['landingPage', 'contactPage'])

async function loadPageDoc(pathTrim: string, language: string, resolved: ResolvedPage | null): Promise<PageSeoDoc | null> {
  if (!pathTrim) return getPageSeo({ type: 'landingPage', slug: '', language })
  if (!resolved) return null
  return getPageSeo({ type: resolved.type, slug: resolved.slug ?? resolved.canonicalPath, language })
}

function stripContext(node: JsonLdObject): JsonLdObject {
  const { '@context': _ctx, ...rest } = node
  return rest
}

function dedupe(nodes: JsonLdObject[]): JsonLdObject[] {
  const seen = new Set<string>()
  const out: JsonLdObject[] = []
  for (const n of nodes) {
    const id = typeof n['@id'] === 'string' ? (n['@id'] as string) : JSON.stringify(n)
    if (seen.has(id)) continue
    seen.add(id)
    out.push(n)
  }
  return out
}

function buildServiceNode(opts: {
  origin: string
  pageUrl: string
  language: string
  type: string
  pageDoc: PageSeoDoc | null
  leafSlug?: string
}): JsonLdObject | null {
  const { origin, pageUrl, type, pageDoc, leafSlug } = opts
  const name = pageDoc?.seoExtended?.metaTitle?.trim() || pageDoc?.pageTitle?.trim()
  if (!name) return null
  const description =
    pageDoc?.seoExtended?.metaDescription?.trim() || pageDoc?.seo?.metaDescription?.trim() || undefined
  const node: JsonLdObject = {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name,
    url: pageUrl,
    serviceType: 'Shopify Plus agency services',
    provider: { '@id': organizationSchemaId(origin) },
    areaServed: [{ '@type': 'Country', name: 'Norway' }, { '@type': 'Place', name: 'Nordics' }],
    ...(description && { description: toPlainTextForSchema(description, 5000) }),
  }
  if (type === 'packageDetailPage' && leafSlug) {
    const pkg = ORGANIZATION_SERVICE_PACKAGES.find((p) => p.slug === leafSlug)
    if (pkg) {
      node.offers = {
        '@type': 'Offer',
        name: pkg.name,
        price: pkg.price,
        priceCurrency: 'NOK',
        url: pageUrl,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: pkg.price,
          priceCurrency: 'NOK',
          billingDuration: 'P1M',
          unitText: 'month',
        },
      }
    }
  }
  if (type === 'allPackagesPage') {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${ORGANIZATION_BRAND_NAME} packages`,
      itemListElement: ORGANIZATION_SERVICE_PACKAGES.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        price: pkg.price,
        priceCurrency: 'NOK',
        ...(pkg.slug !== 'foundation' && { url: `${pageUrl}/${pkg.slug}` }),
      })),
    }
  }
  return node
}

async function buildCaseStudyNodes(opts: {
  origin: string
  pageUrl: string
  language: string
  slug: string
}): Promise<JsonLdObject[]> {
  const { origin, pageUrl, language, slug } = opts
  const cs = (await getCaseStudyBySlugCached(slug, language)) as
    | {
        title?: string
        excerpt?: string
        metaDescription?: string
        publishedAt?: string
        _updatedAt?: string
        _createdAt?: string
        partner?: string
        industry?: string
        heroImage?: { asset?: { url?: string } }
        clientLogo?: { asset?: { url?: string } }
        language?: string
      }
    | null
  if (!cs?.title) return []
  const nodes: JsonLdObject[] = []
  const client = cs.partner?.trim()
  const clientNode: JsonLdObject | null = client
    ? {
        '@type': 'Organization',
        '@id': `${pageUrl}#client`,
        name: client,
        ...(cs.clientLogo?.asset?.url && { logo: cs.clientLogo.asset.url }),
      }
    : null
  const published = toSchemaDateTime(cs.publishedAt ?? cs._createdAt ?? undefined)
  const modified = toSchemaDateTime(cs._updatedAt ?? undefined)
  const article: JsonLdObject = {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: cs.title.trim(),
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: { '@id': organizationSchemaId(origin) },
    publisher: { '@id': organizationSchemaId(origin) },
    inLanguage: getSchemaInLanguageTag(cs.language || language),
    articleSection: 'Case study',
    ...(cs.excerpt && { description: toPlainTextForSchema(cs.excerpt, 5000) }),
    ...(cs.heroImage?.asset?.url && { image: cs.heroImage.asset.url }),
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
    ...(clientNode && { about: { '@id': clientNode['@id'] } }),
    ...(cs.industry && { keywords: cs.industry }),
  }
  nodes.push(article)
  if (clientNode) nodes.push(clientNode)
  return nodes
}

/** All JSON-LD nodes for the current request (without `@context`). */
export async function buildPageJsonLdNodes(): Promise<JsonLdObject[]> {
  if (await shouldSuppressMarketingJsonLd()) return []

  const origin = await getSchemaSiteOrigin()
  const pageUrl = await getSchemaPageUrl()
  if (!origin || !pageUrl) return []

  const site = await getRequestSite()
  const pathRaw = await getSchemaPathnameWithoutLang()
  const pathTrim = pathRaw.replace(/^\/+|\/+$/g, '')
  const rawLocale = await getSchemaLocale()
  const language = toSanityLanguageId(rawLocale)

  const nodes: JsonLdObject[] = []

  // --- Organization (sitewide) ---------------------------------------------
  const settings = await getSiteSettings(language)
  const orgStatic = buildOrganizationNode(origin)
  const orgCms = buildOrganizationJsonLdFromSiteSettings(origin, settings)
  if (orgStatic) {
    const merged: JsonLdObject = { ...orgStatic }
    if (orgCms) {
      // CMS wins for editorial fields; static profile fills the gaps.
      for (const key of ['legalName', 'description', 'telephone', 'email', 'address', 'foundingDate', 'logo'] as const) {
        const v = (orgCms as Record<string, unknown>)[key]
        if (v !== undefined && v !== null && v !== '') merged[key] = v
      }
      const cmsSameAs = orgCms.sameAs
      if (Array.isArray(cmsSameAs)) {
        merged.sameAs = [...new Set([...(merged.sameAs as string[]), ...(cmsSameAs as string[])])]
      }
    }
    nodes.push(merged)
  }

  // --- Homepage ---------------------------------------------------------------
  if (!pathTrim) {
    const ws = buildWebSiteSchema({ origin, url: pageUrl })
    if (ws) nodes.push(stripContext(ws))
    if (site.key === 'no') {
      const lb = buildLocalBusinessNode(origin)
      if (lb) nodes.push(lb)
    }
    const homeDoc = await loadPageDoc('', language, null)
    const routeNodes = await buildRouteStructuredSchemasFromPageDoc({
      origin,
      pageUrl,
      language,
      pathTrim: '',
      resolved: null,
      pageDoc: homeDoc,
    })
    nodes.push(...routeNodes.map(stripContext))
    return dedupe(nodes)
  }

  // --- Breadcrumbs (every sub-page) ------------------------------------------
  const sanityLang = sanityLanguageForBreadcrumb(rawLocale)
  const titleBySlug = await fetchBreadcrumbTitleMap(pathTrim, rawLocale)
  const breadcrumb = buildBreadcrumbListSchema({
    origin,
    pathWithoutLang: pathTrim,
    homeLabel: getBreadcrumbHomeLabel(rawLocale),
    titleBySlug,
    sanityLanguage: sanityLang,
  })
  if (breadcrumb) nodes.push(stripContext(breadcrumb))

  const resolved = await resolvePageByPath(pathTrim, language)
  const pageDoc = await loadPageDoc(pathTrim, language, resolved)
  const structured = (pageDoc?.seoExtended?.structuredDataType as string | undefined) ?? 'none'

  if (!resolved) {
    const routeNodes = await buildRouteStructuredSchemasFromPageDoc({ origin, pageUrl, language, pathTrim, resolved: null, pageDoc })
    nodes.push(...routeNodes.map(stripContext))
    return dedupe(nodes)
  }

  if (site.key === 'no' && LOCAL_BUSINESS_TYPES.has(resolved.type)) {
    const lb = buildLocalBusinessNode(origin)
    if (lb) nodes.push(lb)
  }

  if (SERVICE_PAGE_TYPES.has(resolved.type) && structured !== 'Service') {
    const leaf = pathTrim.split('/').pop()
    const svc = buildServiceNode({ origin, pageUrl, language, type: resolved.type, pageDoc, leafSlug: leaf })
    if (svc) nodes.push(svc)
  }

  switch (resolved.type) {
    case 'allPackagesPage': {
      if (structured !== 'FAQPage') {
        const faq = buildFaqPageSchema([...ALL_PACKAGES_FAQ_JSON_LD_ITEMS], pageUrl)
        if (faq) nodes.push(stripContext(faq))
      }
      break
    }
    case 'aboutPage': {
      const pageData = await getAboutPageDocumentCached(language)
      nodes.push(
        ...buildAboutPagePersonJsonLd(pageData?.meetTheTeam, { origin, personListingPageUrl: pageUrl }).map(stripContext)
      )
      break
    }
    case 'blogPost': {
      if (resolved.slug && structured !== 'Article') {
        const post = await getBlogPostBySlugCached(resolved.slug, language)
        const node = buildBlogPostingJsonLdFromLegacyBlogPost(post, { origin, pageUrl, routeLang: language })
        if (node) nodes.push(stripContext(node))
      }
      break
    }
    case 'post': {
      if (resolved.slug && structured !== 'Article') {
        const post = await getPostBySlugCached(resolved.slug, language)
        const node = buildBlogPostingJsonLdFromPostBuilder(post, { origin, pageUrl, routeLang: language })
        if (node) nodes.push(stripContext(node))
      }
      break
    }
    case 'caseStudy': {
      if (resolved.slug) nodes.push(...(await buildCaseStudyNodes({ origin, pageUrl, language, slug: resolved.slug })))
      break
    }
    default:
      break
  }

  const routeNodes = await buildRouteStructuredSchemasFromPageDoc({ origin, pageUrl, language, pathTrim, resolved, pageDoc })
  nodes.push(...routeNodes.map(stripContext))

  return dedupe(nodes)
}

export function graphFor(nodes: JsonLdObject[]): JsonLdObject | null {
  if (!nodes.length) return null
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export { normalizeHttpUrl }
