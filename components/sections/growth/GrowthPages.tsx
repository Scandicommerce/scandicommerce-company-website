import React from 'react'
import {
  ArrowRight,
  ChartLine,
  Compass,
  Handshake,
  Info,
  Mail,
  MousePointerClick,
  Search,
  Share2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import ServiceHero from '@/components/sections/services/ServiceHero'
import { CtaBand, Faq } from '@/components/integrations/LinkBlocks'
import { ui } from '@/components/integrations/labels'
import { growthChildren, growthHref, growthHub, findGrowthService, type GrowthService } from '@/lib/growthServices'
import {
  findGrowthContent,
  growthHubContent,
  growthStageOf,
  type GrowthFlow,
  type GrowthInsight,
  type GrowthPageContent,
  type GrowthStage,
} from '@/lib/growthContent'
import { contactHref, PACKAGES_SLUG } from '@/lib/routes'
import { GrowthChartView } from './GrowthCharts'

/**
 * Growth marketing hub and service pages, on the Tjenester layout
 * (components/pages/services): ServiceHero, facts, deliverables, process,
 * FAQ, onward links and the ink CTA band. Every page names its place in the
 * growth model, so the pages read as one story.
 */

const HERO_BUTTONS = [
  { text: 'Book møte', link: '/kontakt', variant: 'primary' as const },
  { text: 'Se pakkene', link: `/${PACKAGES_SLUG.no}`, variant: 'secondary' as const },
]

const CTA = {
  heading: 'Klar for mer vekst?',
  text: 'Fortell oss hvor butikken står i dag, så foreslår vi hvor det lønner seg å starte.',
  buttonLabel: 'Book møte',
}

/** What a finished page holds; shown on pages that have no copy yet. */
const TEMPLATE_BRIEF: { name: string; text: string }[] = [
  { name: 'Kort fortalt', text: 'Fire fakta: kanaler eller kjerne, hva vi starter med, hvordan vi jobber videre og hva vi måler.' },
  { name: 'Hvorfor', text: 'Hvorfor tjenesten betyr noe for en nettbutikk, med ett forskningspunkt og kilde.' },
  { name: 'Når du trenger dette', text: 'Fire situasjoner kunden kjenner seg igjen i.' },
  { name: 'Leveranser', text: 'Rundt seks leveranser i den rekkefølgen de skjer, og hva som ikke er inkludert.' },
  { name: 'De første 90 dagene', text: 'Tre steg, og de tre måltallene vi styrer etter.' },
  { name: 'Vanlige spørsmål', text: 'Fire spørsmål kunder faktisk stiller før de kjøper.' },
]

/**
 * One Lucide icon per top-level service, shown on the hub model only
 * (design system: Lucide, 1.75 stroke, used sparingly).
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'merkevare-og-strategi': Compass,
  'sporing-og-analyse': ChartLine,
  sem: MousePointerClick,
  some: Share2,
  affiliate: Handshake,
  seo: Search,
  'e-postmarkedsforing': Mail,
  cro: TrendingUp,
}
const ICON_STROKE = 1.75

const sectionLead = 'm-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg'

/** "Steg 2 · Fang etterspørselen", or "Grunnmuren · Riktig data" for the foundation. */
function stageEyebrow(slug: string): string | undefined {
  const stage = growthStageOf(slug)
  if (!stage) return undefined
  const index = growthHubContent.model.stages.indexOf(stage)
  return index >= 0 ? `Steg ${index + 1} · ${stage.label}` : `${stage.label} · Riktig data`
}

function DraftNotice() {
  return (
    <div className="border-b border-sc-cyan-100 bg-sc-cyan-50">
      <div className={`${ui.container} flex items-center gap-2 py-2.5 text-[13px] text-sc-cyan-800`}>
        <Info className="h-4 w-4 flex-shrink-0" strokeWidth={ICON_STROKE} aria-hidden="true" />
        Utkast – innholdet er ikke godkjent ennå, og siden er ikke indeksert.
      </div>
    </div>
  )
}

/** Eyebrow and heading on the left, lead on the right: the Tjenester section header. */
function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="flex flex-col gap-2.5">
        <div className={ui.eyebrow}>{eyebrow}</div>
        <h2 className={`m-0 ${ui.h2}`}>{title}</h2>
      </div>
      {lead && <p className={sectionLead}>{lead}</p>}
    </div>
  )
}

