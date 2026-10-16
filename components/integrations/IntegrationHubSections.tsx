import CategoryCard from './CategoryCard'
import DataFlowAnimation from './DataFlowAnimation'
import IntegrationGrid from './IntegrationGrid'
import { T, lang, ui, type CategorySummary, type IntegrationCard } from './labels'

export type HubData = { categories: CategorySummary[]; integrations: IntegrationCard[] }

/**
 * Hub-only sections rendered on the integrations pillar page, between the hero
 * and the long-form body: category cards, the filterable grid, and the
 * Make.com vs custom code comparison.
 */
export default function IntegrationHubSections({ data, language }: { data: HubData; language: string }) {
  const t = T[lang(language)]
  const isNo = lang(language) === 'no'
  const nodeLabels = data.categories.slice(0, 4).map((c) => c.title)
  const overviewNodes = data.categories.slice(0, 4).map((c) => ({
    label: c.title,
    logos: data.integrations.filter((i) => i.category?.key === c.key && i.logoUrl).slice(0, 3).map((i) => i.logoUrl as string),
  }))
  const overviewSteps = [
    { from: 'Shopify', to: nodeLabels[0] ?? '', payload: isNo ? 'ordre #1042' : 'order #1042' },
    { from: nodeLabels[1] ?? '', to: 'Shopify', payload: isNo ? 'lagerbeholdning' : 'inventory' },
    { from: 'Shopify', to: nodeLabels[2] ?? '', payload: isNo ? 'forsendelse' : 'shipment' },
    { from: nodeLabels[3] ?? '', to: 'Shopify', payload: isNo ? 'betalt' : 'paid' },
  ]
  return (
    <>
      <section className={`${ui.container} pt-4`}>
        <DataFlowAnimation variant="overview" systems={[{ name: 'Shopify', role: 'source' }]} steps={overviewSteps} language={language} nodes={overviewNodes} />
      </section>
      <section className={`${ui.container} py-16`}>
        <div className="mb-8 flex flex-col gap-2.5">
          <div className={ui.eyebrow}>{t.bySystem}</div>
          <h2 className={ui.h2}>{t.bySystemHeading}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.categories.map((c) => (
            <CategoryCard key={c._id} category={c} language={language} />
          ))}
        </div>
      </section>

      <section id="alle" className="bg-sc-ink-50 py-16">
        <div className={ui.container}>
          <div className="mb-8 flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{t.eyebrowAll}</div>
            <h2 className={ui.h2}>{t.allHeading}</h2>
          </div>
          <IntegrationGrid items={data.integrations} categories={data.categories} language={language} />
        </div>
      </section>

      <section className={`${ui.container} py-16`}>
        <div className="mb-8 flex max-w-[720px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{t.howEyebrow}</div>
          <h2 className={ui.h2}>{t.howHeading}</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-white p-8">
            <div className={ui.mono}>make.com</div>
            <h3 className="text-2xl font-semibold text-sc-ink-900">Make.com</h3>
            <p className="leading-relaxed text-sc-ink-600">{t.makeBody}</p>
            <ul className="list-disc space-y-1 pl-5 text-[15px] text-sc-ink-600">
              {t.makeBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-sc-ink-900 p-8 text-white">
            <div className="font-mono text-[13px] text-sc-ink-300">shopify app · webhooks · supabase</div>
            <h3 className="text-2xl font-semibold">{lang(language) === 'no' ? 'Egen kode' : 'Custom code'}</h3>
            <p className="leading-relaxed text-sc-ink-200">{t.codeBody}</p>
            <ul className="list-disc space-y-1 pl-5 text-[15px] text-sc-ink-200">
              {t.codeBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
