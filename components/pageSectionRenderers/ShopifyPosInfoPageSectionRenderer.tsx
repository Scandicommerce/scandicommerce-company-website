import Hero from '@/components/layout/Hero'
import BleedingMoney from '@/components/sections/shopify/shopify_POS/BleedingMoney'
import OmnichannelFeatures from '@/components/sections/shopify/shopify_POS/OmnichannelFeatures'
import RevenueForm from '@/components/sections/shopify/shopify_POS/RevenueForm'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyPosInfoPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPosInfoPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} isStats={true} />
          case 'shopifyPosInfoPageBleedingMoneySection':
            return <BleedingMoney key={_key} bleedingMoney={rest as Parameters<typeof BleedingMoney>[0]['bleedingMoney']} />
          case 'shopifyPosInfoPageOmnichannelFeaturesSection':
            return (
              <OmnichannelFeatures
                key={_key}
                omnichannelFeatures={
                  rest as Parameters<typeof OmnichannelFeatures>[0]['omnichannelFeatures']
                }
              />
            )
          case 'shopifyPosInfoPageRevenueFormSection':
            return <RevenueForm key={_key} revenueForm={rest as Parameters<typeof RevenueForm>[0]['revenueForm']} />
          default:
            return null
        }
      })}
    </>
  )
}
