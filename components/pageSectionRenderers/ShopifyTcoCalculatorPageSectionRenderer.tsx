import TCOCalculatorClient from '@/app/shopify/shopify_TCO_calculator/TCOCalculatorClient'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

type HeroProp = Parameters<typeof TCOCalculatorClient>[0]['hero']
type CalcConfigProp = Parameters<typeof TCOCalculatorClient>[0]['calculatorConfig']

export async function ShopifyTcoCalculatorPageSectionRenderer({
  sections,
  legacyHero,
  lang,
}: {
  sections: SanitySectionItem[]
  legacyHero?: HeroProp
  lang?: string
}) {
  const language = lang ?? (await getServerLanguage())

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

  return <TCOCalculatorClient hero={hero} calculatorConfig={calculatorConfig} lang={language} />
}
