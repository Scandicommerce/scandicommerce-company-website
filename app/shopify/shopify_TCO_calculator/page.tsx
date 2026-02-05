import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { shopifyTcoCalculatorPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import TCOCalculatorClient from './TCOCalculatorClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyTcoCalculatorPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    platforms?: string[]
  }
}

async function getPageData(): Promise<ShopifyTcoCalculatorPageData | null> {
  try {
    const data = await client.fetch<ShopifyTcoCalculatorPageData>(
      shopifyTcoCalculatorPageQuery,
      getQueryParams({}),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching TCO Calculator page:', error)
    return null
  }
}

export default async function ShopifyTCOCalculatorPage() {
  const pageData = await getPageData()

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
