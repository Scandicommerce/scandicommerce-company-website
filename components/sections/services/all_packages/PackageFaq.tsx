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

/** Package FAQ: hairline accordion, first item open, same as the integrations pages. */
export default function PackageFaq({ items, lang = 'en' }: PackageFaqProps) {
  const faqs = (items ?? []).filter((i) => i?.question && i?.answer)
  if (faqs.length === 0) return null

  return (
    <section id="faq" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className="mx-auto max-w-[880px] px-5 lg:px-8">
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[36px]">
          {T[lang as keyof typeof T] ?? T.en}
        </h2>
        <div className="border-t border-sc-ink-200">
          {faqs.map((item, index) => (
            <details key={index} className="group border-b border-sc-ink-200 py-5" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-sc-ink-900">
                <h3 className="m-0 inline text-lg">{item.question}</h3>
                <span className="text-sc-ink-500 group-open:hidden">+</span>
                <span className="hidden text-sc-ink-500 group-open:inline">–</span>
              </summary>
              <p className="mt-3 leading-relaxed text-sc-ink-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
