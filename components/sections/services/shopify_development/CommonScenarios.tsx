import Link from 'next/link'
import { ui } from '@/components/integrations/labels'

interface ScenariosData {
  scenariosEyebrow?: string
  scenariosTitle?: string
  scenariosLinkText?: string
  scenariosItems?: Array<{
    title: string
    description: string
    link?: string
  }>
}

interface CommonScenariosProps {
  scenarios?: ScenariosData
}

/** Scenarios as hairline cards, two per row. */
export default function CommonScenarios({ scenarios }: CommonScenariosProps) {
  const title = scenarios?.scenariosTitle
  const linkText = scenarios?.scenariosLinkText || 'Se hvordan vi hjelper'
  const items = scenarios?.scenariosItems

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{scenarios?.scenariosEyebrow || 'Typiske oppdrag'}</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {items.map((scenario, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
                <span className="font-mono text-[13px] text-sc-ink-500">{String(index + 1).padStart(2, '0')}</span>
                {scenario.title && <h3 className="m-0 text-xl font-semibold leading-snug text-sc-ink-900">{scenario.title}</h3>}
                {scenario.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{scenario.description}</p>}
                {scenario.link && (
                  <Link href={scenario.link} className="mt-auto pt-2 text-sm font-semibold text-sc-ink-900 no-underline hover:text-sc-cyan-600">
                    {linkText} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
