import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { PackageDetailPageSectionRenderer } from '@/components/pageSectionRenderers/PackageDetailPageSectionRenderer'
import { getPackageBySlug, Package } from '@/lib/packages'
import { notFound } from 'next/navigation'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { packageDetailPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { mergePackageDetailPageData } from '@/lib/sanity/mergePackageDetailPageData'

interface PackageDetailPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  seo?: { metaTitle?: string; metaDescription?: string }
}

/** Flat shape produced by mergePackageDetailPageData from the page's `sections[]`. */
interface PackageDetailMerged {
  packageInfo?: { title?: string; subtitle?: string; price?: string; priceType?: string; timeline?: string; rating?: number; ratingValue?: string; reviewCount?: number; description?: string }
  bestFor?: string[]
  idealFor?: string[]
  highlights?: string[]
  moreDeliverablesCount?: number
  included?: string[]
  includedCategories?: { category?: string; items?: string[] }[]
  processSteps?: { week?: string; title?: string; description?: string }[]
  faq?: { question?: string; answer?: string }[]
  reviews?: { name?: string; rating?: number; comment?: string; title?: string }[]
  tabLabels?: { overview?: string; whatsIncluded?: string; process?: string; faq?: string; reviews?: string; idealFor?: string; bestFor?: string }
  addOns?: { sectionTitle?: string; sectionSubtitle?: string; items?: { title?: string; description?: string; price?: string }[] }
  heroButtons?: { primaryButtonText?: string; primaryButtonLink?: string; secondaryButtonText?: string; secondaryButtonLink?: string }
  caseStudiesBanner?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
}

function sanityToPackage(sanityData: PackageDetailMerged, slug: string): Package {
  return {
    slug,
    title: sanityData.packageInfo?.title || '',
    subtitle: sanityData.packageInfo?.subtitle || '',
    price: sanityData.packageInfo?.price || '',
    priceType: sanityData.packageInfo?.priceType || '',
    timeline: sanityData.packageInfo?.timeline || '',
    rating: sanityData.packageInfo?.rating || 0,
    ratingValue: sanityData.packageInfo?.ratingValue || '',
    reviewCount: sanityData.packageInfo?.reviewCount || 0,
    description: sanityData.packageInfo?.description || '',
    bestFor: (Array.isArray(sanityData.bestFor) ? sanityData.bestFor : []) || [],
    idealFor: (Array.isArray(sanityData.idealFor) ? sanityData.idealFor : []) || [],
    included: (Array.isArray(sanityData.included) ? sanityData.included : []) || [],
    includedCategories: (Array.isArray(sanityData.includedCategories)
      ? sanityData.includedCategories
      : []
    ).map((cat) => ({ category: cat.category || '', items: cat.items || [] })),
    highlights: (Array.isArray(sanityData.highlights) ? sanityData.highlights : []) || [],
    moreDeliverablesCount:
      typeof sanityData.moreDeliverablesCount === 'number' ? sanityData.moreDeliverablesCount : undefined,
    processSteps: (Array.isArray(sanityData.processSteps) ? sanityData.processSteps : []).map((s) => ({
      week: s.week || '',
      title: s.title || '',
      description: s.description || '',
    })),
    faq: (Array.isArray(sanityData.faq) ? sanityData.faq : []).map((i) => ({
      question: i.question || '',
      answer: i.answer || '',
    })),
    reviews: (Array.isArray(sanityData.reviews) ? sanityData.reviews : []).map((r) => ({
      name: r.name || '',
      rating: r.rating || 0,
      comment: r.comment || '',
      title: r.title,
    })),
    heroButtons: sanityData.heroButtons
      ? {
          primaryButtonText: sanityData.heroButtons.primaryButtonText,
          primaryButtonLink: sanityData.heroButtons.primaryButtonLink,
          secondaryButtonText: sanityData.heroButtons.secondaryButtonText,
          secondaryButtonLink: sanityData.heroButtons.secondaryButtonLink,
        }
      : undefined,
  }
}

export default async function PackageDetailPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const resolvedParams = await params
  const { slug, lang } = resolvedParams
  if (!slug) notFound()
  const language = getLanguageFromParams(resolvedParams)

  const raw = await sanityPageFetch<PackageDetailPageData | null>(
    packageDetailPageQuery,
    getQueryParams({ slug }, language),
    { next: { revalidate: 0 } }
  )
  const staticPkg = getPackageBySlug(slug)
  if (!raw && !staticPkg) notFound()

  const sections = normalizePageSections('packageDetailPage', raw)

  const mergedRecord = mergePackageDetailPageData(raw, sections)
  const sanityData = mergedRecord as PackageDetailMerged

  const pkg: Package = raw ? sanityToPackage(sanityData, slug) : staticPkg!
  if (staticPkg && raw) {
    if (!pkg.title) pkg.title = staticPkg.title
    if (!pkg.subtitle) pkg.subtitle = staticPkg.subtitle
    if (!pkg.price) pkg.price = staticPkg.price
    if (!pkg.priceType) pkg.priceType = staticPkg.priceType
    if (!pkg.timeline) pkg.timeline = staticPkg.timeline
    if (!pkg.rating) pkg.rating = staticPkg.rating
    if (!pkg.ratingValue) pkg.ratingValue = staticPkg.ratingValue
    if (!pkg.reviewCount) pkg.reviewCount = staticPkg.reviewCount
    if (!pkg.description) pkg.description = staticPkg.description
    if (!pkg.bestFor?.length) pkg.bestFor = staticPkg.bestFor
    if (!pkg.idealFor?.length) pkg.idealFor = staticPkg.idealFor
    if (!pkg.included?.length) pkg.included = staticPkg.included
    if (!pkg.includedCategories?.length) pkg.includedCategories = staticPkg.includedCategories
    if (!pkg.highlights?.length) pkg.highlights = staticPkg.highlights
    if (pkg.moreDeliverablesCount === undefined) pkg.moreDeliverablesCount = staticPkg.included.length - staticPkg.highlights.length
    if (!pkg.processSteps?.length) pkg.processSteps = staticPkg.processSteps
    if (!pkg.faq?.length) pkg.faq = staticPkg.faq
  }

  // Packages and add-ons are sold through a call, not the Shopify cart, so
  // price and copy come from Sanity only.
  const addOnItems = sanityData?.addOns?.items ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <PackageDetailPageSectionRenderer
          sections={sections}
          pkg={pkg}
          addOns={{ ...sanityData?.addOns, items: addOnItems }}
          caseStudiesBanner={sanityData?.caseStudiesBanner}
          lang={lang}
        />
      </main>
      <FooterWrapper />
    </div>
  )
}
