import { ui } from '@/components/integrations/labels'

interface SavingsCard {
  title?: string
  description?: string
  hours?: string
}

interface TimeSavingsData {
  title?: string
  description?: string
  savingsCards?: SavingsCard[]
  summaryTitle?: string
  summaryDescription?: string
}

/** Sanity may store "Timer spart per uke: 5-10"; split that into label and figure. */
function splitHours(hours: string, fallbackLabel: string): { label: string; value: string } {
  const idx = hours.indexOf(':')
  if (idx > 0 && idx < hours.length - 1) return { label: hours.slice(0, idx).trim(), value: hours.slice(idx + 1).trim() }
  return { label: fallbackLabel, value: hours.trim() }
}

/** Ink section: hours saved per task as mono figures on hairline cards, summary under a hairline. */
export default function TimeSavings({ timeSavings, lang = 'no' }: { timeSavings?: TimeSavingsData; lang?: string }) {
  const isNo = lang === 'no'
  const cards = (timeSavings?.savingsCards ?? []).filter((c) => c?.title || c?.hours)
  if (!timeSavings?.title && cards.length === 0) return null
  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{isNo ? 'Tid spart' : 'Time saved'}</div>
          {timeSavings?.title && <h2 className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px]">{timeSavings.title}</h2>}
          {timeSavings?.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-300">{timeSavings.description}</p>}
        </div>

        {cards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {cards.map((card, i) => {
              const hours = card.hours ? splitHours(card.hours, isNo ? 'Timer spart per uke' : 'Hours saved per week') : null
              return (
                <div key={i} className="flex flex-col gap-3 rounded-lg border border-sc-ink-700 bg-sc-ink-800 p-6">
                  {hours && (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[36px] font-semibold leading-none tracking-[-0.02em] text-sc-cyan-300">{hours.value}</span>
                      <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-sc-ink-400">{hours.label}</span>
                    </div>
                  )}
                  {card.title && <h3 className="m-0 text-lg font-semibold leading-snug text-white">{card.title}</h3>}
                  {card.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-300">{card.description}</p>}
                </div>
              )
            })}
          </div>
        )}

        {(timeSavings?.summaryTitle || timeSavings?.summaryDescription) && (
          <div className="grid grid-cols-1 gap-3 border-t border-sc-ink-700 pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
            {timeSavings.summaryTitle && <h3 className="m-0 text-[22px] font-bold leading-snug tracking-[-0.01em] text-white lg:text-[26px]">{timeSavings.summaryTitle}</h3>}
            {timeSavings.summaryDescription && <p className="m-0 text-base leading-relaxed text-sc-ink-300 lg:text-lg">{timeSavings.summaryDescription}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
