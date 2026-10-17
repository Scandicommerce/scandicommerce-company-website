import { ui } from '@/components/integrations/labels'

interface AISolution {
  title?: string
  description?: string
}

interface ShopifyAiData {
  title?: string
  description?: string
  aiSolutions?: AISolution[]
}

/** AI in Shopify: numbered steps over a hairline on the ink-50 surface. */
export default function ShopifyAI({ shopifyAi, lang = 'no' }: { shopifyAi?: ShopifyAiData; lang?: string }) {
  const solutions = (shopifyAi?.aiSolutions ?? []).filter((s) => s?.title || s?.description)
  if (!shopifyAi?.title && solutions.length === 0) return null
  const cols = solutions.length >= 4 && solutions.length % 3 !== 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{lang === 'no' ? 'Shopify og KI' : 'Shopify and AI'}</div>
          {shopifyAi?.title && <h2 className={ui.h2}>{shopifyAi.title}</h2>}
          {shopifyAi?.description && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{shopifyAi.description}</p>}
        </div>
        {solutions.length > 0 && (
          <ol className={`m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 ${cols} lg:gap-8`}>
            {solutions.map((s, i) => (
              <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {s.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{s.title}</h3>}
                {s.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{s.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
