'use client'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "How does PIM differ from Shopify's built-in product management?",
    answer: "While Shopify offers basic product management capabilities, PIM systems provide advanced features like bulk editing, data validation, workflow management, digital asset management, and multi-channel publishing. PIM solutions are purpose-built for handling complex product information at scale.",
  },
  {
    question: 'Can I still manage my products directly in Shopify after implementing a PIM?',
    answer: 'Yes, you typically can still make changes in Shopify. However, most businesses adopt a "PIM-first" approach where all product information changes are made in the PIM system and then synchronized to Shopify. This ensures consistency across all channels.',
  },
  {
    question: 'How long does it take to see ROI from a PIM implementation?',
    answer: "Most mid-sized Shopify merchants see full ROI within 6-12 months. The returns come from improved team productivity, higher conversion rates, lower return rates, and faster time-to-market for new products. The larger and more complex your catalog, the faster you'll typically see returns.",
  },
]

export default function FAQ() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-12 lg:mb-16">
          Common Questions About PIM for Shopify
        </h2>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#F8F8F8] p-6 lg:p-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-[#222222] mb-3">
                {item.question}
              </h3>
              <p className="text-sm sm:text-base text-[#565454] leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

