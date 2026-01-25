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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-12 lg:mb-16">
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
                  <h3 className="text-base sm:text-lg font-semibold text-[#222222] mb-3">
                    {item.question}
                  </h3>
                )}
                {item.answer && (
                  <p className="text-sm sm:text-base text-[#565454] leading-relaxed">
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
