'use client'

const DEFAULT_PRICE_ITEMS = [
  { priceText: '399 NOK' },
  { priceText: '259 DKK' },
  { priceText: '35 EUR' },
]

interface PricingData {
  sectionTitle?: string
  price?: string
  priceItems?: { priceText?: string }[]
  priceNote?: string
  supportText?: string
}

interface PricingProps {
  pricing?: PricingData
}

export default function Pricing({ pricing }: PricingProps) {
  const sectionTitle = pricing?.sectionTitle || 'How much does it cost to use Quick Checkout for Vipps in Shopify'
  const priceNote = pricing?.priceNote || 'ex. VAT per month'
  const supportText = pricing?.supportText || 'free support via email'

  const priceItems = (pricing?.priceItems?.filter((p) => p?.priceText?.trim()).length
    ? pricing.priceItems
    : DEFAULT_PRICE_ITEMS) as { priceText: string }[]

  const hasRegionalPrices = priceItems.length > 0

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-10 lg:mb-14">
            {sectionTitle}
          </h2>

          <div className="bg-[#F8F8F8] p-8 lg:p-12 shadow-lg">
            <p className="text-sm font-semibold text-[#03C1CA] uppercase tracking-wider mb-4">
              PRICE
            </p>
            {hasRegionalPrices ? (
              <div className="mb-4 space-y-2">
                {priceItems.map((item, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-1">
                    <span className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA] font-mono tracking-tight">
                      {item.priceText}
                    </span>
                    <span className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] font-sans">/{priceNote}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA] font-mono tracking-tight">
                  {pricing?.price || 'kr 399'}
                </span>
                <span className="text-base lg:text-lg text-[#565454] ml-1 font-sans">/{priceNote}</span>
              </div>
            )}
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
              {supportText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
