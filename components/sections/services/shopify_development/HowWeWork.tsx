import { ui } from '@/components/integrations/labels'

interface HowWeWorkData {
  howWeWorkEyebrow?: string
  howWeWorkTitle?: string
  howWeWorkSteps?: Array<{
    number: number
    title: string
    description: string
  }>
}

interface HowWeWorkProps {
  howWeWork?: HowWeWorkData
}

/** Process as a numbered row: mono step numbers over a hairline, like the data-flow steps. */
export default function HowWeWork({ howWeWork }: HowWeWorkProps) {
  const title = howWeWork?.howWeWorkTitle
  const steps = howWeWork?.howWeWorkSteps

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{howWeWork?.howWeWorkEyebrow || 'Prosess'}</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {steps && steps.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <li key={index} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className="font-mono text-[13px] text-sc-ink-500">{String(index + 1).padStart(2, '0')}</span>
                {step.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>}
                {step.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
