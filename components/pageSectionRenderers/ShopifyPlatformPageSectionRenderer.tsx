import Hero from '@/components/layout/Hero'
import BleedingMoney from '@/components/sections/shopify/shopify_platform/BleedingMoney'
import ShopifyEmpires from '@/components/sections/shopify/shopify_platform/ShopifyEmpires'
import RevenueForm from '@/components/sections/shopify/shopify_platform/RevenueForm'
import SuccessStories from '@/components/sections/shopify/shopify_platform/SuccessStories'
import type { SanitySectionItem } from '@/lib/sanity/normalizeDocumentSections'

export function ShopifyPlatformPageSectionRenderer({ sections }: { sections: SanitySectionItem[] }) {
  return (
    <>
      {sections.map((section) => {
        const { _type, _key, ...rest } = section
        switch (_type) {
          case 'shopifyPlatformPageHeroSection':
            return <Hero key={_key} hero={rest as Parameters<typeof Hero>[0]['hero']} />
          case 'shopifyPlatformPageBleedingMoneySection':
            return <BleedingMoney key={_key} bleedingMoney={rest as Parameters<typeof BleedingMoney>[0]['bleedingMoney']} />
          case 'shopifyPlatformPageShopifyEmpiresSection':
            return (
              <ShopifyEmpires key={_key} shopifyEmpires={rest as Parameters<typeof ShopifyEmpires>[0]['shopifyEmpires']} />
            )
          case 'shopifyPlatformPageRevenueFormSection':
            return <RevenueForm key={_key} revenueForm={rest as Parameters<typeof RevenueForm>[0]['revenueForm']} />
          case 'shopifyPlatformPageSuccessStoriesSection':
            return (
              <SuccessStories key={_key} successStories={rest as Parameters<typeof SuccessStories>[0]['successStories']} />
            )
          default:
            return null
        }
      })}
    </>
  )
}
