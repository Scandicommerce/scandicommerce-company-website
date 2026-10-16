import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { sitemapPagesQuery, sitemapBlogPostsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import type { Metadata } from 'next'
import { docHref } from '@/lib/routes'
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
  key: CategoryKey
  label: string
  entries: SitemapEntry[]
}

type CategoryKey =
  | 'pages'
  | 'company'
  | 'services'
  | 'integrations'
  | 'shopify'
  | 'resources'
  | 'articles'
  | 'caseStudies'
  | 'legal'
  | 'merch'
  | 'products'

/** Order sections the same way the site's own IA orders them. */
const CATEGORY_ORDER: CategoryKey[] = [
  'pages',
  'services',
  'integrations',
  'shopify',
  'caseStudies',
  'resources',
  'articles',
  'company',
  'merch',
  'products',
  'legal',
]

const CATEGORY_LABELS: Record<CategoryKey, { no: string; en: string }> = {
  pages: { no: 'Sider', en: 'Pages' },
  company: { no: 'Selskapet', en: 'Company' },
  services: { no: 'Tjenester', en: 'Services' },
  integrations: { no: 'Integrasjoner', en: 'Integrations' },
  shopify: { no: 'Shopify', en: 'Shopify' },
  resources: { no: 'Ressurser', en: 'Resources' },
  articles: { no: 'Artikler', en: 'Articles' },
  caseStudies: { no: 'Kundecaser', en: 'Case studies' },
  legal: { no: 'Juridisk', en: 'Legal' },
  merch: { no: 'Merch', en: 'Merch' },
  products: { no: 'Produkter', en: 'Products' },
}

const PAGE_TYPE_CATEGORY: Record<string, CategoryKey> = {
  landingPage: 'pages',
  aboutPage: 'company',
  contactPage: 'company',
  workPage: 'company',
  partnersPage: 'company',
  blogPage: 'resources',
  allPackagesPage: 'services',
  packageDetailPage: 'services',
  migratePage: 'services',
  shopifyDevelopmentPage: 'services',
  shopifyPosPage: 'shopify',
  shopifyPosInfoPage: 'shopify',
  shopifyXAiPage: 'shopify',
  shopifyXPimPage: 'shopify',
  whyShopifyPage: 'shopify',
  shopifyPlatformPage: 'shopify',
  vippsHurtigkassePage: 'shopify',
  shopifyTcoCalculatorPage: 'shopify',
  merchPage: 'merch',
  shopifyProduct: 'products',
  // Template-driven pages behind the new IA's /integrasjoner/* and /tjenester/* hubs
  pillarPage: 'integrations',
  integrationPage: 'integrations',
  migrationPage: 'integrations',
  legalPage: 'legal',
  // `post` is the current article type; `blogPost` is the legacy one
  post: 'articles',
  blogPost: 'articles',
  caseStudy: 'caseStudies',
}

const UI_COPY = {
  no: {
    heading: 'Nettstedskart',
    intro: 'En komplett oversikt over alle sidene på nettstedet vårt.',
    empty: 'Fant ingen sider.',
  },
  en: {
    heading: 'Sitemap',
    intro: 'A complete overview of all pages on our website.',
    empty: 'No pages found.',
  },
} as const

function copyFor(language: string) {
  return language === 'no' ? UI_COPY.no : UI_COPY.en
}

function labelFor(key: CategoryKey, language: string): string {
  const label = CATEGORY_LABELS[key]
  return language === 'no' ? label.no : label.en
}

function groupByCategory(
  pages: SitemapEntry[],
  blogPosts: SitemapEntry[],
  products: SitemapEntry[],
  language: string
): SitemapCategory[] {
  const categoryMap = new Map<CategoryKey, SitemapEntry[]>()

  for (const entry of [...pages, ...blogPosts, ...products]) {
    const category = PAGE_TYPE_CATEGORY[entry._type] || 'pages'
    if (!categoryMap.has(category)) categoryMap.set(category, [])
    categoryMap.get(category)!.push(entry)
  }

  return CATEGORY_ORDER.filter((key) => categoryMap.has(key)).map((key) => ({
    key,
    label: labelFor(key, language),
    entries: categoryMap.get(key)!,
  }))
}

function getPageHref(entry: SitemapEntry, language: string): string {
  if (entry._type === 'shopifyProduct') return `/merch/${entry.slug}`
  return docHref({ _type: entry._type, slug: entry.slug, language })
}

/** Human-readable sitemap: useful for visitors, but must not compete with real pages (Task 5.4). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  return {
    title: `${copyFor(language).heading} | scandicommerce`,
    robots: { index: false, follow: true },
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

  const copy = copyFor(language)
  const categories = groupByCategory(pages || [], blogPosts || [], productEntries, language)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <section className="section_container mx-auto page-padding-x py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {copy.heading}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                {copy.intro}
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
                <div key={category.key}>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                    {category.label}
                  </h2>
                  <div className="h-0.5 w-10 bg-teal/40 rounded-full mb-5" />
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {category.entries.map((entry) => (
                      <li key={`${entry._type}-${entry.slug}`}>
                        <LocalizedLink
                          href={getPageHref(entry, language)}
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
                {copy.empty}
              </p>
            )}
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  )
}
