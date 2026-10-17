import { ui } from '@/components/integrations/labels'

interface PerfectForData {
  perfectForTitle?: string
  perfectForItems?: Array<{
    title: string
    description: string
  }>
}

interface PerfectForProps {
  perfectFor?: PerfectForData
}

/** Use cases as a numbered hairline row, like the process steps on the service pages. */
export default function PerfectFor({ perfectFor }: PerfectForProps) {
  const title = perfectFor?.perfectForTitle
  const items = perfectFor?.perfectForItems
  if (!title && !items?.length) return null

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>Shopify POS</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {items && items.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3 lg:gap-8">
            {items.map((useCase, index) => (
              <li key={index} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className="font-mono text-[13px] text-sc-ink-500">{String(index + 1).padStart(2, '0')}</span>
                {useCase.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{useCase.title}</h3>}
                {useCase.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{useCase.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
