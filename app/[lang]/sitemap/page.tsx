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
import { ui } from '@/components/integrations/labels'

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
  post: 'articles',
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
        <section className="bg-white">
          <div className={`${ui.container} py-14 lg:py-20`}>
            <div className="mb-12 flex max-w-[820px] flex-col gap-4 lg:mb-16">
              <h1 className="m-0 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:text-[60px]">{copy.heading}</h1>
              <p className="m-0 max-w-[640px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{copy.intro}</p>
            </div>

            <div className="flex flex-col gap-12 lg:gap-14">
              {categories.map((category) => (
                <div key={category.key} className="grid grid-cols-1 gap-5 border-t border-sc-ink-100 pt-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
                  <div className="flex items-baseline justify-between gap-4 md:flex-col md:items-start md:gap-1">
                    <h2 className="m-0 text-[24px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900">{category.label}</h2>
                    <span className="font-mono text-[13px] text-sc-ink-400">{category.entries.length}</span>
                  </div>
                  <ul className="m-0 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                    {category.entries.map((entry) => (
                      <li key={`${entry._type}-${entry.slug}`}>
                        <LocalizedLink
                          href={getPageHref(entry, language)}
                          className="group flex items-start gap-2.5 text-[15px] leading-relaxed text-sc-ink-600 no-underline transition-colors hover:text-sc-ink-900"
                        >
                          <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sc-ink-300 transition-colors group-hover:bg-sc-cyan-500" />
                          <span>{entry.title || entry.slug}</span>
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {categories.length === 0 && <p className="m-0 py-12 text-center text-sc-ink-500">{copy.empty}</p>}
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  )
}
