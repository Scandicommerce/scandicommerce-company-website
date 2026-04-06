import Hero from '@/components/layout/Hero'
import WhatIsShopify from '@/components/sections/shopify/why_shopify/WhatIsShopify'
import ShopifyFacts from '@/components/sections/shopify/why_shopify/ShopifyFacts'
import WhyBusinessesChooseShopify from '@/components/sections/shopify/why_shopify/WhyBusinessesChooseShopify'
import WhyScandicommerceSpecializes from '@/components/sections/shopify/why_shopify/WhyScandicommerceSpecializes'
import ShopifyAI from '@/components/sections/shopify/why_shopify/ShopifyAI'
import CTA from '@/components/sections/shopify/why_shopify/CTA'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function WhyShopifyPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'whyShopifyPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'whyShopifyPageWhatIsShopifySection':
            return (
              <WhatIsShopify key={_key} whatIsShopify={rest as Parameters<typeof WhatIsShopify>[0]['whatIsShopify']} />
            )
          case 'whyShopifyPageShopifyFactsSection':
            return (
              <ShopifyFacts key={_key} shopifyFacts={rest as Parameters<typeof ShopifyFacts>[0]['shopifyFacts']} />
            )
          case 'whyShopifyPageWhyBusinessesChooseSection':
            return (
              <WhyBusinessesChooseShopify
                key={_key}
                whyBusinessesChoose={rest as Parameters<typeof WhyBusinessesChooseShopify>[0]['whyBusinessesChoose']}
              />
            )
          case 'whyShopifyPageWhyScandicommerceSpecializesSection':
            return (
              <WhyScandicommerceSpecializes
                key={_key}
                whyScandicommerceSpecializes={
                  rest as Parameters<typeof WhyScandicommerceSpecializes>[0]['whyScandicommerceSpecializes']
                }
              />
            )
          case 'whyShopifyPageShopifyAiSection':
            return <ShopifyAI key={_key} shopifyAi={rest as Parameters<typeof ShopifyAI>[0]['shopifyAi']} />
          case 'whyShopifyPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
