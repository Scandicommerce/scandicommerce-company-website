import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import CommonScenarios from '@/components/sections/services/shopify_development/CommonScenarios'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import Testimonial from '@/components/sections/services/shopify_development/Testimonial'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyDevelopmentPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyDevelopmentPageHeroSection': {
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
          case 'shopifyDevelopmentPageWhyShopifySection':
            return <WhyShopifyWins key={_key} whyShopify={rest as Parameters<typeof WhyShopifyWins>[0]['whyShopify']} />
          case 'shopifyDevelopmentPageScenariosSection':
            return <CommonScenarios key={_key} scenarios={rest as Parameters<typeof CommonScenarios>[0]['scenarios']} />
          case 'shopifyDevelopmentPageHowWeWorkSection':
            return <HowWeWork key={_key} howWeWork={rest as Parameters<typeof HowWeWork>[0]['howWeWork']} />
          case 'shopifyDevelopmentPageTestimonialSection':
            return <Testimonial key={_key} testimonial={rest as Parameters<typeof Testimonial>[0]['testimonial']} />
          case 'shopifyDevelopmentPageCtaSection':
            return <ReadyToBuild key={_key} cta={rest as Parameters<typeof ReadyToBuild>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
