import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'
import OmnichannelFeatures from '@/components/sections/services/shopify_pos/OmnichannelFeatures'
import PerfectFor from '@/components/sections/services/shopify_pos/PerfectFor'
import ReadyForOmnichannel from '@/components/sections/services/shopify_pos/ReadyForOmnichannel'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyPosPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPosPageHeroSection': {
            const hero = rest as Parameters<typeof Hero>[0]['hero'] & {
              heroButtonText?: string
              heroButtonLink?: string
            }
            return (
              <Hero key={_key} hero={hero}>
                <div className="grid grid-cols-1 lg:gap-4 gap-2">
                  <Button href={hero.heroButtonLink}>{hero.heroButtonText}</Button>
                </div>
              </Hero>
            )
          }
          case 'shopifyPosPageFeaturesSection':
            return <OmnichannelFeatures key={_key} features={rest as Parameters<typeof OmnichannelFeatures>[0]['features']} />
          case 'shopifyPosPagePerfectForSection':
            return <PerfectFor key={_key} perfectFor={rest as Parameters<typeof PerfectFor>[0]['perfectFor']} />
          case 'shopifyPosPageCtaSection':
            return <ReadyForOmnichannel key={_key} cta={rest as Parameters<typeof ReadyForOmnichannel>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
