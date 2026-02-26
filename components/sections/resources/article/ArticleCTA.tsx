'use client'

import LocalizedLink from '@/components/ui/LocalizedLink'

export default function ArticleCTA() {
  return (
    <section className="bg-[#EFEFEF] py-8 pb-16">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#03C1CA] p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to optimize your Shopify store?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s audit your current setup and recommend the perfect apps for your business.
            </p>
            <LocalizedLink
              href="/contact"
              className="inline-block px-8 py-3 md:px-10 md:py-4 bg-white text-[#03C1CA] font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Free Consultation
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  )
}

