import ServiceHero from '@/components/sections/services/ServiceHero'
import Features from '@/components/sections/shopify/vipps_hurtigkasse/Features'
import HowToGetStarted from '@/components/sections/shopify/vipps_hurtigkasse/HowToGetStarted'
import Pricing from '@/components/sections/shopify/vipps_hurtigkasse/Pricing'
import OrderForm from '@/components/sections/shopify/vipps_hurtigkasse/OrderForm'
import Support from '@/components/sections/shopify/vipps_hurtigkasse/Support'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroBlock = {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  heroButtons?: Array<{ text: string; link: string; variant?: string }>
}

export async function VippsHurtigkassePageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'vippsHurtigkassePageHeroSection': {
            const hero = rest as HeroBlock
            if (!hero.heroTitle?.text) return null
            const buttons = (hero.heroButtons ?? [])
              .filter((b) => b?.text && b?.link)
              .map((b, i) => ({ text: b.text, link: b.link, variant: (b.variant === 'secondary' ? 'secondary' : b.variant === 'primary' || i === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary' }))
            return <ServiceHero key={_key} eyebrow="Vipps Hurtigkasse" title={hero.heroTitle.text} highlight={hero.heroTitle.highlight} description={hero.heroDescription} buttons={buttons} />
          }
          case 'vippsHurtigkassePageFeaturesSection':
            return <Features key={_key} lang={language} features={rest as Parameters<typeof Features>[0]['features']} />
          case 'vippsHurtigkassePageHowToGetStartedSection':
            return <HowToGetStarted key={_key} lang={language} howToGetStarted={rest as Parameters<typeof HowToGetStarted>[0]['howToGetStarted']} />
          case 'vippsHurtigkassePagePricingSection':
            return <Pricing key={_key} lang={language} pricing={rest as Parameters<typeof Pricing>[0]['pricing']} />
          case 'vippsHurtigkassePageOrderFormSection':
            return <OrderForm key={_key} lang={language} orderForm={rest as Parameters<typeof OrderForm>[0]['orderForm']} />
          case 'vippsHurtigkassePageSupportSection':
            return <Support key={_key} lang={language} support={rest as Parameters<typeof Support>[0]['support']} />
          default:
            return null
        }
      })}
    </>
  )
}
