import LocalizedLink from '@/components/ui/LocalizedLink'
import IntegrationCard from '@/components/integrations/IntegrationCard'
import { Faq } from '@/components/integrations/LinkBlocks'
import { ui, type IntegrationCard as Card } from '@/components/integrations/labels'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { INTEGRATION_CARD_PROJECTION } from '@/sanity/lib/templateQueries'
import type { ServiceDepth as Depth } from '@/lib/servicesDepth'

/** Sticky anchor bar, the same one the package detail page uses. */
export function ServiceAnchors({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="sticky top-14 z-20 border-y border-sc-ink-100 bg-white/95 backdrop-blur-md lg:top-[62px]" aria-label="På denne siden">
      <div className={ui.container}>
        <ul className="m-0 flex list-none gap-6 overflow-x-auto py-3.5 p-0 text-[15px] font-medium [scrollbar-width:none]">
          {items.map((a) => (
            <li key={a.id} className="flex-none">
              <a href={`#${a.id}`} className="whitespace-nowrap text-sc-ink-500 transition-colors hover:text-sc-ink-900">{a.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/** Four facts in mono: timeline, price model and the like. */
export function ServiceFacts({ depth }: { depth: Depth }) {
  return (
    <section id="fakta" className="scroll-mt-28 bg-white py-12 lg:py-16">
      <div className={ui.container}>
        <div className={`${ui.eyebrow} mb-5`}>{depth.headings.facts}</div>
        <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 lg:grid-cols-4">
          {depth.facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1 bg-white p-5 lg:p-6">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{f.label}</dt>
              <dd className="m-0 font-mono text-[20px] font-medium leading-tight tracking-tight text-sc-ink-900 lg:text-[24px]">{f.value}</dd>
              {f.note && <dd className="m-0 text-[13px] leading-snug text-sc-ink-500">{f.note}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** What is delivered, with scope notes, on the integration capability rows. */
export function ServiceDeliverables({ depth }: { depth: Depth }) {
  return (
    <section id="leveranser" className="scroll-mt-28 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Leveranser</div>
            <h2 className={ui.h2}>{depth.headings.deliverables}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{depth.headings.deliverablesLead}</p>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0 md:grid-cols-2">
          {depth.deliverables.map((d, i) => (
            <li key={d.name} className="flex gap-4 bg-white p-5 lg:p-6">
              <span className="font-mono text-[13px] leading-6 text-sc-ink-500">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <h3 className="m-0 text-[17px] font-semibold leading-snug text-sc-ink-900">{d.name}</h3>
                <p className="m-0 mt-1 text-[15px] leading-relaxed text-sc-ink-600">{d.text}</p>
                {d.scope && <p className="m-0 mt-2 text-[13px] leading-snug text-sc-ink-400"><span className="font-medium">Omfang:</span> {d.scope}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const CHECK = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

/** Two lists: what the customer has ready, what we take care of. */
export function ServicePrerequisites({ depth }: { depth: Depth }) {
  return (
    <section id="forutsetninger" className="scroll-mt-28 bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid gap-5 lg:grid-cols-[1fr_1fr_1fr] lg:gap-8`}>
        <div className="flex flex-col gap-2.5">
          <div className={ui.eyebrow}>Forutsetninger</div>
          <h2 className={ui.h2}>{depth.headings.prerequisites}</h2>
          <p className="m-0 text-base leading-relaxed text-sc-ink-600">Jo mer som er klart, jo raskere går det. Mangler noe, hjelper vi med å få det på plass.</p>
        </div>
        <div className="rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-6">
          <h3 className="m-0 mb-4 text-[17px] font-bold text-sc-ink-900">Dere har klart</h3>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {depth.youBring.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-[15px] leading-snug text-sc-ink-700">
                <span className="mt-[3px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border border-sc-ink-300 text-transparent" aria-hidden="true">{CHECK}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-sc-ink-900 p-6 text-white">
          <h3 className="m-0 mb-4 text-[17px] font-bold">Vi tar oss av</h3>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {depth.weHandle.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-[15px] leading-snug text-sc-ink-100">
                <span className="mt-[3px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-sc-cyan-500 text-sc-ink-900" aria-hidden="true">{CHECK}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const cardsBySlugQuery = `*[_type == "integrationPage" && language == $language && slug.current in $slugs] ${INTEGRATION_CARD_PROJECTION}`

/** Integration cards for the slugs the service names, in that order. Renders nothing when none exist. */
export async function ServiceIntegrations({ depth, language }: { depth: Depth; language: string }) {
  const cards = await sanityPageFetch<Card[]>(cardsBySlugQuery, { language, slugs: depth.integrationSlugs }, { next: { revalidate: 0 } }).catch(() => [] as Card[])
  const ordered = depth.integrationSlugs.map((s) => (cards ?? []).find((c) => c.slug === s)).filter((c): c is Card => Boolean(c))
  if (ordered.length === 0) return null
  return (
    <section id="integrasjoner" className="scroll-mt-28 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Integrasjoner</div>
            <h2 className={ui.h2}>{depth.headings.integrations}</h2>
          </div>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{depth.headings.integrationsLead}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {ordered.map((c) => <IntegrationCard key={c._id} item={c} language={language} />)}
        </div>
        <div className="mt-6">
          <LocalizedLink href="/integrasjoner" className="text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600">Se alle integrasjoner →</LocalizedLink>
        </div>
      </div>
    </section>
  )
}

export function ServiceFaq({ depth }: { depth: Depth }) {
  return <Faq items={depth.faq} heading={depth.headings.faq} />
}

/** Onward links: packages, cases, integrations. */
export function ServiceLinks({ depth }: { depth: Depth }) {
  return (
    <section id="les-videre" className="scroll-mt-28 bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <div className={`${ui.eyebrow} mb-5`}>{depth.headings.links}</div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
          {depth.links.map((l) => (
            <li key={l.href + l.title}>
              <LocalizedLink href={l.href} className={`${ui.card} group h-full no-underline`}>
                <span className={ui.eyebrow}>{l.eyebrow}</span>
                <span className="text-[20px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900">{l.title}</span>
                <span className="flex-1 text-[15px] leading-relaxed text-sc-ink-600">{l.text}</span>
                <span className="mt-auto text-sm font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600">{l.linkText ?? 'Les mer'} →</span>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** The full depth block in the order every service page uses. */
export default async function ServiceDepthSections({ depth, language, anchors }: { depth: Depth; language: string; anchors?: { id: string; label: string }[] }) {
  return (
    <>
      {anchors && <ServiceAnchors items={anchors} />}
      <ServiceFacts depth={depth} />
      <ServiceDeliverables depth={depth} />
      <ServicePrerequisites depth={depth} />
      <ServiceIntegrations depth={depth} language={language} />
      <ServiceFaq depth={depth} />
      <ServiceLinks depth={depth} />
    </>
  )
}
