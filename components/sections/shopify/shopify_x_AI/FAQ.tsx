'use client'

interface FAQItem {
  question?: string
  answer?: string
}

interface FAQData {
  title?: string
  items?: FAQItem[]
}

interface FAQProps {
  faq?: FAQData
}

export default function FAQ({ faq }: FAQProps) {
  const title = faq?.title
  const faqItems = faq?.items || []

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        {title && (
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-12 lg:mb-16">
            {title}
          </h2>
        )}

        {/* FAQ Items */}
        {faqItems.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 lg:p-8"
              >
                {item.question && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#222222] mb-3">
                    {item.question}
                  </h3>
                )}
                {item.answer && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
