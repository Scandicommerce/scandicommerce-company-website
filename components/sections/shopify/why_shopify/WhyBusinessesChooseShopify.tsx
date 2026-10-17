import { ui } from '@/components/integrations/labels'
import { Bullet } from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'

interface Reason {
  title?: string
  description?: string
  bulletPoints?: string[]
  concludingParagraph?: string
}

interface WhyBusinessesChooseData {
  title?: string
  reasons?: Reason[]
}

/** "Category: detail" bullets keep the category bold. */
function BulletText({ text }: { text: string }) {
  const idx = text.indexOf(':')
  if (idx > 0 && idx < 40 && !text.includes('http')) {
    return (
      <>
        <strong className="font-semibold text-white">{text.slice(0, idx + 1)}</strong>
        {text.slice(idx + 1)}
      </>
    )
  }
  return <>{text}</>
}

/** Ink section: reasons as a numbered two-column list over hairlines. */
export default function WhyBusinessesChooseShopify({ whyBusinessesChoose, lang = 'no' }: { whyBusinessesChoose?: WhyBusinessesChooseData; lang?: string }) {
  const reasons = (whyBusinessesChoose?.reasons ?? []).filter((r) => r?.title || r?.description)
  if (!whyBusinessesChoose?.title && reasons.length === 0) return null
  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Hvorfor Shopify' : 'Why Shopify'}</div>
          {whyBusinessesChoose?.title && <h2 className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px]">{whyBusinessesChoose.title}</h2>}
        </div>
        {reasons.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
            {reasons.map((reason, i) => {
              const bullets = (reason.bulletPoints ?? []).filter(Boolean)
              return (
                <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-700 pt-5">
                  <span className="font-mono text-[13px] text-sc-ink-400">{String(i + 1).padStart(2, '0')}</span>
                  {reason.title && <h3 className="m-0 text-[20px] font-bold leading-snug tracking-[-0.01em] text-white">{reason.title}</h3>}
                  {reason.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-300">{reason.description}</p>}
                  {bullets.length > 0 && (
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {bullets.map((b, j) => (
                        <Bullet key={j} dark>
                          <BulletText text={b} />
                        </Bullet>
                      ))}
                    </ul>
                  )}
                  {reason.concludingParagraph && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-300">{reason.concludingParagraph}</p>}
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