/** Hero panel: the model with this service's stage and service marked, so every page shows where it fits. */
function ModelPosition({ service }: { service: GrowthService }) {
  const { stages, foundation } = growthHubContent.model
  const current = growthStageOf(service.slug)
  const root = service.parent ?? service.slug
  const rows = [...stages, foundation]
  return (
    <div>
      <div className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">Her i modellen</div>
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {rows.map((stage, index) => {
          const active = stage === current
          const isFoundation = stage === foundation
          return (
            <li
              key={stage.title}
              className={`rounded-lg border bg-white p-4 ${active ? 'border-sc-cyan-500' : 'border-sc-ink-100'} ${
                isFoundation ? 'mt-1.5 border-dashed' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="w-5 flex-none font-mono text-[13px] text-sc-ink-500">
                  {isFoundation ? '—' : String(index + 1).padStart(2, '0')}
                </span>
                <span className={`text-[15px] font-semibold ${active ? 'text-sc-ink-900' : 'text-sc-ink-500'}`}>{stage.title}</span>
              </div>
              <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0 pl-8">
                {stage.services.map((slug) => {
                  const item = findGrowthService(slug)
                  if (!item) return null
                  const isCurrent = slug === root
                  return (
                    <li key={slug}>
                      <LocalizedLink
                        href={growthHref(slug)}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={
                          isCurrent
                            ? 'inline-flex items-center rounded-full bg-sc-ink-900 px-2.5 py-1 text-xs font-medium text-white'
                            : `${ui.chip} transition-colors hover:border-sc-ink-400 hover:text-sc-ink-900`
                        }
                      >
                        {isCurrent && service.parent ? `${item.label} · ${service.label}` : item.label}
                      </LocalizedLink>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
      <LocalizedLink href={growthHref()} className="mt-5 inline-block text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600">
        Se hele modellen →
      </LocalizedLink>
    </div>
  )
}

function FactsSection({ facts }: { facts: NonNullable<GrowthPageContent['facts']> }) {
  return (
    <section className="bg-white pb-12 lg:pb-16">
      <div className={ui.container}>
        <div className={`${ui.eyebrow} mb-5`}>Kort fortalt</div>
        <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 bg-white p-5 lg:p-6">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{fact.label}</dt>
              <dd className="m-0 font-mono text-[18px] font-medium leading-tight tracking-tight text-sc-ink-900 lg:text-[22px]">{fact.value}</dd>
              {fact.note && <dd className="m-0 text-[13px] leading-snug text-sc-ink-500">{fact.note}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function InsightCard({ insight }: { insight: GrowthInsight }) {
  return (
    <figure className="m-0 flex flex-col gap-3 rounded-lg border border-sc-ink-100 bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">Forskningen</div>
      <h3 className="m-0 text-[19px] font-semibold leading-snug text-sc-ink-900">{insight.title}</h3>
      <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{insight.text}</p>
      {insight.chart && <GrowthChartView chart={insight.chart} />}
      <p className="m-0 text-[13px] text-sc-ink-500">
        Kilde:{' '}
        <a href={insight.source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-sc-cyan-600">
          {insight.source.label}
        </a>
      </p>
    </figure>
  )
}

function FlowDiagram({ flow }: { flow: GrowthFlow }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{flow.title}</figcaption>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
        {flow.stages.map((stage, index) => (
          <React.Fragment key={stage.title}>
            {index > 0 && (
              <div className="flex items-center justify-center text-sc-ink-300 lg:px-3" aria-hidden="true">
                <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" strokeWidth={ICON_STROKE} />
              </div>
            )}
            <div className={`flex-1 rounded-lg border bg-white p-5 ${index === 1 ? 'border-sc-cyan-500' : 'border-sc-ink-100'}`}>
              <h3 className="m-0 mb-2 text-[15px] font-semibold text-sc-ink-900">{stage.title}</h3>
              <ul className="m-0 list-none space-y-1 p-0 text-[14px] text-sc-ink-600">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>
    </figure>
  )
}

function WhySection({ why }: { why: NonNullable<GrowthPageContent['why']> }) {
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid items-start gap-10 ${why.insight ? 'lg:grid-cols-[1fr_1.1fr] lg:gap-16' : ''}`}>
        <div className={`flex flex-col gap-2.5 ${why.insight ? '' : 'max-w-[760px]'}`}>
          <div className={ui.eyebrow}>Hvorfor</div>
          <h2 className={`m-0 ${ui.h2}`}>{why.title}</h2>
          {why.paragraphs.map((paragraph) => (
            <p key={paragraph} className="m-0 mt-2 text-base leading-relaxed text-sc-ink-600 lg:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
        {why.insight && <InsightCard insight={why.insight} />}
      </div>
      {why.flow && (
        <div className={`${ui.container} mt-10 lg:mt-12`}>
          <FlowDiagram flow={why.flow} />
        </div>
      )}
    </section>
  )
}

function SituationsSection({ situations }: { situations: NonNullable<GrowthPageContent['situations']> }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Når du trenger dette" title="Kjenner du deg igjen?" />
        <ul className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0 md:grid-cols-2">
          {situations.map((item) => (
            <li key={item.title} className="bg-white p-5 lg:p-6">
              <h3 className="m-0 text-[17px] font-semibold leading-snug text-sc-ink-900">{item.title}</h3>
              <p className="m-0 mt-1 text-[15px] leading-relaxed text-sc-ink-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Numbered rows, as ServiceDeliverables on the Tjenester pages. */
function NumberedList({ items }: { items: { name: string; text: string }[] }) {
  return (
    <ol className="m-0 grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 p-0 md:grid-cols-2">
      {items.map((item, index) => (
        <li key={item.name} className="flex gap-4 bg-white p-5 lg:p-6">
          <span className="font-mono text-[13px] leading-6 text-sc-ink-500">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <h3 className="m-0 text-[17px] font-semibold leading-snug text-sc-ink-900">{item.name}</h3>
            <p className="m-0 mt-1 text-[15px] leading-relaxed text-sc-ink-600">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function DeliverablesSection({ deliverables, notIncluded }: { deliverables: NonNullable<GrowthPageContent['deliverables']>; notIncluded?: string[] }) {
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead
          eyebrow="Leveranser"
          title="Dette får du"
          lead="Fra revisjon til løpende oppfølging. Du kan starte med én del og bygge videre."
        />
        <NumberedList items={deliverables} />
        {notIncluded?.length ? (
          <p className="m-0 mt-5 text-[14px] leading-relaxed text-sc-ink-500">
            <span className="font-medium text-sc-ink-700">Ikke inkludert:</span> {notIncluded.join(' · ')}
          </p>
        ) : null}
      </div>
    </section>
  )
}

/** The first 90 days as a numbered row, with the KPIs we steer by underneath. */
function ProcessSection({
  title,
  steps,
  kpis,
}: {
  title: string
  steps: NonNullable<GrowthPageContent['process']>
  kpis?: GrowthPageContent['kpis']
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Prosess" title={title} />
        <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li key={step.period} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
              <span className="font-mono text-[13px] text-sc-ink-500">{step.period}</span>
              <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.text}</p>
            </li>
          ))}
        </ol>
        {kpis?.length ? (
          <div className="mt-12 lg:mt-14">
            <div className={`${ui.eyebrow} mb-5`}>Det vi styrer etter</div>
            <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 md:grid-cols-3">
              {kpis.map((kpi) => (
                <div key={kpi.name} className="bg-white p-5 lg:p-6">
                  <dt className="text-[17px] font-semibold text-sc-ink-900">{kpi.name}</dt>
                  <dd className="m-0 mt-1 text-[15px] leading-relaxed text-sc-ink-600">{kpi.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/** Onward links: the service's channel pages first, then related services. Three at most. */
function LinksSection({ service, related }: { service: GrowthService; related?: GrowthPageContent['related'] }) {
  const channels = growthChildren(service.slug).map((child) => ({ target: child, eyebrow: 'Kanal', text: child.lead }))
  const others = (related ?? []).flatMap((item) => {
    const target = findGrowthService(item.slug)
    return target ? [{ target, eyebrow: stageEyebrow(target.slug) ?? growthHub.label, text: item.why }] : []
  })
  const items = [...channels, ...others].slice(0, 3)
  if (!items.length) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <div className={`${ui.eyebrow} mb-5`}>Les videre</div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
          {items.map(({ target, eyebrow, text }) => (
            <li key={target.slug}>
              <LocalizedLink href={growthHref(target.slug)} className={`${ui.card} group h-full no-underline`}>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-500">{eyebrow}</span>
                <span className="text-[20px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900">{target.label}</span>
                <span className="flex-1 text-[15px] leading-relaxed text-sc-ink-600">{text}</span>
                <span className="mt-auto text-sm font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600">Les mer →</span>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BriefSection() {
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead
          eyebrow="Kommer"
          title="Innholdet skrives nå"
          lead="Siden følger samme mal som de andre Growth-sidene. Dette skal stå her når den er ferdig."
        />
        <NumberedList items={TEMPLATE_BRIEF} />
      </div>
    </section>
  )
}

export function GrowthServicePage({ service }: { service: GrowthService }) {
  const content = findGrowthContent(service.slug)
  return (
    <>
      <DraftNotice />
      <ServiceHero
        eyebrow={stageEyebrow(service.slug)}
        title={service.heroTitle ?? service.title}
        highlight={content?.highlight}
        description={service.lead}
        buttons={HERO_BUTTONS}
        highlights={content?.highlights}
        visual={<ModelPosition service={service} />}
      />
      {content ? (
        <>
          {content.facts?.length ? <FactsSection facts={content.facts} /> : null}
          {content.why && <WhySection why={content.why} />}
          {content.situations?.length ? <SituationsSection situations={content.situations} /> : null}
          {content.deliverables?.length ? <DeliverablesSection deliverables={content.deliverables} notIncluded={content.notIncluded} /> : null}
          {content.process?.length ? <ProcessSection title="De første 90 dagene" steps={content.process} kpis={content.kpis} /> : null}
          <Faq items={content.faq} heading="Vanlige spørsmål" />
        </>
      ) : (
        <BriefSection />
      )}
      <LinksSection service={service} related={content?.related} />
      <CtaBand {...CTA} buttonHref={contactHref('no')} />
    </>
  )
}

export function GrowthHubPage() {
  const content = growthHubContent
  return (
    <>
      <DraftNotice />
      <ServiceHero
        eyebrow={growthHub.label}
        title={growthHub.title}
        highlight={content.highlight}
        description={growthHub.lead}
        buttons={HERO_BUTTONS}
        highlights={content.highlights}
      />
      <ModelSection intro={content.intro} />
      <PrinciplesSection principles={content.principles} />
      <ProcessSection title="Slik starter vi" steps={content.process} kpis={content.kpis} />
      <Faq items={content.faq} heading="Vanlige spørsmål" />
      <CtaBand {...CTA} buttonHref={contactHref('no')} />
    </>
  )
}

/** A service in the model, with its channel pages as small links. */
function ModelServiceLink({ slug, onDark }: { slug: string; onDark?: boolean }) {
  const service = findGrowthService(slug)
  if (!service) return null
  const Icon = SERVICE_ICONS[slug]
  const children = growthChildren(slug)
  return (
    <div className={`rounded-lg px-3.5 py-3 ${onDark ? 'bg-white/10' : 'bg-sc-ink-50'}`}>
      <LocalizedLink href={growthHref(slug)} className="group flex items-center gap-2.5">
        {Icon && <Icon className={`h-4 w-4 flex-shrink-0 ${onDark ? 'text-sc-cyan-300' : 'text-sc-cyan-600'}`} strokeWidth={ICON_STROKE} aria-hidden="true" />}
        <span className={`text-[15px] font-semibold ${onDark ? 'text-white' : 'text-sc-ink-900 group-hover:text-sc-cyan-700'}`}>{service.label}</span>
        <ArrowRight
          className={`ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${onDark ? 'text-sc-ink-300' : 'text-sc-ink-400'}`}
          strokeWidth={ICON_STROKE}
          aria-hidden="true"
        />
      </LocalizedLink>
      {children.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 pl-[26px]">
          {children.map((child) => (
            <LocalizedLink
              key={child.slug}
              href={growthHref(child.slug)}
              className={
                onDark
                  ? 'rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-sc-ink-100 hover:border-white/50'
                  : `${ui.chip} bg-white transition-colors hover:border-sc-ink-400 hover:text-sc-ink-900`
              }
            >
              {child.label}
            </LocalizedLink>
          ))}
        </div>
      )}
    </div>
  )
}

/** The growth model, which is also the hub's navigation: every service sits in its stage. */
function ModelSection({ intro }: { intro: string }) {
  const { stages, foundation } = growthHubContent.model
  return (
    <section className="bg-white pb-16 lg:pb-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Modellen" title="Slik henger det sammen" lead={intro} />
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
          {stages.map((stage, index) => (
            <ModelStage key={stage.title} stage={stage} marker={String(index + 1).padStart(2, '0')} />
          ))}
        </ol>
        <div className="mt-4 grid gap-5 rounded-lg bg-sc-ink-900 p-6 text-white lg:mt-5 lg:grid-cols-[1fr_320px] lg:items-center lg:gap-10">
          <div>
            <h3 className="m-0 text-[19px] font-semibold">{foundation.title}</h3>
            <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-sc-ink-200">{foundation.text}</p>
          </div>
          <div className="space-y-2">
            {foundation.services.map((slug) => (
              <ModelServiceLink key={slug} slug={slug} onDark />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ModelStage({ stage, marker }: { stage: GrowthStage; marker: string }) {
  return (
    <li className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
      <span className="font-mono text-[13px] text-sc-ink-500">{marker}</span>
      <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{stage.title}</h3>
      <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{stage.text}</p>
      <div className="mt-1 space-y-2">
        {stage.services.map((slug) => (
          <ModelServiceLink key={slug} slug={slug} />
        ))}
      </div>
    </li>
  )
}

function PrinciplesSection({ principles }: { principles: typeof growthHubContent.principles }) {
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Prinsipper" title="Slik jobber vi" />
        <NumberedList items={principles.map((p) => ({ name: p.title, text: p.text }))} />
      </div>
    </section>
  )
}
