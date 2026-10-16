'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface FaqItem {
  question: string
  answer: string
}

interface PackageFaqProps {
  items?: FaqItem[]
  lang?: string
}

const T = {
  no: 'Spørsmål og svar',
  en: 'Questions and answers',
  sv: 'Frågor och svar',
  da: 'Spørgsmål og svar',
  de: 'Fragen und Antworten',
} as const

function AccordionItem({ question, answer }: FaqItem) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-[#1DEFFA33] px-4 sm:px-8 md:px-12 lg:px-[82px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left transition-opacity hover:opacity-80 md:py-5"
      >
        <span className="pr-4 text-sm font-medium text-white sm:text-base lg:text-lg">{question}</span>
        <FiChevronDown
          className={`flex-shrink-0 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      {/* Grid-rows transition so the panel sizes to its content instead of a
          fixed max-height, which clipped longer answers. */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          isOpen ? 'grid-rows-[1fr] pb-4 md:pb-5' : 'grid-rows-[0fr]'
        }`}
      >
        <p className="min-h-0 text-xs leading-relaxed text-white/80 sm:text-sm lg:text-base">
          {answer}
        </p>
      </div>
    </div>
  )
}

/** Package FAQ, in the same accordion the rest of the site uses. */
export default function PackageFaq({ items, lang = 'en' }: PackageFaqProps) {
  const faqs = (items ?? []).filter((i) => i?.question && i?.answer)
  if (faqs.length === 0) return null

  return (
    <section id="faq" className="scroll-mt-24 bg-[#03C1CA] py-12 md:py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <h2 className="mb-8 text-center text-[26px] font-bold text-white md:mb-10 lg:text-[34px]">
          {T[lang as keyof typeof T] ?? T.en}
        </h2>
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:gap-4 lg:gap-5">
          {faqs.map((item, index) => (
            <AccordionItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
