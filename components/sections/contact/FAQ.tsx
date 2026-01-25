'use client'

import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface FAQItem {
  question?: string
  answer?: string
}

interface FAQData {
  title?: string
  subtitle?: string
  faqs?: FAQItem[]
}

interface FAQProps {
  faq?: FAQData
}

// Default FAQs
const defaultFaqs: FAQItem[] = [
  {
    question: 'What happens during the free consultation?',
    answer: "During our free consultation, we'll discuss your current e-commerce setup, understand your business goals, identify challenges you're facing, and explore how Shopify can help you grow. We'll also provide initial recommendations and outline potential next steps.",
  },
  {
    question: 'How long does a typical project take?',
    answer: "Project timelines vary based on complexity. A simple Shopify store setup typically takes 2-4 weeks. Custom development projects usually range from 4-8 weeks. Large enterprise migrations can take 8-16 weeks. We'll provide a detailed timeline during our consultation.",
  },
  {
    question: 'Do you work with businesses outside Norway?',
    answer: "Yes! While we're based in Oslo, Norway, we work with clients across Scandinavia and Europe. We've successfully delivered projects for businesses in Sweden, Denmark, Finland, Germany, and the UK. Our team is fluent in English and Norwegian.",
  },
  {
    question: 'What if I need ongoing support after launch?',
    answer: 'We offer flexible support packages for post-launch needs. This includes monthly retainer options, ad-hoc support hours, and dedicated support plans. Our team provides ongoing maintenance, updates, optimization, and strategic guidance to ensure your store continues to perform.',
  },
]

function FAQAccordionItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-[#1DEFFA33] px-4 sm:px-8 md:px-12 lg:px-[82px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-5 flex items-center justify-between text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-white font-medium text-sm sm:text-base lg:text-lg pr-4">{question}</span>
        <FiChevronDown
          className={`text-white flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4 md:pb-5' : 'max-h-0'
          }`}
      >
        <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQ({ faq }: FAQProps) {
  const title = faq?.title || 'Quick Questions?'
  const subtitle = faq?.subtitle || "Choose a time that works for you. We'll discuss your goals and create a custom plan."
  const faqs = faq?.faqs && faq.faqs.length > 0 ? faq.faqs : defaultFaqs

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#03C1CA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col gap-3 md:gap-4 lg:gap-5">
          {faqs.map((item, index) => (
            <FAQAccordionItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
