import Hero from '@/components/layout/Hero'
import WhatIsPIM from '@/components/sections/shopify/shopify_x_PIM/WhatIsPIM'
import IntegratingPIM from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'
import WhichBusinesses from '@/components/sections/shopify/shopify_x_PIM/WhichBusinesses'
import TimeSavings from '@/components/sections/shopify/shopify_x_PIM/TimeSavings'
import WhyGoodInvestment from '@/components/sections/shopify/shopify_x_PIM/WhyGoodInvestment'
import CombinedSection from '@/components/sections/shopify/shopify_x_PIM/CombinedSection'
import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyXPimPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyXPimPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'shopifyXPimPageWhatIsPimSection':
            return <WhatIsPIM key={_key} whatIsPim={rest as Parameters<typeof WhatIsPIM>[0]['whatIsPim']} />
          case 'shopifyXPimPageIntegratingPimSection':
            return (
              <IntegratingPIM key={_key} integratingPim={rest as Parameters<typeof IntegratingPIM>[0]['integratingPim']} />
            )
          case 'shopifyXPimPageWhichBusinessesSection':
            return (
              <WhichBusinesses
                key={_key}
                whichBusinesses={rest as Parameters<typeof WhichBusinesses>[0]['whichBusinesses']}
              />
            )
          case 'shopifyXPimPageTimeSavingsSection':
            return <TimeSavings key={_key} timeSavings={rest as Parameters<typeof TimeSavings>[0]['timeSavings']} />
          case 'shopifyXPimPageWhyGoodInvestmentSection':
            return (
              <WhyGoodInvestment
                key={_key}
                whyGoodInvestment={rest as Parameters<typeof WhyGoodInvestment>[0]['whyGoodInvestment']}
              />
            )
          case 'shopifyXPimCombinedSection':
            return (
              <CombinedSection
                key={_key}
                combinedSection={
                  rest as NonNullable<Parameters<typeof CombinedSection>[0]['combinedSection']>
                }
              />
            )
          case 'shopifyXPimPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
