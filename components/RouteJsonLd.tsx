import SchemaMarkup from '@/components/SchemaMarkup'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import {
  getAboutPageDocumentCached,
  getBlogPostBySlugCached,
  getPostBySlugCached,
} from '@/lib/sanity/cachedDocuments'
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

  const language = await getSchemaLocale()
  const schemas: JsonLdObject[] = []

  if (!pathTrim) {
    const ws = buildWebSiteSchema({ origin, url: pageUrl })
    if (ws) schemas.push(ws)
    return schemas.length ? <SchemaMarkup schema={schemas} /> : null
  }

  const resolved = await resolvePageByPath(pathTrim, language)
  if (!resolved) return null

  switch (resolved.type) {
    case 'allPackagesPage': {
      const faq = buildFaqPageSchema(
        [...ALL_PACKAGES_FAQ_JSON_LD_ITEMS],
        pageUrl
      )
      if (faq) schemas.push(faq)
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
      if (!resolved.slug) break
      const post = await getBlogPostBySlugCached(resolved.slug, language)
      const node = buildBlogPostingJsonLdFromLegacyBlogPost(post, {
        origin,
        pageUrl,
        routeLang: language,
      })
      if (node) schemas.push(node)
      break
    }
    case 'post': {
      if (!resolved.slug) break
      const post = await getPostBySlugCached(resolved.slug, language)
      const node = buildBlogPostingJsonLdFromPostBuilder(post, {
        origin,
        pageUrl,
        routeLang: language,
      })
      if (node) schemas.push(node)
      break
    }
    default:
      break
  }

  return schemas.length ? <SchemaMarkup schema={schemas} /> : null
}
