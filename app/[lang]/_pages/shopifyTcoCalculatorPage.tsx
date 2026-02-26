import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { shopifyTcoCalculatorPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import TCOCalculatorClient from '@/app/shopify/shopify_TCO_calculator/TCOCalculatorClient'

interface ShopifyTcoCalculatorPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string; platforms?: string[] }
}

export default async function ShopifyTcoCalculatorPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<ShopifyTcoCalculatorPageData | null>(shopifyTcoCalculatorPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }).catch(() => null)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <TCOCalculatorClient hero={pageData?.hero} />
      </main>
      <FooterWrapper />
    </div>
  )
}
