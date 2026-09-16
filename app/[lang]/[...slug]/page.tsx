import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getLanguageFromParams } from '@/lib/language'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import type { ResolvedPage } from '@/lib/resolvePageByPath'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { publicPath, trimSlashes } from '@/lib/routes'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { authorBySlugQuery } from '@/sanity/lib/queries'

import AboutPage from '../_pages/aboutPage'
import ContactPage from '../_pages/contactPage'
import PartnersPage from '../_pages/partnersPage'
import WorkPage from '../_pages/workPage'
import MerchPage from '../_pages/merchPage'
import MigratePage from '../_pages/migratePage'
import ShopifyPosPage from '../_pages/shopifyPosPage'
import ShopifyPosInfoPage from '../_pages/shopifyPosInfoPage'
import ShopifyXAiPage from '../_pages/shopifyXAiPage'
import ShopifyXPimPage from '../_pages/shopifyXPimPage'
import WhyShopifyPage from '../_pages/whyShopifyPage'
import ShopifyPlatformPage from '../_pages/shopifyPlatformPage'
import VippsHurtigkassePage from '../_pages/vippsHurtigkassePage'
import ShopifyTcoCalculatorPage from '../_pages/shopifyTcoCalculatorPage'
import ShopifyDevelopmentPage from '../_pages/shopifyDevelopmentPage'
import AllPackagesPage from '../_pages/allPackagesPage'
import PackageDetailPage from '../_pages/packageDetailPage'
import BlogPage from '../_pages/blogPage'
import BlogPostPage from '../_pages/blogPostPage'
import PostPage from '../_pages/postPage'
import MerchProductPage from '../_pages/merchProductPage'
import CaseStudyPage from '../_pages/caseStudyPage'
import AuthorPage from '../_pages/authorPage'
import TemplatePage from '../_pages/templatePage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = { params: Promise<{ lang: string; slug?: string }> }
type PageComponent = React.ComponentType<PageProps>

const PAGE_COMPONENTS: Record<string, PageComponent> = {
  aboutPage: AboutPage as PageComponent,
  contactPage: ContactPage as PageComponent,
  partnersPage: PartnersPage as PageComponent,
  workPage: WorkPage as PageComponent,
  merchPage: MerchPage as PageComponent,
  migratePage: MigratePage as PageComponent,
  shopifyPosPage: ShopifyPosPage as PageComponent,
  shopifyPosInfoPage: ShopifyPosInfoPage as PageComponent,
  shopifyXAiPage: ShopifyXAiPage as PageComponent,
  shopifyXPimPage: ShopifyXPimPage as PageComponent,
  whyShopifyPage: WhyShopifyPage as PageComponent,
  shopifyPlatformPage: ShopifyPlatformPage as PageComponent,
  vippsHurtigkassePage: VippsHurtigkassePage as PageComponent,
  shopifyTcoCalculatorPage: ShopifyTcoCalculatorPage as PageComponent,
  shopifyDevelopmentPage: ShopifyDevelopmentPage as PageComponent,
  allPackagesPage: AllPackagesPage as PageComponent,
  packageDetailPage: PackageDetailPage as PageComponent,
  blogPage: BlogPage as PageComponent,
  blogPost: BlogPostPage as PageComponent,
  post: PostPage as PageComponent,
  caseStudy: CaseStudyPage as PageComponent,
  merchProduct: MerchProductPage as PageComponent,
  author: AuthorPage as PageComponent,
  pillarPage: TemplatePage as PageComponent,
  integrationPage: TemplatePage as PageComponent,
  migrationPage: TemplatePage as PageComponent,
}

/**
 * One canonical URL per document: if the request used a legacy prefix
 * (/resources/…), the wrong section, or different casing, 308 to the
 * canonical shape. Middleware already handles most cases from the static
 * URL plan; this covers content published after the plan was generated.
 */
function redirectIfNotCanonical(path: string, language: string, resolved: NonNullable<ResolvedPage>): void {
  const requested = trimSlashes(path)
  if (requested !== resolved.canonicalPath) {
    permanentRedirect(publicPath(language, resolved.canonicalPath))
  }
}

function isMerchProduct(path: string): boolean {
  const segments = trimSlashes(path).split('/')
  return segments.length === 2 && segments[0] === 'merch'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  const path = slug.join('/')

  if (isMerchProduct(path)) {
    const settings = await getSiteSettings(language)
    const seo = coalescePageSeo(null, settings)
    seo.metaTitle = decodeURIComponent(slug[1]).replace(/-/g, ' ')
    return buildMetadata({ seo, settings, language, pathWithoutLang: path })
  }

  const resolved = await resolvePageByPath(path, language)
  if (!resolved) return {}
  redirectIfNotCanonical(path, language, resolved)

  const seoSlug = resolved.slug ?? resolved.canonicalPath
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: resolved.type, slug: seoSlug, language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)

  if (resolved.type === 'author' && !seo.metaTitle) {
    const author = await sanityPageFetch<{ name?: string; role?: string; bio?: string } | null>(
      authorBySlugQuery,
      { slug: resolved.slug },
      { next: { revalidate: 0 } }
    )
    if (author?.name) seo.metaTitle = author.role ? `${author.name} – ${author.role}` : author.name
    if (author?.bio && !doc?.seoExtended?.metaDescription) seo.metaDescription = author.bio
  }

  return buildMetadata({
    seo,
    settings,
    language,
    pathWithoutLang: resolved.canonicalPath,
    docType: resolved.type,
  })
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  const path = slug.join('/')

  // Merch product: path "merch/handle" -> render product page (Shopify)
  if (isMerchProduct(path)) {
    const ProductPage = PAGE_COMPONENTS.merchProduct
    return <ProductPage params={Promise.resolve({ lang, slug: slug[1] })} />
  }

  const resolved: ResolvedPage = await resolvePageByPath(path, language)
  if (!resolved) notFound()
  redirectIfNotCanonical(path, language, resolved)

  const PageComponent = PAGE_COMPONENTS[resolved.type]
  if (!PageComponent) notFound()

  return <PageComponent params={Promise.resolve({ lang, slug: resolved.slug })} />
}
