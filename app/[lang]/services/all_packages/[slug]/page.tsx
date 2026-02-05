import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import PackageHero from '@/components/sections/services/all_packages/PackageHero'
import PackageTabs from '@/components/sections/services/all_packages/PackageTabs'
import FrequentlyAddedTogether from '@/components/sections/services/all_packages/FrequentlyAddedTogether'
import CaseStudiesBanner from '@/components/sections/services/all_packages/CaseStudiesBanner'
import { getPackageBySlug, Package } from '@/lib/packages'
import { getShopifyProductByHandle } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { packageDetailPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PackageDetailPageData {
  _id: string
  pageTitle?: string
  slug?: string
  packageInfo?: {
    title?: string
    subtitle?: string
    price?: string
    priceType?: string
    timeline?: string
    rating?: number
    ratingValue?: string
    reviewCount?: number
    description?: string
  }
  bestFor?: string[]
  idealFor?: string[]
  highlights?: string[]
  moreDeliverablesCount?: number
  included?: string[]
  includedCategories?: {
    category?: string
    items?: string[]
  }[]
  processSteps?: {
    week?: string
    title?: string
    description?: string
  }[]
  faq?: {
    question?: string
    answer?: string
  }[]
  reviews?: {
    name?: string
    rating?: number
    comment?: string
    title?: string
  }[]
  addOns?: {
    sectionTitle?: string
    sectionSubtitle?: string
    items?: {
      title?: string
      description?: string
      price?: string
    }[]
  }
  heroButtons?: {
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
  }
  caseStudiesBanner?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

function sanityToPackage(sanityData: PackageDetailPageData, slug: string): Package {
  return {
    slug: slug,
    title: sanityData.packageInfo?.title || '',
    subtitle: sanityData.packageInfo?.subtitle || '',
    price: sanityData.packageInfo?.price || '',
    priceType: sanityData.packageInfo?.priceType || '',
    timeline: sanityData.packageInfo?.timeline || '',
    rating: sanityData.packageInfo?.rating || 0,
    ratingValue: sanityData.packageInfo?.ratingValue || '',
    reviewCount: sanityData.packageInfo?.reviewCount || 0,
    description: sanityData.packageInfo?.description || '',
    bestFor: sanityData.bestFor || [],
    idealFor: sanityData.idealFor || [],
    included: sanityData.included || [],
    includedCategories: sanityData.includedCategories?.map(cat => ({
      category: cat.category || '',
      items: cat.items || [],
    })),
    highlights: sanityData.highlights || [],
    moreDeliverablesCount: sanityData.moreDeliverablesCount,
    processSteps: sanityData.processSteps?.map(step => ({
      week: step.week || '',
      title: step.title || '',
      description: step.description || '',
    })),
    faq: sanityData.faq?.map(item => ({
      question: item.question || '',
      answer: item.answer || '',
    })),
    reviews: sanityData.reviews?.map(review => ({
      name: review.name || '',
      rating: review.rating || 0,
      comment: review.comment || '',
      title: review.title,
    })),
    heroButtons: sanityData.heroButtons ? {
      primaryButtonText: sanityData.heroButtons.primaryButtonText,
      primaryButtonLink: sanityData.heroButtons.primaryButtonLink,
      secondaryButtonText: sanityData.heroButtons.secondaryButtonText,
      secondaryButtonLink: sanityData.heroButtons.secondaryButtonLink,
    } : undefined,
  }
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })

  const sanityData: PackageDetailPageData = await client.fetch(
    packageDetailPageQuery,
    getQueryParams({ slug }, language),
    { next: { revalidate: 0 } }
  )

  const staticPkg = getPackageBySlug(slug)

  if (!sanityData && !staticPkg) {
    notFound()
  }

  const pkg: Package = sanityData
    ? sanityToPackage(sanityData, slug)
    : staticPkg!

  if (staticPkg && sanityData) {
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
    if (!pkg.reviews?.length) pkg.reviews = staticPkg.reviews
  }

  let shopifyProduct = null
  try {
    shopifyProduct = await getShopifyProductByHandle(slug)
  } catch {
    // package might not be a product
  }

  const titleToHandle = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const addOnsToProcess = sanityData?.addOns?.items && sanityData.addOns.items.length > 0
    ? sanityData.addOns.items
    : [
        { title: 'CRO Audit', description: 'Comprehensive conversion optimization analysis', price: '12.000 kr' },
        { title: 'Monthly Support', description: 'Ongoing updates, bug fixes, and improvements', price: '8.000 kr/mo' },
      ]

  const addOnsWithShopify = await Promise.all(
    addOnsToProcess.map(async (addOn) => {
      if (!addOn.title) return { ...addOn }

      const handle = titleToHandle(addOn.title)
      let shopifyProduct = null

      try {
        shopifyProduct = await getShopifyProductByHandle(handle)
      } catch {
        // add-on might not exist in Shopify
      }

      return {
        ...addOn,
        shopifyProduct: shopifyProduct
          ? {
              variantId: shopifyProduct.variants?.[0]?.id || '',
              productTitle: shopifyProduct.title,
              hasVariants: (shopifyProduct.variants?.length || 0) > 1,
              variants: shopifyProduct.variants || [],
            }
          : undefined,
      }
    })
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <PackageHero
          pkg={pkg}
          shopifyProduct={shopifyProduct ? {
            variantId: shopifyProduct.variants?.[0]?.id || '',
            productTitle: shopifyProduct.title,
            hasVariants: (shopifyProduct.variants?.length || 0) > 1,
            variants: shopifyProduct.variants || [],
          } : undefined}
        />
        <PackageTabs pkg={pkg} />
        <FrequentlyAddedTogether
          addOns={{
            ...sanityData?.addOns,
            items: addOnsWithShopify,
          }}
        />
        <CaseStudiesBanner
          packageName={pkg.title}
          caseStudiesBanner={sanityData?.caseStudiesBanner}
        />
      </main>
      <FooterWrapper />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })

  const sanityData: PackageDetailPageData = await client.fetch(
    packageDetailPageQuery,
    getQueryParams({ slug }, language),
    { next: { revalidate: 0 } }
  )

  const staticPkg = getPackageBySlug(slug)

  if (!sanityData && !staticPkg) {
    return {
      title: 'Package Not Found | ScandiCommerce',
      description: 'The package you are looking for could not be found.',
    }
  }

  const title = sanityData?.seo?.metaTitle || sanityData?.packageInfo?.title || staticPkg?.title
  const description = sanityData?.seo?.metaDescription || sanityData?.packageInfo?.description || staticPkg?.description

  return {
    title: `${title} Package | ScandiCommerce`,
    description: description,
  }
}
