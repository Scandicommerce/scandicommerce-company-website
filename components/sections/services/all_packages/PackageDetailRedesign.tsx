import Link from 'next/link'
import type { Package } from '@/lib/packages'
import {
  cardForTier,
  serviceCount,
  servicesForTier,
  tierBelow,
  PACKAGE_TIERS,
  type PackageSection,
  type PackageService,
  type PackageTier,
} from '@/lib/packageMatrix'

interface AddOnItem {
  title?: string
  description?: string
  price?: string
}

interface PackageDetailRedesignProps {
  pkg: Package
  tier: PackageTier
  addOns?: { items?: AddOnItem[]; sectionSubtitle?: string }
  contactHref: string
}

/** Stroke icons per service area; decorative. */
const SECTION_ICON: Record<PackageSection, JSX.Element> = {
  'Drift og støtte': <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />,
  'Integrer og data': <path d="M9 7H6a3 3 0 0 0 0 6h3M15 7h3a3 3 0 0 1 0 6h-3M8 10h8" />,
  Bygg: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 14h5" />
    </>
  ),
  'Strategi og vekst': <path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" />,
}

/** Display order for the panels: day-to-day first, strategy last. */
const PANEL_ORDER: PackageSection[] = ['Drift og støtte', 'Integrer og data', 'Bygg', 'Strategi og vekst']

const UPSELL: Partial<Record<PackageTier, { next: PackageTier; text: string }>> = {
  growth: {
    next: 'premium',
    text: 'Med Premium får du skreddersydd utvikling, drift av integrasjoner og en fast kontaktperson som kjenner butikken. CRO-revisjon hvert kvartal er inkludert, verdt 48 000 kr i året.',
  },
  premium: {
    next: 'enterprise',
    text: 'Med Enterprise får du en fast dag i uken med seniorteamet, A/B-testing, multistore og forvaltning av ERP, OMS og PIM.',
  },
}

const Check = () => (
  <span aria-hidden="true" className="mt-[3px] font-bold text-sc-cyan-700">
    ✓
  </span>
)

function ServiceItem({ service }: { service: PackageService }) {
  return (
    <li className="flex gap-3">
      <Check />
      <div className="min-w-0">
        <div className="font-semibold text-sc-ink-900">{service.name}</div>
        <div className="text-[14px] leading-snug text-sc-ink-500">{service.text}</div>
      </div>
    </li>
  )
}

function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="m-0 scroll-mt-24 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">
      {children}
    </h2>
  )
}

/**
 * Norwegian package page for the three matrix tiers: copy column on the left,
 * a price box that stays in view on the right. Price and add-ons come from
 * Sanity; the service list comes from the package matrix.
 */
