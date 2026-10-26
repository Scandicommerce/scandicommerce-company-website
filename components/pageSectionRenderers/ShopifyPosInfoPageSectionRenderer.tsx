import FeatureGrid from '@/components/sections/shopify/shared/FeatureGrid'
import PainPoints from '@/components/sections/shopify/shared/PainPoints'
import RevenueForm from '@/components/sections/shopify/shared/RevenueForm'
import ShopifyHero from '@/components/sections/shopify/shared/ShopifyHero'
import { SHOPIFY_T, shopifyLang } from '@/components/sections/shopify/shared/labels'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

/** HubSpot form on the POS page ("Få et gratis tilbud på POS-implementering"). */
const POS_FORM_ID = '2efcdab4-e793-4fd7-9283-1bc50df8c032'

export async function ShopifyPosInfoPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  const t = SHOPIFY_T[shopifyLang(language)]
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPosInfoPageHeroSection':
            return <ShopifyHero key={_key} lang={language} eyebrow={t.posEyebrow} hero={rest as Parameters<typeof ShopifyHero>[0]['hero']} />
          case 'shopifyPosInfoPageBleedingMoneySection':
            return <PainPoints key={_key} lang={language} data={rest as Parameters<typeof PainPoints>[0]['data']} />
          case 'shopifyPosInfoPageOmnichannelFeaturesSection':
            return <FeatureGrid key={_key} lang={language} data={rest as Parameters<typeof FeatureGrid>[0]['data']} />
          case 'shopifyPosInfoPageRevenueFormSection':
            return <RevenueForm key={_key} lang={language} formId={POS_FORM_ID} data={rest as Parameters<typeof RevenueForm>[0]['data']} />
          default:
            return null
        }
      })}
    </>
  )
}
