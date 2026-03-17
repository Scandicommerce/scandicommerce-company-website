import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { sitemapPagesQuery, sitemapBlogPostsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import { getShopifyProducts } from '@/lib/shopify'
import LocalizedLink from '@/components/ui/LocalizedLink'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SitemapEntry {
  _type: string
  title: string
  slug: string
}

interface SitemapCategory {
  label: string
  entries: SitemapEntry[]
}

const PAGE_TYPE_CATEGORY: Record<string, string> = {
  landingPage: 'Pages',
  aboutPage: 'Company',
  contactPage: 'Company',
  workPage: 'Company',
  partnersPage: 'Company',
  blogPage: 'Resources',
  blogPost: 'Blog Articles',
  allPackagesPage: 'Services',
  packageDetailPage: 'Services',
  migratePage: 'Services',
  shopifyDevelopmentPage: 'Services',
  shopifyPosPage: 'Shopify',
  shopifyPosInfoPage: 'Shopify',
  shopifyXAiPage: 'Shopify',
  shopifyXPimPage: 'Shopify',
  whyShopifyPage: 'Shopify',
  shopifyPlatformPage: 'Shopify',
  vippsHurtigkassePage: 'Shopify',
  shopifyTcoCalculatorPage: 'Shopify',
  merchPage: 'Merch',
  shopifyProduct: 'Products',
}

function groupByCategory(
  pages: SitemapEntry[],
  blogPosts: SitemapEntry[],
  products: SitemapEntry[]
): SitemapCategory[] {
  const categoryMap = new Map<string, SitemapEntry[]>()

  const categoryOrder = [
    'Pages',
    'Company',
    'Services',
    'Shopify',
    'Resources',
    'Blog Articles',
    'Merch',
    'Products',
  ]

  for (const page of pages) {
    const category = PAGE_TYPE_CATEGORY[page._type] || 'Pages'
    if (!categoryMap.has(category)) categoryMap.set(category, [])
    categoryMap.get(category)!.push(page)
  }

  if (blogPosts.length > 0) {
    categoryMap.set('Blog Articles', blogPosts)
  }

  if (products.length > 0) {
    categoryMap.set('Products', products)
  }

  return categoryOrder
    .filter((cat) => categoryMap.has(cat))
    .map((cat) => ({ label: cat, entries: categoryMap.get(cat)! }))
}

function getPageHref(entry: SitemapEntry): string {
  if (entry._type === 'blogPost') return `/resources/${entry.slug}`
  if (entry._type === 'shopifyProduct') return `/merch/${entry.slug}`
  return `/${entry.slug}`
}

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('sitemap')
  return {
    title: 'Sitemap | ScandiCommerce',
    alternates: Object.keys(alternates).length
      ? { languages: alternates }
      : undefined,
  }
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })

  const [pages, blogPosts, shopifyProducts] = await Promise.all([
    client.fetch<SitemapEntry[]>(
      sitemapPagesQuery,
      getQueryParams({}, language),
      { next: { revalidate: 0 } }
    ),
    client.fetch<SitemapEntry[]>(
      sitemapBlogPostsQuery,
      getQueryParams({}, language),
      { next: { revalidate: 0 } }
    ),
    getShopifyProducts().catch(() => []),
  ])

  const productEntries: SitemapEntry[] = shopifyProducts
    .filter((p) => p.collections.length > 0)
    .map((p) => ({
      _type: 'shopifyProduct',
      title: p.title,
      slug: p.handle,
    }))

  const categories = groupByCategory(pages || [], blogPosts || [], productEntries)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <section className="section_container mx-auto page-padding-x py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Sitemap
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                A complete overview of all pages on our website.
              </p>
              <div className="mt-4 h-1 w-16 bg-teal rounded-full" />
            </div>

            {/* <div className="mb-8">
              <LocalizedLink
                href="/"
                className="inline-flex items-center gap-2 text-teal hover:text-teal-dark font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Home
              </LocalizedLink>
            </div> */}

            <div className="grid gap-10 sm:gap-12">
              {categories.map((category) => (
                <div key={category.label}>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                    {category.label}
                  </h2>
                  <div className="h-0.5 w-10 bg-teal/40 rounded-full mb-5" />
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {category.entries.map((entry) => (
                      <li key={`${entry._type}-${entry.slug}`}>
                        <LocalizedLink
                          href={getPageHref(entry)}
                          className="group flex items-center gap-2 text-gray-600 hover:text-teal transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-teal transition-colors shrink-0" />
                          <span className="text-sm sm:text-base">
                            {entry.title || entry.slug}
                          </span>
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <p className="text-gray-400 text-center py-12">
                No pages found.
              </p>
            )}
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  )
}
