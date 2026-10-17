import Image from 'next/image'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { formatNok, nexusKitContents, nexusRequirements, nexusSteps, type NexusItem } from '@/lib/nexuspos'
import PackageAddToCart from '@/components/sections/services/all_packages/PackageAddToCart'

/* ------------------------------------------------------------ helpers */

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={dark ? '#7ee5eb' : '#118792'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-[3px] flex-none">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  )
}

function Dash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5a6670" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-[3px] flex-none">
      <path d="M4 8h8" />
    </svg>
  )
}

export function SectionHead({ eyebrow, heading, lead, id }: { eyebrow: string; heading: string; lead?: string; id?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="flex flex-col gap-2.5">
        <div className={ui.eyebrow} id={id}>{eyebrow}</div>
        <h2 className={ui.h2}>{heading}</h2>
      </div>
      {lead && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{lead}</p>}
    </div>
  )
}

const Mva = () => <span className="text-xs font-medium text-sc-ink-500">eks. mva</span>

/* ------------------------------------------------------- before/after */

export function BeforeAfter() {
  const before = [
    ['Kasse', 'Eget kassesystem'],
    ['Nettbutikk', 'Egne priser og varer'],
    ['Lager', 'Henger på nettbutikken'],
    ['Regnskap', 'Ser på det i etterkant'],
  ]
  const after = [
    ['Kasse', 'Shopify POS + N950'],
    ['Nettbutikk', 'Samme varer og priser'],
    ['Lager', 'Oppdateres ved hvert salg'],
    ['Regnskap', 'Z-rapport og SAF-T'],
  ]
  return (
    <section id="unified" className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Unified commerce" heading="Slutt på kasse her og nettbutikk der" lead="Unified commerce betyr at butikk og nett deler samme motor. Ingen synkronisering om natten, ingen dobbel registrering, ingen gjetting på hva som faktisk er på lager." />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-lg border border-dashed border-sc-ink-300 bg-white p-6 lg:p-8">
            <span className={ui.tagOutline}>Før</span>
            <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em] text-sc-ink-900">Fire systemer som ikke snakker sammen</h3>
            <div className="grid grid-cols-2 gap-3">
              {before.map(([t, s]) => (
                <div key={t} className="flex flex-col gap-0.5 rounded-lg border border-dashed border-sc-ink-300 p-3.5 text-[15px] font-semibold text-sc-ink-700">
                  {t}
                  <small className="text-[13px] font-normal text-sc-ink-500">{s}</small>
                </div>
              ))}
            </div>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">Varen selges i butikken, men står fortsatt til salgs på nett. Rapportene stemmer aldri helt.</p>
          </div>
          <div className="flex flex-col gap-5 rounded-lg bg-sc-ink-900 p-6 text-white lg:p-8">
            <span className="inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200">Med Nexus POS</span>
            <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em]">Én Shopify for hele bedriften</h3>
            <div className="grid grid-cols-2 gap-3">
              {after.slice(0, 2).map(([t, s]) => (
                <div key={t} className="flex flex-col gap-0.5 rounded-lg border border-sc-cyan-500/30 bg-sc-cyan-500/10 p-3.5 text-[15px] font-semibold">
                  {t}
                  <small className="text-[13px] font-normal text-sc-ink-300">{s}</small>
                </div>
              ))}
              <span className="col-span-2 justify-self-center rounded-full bg-sc-cyan-500 px-4 py-1.5 font-mono text-[12px] font-bold tracking-[0.06em] text-sc-ink-900">SHOPIFY + NEXUS POS</span>
              {after.slice(2).map(([t, s]) => (
                <div key={t} className="flex flex-col gap-0.5 rounded-lg border border-sc-cyan-500/30 bg-sc-cyan-500/10 p-3.5 text-[15px] font-semibold">
                  {t}
                  <small className="text-[13px] font-normal text-sc-ink-300">{s}</small>
                </div>
              ))}
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-sc-ink-200">
              <li className="flex gap-2.5"><Check dark />Klikk og hent, retur på tvers av kanaler og felles kundeklubb</li>
              <li className="flex gap-2.5"><Check dark />Ett dashboard for omsetning i butikk og på nett</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- case */

