'use client'

interface PricingData {
  sectionTitle?: string
  price?: string
  priceNote?: string
  supportText?: string
}

interface PricingProps {
  pricing?: PricingData
}

export default function Pricing({ pricing }: PricingProps) {
  const sectionTitle = pricing?.sectionTitle || 'How much does it cost to use Quick Checkout for Vipps in Shopify'
  const price = pricing?.price || 'kr 399'
  const priceNote = pricing?.priceNote || 'ex. VAT per month'
  const supportText = pricing?.supportText || 'free support via email'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-10 lg:mb-14">
            {sectionTitle}
          </h2>

          <div className="bg-[#F8F8F8] p-8 lg:p-12 shadow-lg">
            <p className="text-sm font-semibold text-[#03C1CA] uppercase tracking-wider mb-4">
              PRICE
            </p>
            <div className="mb-4">
              <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#03C1CA] font-mono tracking-tight">{price}</span>
              <span className="text-base lg:text-lg text-[#565454] ml-1 font-sans">/{priceNote}</span>
            </div>
            <p className="text-base lg:text-lg text-[#565454]">
              {supportText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
