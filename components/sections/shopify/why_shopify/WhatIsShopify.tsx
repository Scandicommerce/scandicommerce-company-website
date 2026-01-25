'use client'

interface WhatIsShopifyData {
  title?: string
  paragraph1?: string
  paragraph2?: string
}

interface WhatIsShopifyProps {
  whatIsShopify?: WhatIsShopifyData
}

export default function WhatIsShopify({ whatIsShopify }: WhatIsShopifyProps) {
  const title = whatIsShopify?.title
  const paragraph1 = whatIsShopify?.paragraph1
  const paragraph2 = whatIsShopify?.paragraph2

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {title && (
            <h2 className="text-[5.8vw] xs:text-[4.3vw] sm:text-[4.2vw] md:text-[4vw] lg:text-4xl xl:text-[42px] font-bold text-[#222222] mb-8 lg:mb-12">
              {title}
            </h2>
          )}

          <div className="space-y-6">
            {paragraph1 && (
              <p className="text-sm xs:text-[2.4vw] sm:text-[2vw] md:text-base lg:text-lg text-[#565454] leading-relaxed">
                {paragraph1}
              </p>
            )}

            {paragraph2 && (
              <p className="text-sm xs:text-[2.4vw] sm:text-[2vw] md:text-base lg:text-lg text-[#565454] leading-relaxed">
                {paragraph2}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
