import TCOCalculatorClient from '@/app/shopify/shopify_TCO_calculator/TCOCalculatorClient'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroProp = Parameters<typeof TCOCalculatorClient>[0]['hero']

export function ShopifyTcoCalculatorPageSectionRenderer({
  sections,
  legacyHero,
}: {
  sections: SanitySectionItem[]
  legacyHero?: HeroProp
}) {
  const heroSection = sections.find((s) => s._type === 'shopifyTcoCalculatorPageHeroSection')
  const heroFromSections = heroSection
    ? (() => {
        const { _type: _t, _key: _k, ...rest } = heroSection
        return rest as HeroProp
      })()
    : undefined

  const hero = heroFromSections ?? legacyHero

  return <TCOCalculatorClient hero={hero} />
}
