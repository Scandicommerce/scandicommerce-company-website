import { ui } from '@/components/integrations/labels'

interface FactCard {
  statistic?: string
  description?: string
  source?: string
}

interface ShopifyFactsData {
  title?: string
  facts?: FactCard[]
}

/** Facts as stat tiles: mono figure, description, source in small mono. */
export default function ShopifyFacts({ shopifyFacts, lang = 'no' }: { shopifyFacts?: ShopifyFactsData; lang?: string }) {
  const facts = (shopifyFacts?.facts ?? []).filter((f) => f?.statistic || f?.description)
  if (!shopifyFacts?.title && facts.length === 0) return null
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Tall og fakta' : 'Facts and figures'}</div>
          {shopifyFacts?.title && <h2 className={ui.h2}>{shopifyFacts.title}</h2>}
        </div>
        {facts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {facts.map((fact, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-sc-ink-100 bg-white p-6">
                {fact.statistic && <span className="break-words font-mono text-[32px] font-semibold leading-none tracking-[-0.02em] text-sc-ink-900 lg:text-[36px]">{fact.statistic}</span>}
                {fact.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{fact.description}</p>}
                {fact.source && <span className={`mt-auto ${ui.mono}`}>{fact.source}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
