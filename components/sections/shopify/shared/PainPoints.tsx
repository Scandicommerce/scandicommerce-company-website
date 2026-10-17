import { X } from 'lucide-react'
import { ui } from '@/components/integrations/labels'
import { SHOPIFY_T, shopifyLang } from './labels'

export interface PainPointsData {
  title?: string
  leftPoints?: string[]
  rightPoints?: string[]
  /** Platform page only: a closing point across the full width. */
  bottomPoint?: string
}

interface PainPointsProps {
  data?: PainPointsData
  lang?: string
  eyebrow?: string
}

function PainIcon() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sc-ink-200 text-sc-ink-500">
      <X className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
  )
}

/**
 * "Bleeding money" for the platform and POS pages: the pain points as two
 * numbered hairline columns (mono numbers, like the data-flow steps).
 */
export default function PainPoints({ data, lang, eyebrow }: PainPointsProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  const left = (data?.leftPoints ?? []).filter(Boolean)
  const right = (data?.rightPoints ?? []).filter(Boolean)
  const bottom = data?.bottomPoint
  if (!data?.title && left.length === 0 && right.length === 0 && !bottom) return null

  const columns = [left, right].filter((c) => c.length > 0)
  let n = 0

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{eyebrow ?? t.painEyebrow}</div>
          {data?.title && <h2 className={ui.h2}>{data.title}</h2>}
        </div>

        {columns.length > 0 && (
          <div className={`grid grid-cols-1 gap-x-10 ${columns.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {columns.map((points, c) => (
              <ol key={c} className="m-0 list-none p-0">
                {points.map((point) => {
                  n += 1
                  return (
                    <li key={`${c}-${point}`} className="flex items-start gap-4 border-t border-sc-ink-200 py-5">
                      <span className={`${ui.mono} w-6 shrink-0 pt-0.5`}>{String(n).padStart(2, '0')}</span>
                      <PainIcon />
                      <p className="m-0 text-[15px] leading-relaxed text-sc-ink-700 lg:text-base">{point}</p>
                    </li>
                  )
                })}
              </ol>
            ))}
          </div>
        )}

        {bottom && (
          <div className="flex items-start gap-4 border-t border-sc-ink-900 pt-5">
            <span className={`${ui.mono} w-6 shrink-0 pt-0.5`}>{String(n + 1).padStart(2, '0')}</span>
            <PainIcon />
            <p className="m-0 max-w-[760px] text-[15px] font-semibold leading-relaxed text-sc-ink-900 lg:text-base">{bottom}</p>
          </div>
        )}
      </div>
    </section>
  )
}
