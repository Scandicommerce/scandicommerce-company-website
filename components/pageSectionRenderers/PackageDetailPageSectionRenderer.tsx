import PackageHero from '@/components/sections/services/all_packages/PackageHero'
import PackageTabs from '@/components/sections/services/all_packages/PackageTabs'
import FrequentlyAddedTogether from '@/components/sections/services/all_packages/FrequentlyAddedTogether'
import CaseStudiesBanner from '@/components/sections/services/all_packages/CaseStudiesBanner'
import type { Package } from '@/lib/packages'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type ShopifyProductProp = Parameters<typeof PackageHero>[0]['shopifyProduct']
type AddOnsProp = Parameters<typeof FrequentlyAddedTogether>[0]['addOns']

/** `sections` are merged on the server; layout is fixed: hero → tabs → add-ons → banner. */
export function PackageDetailPageSectionRenderer({
  sections,
  pkg,
  shopifyProduct,
  tabLabels,
  addOns,
  caseStudiesBanner,
  lang,
}: {
  sections: SanitySectionItem[]
  pkg: Package
  shopifyProduct?: ShopifyProductProp
  tabLabels?: Parameters<typeof PackageTabs>[0]['tabLabels']
  addOns?: AddOnsProp
  caseStudiesBanner?: Parameters<typeof CaseStudiesBanner>[0]['caseStudiesBanner']
  lang?: string
}) {
  void sections
  return (
    <>
      <PackageHero pkg={pkg} shopifyProduct={shopifyProduct} />
      <PackageTabs pkg={pkg} tabLabels={tabLabels} lang={lang} />
      <FrequentlyAddedTogether addOns={addOns} />
      <CaseStudiesBanner packageName={pkg.title} caseStudiesBanner={caseStudiesBanner} />
    </>
  )
}
