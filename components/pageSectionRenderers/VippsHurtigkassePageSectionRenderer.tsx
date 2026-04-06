import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'
import Features from '@/components/sections/shopify/vipps_hurtigkasse/Features'
import HowToGetStarted from '@/components/sections/shopify/vipps_hurtigkasse/HowToGetStarted'
import Pricing from '@/components/sections/shopify/vipps_hurtigkasse/Pricing'
import OrderForm from '@/components/sections/shopify/vipps_hurtigkasse/OrderForm'
import Support from '@/components/sections/shopify/vipps_hurtigkasse/Support'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function VippsHurtigkassePageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'vippsHurtigkassePageHeroSection': {
            const hero = rest as {
              heroTitle?: { text?: string; highlight?: string }
              heroDescription?: string
              heroButtons?: Array<{ text: string; link: string; variant?: string }>
            }
            return (
              <Hero key={_key} hero={hero}>
                <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
                  {hero.heroButtons?.map((button, index) => (
                    <Button key={index} type={button.variant === 'primary' ? 'primary' : 'default'} href={button.link}>
                      {button.text}
                    </Button>
                  ))}
                </div>
              </Hero>
            )
          }
          case 'vippsHurtigkassePageFeaturesSection':
            return <Features key={_key} features={rest as Parameters<typeof Features>[0]['features']} />
          case 'vippsHurtigkassePageHowToGetStartedSection':
            return (
              <HowToGetStarted
                key={_key}
                howToGetStarted={rest as Parameters<typeof HowToGetStarted>[0]['howToGetStarted']}
              />
            )
          case 'vippsHurtigkassePagePricingSection':
            return <Pricing key={_key} pricing={rest as Parameters<typeof Pricing>[0]['pricing']} />
          case 'vippsHurtigkassePageOrderFormSection':
            return <OrderForm key={_key} orderForm={rest as Parameters<typeof OrderForm>[0]['orderForm']} />
          case 'vippsHurtigkassePageSupportSection':
            return <Support key={_key} support={rest as Parameters<typeof Support>[0]['support']} />
          default:
            return null
        }
      })}
    </>
  )
}
