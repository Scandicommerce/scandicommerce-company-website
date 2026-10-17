import FeatureGrid from '@/components/sections/shopify/shared/FeatureGrid'
import PainPoints from '@/components/sections/shopify/shared/PainPoints'
import RevenueForm from '@/components/sections/shopify/shared/RevenueForm'
import ShopifyHero from '@/components/sections/shopify/shared/ShopifyHero'
import { SHOPIFY_T, shopifyLang } from '@/components/sections/shopify/shared/labels'
import SuccessStories from '@/components/sections/shopify/shopify_platform/SuccessStories'
import { getServerLanguage } from '@/lib/language'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

/** HubSpot form on the platform page ("Få et gratis tilbud"). */
const PLATFORM_FORM_ID = '6e11716a-1f41-4ed2-9a5f-debd82767472'

export async function ShopifyPlatformPageSectionRenderer({ sections, lang }: { sections: SanitySectionItem[]; lang?: string }) {
  const language = lang ?? (await getServerLanguage())
  const t = SHOPIFY_T[shopifyLang(language)]
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPlatformPageHeroSection':
            return <ShopifyHero key={_key} lang={language} eyebrow={t.platformEyebrow} hero={rest as Parameters<typeof ShopifyHero>[0]['hero']} />
          case 'shopifyPlatformPageBleedingMoneySection':
            return <PainPoints key={_key} lang={language} data={rest as Parameters<typeof PainPoints>[0]['data']} />
          case 'shopifyPlatformPageShopifyEmpiresSection':
            return <FeatureGrid key={_key} lang={language} data={rest as Parameters<typeof FeatureGrid>[0]['data']} />
          case 'shopifyPlatformPageRevenueFormSection':
            return <RevenueForm key={_key} lang={language} formId={PLATFORM_FORM_ID} data={rest as Parameters<typeof RevenueForm>[0]['data']} />
          case 'shopifyPlatformPageSuccessStoriesSection':
            return <SuccessStories key={_key} lang={language} successStories={rest as Parameters<typeof SuccessStories>[0]['successStories']} />
          default:
            return null
        }
      })}
    </>
  )
}
