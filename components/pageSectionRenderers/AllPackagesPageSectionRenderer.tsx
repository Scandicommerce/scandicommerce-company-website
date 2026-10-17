import PackagesHero from '@/components/sections/services/all_packages/PackagesHero'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'
import type { ShopifyProduct } from '@/lib/shopify'

export function AllPackagesPageSectionRenderer({ sections, lang, products }: { sections: SanitySectionItem[]; lang?: string; products?: ShopifyProduct[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'allPackagesPageHeroSection':
            return <PackagesHero key={_key} hero={rest as Parameters<typeof PackagesHero>[0]['hero']} eyebrow={lang === 'no' ? 'Pakker' : 'Packages'} />
          case 'allPackagesPagePackagesSection':
            return <PricingPackages key={_key} packages={rest as Parameters<typeof PricingPackages>[0]['packages']} lang={lang} products={products} />
          case 'allPackagesPageFaqSection':
            return <FAQ key={_key} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          default:
            return null
        }
      })}
    </>
  )
}
