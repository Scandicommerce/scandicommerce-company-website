import { ui } from '@/components/integrations/labels'

interface ProcessData {
  processEyebrow?: string
  processTitle?: string
  processSubtitle?: string
  processPhases?: Array<{
    week: string
    title: string
    activities: string[]
  }>
}

interface MigrationProcessProps {
  process?: ProcessData
}

/** Migration phases as a numbered row over a hairline, week label in mono. */
export default function MigrationProcess({ process }: MigrationProcessProps) {
  const title = process?.processTitle
  const subtitle = process?.processSubtitle
  const phases = process?.processPhases

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {(title || subtitle) && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{process?.processEyebrow || 'Prosess'}</div>
            {title && <h2 className={ui.h2}>{title}</h2>}
            {subtitle && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{subtitle}</p>}
          </div>
        )}

        {phases && phases.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {phases.map((phase, index) => (
              <li key={index} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className="font-mono text-[13px] text-sc-ink-500">
                  {String(index + 1).padStart(2, '0')}
                  {phase.week ? ` · ${phase.week}` : ''}
                </span>
                {phase.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{phase.title}</h3>}
                {phase.activities && phase.activities.length > 0 && (
                  <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] leading-relaxed text-sc-ink-600">
                    {phase.activities.map((activity, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan-500" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
