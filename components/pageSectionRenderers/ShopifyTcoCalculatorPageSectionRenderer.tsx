import TCOCalculatorClient from '@/app/shopify/shopify_TCO_calculator/TCOCalculatorClient'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroProp = Parameters<typeof TCOCalculatorClient>[0]['hero']
type CalcConfigProp = Parameters<typeof TCOCalculatorClient>[0]['calculatorConfig']

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

  const calcSection = sections.find((s) => s._type === 'shopifyTcoCalculatorPageCalculatorSection')
  const calculatorConfig = calcSection
    ? (() => {
        const { _type: _t, _key: _k, ...rest } = calcSection
        return rest as CalcConfigProp
      })()
    : undefined

  const hero = heroFromSections ?? legacyHero

  return <TCOCalculatorClient hero={hero} calculatorConfig={calculatorConfig} />
}
