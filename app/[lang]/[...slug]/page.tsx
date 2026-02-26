import { notFound } from 'next/navigation'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import type { ResolvedPage } from '@/lib/resolvePageByPath'

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
import MerchProductPage from '../_pages/merchProductPage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PAGE_COMPONENTS: Record<string, React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>> = {
  aboutPage: AboutPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  contactPage: ContactPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  partnersPage: PartnersPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  workPage: WorkPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  merchPage: MerchPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  migratePage: MigratePage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyPosPage: ShopifyPosPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyPosInfoPage: ShopifyPosInfoPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyXAiPage: ShopifyXAiPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyXPimPage: ShopifyXPimPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  whyShopifyPage: WhyShopifyPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyPlatformPage: ShopifyPlatformPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  vippsHurtigkassePage: VippsHurtigkassePage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyTcoCalculatorPage: ShopifyTcoCalculatorPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  shopifyDevelopmentPage: ShopifyDevelopmentPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  allPackagesPage: AllPackagesPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  packageDetailPage: PackageDetailPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  blogPage: BlogPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  blogPost: BlogPostPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
  merchProduct: MerchProductPage as React.ComponentType<{ params: Promise<{ lang: string; slug?: string }> }>,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  const path = slug.join('/')
  const resolved = await resolvePageByPath(path, language)
  if (!resolved) return {}
  const alternates = getAlternateLanguagesForMetadata(path)
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
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
  const segments = path.split('/')
  if (segments.length === 2 && segments[0] === 'merch') {
    const ProductPage = PAGE_COMPONENTS.merchProduct
    if (ProductPage) {
      return <ProductPage params={Promise.resolve({ lang, slug: segments[1] })} />
    }
  }

  const resolved: ResolvedPage = await resolvePageByPath(path, language)
  if (!resolved) notFound()

  const PageComponent = PAGE_COMPONENTS[resolved.type]
  if (!PageComponent) notFound()

  return (
    <PageComponent
      params={Promise.resolve({ lang, slug: resolved.slug })}
    />
  )
}
