import PackageDetailHero from '@/components/sections/services/all_packages/PackageDetailHero'
import PackageDetailBody from '@/components/sections/services/all_packages/PackageDetailBody'
import PackageFaq from '@/components/sections/services/all_packages/PackageFaq'
import FrequentlyAddedTogether from '@/components/sections/services/all_packages/FrequentlyAddedTogether'
import CaseStudiesBanner from '@/components/sections/services/all_packages/CaseStudiesBanner'
import PackageDetailRedesign from '@/components/sections/services/all_packages/PackageDetailRedesign'
import { contactHref } from '@/lib/routes'
import type { Package } from '@/lib/packages'
import { PACKAGE_TIERS, type PackageTier } from '@/lib/packageMatrix'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type ShopifyProductProp = Parameters<typeof PackageDetailHero>[0]['shopifyProduct']
type AddOnsProp = Parameters<typeof FrequentlyAddedTogether>[0]['addOns']

/**
 * `sections` are merged on the server; layout is fixed:
 * hero → full body → FAQ → add-ons → banner.
 *
 * The body is not tabbed: everything a buyer needs is on the page at once.
 */
export function PackageDetailPageSectionRenderer({
  sections,
  pkg,
  shopifyProduct,
  addOns,
  caseStudiesBanner,
  lang,
}: {
  sections: SanitySectionItem[]
  pkg: Package
  shopifyProduct?: ShopifyProductProp
  addOns?: AddOnsProp
  caseStudiesBanner?: Parameters<typeof CaseStudiesBanner>[0]['caseStudiesBanner']
  lang?: string
}) {
  void sections

  // The slug arrives as a full path ("tjenester/alle-pakker/growth"), so match
  // the matrix on its last segment.
  const slugTail = (pkg.slug || '').split('/').filter(Boolean).pop() ?? ''
  const tier = PACKAGE_TIERS.includes(slugTail as PackageTier)
    ? (slugTail as PackageTier)
    : undefined

  // Norwegian tier pages use the redesigned layout; other languages and
  // non-matrix packages keep the previous one until their copy is updated.
  if (tier && lang === 'no') {
    return (
      <>
        <PackageDetailRedesign pkg={pkg} tier={tier} addOns={addOns} contactHref={contactHref(lang)} />
        <CaseStudiesBanner packageName={pkg.title} caseStudiesBanner={caseStudiesBanner} />
      </>
    )
  }

  return (
    <>
      <PackageDetailHero pkg={pkg} tier={tier} shopifyProduct={shopifyProduct} lang={lang} />
      <PackageDetailBody pkg={pkg} tier={tier} lang={lang} />
      <PackageFaq items={pkg.faq} lang={lang} />
      <FrequentlyAddedTogether addOns={addOns} />
      <CaseStudiesBanner packageName={pkg.title} caseStudiesBanner={caseStudiesBanner} />
    </>
  )
}