export default function PackageDetailRedesign({ pkg, tier, addOns, contactHref }: PackageDetailRedesignProps) {
  const card = cardForTier(tier)
  const below = tierBelow(tier)
  const belowCard = below ? cardForTier(below) : undefined
  const total = serviceCount(tier)
  const position = PACKAGE_TIERS.indexOf(tier) + 1
  const price = pkg.price || card?.price || ''
  const groups = servicesForTier(tier).sort((a, b) => PANEL_ORDER.indexOf(a.section) - PANEL_ORDER.indexOf(b.section))
  const panels = groups.filter((g) => g.added.length > 0)
  const inheritedCount = groups.reduce((n, g) => n + g.inherited.length, 0)
  const idealFor = (pkg.idealFor ?? []).filter(Boolean)
  const steps = (pkg.processSteps ?? []).filter((s) => s?.title)
  const faqs = (pkg.faq ?? []).filter((f) => f?.question && f?.answer)
  const extras = (addOns?.items ?? []).filter((a) => a?.title)
  const upsell = UPSELL[tier]
  const upsellCard = upsell ? cardForTier(upsell.next) : undefined
  const bookHref = pkg.heroButtons?.primaryButtonLink || contactHref
  const bookText = pkg.heroButtons?.primaryButtonText || 'Book en samtale'

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-10">
        <nav aria-label="Brødsmuler" className="text-sm text-sc-ink-500">
          <Link href="/tjenester/alle-pakker" className="text-sc-ink-500 underline-offset-2 hover:underline">
            Alle pakker
          </Link>{' '}
          / {pkg.title}
        </nav>

        <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
          {/* Copy column */}
          <div className="flex min-w-0 flex-1 flex-col gap-16">
            <section className="flex flex-col gap-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-700">
                Pakke {position} av {PACKAGE_TIERS.length}
              </div>
              <h1 className="m-0 text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-sc-ink-900 lg:text-[56px]">{pkg.title}</h1>
              {(card?.tagline || pkg.subtitle) && (
                <p className="m-0 max-w-[600px] text-[18px] leading-relaxed text-sc-ink-600 lg:text-[20px]">{card?.tagline || pkg.subtitle}</p>
              )}
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                {['Fast månedspris', 'Support inkludert', 'Ingen bindingstid'].map((chip) => (
                  <li key={chip} className="rounded-full bg-sc-ink-50 px-3.5 py-2 text-sm text-sc-ink-700">
                    {chip}
                  </li>
                ))}
              </ul>
            </section>

            {idealFor.length > 0 && (
              <section className="flex flex-col gap-5">
                <SectionTitle id="passer-for">Passer for deg som</SectionTitle>
                <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
                  {idealFor.map((item) => (
                    <li key={item} className="rounded-xl border border-sc-ink-100 p-4 text-[15px] leading-relaxed text-sc-ink-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="inkludert" className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <SectionTitle id="inkludert">Dette er inkludert</SectionTitle>
                <p className="m-0 max-w-[560px] text-sc-ink-600">
                  {total} tjenester{belowCard ? `: alt i ${belowCard.name}, pluss det som er nytt i ${pkg.title}` : ' i fire områder'}. Vi prioriterer sammen med deg.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {panels.map((group) => {
                  const wide = group.added.length > 3 || (panels.length % 2 === 1 && group === panels[panels.length - 1])
                  return (
                    <div key={group.section} className={`flex flex-col gap-5 rounded-[20px] bg-sc-ink-50 p-6 lg:p-7 ${wide ? 'md:col-span-2' : ''}`}>
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-sc-ink-900">
                          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3fd4dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {SECTION_ICON[group.section]}
                          </svg>
                        </span>
                        <div className="flex flex-col">
                          <h3 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-sc-ink-900">{group.section}</h3>
                          <span className="text-sm text-sc-ink-500">
                            {group.added.length} {group.added.length === 1 ? 'tjeneste' : 'tjenester'}
                            {belowCard ? ` nye i ${pkg.title}` : ''}
                          </span>
                        </div>
                      </div>
                      <ul className={`m-0 grid list-none gap-x-8 gap-y-3.5 p-0 ${wide ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        {group.added.map((service) => (
                          <ServiceItem key={service.id} service={service} />
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              {belowCard && inheritedCount > 0 && (
                <details className="group rounded-[20px] border border-sc-ink-100 px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-sc-ink-900">
                    <span>
                      Pluss {inheritedCount} tjenester fra {below === 'growth' ? 'Growth' : `${belowCard.name} og pakkene under`}
                    </span>
                    <span className="text-sc-ink-500 group-open:hidden">+</span>
                    <span className="hidden text-sc-ink-500 group-open:inline">–</span>
                  </summary>
                  <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-x-8 gap-y-1.5 p-0 md:grid-cols-2">
                    {groups.flatMap((g) => g.inherited).map((service) => (
                      <li key={service.id} className="flex gap-2.5 text-[15px] text-sc-ink-600">
                        <Check />
                        {service.name}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>

            {steps.length > 0 && (
              <section className="flex flex-col gap-5">
                <SectionTitle>Slik jobber vi</SectionTitle>
                <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4">
                  {steps.map((step) => (
                    <li key={step.title} className="flex flex-col gap-1 rounded-xl border border-sc-ink-100 p-4">
                      {step.week && <span className="font-mono text-[13px] text-sc-cyan-700">{step.week}</span>}
                      <span className="font-semibold text-sc-ink-900">{step.title}</span>
                      {step.description && <span className="text-sm leading-snug text-sc-ink-500">{step.description}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {extras.length > 0 && (
              <section className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <SectionTitle>Utenfor pakken</SectionTitle>
                  <p className="m-0 text-sc-ink-600">{addOns?.sectionSubtitle || 'Større løft gjør vi som egne prosjekter.'}</p>
                </div>
                <ul className="m-0 list-none overflow-hidden rounded-xl border border-sc-ink-100 p-0">
                  {extras.map((item) => (
                    <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-sc-ink-100 px-5 py-4 last:border-b-0">
                      <div className="min-w-0">
                        <div className="font-medium text-sc-ink-900">{item.title}</div>
                        {item.description && <div className="text-sm text-sc-ink-500">{item.description}</div>}
                      </div>
                      {item.price && <span className="font-mono text-[15px] text-sc-ink-900">{item.price}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {faqs.length > 0 && (
              <section id="faq" className="flex scroll-mt-24 flex-col">
                <div className="mb-3">
                  <SectionTitle>Spørsmål og svar</SectionTitle>
                </div>
                {faqs.map((item, index) => (
                  <details key={item.question} className="group border-t border-sc-ink-100 py-5 last:border-b" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-sc-ink-900">
                      <h3 className="m-0 inline text-[17px]">{item.question}</h3>
                      <span className="text-sc-ink-500 group-open:hidden">+</span>
                      <span className="hidden text-sc-ink-500 group-open:inline">–</span>
                    </summary>
                    <p className="m-0 mt-3 whitespace-pre-line leading-relaxed text-sc-ink-600">{item.answer.trim()}</p>
                  </details>
                ))}
              </section>
            )}
          </div>

          {/* Price box: stays in view on desktop */}
          <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:w-[340px] lg:flex-none">
            <div className="flex flex-col gap-5 rounded-[20px] border border-sc-ink-200 bg-white p-7 shadow-[0_8px_20px_rgba(10,13,15,0.10)]">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-[40px] font-medium leading-none tracking-[-0.03em] text-sc-ink-900">{price}</span>
                <span className="text-[15px] text-sc-ink-500">/mnd eks. mva</span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-2 border-y border-dashed border-sc-ink-200 p-0 py-4 text-[15px] text-sc-ink-700">
                <li className="flex gap-2"><Check />{total} tjenester inkludert</li>
                <li className="flex gap-2"><Check />Support på e-post og chat</li>
                <li className="flex gap-2"><Check />Ingen bindingstid</li>
              </ul>
              <a href={bookHref} className="flex min-h-[52px] items-center justify-center rounded-full bg-sc-ink-900 px-6 text-base font-semibold text-white transition-colors hover:bg-sc-ink-700">
                {bookText}
              </a>
              <p className="m-0 text-center text-sm text-sc-ink-500">30 minutter, uforpliktende</p>
            </div>

            {upsell && upsellCard && (
              <div className="flex flex-col gap-2.5 rounded-[20px] border border-sc-cyan-200 bg-sc-cyan-50 p-6">
                <div className="text-[20px] font-bold tracking-[-0.01em] text-sc-ink-900">Trenger du mer hjelp?</div>
                <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{upsell.text}</p>
                <p className="m-0 text-[15px] font-semibold text-sc-ink-900">{upsellCard.price}/mnd</p>
                <Link href={`/tjenester/alle-pakker/${upsell.next}`} className="text-[15px] font-semibold text-sc-cyan-700 underline-offset-2 hover:underline">
                  Se {upsellCard.name}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
