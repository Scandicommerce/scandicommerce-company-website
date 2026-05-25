import Hero from '@/components/layout/Hero'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function AllPackagesPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'allPackagesPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'allPackagesPagePackagesSection':
            return <PricingPackages key={_key} packages={rest as Parameters<typeof PricingPackages>[0]['packages']} lang={lang} />
          case 'allPackagesPageFaqSection':
            return <FAQ key={_key} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          default:
            return null
        }
      })}
    </>
  )
}
