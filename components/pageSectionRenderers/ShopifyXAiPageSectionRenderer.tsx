import Hero from '@/components/layout/Hero'
import EnhancingWithAI from '@/components/sections/shopify/shopify_x_AI/EnhancingWithAI'
import HowWeLeverageAI from '@/components/sections/shopify/shopify_x_AI/HowWeLeverageAI'
import AIToolsToolkit from '@/components/sections/shopify/shopify_x_AI/AIToolsToolkit'
import HowWeApplyAI from '@/components/sections/shopify/shopify_x_AI/HowWeApplyAI'
import AIEnhancedProcess from '@/components/sections/shopify/shopify_x_AI/AIEnhancedProcess'
import FAQ from '@/components/sections/shopify/shopify_x_AI/FAQ'
import CTA from '@/components/sections/shopify/shopify_x_AI/CTA'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyXAiPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyXAiPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'shopifyXAiPageEnhancingWithAiSection':
            return (
              <EnhancingWithAI key={_key} enhancingWithAi={rest as Parameters<typeof EnhancingWithAI>[0]['enhancingWithAi']} />
            )
          case 'shopifyXAiPageHowWeLeverageAiSection':
            return (
              <HowWeLeverageAI
                key={_key}
                howWeLeverageAi={rest as Parameters<typeof HowWeLeverageAI>[0]['howWeLeverageAi']}
              />
            )
          case 'shopifyXAiPageAiToolsToolkitSection':
            return (
              <AIToolsToolkit key={_key} aiToolsToolkit={rest as Parameters<typeof AIToolsToolkit>[0]['aiToolsToolkit']} />
            )
          case 'shopifyXAiPageHowWeApplyAiSection':
            return (
              <HowWeApplyAI key={_key} howWeApplyAi={rest as Parameters<typeof HowWeApplyAI>[0]['howWeApplyAi']} />
            )
          case 'shopifyXAiPageAiEnhancedProcessSection':
            return (
              <AIEnhancedProcess
                key={_key}
                aiEnhancedProcess={rest as Parameters<typeof AIEnhancedProcess>[0]['aiEnhancedProcess']}
              />
            )
          case 'shopifyXAiPageFaqSection':
            return <FAQ key={_key} faq={rest as Parameters<typeof FAQ>[0]['faq']} />
          case 'shopifyXAiPageCtaSection':
            return <CTA key={_key} cta={rest as Parameters<typeof CTA>[0]['cta']} />
          default:
            return null
        }
      })}
    </>
  )
}
