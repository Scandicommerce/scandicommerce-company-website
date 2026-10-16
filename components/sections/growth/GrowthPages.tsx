import React from 'react'
import {
  ArrowRight,
  ChartLine,
  Check,
  ChevronRight,
  Compass,
  Handshake,
  Info,
  Mail,
  Minus,
  MousePointerClick,
  Search,
  Share2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import {
  GROWTH_GROUPS,
  growthChildren,
  growthGroupServices,
  growthHref,
  growthHub,
  findGrowthService,
  type GrowthService,
} from '@/lib/growthServices'
import { findGrowthContent, type GrowthPageContent } from '@/lib/growthContent'

/**
 * Service-page template for the Growth marketing area, rendered with
 * placeholder blocks. Each block names what the finished section must hold, so
 * the dummy doubles as the content brief for whoever writes the page.
 */
type TemplateKey = 'situations' | 'deliverables' | 'packages' | 'process' | 'proof' | 'kpis' | 'faq'

const SERVICE_TEMPLATE: { key: TemplateKey; eyebrow: string; title: string; hint: string }[] = [
  {
    key: 'situations',
    eyebrow: 'Kjøpssituasjoner',
    title: 'Når du trenger dette',
    hint: '4–6 konkrete situasjoner kunden kjenner seg igjen i, med lenke videre der det passer.',
  },
  {
    key: 'deliverables',
    eyebrow: 'Leveranser',
    title: 'Hva du får',
    hint: 'Leveranser gruppert som Strategi · Gjennomføring · Rapportering, pluss hva som ikke er inkludert.',
  },
  {
    key: 'packages',
    eyebrow: 'Pakker',
    title: 'Pakker og pris',
    hint: 'Fastpris: engangsleveranse og løpende avtale, med «fra»-pris og hva som skiller dem.',
  },
  {
    key: 'process',
    eyebrow: 'Prosess',
    title: 'De første 90 dagene',
    hint: 'Hva som skjer etter 30, 60 og 90 dager, og hva vi trenger fra kunden.',
  },
  {
    key: 'proof',
    eyebrow: 'Bevis',
    title: 'Resultater og folkene bak',
    hint: 'Kundecase med tall, navngitt spesialist med bilde, partnermerker.',
  },
  {
    key: 'kpis',
    eyebrow: 'Måling',
    title: 'Hva vi måler og rapporterer',
    hint: 'De 3–5 måltallene vi rapporterer på for denne tjenesten, og hvor ofte.',
  },
  {
    key: 'faq',
    eyebrow: 'FAQ',
    title: 'Ofte stilte spørsmål',
    hint: '5–8 spørsmål kunder faktisk stiller før de kjøper.',
  },
]

/**
 * One Lucide icon per top-level service, shown on the hub cards only
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

const containerClasses = 'section_container max-w-[1320px] mx-auto page-padding-x'
const eyebrowClasses =
  'text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2 lg:mb-2.5'
const h2Classes = 'text-[26px] lg:text-[40px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-tight m-0'

function DraftNotice() {
  return (
    <div className="bg-sc-cyan-50 border-b border-sc-cyan-100">
      <div className={`${containerClasses} py-2.5 text-[13px] text-sc-cyan-800 flex items-center gap-2`}>
        <Info className="w-4 h-4 flex-shrink-0" strokeWidth={ICON_STROKE} aria-hidden="true" />
        Utkast – innholdet er ikke godkjent ennå, og siden er ikke indeksert.
      </div>
    </div>
  )
}

function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Brødsmuler" className="flex flex-wrap items-center text-[13px] text-sc-ink-500 mb-4 lg:mb-6">
      {trail.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-sc-ink-300" strokeWidth={ICON_STROKE} aria-hidden="true" />
          )}
          {crumb.href ? (
            <LocalizedLink href={crumb.href} className="hover:text-sc-ink-900 transition-colors">
              {crumb.label}
            </LocalizedLink>
          ) : (
            <span className="text-sc-ink-700">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

function Hero({
  trail,
  title,
  lead,
}: {
  trail: { label: string; href?: string }[]
  title: string
  lead: string
}) {
  return (
    <section className="bg-white pt-8 pb-10 lg:pt-14 lg:pb-16">
      <div className={containerClasses}>
        <Breadcrumbs trail={trail} />
        <h1 className="text-[32px] lg:text-[56px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-[1.05] m-0 max-w-[900px]">
          {title}
        </h1>
        <p className="text-base lg:text-lg text-sc-ink-600 mt-4 lg:mt-5 m-0 max-w-[720px]">{lead}</p>
        <div className="flex flex-col sm:flex-row gap-2.5 lg:gap-3 mt-6 lg:mt-8">
          <LocalizedLink
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-lg px-[22px] py-3 text-sm font-semibold bg-sc-cyan-500 text-white hover:bg-sc-cyan-600 transition-colors"
          >
            Book møte
          </LocalizedLink>
          <LocalizedLink
            href="/tjenester/alle-pakker"
            className="inline-flex items-center justify-center rounded-lg px-[22px] py-3 text-sm font-semibold bg-white text-sc-ink-900 border border-sc-ink-200 hover:bg-sc-ink-50 transition-colors"
          >
            Se pakker
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  label,
  summary,
  href,
  icon: Icon,
}: {
  label: string
  summary?: string
  href: string
  icon?: LucideIcon
}) {
  return (
    <LocalizedLink
      href={href}
      className="group block rounded-[10px] border border-sc-ink-100 p-5 lg:p-6 hover:border-sc-cyan-300 hover:-translate-y-0.5 transition-all"
    >
      {Icon && (
        <Icon className="w-6 h-6 text-sc-cyan-600 mb-3 lg:mb-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
      )}
      <div className="flex items-center gap-1.5 text-base lg:text-lg font-semibold text-sc-ink-900">
        {label}
        <ArrowRight
          className="w-4 h-4 text-sc-ink-400 group-hover:text-sc-cyan-600 group-hover:translate-x-0.5 transition-all"
          strokeWidth={ICON_STROKE}
          aria-hidden="true"
        />
      </div>
      {summary && <p className="text-sm text-sc-ink-600 mt-1.5 m-0">{summary}</p>}
    </LocalizedLink>
  )
}

function ClosingCta() {
  return (
    <section className="bg-sc-ink-900">
      <div className={`${containerClasses} py-11 lg:py-[72px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6`}>
        <h2 className="text-[26px] lg:text-[40px] font-bold text-white tracking-[-0.02em] leading-tight m-0">
          Klar for mer vekst?
        </h2>
        <LocalizedLink
          href="/kontakt"
          className="inline-flex items-center justify-center rounded-lg px-[22px] py-3 text-sm font-semibold bg-sc-cyan-500 text-white hover:bg-sc-cyan-600 transition-colors"
        >
          Book en uforpliktende samtale
        </LocalizedLink>
      </div>
    </section>
  )
}

export function GrowthHubPage() {
  return (
    <>
      <DraftNotice />
      <Hero trail={[{ label: growthHub.label }]} title={growthHub.title} lead={growthHub.lead} />
      {GROWTH_GROUPS.map((group) => (
        <section key={group.id} className="bg-white pb-10 lg:pb-16">
          <div className={containerClasses}>
            <div className={eyebrowClasses}>{group.title}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-3">
              {growthGroupServices(group.id).map((service) => (
                <ServiceCard
                  key={service.slug}
                  label={service.label}
                  summary={service.lead}
                  href={growthHref(service.slug)}
                  icon={SERVICE_ICONS[service.slug]}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
      <PlaceholderSection eyebrow="Pakker" title="Growth-pakker" hint="Pakketering av growth-tjenestene med fastpris." />
      <PlaceholderSection eyebrow="Bevis" title="Resultater" hint="2–3 kundecaser med tall fra growth-arbeid." />
      <ClosingCta />
    </>
  )
}

function PlaceholderSection({ eyebrow, title, hint }: { eyebrow: string; title: string; hint: string }) {
  return (
    <section className="bg-white py-8 lg:py-12">
      <div className={containerClasses}>
        <div className={eyebrowClasses}>{eyebrow}</div>
        <h2 className={h2Classes}>{title}</h2>
        <div className="mt-4 lg:mt-5 rounded-[10px] border border-dashed border-sc-ink-200 bg-sc-ink-50 px-5 py-8 lg:py-10 text-sm text-sc-ink-500">
          Innhold kommer: {hint}
        </div>
      </div>
    </section>
  )
}

export function GrowthServicePage({ service }: { service: GrowthService }) {
  const parent = service.parent ? findGrowthService(service.parent) : undefined
  const channels = growthChildren(service.slug)
  const content = findGrowthContent(service.slug)
  const trail = [
    { label: growthHub.label, href: growthHref() },
    ...(parent ? [{ label: parent.label, href: growthHref(parent.slug) }] : []),
    { label: service.label },
  ]

  return (
    <>
      <DraftNotice />
      <Hero trail={trail} title={service.title} lead={service.lead} />
      {channels.length > 0 && (
        <section className="bg-white pb-8 lg:pb-12">
          <div className={containerClasses}>
            <div className={eyebrowClasses}>Kanaler</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-3">
              {channels.map((channel) => (
                <ServiceCard key={channel.slug} label={channel.label} summary={channel.lead} href={growthHref(channel.slug)} />
              ))}
            </div>
          </div>
        </section>
      )}
      {content?.intro && <IntroSection intro={content.intro} />}
      {SERVICE_TEMPLATE.map((block) => (
        <React.Fragment key={block.key}>
          {renderTemplateBlock(block, content) ?? <PlaceholderSection {...block} />}
        </React.Fragment>
      ))}
      <ClosingCta />
    </>
  )
}

/** The written section for a template block, or null when the copy is not there yet. */
function renderTemplateBlock(
  block: (typeof SERVICE_TEMPLATE)[number],
  content: GrowthPageContent | undefined
): React.ReactNode | null {
  const heading = { eyebrow: block.eyebrow, title: block.title }
  switch (block.key) {
    case 'situations':
      return content?.situations?.length ? <SituationsSection {...heading} items={content.situations} /> : null
    case 'deliverables':
      return content?.deliverables ? <DeliverablesSection {...heading} deliverables={content.deliverables} /> : null
    case 'packages':
      return content?.packages?.length ? <PackagesSection {...heading} packages={content.packages} /> : null
    case 'process':
      return content?.process?.length ? <ProcessSection {...heading} steps={content.process} /> : null
    case 'kpis':
      return content?.kpis?.length ? <KpiSection {...heading} kpis={content.kpis} /> : null
    case 'faq':
      return content?.faq?.length ? <FaqSection {...heading} faq={content.faq} /> : null
    // Proof needs real clients and numbers from the team; it stays a placeholder until then
    case 'proof':
      return null
  }
}

type Heading = { eyebrow: string; title: string }

function SectionShell({ eyebrow, title, children }: Heading & { children: React.ReactNode }) {
  return (
    <section className="bg-white py-8 lg:py-12">
      <div className={containerClasses}>
        <div className={eyebrowClasses}>{eyebrow}</div>
        <h2 className={h2Classes}>{title}</h2>
        <div className="mt-5 lg:mt-7">{children}</div>
      </div>
    </section>
  )
}

function IntroSection({ intro }: { intro: NonNullable<GrowthPageContent['intro']> }) {
  return (
    <section className="bg-white pb-8 lg:pb-12">
      <div className={containerClasses}>
        <div className="max-w-[860px]">
          <h2 className="text-[20px] lg:text-[24px] font-bold text-sc-ink-900 tracking-[-0.01em] m-0">{intro.title}</h2>
          {intro.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base text-sc-ink-600 leading-relaxed mt-3 m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function SituationsSection({ items, ...heading }: Heading & { items: NonNullable<GrowthPageContent['situations']> }) {
  return (
    <SectionShell {...heading}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-[10px] border border-sc-ink-100 p-5 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-sc-ink-900 m-0">{item.title}</h3>
            <p className="text-sm text-sc-ink-600 leading-normal mt-1.5 m-0">{item.text}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function CheckList({ items, muted }: { items: string[]; muted?: boolean }) {
  const Icon = muted ? Minus : Check
  return (
    <ul className="list-none m-0 p-0 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-normal text-sc-ink-700">
          <Icon
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${muted ? 'text-sc-ink-400' : 'text-sc-cyan-600'}`}
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function DeliverablesSection({
  deliverables,
  ...heading
}: Heading & { deliverables: NonNullable<GrowthPageContent['deliverables']> }) {
  const columns = [
    { title: 'Strategi', items: deliverables.strategi },
    { title: 'Gjennomføring', items: deliverables.gjennomforing },
    { title: 'Rapportering', items: deliverables.rapportering },
  ]
  return (
    <SectionShell {...heading}>
      <div className="grid lg:grid-cols-3 border border-sc-ink-100 rounded-[10px] overflow-hidden">
        {columns.map((column, index) => (
          <div
            key={column.title}
            className={`p-5 lg:p-7 border-sc-ink-100 ${index < columns.length - 1 ? 'border-b lg:border-b-0 lg:border-r' : ''}`}
          >
            <h3 className="text-xs lg:text-[13px] font-semibold text-sc-cyan-600 uppercase tracking-[0.08em] m-0 mb-3">
              {column.title}
            </h3>
            <CheckList items={column.items} />
          </div>
        ))}
      </div>
      {deliverables.ikkeInkludert?.length ? (
        <div className="mt-4 lg:mt-5">
          <h3 className="text-sm font-semibold text-sc-ink-900 m-0 mb-2.5">Ikke inkludert</h3>
          <CheckList items={deliverables.ikkeInkludert} muted />
        </div>
      ) : null}
    </SectionShell>
  )
}

function PackagesSection({ packages, ...heading }: Heading & { packages: NonNullable<GrowthPageContent['packages']> }) {
  return (
    <SectionShell {...heading}>
      <div className="grid md:grid-cols-2 gap-3 lg:gap-4">
        {packages.map((pkg) => (
          <div key={pkg.name} className="rounded-[16px] border border-sc-ink-100 p-6 lg:p-8 flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sc-ink-400">{pkg.kind}</div>
            <h3 className="text-[22px] lg:text-[26px] font-bold text-sc-ink-900 tracking-[-0.01em] mt-1 m-0">{pkg.name}</h3>
            <p className="text-sm text-sc-ink-600 mt-2 m-0">{pkg.summary}</p>
            <div className="mt-5 mb-6 flex-grow">
              <CheckList items={pkg.includes} />
            </div>
            <div className="text-base font-semibold text-sc-ink-900">{pkg.price ?? 'Pris kommer'}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function ProcessSection({ steps, ...heading }: Heading & { steps: NonNullable<GrowthPageContent['process']> }) {
  return (
    <SectionShell {...heading}>
      <div className="grid lg:grid-cols-3 border border-sc-ink-100 rounded-[10px] overflow-hidden">
        {steps.map((step, index) => (
          <div
            key={step.period}
            className={`p-5 lg:px-7 lg:py-8 border-sc-ink-100 ${index < steps.length - 1 ? 'border-b lg:border-b-0 lg:border-r' : ''}`}
          >
            <div className="text-xs lg:text-[13px] font-semibold text-sc-cyan-600 mb-1.5 lg:mb-2">
              {step.period} · {step.title}
            </div>
            <p className="text-sm leading-normal text-sc-ink-600 m-0">{step.text}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function KpiSection({ kpis, ...heading }: Heading & { kpis: NonNullable<GrowthPageContent['kpis']> }) {
  return (
    <SectionShell {...heading}>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 m-0">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="border-t border-sc-ink-100 pt-4">
            <dt className="text-base font-semibold text-sc-ink-900">{kpi.name}</dt>
            <dd className="text-sm text-sc-ink-600 leading-normal mt-1 m-0">{kpi.text}</dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}

function FaqSection({ faq, ...heading }: Heading & { faq: NonNullable<GrowthPageContent['faq']> }) {
  return (
    <SectionShell {...heading}>
      <div className="border-t border-sc-ink-100 max-w-[860px]">
        {faq.map((item) => (
          <details key={item.question} className="group border-b border-sc-ink-100 py-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-base font-semibold text-sc-ink-900">
              {item.question}
              <ChevronRight
                className="w-4 h-4 flex-shrink-0 text-sc-ink-400 transition-transform group-open:rotate-90"
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
            </summary>
            <p className="text-sm text-sc-ink-600 leading-relaxed mt-2.5 m-0">{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  )
}
