import ServiceHero from '@/components/sections/services/ServiceHero'
import WhatIsPIM from '@/components/sections/shopify/shopify_x_PIM/WhatIsPIM'
import IntegratingPIM from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'
import WhichBusinesses from '@/components/sections/shopify/shopify_x_PIM/WhichBusinesses'
import TimeSavings from '@/components/sections/shopify/shopify_x_PIM/TimeSavings'
import WhyGoodInvestment from '@/components/sections/shopify/shopify_x_PIM/WhyGoodInvestment'
import CombinedSection from '@/components/sections/shopify/shopify_x_PIM/CombinedSection'
import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroBlock = {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
}

export async function ShopifyXPimPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  const isNo = language === 'no'
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyXPimPageHeroSection': {
            const hero = rest as HeroBlock
            if (!hero.heroTitle?.text) return null
            return <ServiceHero key={_key} eyebrow={isNo ? 'Shopify og PIM' : 'Shopify and PIM'} title={hero.heroTitle.text} highlight={hero.heroTitle.highlight} description={hero.heroDescription} />
          }
          case 'shopifyXPimPageWhatIsPimSection':
            return <WhatIsPIM key={_key} lang={language} whatIsPim={rest as Parameters<typeof WhatIsPIM>[0]['whatIsPim']} />
          case 'shopifyXPimPageIntegratingPimSection':
            return <IntegratingPIM key={_key} lang={language} integratingPim={rest as Parameters<typeof IntegratingPIM>[0]['integratingPim']} />
          case 'shopifyXPimPageWhichBusinessesSection':
            return <WhichBusinesses key={_key} lang={language} whichBusinesses={rest as Parameters<typeof WhichBusinesses>[0]['whichBusinesses']} />
          case 'shopifyXPimPageTimeSavingsSection':
            return <TimeSavings key={_key} lang={language} timeSavings={rest as Parameters<typeof TimeSavings>[0]['timeSavings']} />
          case 'shopifyXPimPageWhyGoodInvestmentSection':
            return <WhyGoodInvestment key={_key} lang={language} whyGoodInvestment={rest as Parameters<typeof WhyGoodInvestment>[0]['whyGoodInvestment']} />
          case 'shopifyXPimCombinedSection':
            return <CombinedSection key={_key} lang={language} combinedSection={rest as NonNullable<Parameters<typeof CombinedSection>[0]['combinedSection']>} />
          case 'shopifyXPimPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
