import ServiceHero from '@/components/sections/services/ServiceHero'
import WhatIsShopify from '@/components/sections/shopify/why_shopify/WhatIsShopify'
import ShopifyFacts from '@/components/sections/shopify/why_shopify/ShopifyFacts'
import WhyBusinessesChooseShopify from '@/components/sections/shopify/why_shopify/WhyBusinessesChooseShopify'
import WhyScandicommerceSpecializes from '@/components/sections/shopify/why_shopify/WhyScandicommerceSpecializes'
import ShopifyAI from '@/components/sections/shopify/why_shopify/ShopifyAI'
import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroBlock = {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
}

export async function WhyShopifyPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  const isNo = language === 'no'
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'whyShopifyPageHeroSection': {
            const hero = rest as HeroBlock
            if (!hero.heroTitle?.text) return null
            return <ServiceHero key={_key} eyebrow={isNo ? 'Hvorfor Shopify' : 'Why Shopify'} title={hero.heroTitle.text} highlight={hero.heroTitle.highlight} description={hero.heroDescription} />
          }
          case 'whyShopifyPageWhatIsShopifySection':
            return <WhatIsShopify key={_key} lang={language} whatIsShopify={rest as Parameters<typeof WhatIsShopify>[0]['whatIsShopify']} />
          case 'whyShopifyPageShopifyFactsSection':
            return <ShopifyFacts key={_key} lang={language} shopifyFacts={rest as Parameters<typeof ShopifyFacts>[0]['shopifyFacts']} />
          case 'whyShopifyPageWhyBusinessesChooseSection':
            return <WhyBusinessesChooseShopify key={_key} lang={language} whyBusinessesChoose={rest as Parameters<typeof WhyBusinessesChooseShopify>[0]['whyBusinessesChoose']} />
          case 'whyShopifyPageWhyScandicommerceSpecializesSection':
            return <WhyScandicommerceSpecializes key={_key} lang={language} whyScandicommerceSpecializes={rest as Parameters<typeof WhyScandicommerceSpecializes>[0]['whyScandicommerceSpecializes']} />
          case 'whyShopifyPageShopifyAiSection':
            return <ShopifyAI key={_key} lang={language} shopifyAi={rest as Parameters<typeof ShopifyAI>[0]['shopifyAi']} />
          case 'whyShopifyPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
