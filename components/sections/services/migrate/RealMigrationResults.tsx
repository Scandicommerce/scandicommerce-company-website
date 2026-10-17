import { ui } from '@/components/integrations/labels'

interface ResultsData {
  resultsEyebrow?: string
  resultsTitle?: string
  resultsItems?: Array<{
    metric: string
    title: string
    description: string
  }>
}

interface RealMigrationResultsProps {
  results?: ResultsData
  lang?: string
}

/** Outcomes as hairline cards with the figure in mono, like the case-study results. */
export default function RealMigrationResults({ results, lang }: RealMigrationResultsProps) {
  const isNo = (lang ?? 'no') === 'no'
  const title = results?.resultsTitle
  const items = results?.resultsItems

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{results?.resultsEyebrow || (isNo ? 'Resultater' : 'Results')}</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {items.map((result, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
                {result.metric && <div className="font-mono text-[36px] font-medium leading-none tracking-tight text-sc-ink-900 lg:text-[44px]">{result.metric}</div>}
                {result.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{result.title}</h3>}
                {result.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{result.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
