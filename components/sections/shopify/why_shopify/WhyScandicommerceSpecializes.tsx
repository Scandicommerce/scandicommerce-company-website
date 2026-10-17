import { ui } from '@/components/integrations/labels'

interface SpecializationCard {
  title?: string
  description?: string
}

interface WhyScandicommerceSpecializesData {
  title?: string
  description?: string
  specializations?: SpecializationCard[]
}

/** Why we only do Shopify: numbered hairline cards, two to a row. */
export default function WhyScandicommerceSpecializes({ whyScandicommerceSpecializes, lang = 'no' }: { whyScandicommerceSpecializes?: WhyScandicommerceSpecializesData; lang?: string }) {
  const items = (whyScandicommerceSpecializes?.specializations ?? []).filter((s) => s?.title || s?.description)
  if (!whyScandicommerceSpecializes?.title && items.length === 0) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{lang === 'no' ? 'Hvorfor oss' : 'Why us'}</div>
            {whyScandicommerceSpecializes?.title && <h2 className={ui.h2}>{whyScandicommerceSpecializes.title}</h2>}
          </div>
          {whyScandicommerceSpecializes?.description && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{whyScandicommerceSpecializes.description}</p>}
        </div>
        {items.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:gap-5">
            {items.map((s, i) => (
              <li key={i} className={ui.card}>
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {s.title && <h3 className="m-0 text-[20px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900">{s.title}</h3>}
                {s.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{s.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
