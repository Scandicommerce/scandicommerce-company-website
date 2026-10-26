import { ui } from '@/components/integrations/labels'

interface BusinessCard {
  title?: string
  description?: string
}

interface WhichBusinessesData {
  title?: string
  description?: string
  businessCards?: BusinessCard[]
  bottomNote?: string
}

/** Numbered hairline cards, three to a row: who PIM is for. */
export default function WhichBusinesses({ whichBusinesses, lang = 'no' }: { whichBusinesses?: WhichBusinessesData; lang?: string }) {
  const cards = (whichBusinesses?.businessCards ?? []).filter((c) => c?.title || c?.description)
  if (!whichBusinesses?.title && cards.length === 0) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Hvem passer det for' : 'Who it is for'}</div>
          {whichBusinesses?.title && <h2 className={ui.h2}>{whichBusinesses.title}</h2>}
          {whichBusinesses?.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{whichBusinesses.description}</p>}
        </div>
        {cards.length > 0 && (
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {cards.map((card, i) => (
              <li key={i} className={ui.card}>
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {card.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{card.title}</h3>}
                {card.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{card.description}</p>}
              </li>
            ))}
          </ol>
        )}
        {whichBusinesses?.bottomNote && <p className="m-0 max-w-[760px] text-[15px] leading-relaxed text-sc-ink-500">{whichBusinesses.bottomNote}</p>}
      </div>
    </section>
  )
}
