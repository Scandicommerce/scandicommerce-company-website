import ServiceHero from '@/components/sections/services/ServiceHero'
import EnhancingWithAI from '@/components/sections/shopify/shopify_x_AI/EnhancingWithAI'
import HowWeLeverageAI from '@/components/sections/shopify/shopify_x_AI/HowWeLeverageAI'
import AIToolsToolkit from '@/components/sections/shopify/shopify_x_AI/AIToolsToolkit'
import HowWeApplyAI from '@/components/sections/shopify/shopify_x_AI/HowWeApplyAI'
import AIEnhancedProcess from '@/components/sections/shopify/shopify_x_AI/AIEnhancedProcess'
import FAQ from '@/components/sections/shopify/shopify_x_AI/FAQ'
import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroBlock = {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
}

export async function ShopifyXAiPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  const isNo = language === 'no'
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyXAiPageHeroSection': {
            const hero = rest as HeroBlock
            if (!hero.heroTitle?.text) return null
            return <ServiceHero key={_key} eyebrow={isNo ? 'Shopify og KI' : 'Shopify and AI'} title={hero.heroTitle.text} highlight={hero.heroTitle.highlight} description={hero.heroDescription} />
          }
          case 'shopifyXAiPageEnhancingWithAiSection':
            return <EnhancingWithAI key={_key} lang={language} enhancingWithAi={rest as Parameters<typeof EnhancingWithAI>[0]['enhancingWithAi']} />
          case 'shopifyXAiPageHowWeLeverageAiSection':
            return <HowWeLeverageAI key={_key} lang={language} howWeLeverageAi={rest as Parameters<typeof HowWeLeverageAI>[0]['howWeLeverageAi']} />
          case 'shopifyXAiPageAiToolsToolkitSection':
            return <AIToolsToolkit key={_key} lang={language} aiToolsToolkit={rest as Parameters<typeof AIToolsToolkit>[0]['aiToolsToolkit']} />
          case 'shopifyXAiPageHowWeApplyAiSection':
            return <HowWeApplyAI key={_key} lang={language} howWeApplyAi={rest as Parameters<typeof HowWeApplyAI>[0]['howWeApplyAi']} />
          case 'shopifyXAiPageAiEnhancedProcessSection':
            return <AIEnhancedProcess key={_key} lang={language} aiEnhancedProcess={rest as Parameters<typeof AIEnhancedProcess>[0]['aiEnhancedProcess']} />
          case 'shopifyXAiPageFaqSection':
            return <FAQ key={_key} lang={language} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          case 'shopifyXAiPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
