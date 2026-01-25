'use client'

interface FAQData {
  faqTitle?: string
  faqItems?: Array<{
    question: string
    answer: string
  }>
}

interface FAQProps {
  faq?: FAQData
}

export default function FAQ({ faq }: FAQProps) {
  const title = faq?.faqTitle
  const items = faq?.faqItems

  return (
    <section className="bg-[#03C1CA] py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative circles - hidden on mobile for cleaner look */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-white/5 hidden sm:block"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-16 sm:w-32 h-16 sm:h-32 rounded-full bg-white/5 hidden sm:block"></div>
      <div className="absolute top-1/2 left-10 sm:left-20 w-12 sm:w-24 h-12 sm:h-24 rounded-full bg-white/5 -translate-y-1/2 hidden lg:block"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
            {title}
          </h2>
        )}

        {items && items.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-[#1CD8E2]/50 backdrop-blur-sm p-4 sm:p-6"
              >
                {item.question && (
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {item.question}
                  </h3>
                )}
                {item.answer && (
                  <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
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
