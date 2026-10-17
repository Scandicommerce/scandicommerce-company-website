import { ui } from '@/components/integrations/labels'

interface InvestmentBenefit {
  title?: string
  description?: string
}

interface WhyGoodInvestmentData {
  title?: string
  description?: string
  benefits?: InvestmentBenefit[]
  bottomNote?: string
}

/** Numbered benefits on the HowWeWork pattern: mono numbers over a hairline, note in a tinted card. */
export default function WhyGoodInvestment({ whyGoodInvestment, lang = 'no' }: { whyGoodInvestment?: WhyGoodInvestmentData; lang?: string }) {
  const benefits = (whyGoodInvestment?.benefits ?? []).filter((b) => b?.title || b?.description)
  if (!whyGoodInvestment?.title && benefits.length === 0) return null
  const cols = benefits.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Hvorfor det lønner seg' : 'Why it pays off'}</div>
          {whyGoodInvestment?.title && <h2 className={ui.h2}>{whyGoodInvestment.title}</h2>}
          {whyGoodInvestment?.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{whyGoodInvestment.description}</p>}
        </div>
        {benefits.length > 0 && (
          <ol className={`m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 ${cols} lg:gap-8`}>
            {benefits.map((b, i) => (
              <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {b.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{b.title}</h3>}
                {b.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{b.description}</p>}
              </li>
            ))}
          </ol>
        )}
        {whyGoodInvestment?.bottomNote && (
          <p className="m-0 rounded-lg border border-sc-cyan-100 bg-sc-cyan-50 p-6 text-[15px] leading-relaxed text-sc-ink-700">{whyGoodInvestment.bottomNote}</p>
        )}
      </div>
    </section>
  )
}
