import { ui } from '@/components/integrations/labels'
import { Bullet } from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'

interface ApplicationArea {
  title?: string
  description?: string
  features?: string[]
  benefit?: string
}

interface HowWeApplyAiData {
  title?: string
  applicationAreas?: ApplicationArea[]
}

/** Ink section: three application areas as hairline cards with bullet lists and a benefit line. */
export default function HowWeApplyAI({ howWeApplyAi, lang = 'no' }: { howWeApplyAi?: HowWeApplyAiData; lang?: string }) {
  const areas = (howWeApplyAi?.applicationAreas ?? []).filter((a) => a?.title || a?.description)
  if (!howWeApplyAi?.title && areas.length === 0) return null
  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Bruksområder' : 'Where we apply it'}</div>
          {howWeApplyAi?.title && <h2 className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px]">{howWeApplyAi.title}</h2>}
        </div>
        {areas.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {areas.map((area, i) => {
              const features = (area.features ?? []).filter(Boolean)
              return (
                <div key={i} className="flex flex-col gap-4 rounded-lg border border-sc-ink-700 bg-sc-ink-800 p-6">
                  <span className="font-mono text-[13px] text-sc-ink-400">{String(i + 1).padStart(2, '0')}</span>
                  {area.title && <h3 className="m-0 text-[20px] font-bold leading-snug tracking-[-0.01em] text-white">{area.title}</h3>}
                  {area.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-300">{area.description}</p>}
                  {features.length > 0 && (
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {features.map((f, j) => (
                        <Bullet key={j} dark>
                          {f}
                        </Bullet>
                      ))}
                    </ul>
                  )}
                  {area.benefit && <p className="m-0 mt-auto border-t border-sc-ink-700 pt-4 text-sm font-semibold text-sc-cyan-300">{area.benefit}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
