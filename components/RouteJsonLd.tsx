import SchemaMarkup from '@/components/SchemaMarkup'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import type { ResolvedPage } from '@/lib/resolvePageByPath'
import {
  getAboutPageDocumentCached,
  getBlogPostBySlugCached,
  getPostBySlugCached,
} from '@/lib/sanity/cachedDocuments'
import { getPageSeo } from '@/lib/sanity/pageSeo'
import type { PageSeoDoc } from '@/lib/sanity/pageSeo'
import { buildRouteStructuredSchemasFromPageDoc } from '@/lib/seo/buildRouteStructuredSchemas'
import { resolveRouteSeoSlug } from '@/lib/seo/resolveRouteSeoSlug'
import { toSanityLanguageId } from '@/lib/language'
import { buildAboutPagePersonJsonLd } from '@/lib/schema/aboutPagePersonJsonLd'
import {
  ALL_PACKAGES_FAQ_JSON_LD_ITEMS,
  buildFaqPageSchema,
  buildWebSiteSchema,
  getSchemaLocale,
  getSchemaPageUrl,
  getSchemaPathnameWithoutLang,
  getSchemaSiteOrigin,
  shouldSuppressMarketingJsonLd,
} from '@/lib/schema'
import {
  buildBlogPostingJsonLdFromLegacyBlogPost,
  buildBlogPostingJsonLdFromPostBuilder,
} from '@/lib/schema/routeBlogPostingJsonLd'
import type { JsonLdObject } from '@/lib/schema/types'

async function loadPageDocForRoute(
  pathTrim: string,
  language: string,
  resolved: ResolvedPage | null
): Promise<PageSeoDoc | null> {
  if (!pathTrim) {
    return getPageSeo({ type: 'landingPage', slug: '', language })
  }
  if (!resolved) return null
  return getPageSeo({
    type: resolved.type,
    slug: resolveRouteSeoSlug(resolved, pathTrim),
    language,
  })
}

/**
 * Route-level JSON-LD (FAQ, BlogPosting, Person list, WebSite on home).
 * Rendered in root `<head>` next to global Organization + Breadcrumb markup.
 */
export default async function RouteJsonLd() {
  if (await shouldSuppressMarketingJsonLd()) return null

  const origin = await getSchemaSiteOrigin()
  const pageUrl = await getSchemaPageUrl()
  if (!origin || !pageUrl) return null

  const pathRaw = await getSchemaPathnameWithoutLang()
  const pathTrim = pathRaw.replace(/^\/+|\/+$/g, '')

  const rawLocale = await getSchemaLocale()
  const language = toSanityLanguageId(rawLocale)

  const schemas: JsonLdObject[] = []

  if (!pathTrim) {
    const ws = buildWebSiteSchema({ origin, url: pageUrl })
    if (ws) schemas.push(ws)
    const homeDoc = await loadPageDocForRoute('', language, null)
    schemas.push(
      ...(await buildRouteStructuredSchemasFromPageDoc({
        origin,
        pageUrl,
        language,
        pathTrim: '',
        resolved: null,
        pageDoc: homeDoc,
      }))
    )
    return schemas.length ? <SchemaMarkup schema={schemas} /> : null
  }

  const resolved = await resolvePageByPath(pathTrim, language)
  const pageDoc = await loadPageDocForRoute(pathTrim, language, resolved)
  const structured =
    (pageDoc?.seoExtended?.structuredDataType as string | undefined) ?? 'none'

  if (!resolved) {
    schemas.push(
      ...(await buildRouteStructuredSchemasFromPageDoc({
        origin,
        pageUrl,
        language,
        pathTrim,
        resolved: null,
        pageDoc,
      }))
    )
    return schemas.length ? <SchemaMarkup schema={schemas} /> : null
  }

  switch (resolved.type) {
    case 'allPackagesPage': {
      if (structured !== 'FAQPage') {
        const faq = buildFaqPageSchema(
          [...ALL_PACKAGES_FAQ_JSON_LD_ITEMS],
          pageUrl
        )
        if (faq) schemas.push(faq)
      }
      break
    }
    case 'aboutPage': {
      const pageData = await getAboutPageDocumentCached(language)
      schemas.push(
        ...buildAboutPagePersonJsonLd(pageData?.meetTheTeam, {
          origin,
          personListingPageUrl: pageUrl,
        })
      )
      break
    }
    case 'blogPost': {
      if (resolved.slug && structured !== 'Article') {
        const post = await getBlogPostBySlugCached(resolved.slug, language)
        const node = buildBlogPostingJsonLdFromLegacyBlogPost(post, {
          origin,
          pageUrl,
          routeLang: language,
        })
        if (node) schemas.push(node)
      }
      break
    }
    case 'post': {
      if (resolved.slug && structured !== 'Article') {
        const post = await getPostBySlugCached(resolved.slug, language)
        const node = buildBlogPostingJsonLdFromPostBuilder(post, {
          origin,
          pageUrl,
          routeLang: language,
        })
        if (node) schemas.push(node)
      }
      break
    }
    default:
      break
  }

  schemas.push(
    ...(await buildRouteStructuredSchemasFromPageDoc({
      origin,
      pageUrl,
      language,
      pathTrim,
      resolved,
      pageDoc,
    }))
  )

  return schemas.length ? <SchemaMarkup schema={schemas} /> : null
}