export function CaseFlewe({ casesHref }: { casesHref: string }) {
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14`}>
        <div>
          <div className={`${ui.eyebrow} mb-5`}>Kundecase · vår første Nexus POS-kunde</div>
          <blockquote className="m-0">
            <p className="m-0 text-[22px] font-medium leading-[1.35] tracking-[-0.01em] text-sc-ink-900 lg:text-[30px]">
              «Før levde kassen og nettbutikken hver for seg, lageret hang på nettbutikken, og regnskapet var noe vi så på i etterkant. Nå henger alt sammen, og jeg har ett sted å gå for å se hvordan bedriften faktisk går. Det er kritisk fremover, både for vekst og for kontroll.»
            </p>
          </blockquote>
          <div className="mt-7 flex items-center gap-3.5">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-sc-ink-900 font-mono text-sm font-bold text-sc-cyan-300" aria-hidden="true">MJ</span>
            <div className="text-[15px]">
              <b className="font-semibold text-sc-ink-900">Maren Johansen</b>
              <br />
              <span className="text-sc-ink-500">Daglig leder, FLEWÉ</span>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-5 rounded-lg bg-sc-ink-900 p-6 text-white lg:p-8" aria-label="FLEWÉ i tall">
          <span className="text-[26px] font-bold tracking-[0.16em]">FLEWÉ</span>
          <p className="m-0 text-[15px] leading-relaxed text-sc-ink-200">Norsk merkevare innen trenings- og sportsklær. Butikk og nettbutikk på Shopify, med Nexus POS i kassen.</p>
          {[
            ['3', 'kassepunkter på Nexus POS'],
            ['1', 'system for kasse, nettbutikk, lager og regnskap'],
            ['Først ute', 'den første butikken i Norge på Nexus POS'],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col gap-0.5 border-t border-white/10 pt-4">
              <b className="font-mono text-[26px] font-medium tracking-tight text-sc-cyan-300">{v}</b>
              <span className="text-sm text-sc-ink-200">{l}</span>
            </div>
          ))}
          <LocalizedLink href={casesHref} className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50">
            Se flere kundecaser
          </LocalizedLink>
        </aside>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- steps */

export function Steps() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Slik fungerer det" heading="Fra iPad til kvittering på fire steg" lead="Kunden betaler som vanlig. Alt det kjedelige skjer automatisk i bakgrunnen." />
        <ol className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {nexusSteps.map((s) => (
            <li key={s.n} className="border-t border-sc-ink-900 pt-5">
              <div className={ui.mono}>{s.n}</div>
              <h3 className="mb-2 mt-2 text-[20px] font-bold leading-tight text-sc-ink-900">{s.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- pricing */

function PriceCard({ item, dark, lines, contactHref }: { item: NexusItem; dark?: boolean; lines: string[]; contactHref: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg border p-6 lg:p-7 ${dark ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
      <span className={dark ? 'inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200' : ui.tag}>{item.type}</span>
      <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em]">{item.name}</h3>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[30px] font-medium tracking-tight">{formatNok(item.price)}</span>
        <span className={`text-sm ${dark ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{item.unit} · eks. mva</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-relaxed">
        {lines.map((l) => (
          <li key={l} className={`flex gap-2.5 ${dark ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}><Check dark={dark} />{l}</li>
        ))}
      </ul>
      {item.variantId && item.shopifyTitle ? (
        <div className="mt-auto pt-2"><PackageAddToCart variantId={item.variantId} productTitle={item.shopifyTitle} /></div>
      ) : (
        <LocalizedLink href={contactHref} className={`mt-auto ${dark ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50' : ui.btnSecondary}`}>
          Bestill
        </LocalizedLink>
      )}
    </div>
  )
}

export function Pricing({ items, contactHref }: { items: NexusItem[]; contactHref: string }) {
  const get = (h: string) => items.find((i) => i.handle === h)!
  const oppstart = get('nexus-pos-oppstart')
  const lisens = get('nexus-pos-lisens')
  const terminal = get('nets-n950')
  const sla = get('nexus-pos-standard-sla')
  return (
    <section id="priser" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Priser" heading="Vit hva du betaler før du starter" lead="Tre tall. Oppstart én gang, lisens per kassepunkt og terminal til fast pris. Alle priser eks. mva." />
        <div className="grid gap-5 md:grid-cols-3">
          <PriceCard item={oppstart} contactHref={contactHref} lines={['Gjennomgang av dagens kasse og migrering', 'Oppsett av Nexus POS, Shopify POS og terminal', 'Opplæring av deg og de ansatte']} />
          <PriceCard item={lisens} dark contactHref={contactHref} lines={['Kvittering, journal, X/Z-rapporter og SAF-T', 'Inntil 2 timer support i måneden, svar neste virkedag', 'Løpende oppdateringer og videreutvikling']} />
          <PriceCard item={{ ...terminal, type: 'Engangs', name: 'Nets N950-terminal', unit: 'per terminal' }} contactHref={contactHref} lines={['Mobil terminal med innebygd skriver', 'Kort, kontaktløst og Vipps', 'Har du N950 fra før? Den kan ofte gjenbrukes']} />
        </div>
        <div className="mt-5 flex flex-col gap-5 rounded-lg border border-dashed border-sc-ink-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-[720px]">
            <div className={`${ui.eyebrow} mb-2`}>Tillegg</div>
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">
              {sla.name} – <span className="font-mono font-medium">{formatNok(sla.price)}</span> / mnd <Mva />
            </h3>
            <p className="mb-0 mt-2 text-[15px] leading-relaxed text-sc-ink-600">{sla.description}</p>
          </div>
          <LocalizedLink href={contactHref} className={`${ui.btnSecondary} flex-none`}>Spør om SLA</LocalizedLink>
        </div>
        <p className="mb-0 mt-5 text-sm leading-relaxed text-sc-ink-500">Ingen binding · 30 dagers oppsigelse · 14 dagers betalingsfrist · Årlig KPI-justering · Endringer utenfor avtalt omfang: 1 250 kr/t eks. mva, fastpris der det er mulig.</p>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- kits */

export function Kits({ items, contactHref }: { items: NexusItem[]; contactHref: string }) {
  const kits = items.filter((i) => i.group === 'kit')
  return (
    <section id="pakker" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Ferdige kassepakker" heading="Alt du trenger på disken, i én pris" lead="Velg en pakke per kassepunkt. Har du utstyr som fungerer, gjenbruker vi det." />
        <div className="grid gap-5 lg:grid-cols-2">
          {kits.map((kit, i) => {
            const dark = i === kits.length - 1
            const c = nexusKitContents[kit.handle as keyof typeof nexusKitContents]
            return (
              <div key={kit.handle} className={`flex flex-col gap-4 rounded-lg border p-6 lg:p-8 ${dark ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
                <span className={dark ? 'inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200' : ui.tag}>{kit.type}</span>
                <h3 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em]">{kit.name}</h3>
                <p className={`m-0 text-[15px] leading-relaxed ${dark ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}>{kit.description}</p>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-[30px] font-medium tracking-tight">{formatNok(kit.price)}</span>
                  <span className={`text-sm ${dark ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{kit.unit} · eks. mva</span>
                </div>
                {kit.badge && <span className="inline-flex w-fit rounded-full bg-sc-cyan-500 px-3 py-1 text-xs font-bold text-sc-ink-900">{kit.badge}</span>}
                <div className="flex flex-wrap gap-2">
                  {c?.images.map((src, k) => (
                    <span key={src} className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-lg border border-sc-ink-100 bg-white">
                      <Image src={src} alt={c.alts[k]} width={60} height={60} className="h-[60px] w-[60px] object-contain" />
                    </span>
                  ))}
                </div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-relaxed">
                  {c?.lines.map((l) => (
                    <li key={l} className={`flex gap-2.5 ${dark ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}><Check dark={dark} />{l}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  {kit.variantId && kit.shopifyTitle ? (
                    <PackageAddToCart variantId={kit.variantId} productTitle={kit.shopifyTitle} />
                  ) : (
                    <LocalizedLink href={contactHref} className={dark ? 'inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50' : ui.btnPrimary}>
                      Bestill {kit.type}
                    </LocalizedLink>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------- first year */

export function FirstYear({ items }: { items: NexusItem[] }) {
  const get = (h: string) => items.find((i) => i.handle === h)!
  const oppstart = get('nexus-pos-oppstart').price
  const kitA = get('nexus-pos-pakke-a-full-kassedisk').price
  const lisens = get('nexus-pos-lisens').price * 12
  const rows: [string, number][] = [
    ['Oppstart', oppstart],
    ['Pakke A – full kassedisk inkl. N950', kitA],
    ['Lisens, 12 mnd × ' + formatNok(get('nexus-pos-lisens').price), lisens],
  ]
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid items-start gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16`}>
        <div>
          <div className={`${ui.eyebrow} mb-2.5`}>Regnestykket</div>
          <h2 className={ui.h2}>Hva koster første år?</h2>
          <p className="mb-0 mt-5 text-base leading-relaxed text-sc-ink-600 lg:text-lg">Eksempel: én butikk med ett kassepunkt og Pakke A. Ingen skjulte gebyrer fra oss. Det som faktureres av andre, står under.</p>
          <p className="mb-0 mt-5 text-[15px] leading-relaxed text-sc-ink-500">Flere kassepunkter? Oppstarten betales én gang per butikk. Lisens og utstyr ganges med antall kassepunkter. Kjeder med flere butikker får eget tilbud.</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-white" role="table" aria-label="Kostnad første år, ett kassepunkt">
          {rows.map(([l, v]) => (
            <div key={l} role="row" className="flex items-baseline justify-between gap-4 border-b border-sc-ink-100 px-5 py-4 text-[15px] lg:px-7">
              <span role="cell" className="text-sc-ink-700">{l}</span>
              <span role="cell" className="whitespace-nowrap font-mono font-medium text-sc-ink-900">{formatNok(v)} <Mva /></span>
            </div>
          ))}
          <div role="row" className="flex items-baseline justify-between gap-4 bg-sc-ink-900 px-5 py-4 text-white lg:px-7">
            <span role="cell" className="text-base font-semibold">Totalt første år</span>
            <span role="cell" className="whitespace-nowrap font-mono text-[22px] font-medium">{formatNok(oppstart + kitA + lisens)} <span className="text-xs font-medium text-sc-ink-300">eks. mva</span></span>
          </div>
          <div role="row" className="flex items-baseline justify-between gap-4 bg-sc-ink-50 px-5 py-4 text-[15px] lg:px-7">
            <span role="cell" className="text-sc-ink-500">Fra år to: kun lisens</span>
            <span role="cell" className="whitespace-nowrap font-mono font-medium text-sc-ink-900">{formatNok(lisens)} / år</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ requirements */

export function Requirements() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Greit å vite" heading="Hva du trenger, og hva andre fakturerer" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">Dette må være på plass</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-relaxed text-sc-ink-600">
              {nexusRequirements.needed.map((l) => <li key={l} className="flex gap-2.5"><Check />{l}</li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">Faktureres av andre</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-relaxed text-sc-ink-600">
              {nexusRequirements.billedByOthers.map((l) => <li key={l} className="flex gap-2.5"><Dash />{l}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
