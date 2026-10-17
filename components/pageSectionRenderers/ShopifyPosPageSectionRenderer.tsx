import ServiceHero from '@/components/sections/services/ServiceHero'
import OmnichannelFeatures from '@/components/sections/services/shopify_pos/OmnichannelFeatures'
import PerfectFor from '@/components/sections/services/shopify_pos/PerfectFor'
import ReadyForOmnichannel from '@/components/sections/services/shopify_pos/ReadyForOmnichannel'
import { ensureInternalHref } from '@/lib/routes'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyPosPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPosPageHeroSection': {
            const hero = rest as {
              heroTitle?: { text?: string; highlight?: string }
              heroDescription?: string
              heroButtonText?: string
              heroButtonLink?: string
            }
            return (
              <ServiceHero
                key={_key}
                eyebrow="Shopify POS"
                title={hero.heroTitle?.text ?? ''}
                highlight={hero.heroTitle?.highlight}
                description={hero.heroDescription}
                buttons={hero.heroButtonText ? [{ text: hero.heroButtonText, link: ensureInternalHref(hero.heroButtonLink), variant: 'primary' }] : undefined}
              />
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
