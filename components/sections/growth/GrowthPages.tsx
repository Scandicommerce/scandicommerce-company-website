import React from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import {
  GROWTH_COLUMN_TITLES,
  growthChildren,
  growthColumnEntries,
  growthHref,
  growthHub,
  findGrowthService,
  type GrowthColumn,
  type GrowthService,
} from '@/lib/growthServices'

/**
 * Service-page template for the Growth marketing area, rendered with
 * placeholder blocks. Each block names what the finished section must hold, so
 * the dummy doubles as the content brief for whoever writes the page.
 */
const SERVICE_TEMPLATE: { eyebrow: string; title: string; hint: string }[] = [
  {
    eyebrow: 'Kjøpssituasjoner',
    title: 'Når du trenger dette',
    hint: '4–6 konkrete situasjoner kunden kjenner seg igjen i, med lenke videre der det passer.',
  },
  {
    eyebrow: 'Leveranser',
    title: 'Hva du får',
    hint: 'Leveranser gruppert som Strategi · Gjennomføring · Rapportering, pluss hva som ikke er inkludert.',
  },
  {
    eyebrow: 'Pakker',
    title: 'Pakker og pris',
    hint: 'Fastpris: engangsleveranse og løpende avtale, med «fra»-pris og hva som skiller dem.',
  },
  {
    eyebrow: 'Prosess',
    title: 'De første 90 dagene',
    hint: 'Hva som skjer etter 30, 60 og 90 dager, og hva vi trenger fra kunden.',
  },
  {
    eyebrow: 'Bevis',
    title: 'Resultater og folkene bak',
    hint: 'Kundecase med tall, navngitt spesialist med bilde, partnermerker.',
  },
  {
    eyebrow: 'Måling',
    title: 'Hva vi måler og rapporterer',
    hint: 'De 3–5 måltallene vi rapporterer på for denne tjenesten, og hvor ofte.',
  },
  {
    eyebrow: 'FAQ',
    title: 'Ofte stilte spørsmål',
    hint: '5–8 spørsmål kunder faktisk stiller før de kjøper.',
  },
]

const containerClasses = 'section_container max-w-[1320px] mx-auto page-padding-x'
const eyebrowClasses =
  'text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2 lg:mb-2.5'
const h2Classes = 'text-[26px] lg:text-[40px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-tight m-0'

function DraftNotice() {
  return (
    <div className="bg-sc-cyan-50 border-b border-sc-cyan-100">
      <div className={`${containerClasses} py-2.5 text-[13px] text-sc-cyan-800`}>
        Utkast – denne siden er en plassholder og er ikke indeksert ennå.
      </div>
    </div>
  )
}

function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Brødsmuler" className="text-[13px] text-sc-ink-500 mb-4 lg:mb-6">
      {trail.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-1.5 text-sc-ink-300">/</span>}
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

function ServiceCard({ label, summary, href }: { label: string; summary?: string; href: string }) {
  return (
    <LocalizedLink
      href={href}
      className="block rounded-[10px] border border-sc-ink-100 p-5 lg:p-6 hover:border-sc-cyan-300 hover:-translate-y-0.5 transition-all"
    >
      <div className="text-base lg:text-lg font-semibold text-sc-ink-900">{label} →</div>
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
  const columns = Object.keys(GROWTH_COLUMN_TITLES) as GrowthColumn[]
  return (
    <>
      <DraftNotice />
      <Hero trail={[{ label: growthHub.label }]} title={growthHub.title} lead={growthHub.lead} />
      {columns.map((column) => (
        <section key={column} className="bg-white pb-10 lg:pb-16">
          <div className={containerClasses}>
            <div className={eyebrowClasses}>{GROWTH_COLUMN_TITLES[column]}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-3">
              {growthColumnEntries(column)
                .filter((entry) => !entry.indent)
                .map((entry) => (
                  <ServiceCard key={entry.href} label={entry.label} summary={entry.summary} href={entry.href} />
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
      {SERVICE_TEMPLATE.map((block) => (
        <PlaceholderSection key={block.title} {...block} />
      ))}
      <ClosingCta />
    </>
  )
}
