interface FAQItem {
  question?: string
  answer?: string
}

interface FAQData {
  title?: string
  subtitle?: string
  faqs?: FAQItem[]
}

/** Contact FAQ: the same hairline accordion the integration and package pages use. */
export default function FAQ({ faq }: { faq?: FAQData }) {
  const items = (faq?.faqs ?? []).filter((f) => f?.question && f?.answer)
  if (items.length === 0) return null
  return (
    <section id="faq" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className="mx-auto max-w-[880px] px-5 lg:px-8">
        {faq?.title && <h2 className="mb-3 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[36px]">{faq.title}</h2>}
        {faq?.subtitle && <p className="mb-8 mt-0 text-base leading-relaxed text-sc-ink-600">{faq.subtitle}</p>}
        <div className="border-t border-sc-ink-200">
          {items.map((f, i) => (
            <details key={i} className="group border-b border-sc-ink-200 py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-sc-ink-900">
                <h3 className="m-0 inline text-lg">{f.question}</h3>
                <span className="text-sc-ink-500 group-open:hidden">+</span>
                <span className="hidden text-sc-ink-500 group-open:inline">–</span>
              </summary>
              <p className="mt-3 leading-relaxed text-sc-ink-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
