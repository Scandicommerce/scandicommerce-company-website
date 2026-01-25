import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Hero from '@/components/layout/Hero'
import MigrationCalculator from '@/components/sections/shopify/shopify_migration/MigrationCalculator'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const heroData = {
  heroTitle: {
    text: 'Not on Shopify yet? Migrate with 99.9% accuracy',
    highlight: 'Shopify',
  },
  heroDescription:
    'Move your products, customers, orders, blogs, and pages to Shopify with 99.9% data accuracy and zero downtime. At ScandiCommerce, we handle the entire migration process so you can focus on what matters most: growing your business.',
}

export default function ShopifyMigrationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={heroData} />
        <MigrationCalculator />
      </main>
      <FooterWrapper />
    </div>
  )
}
