import Image from 'next/image'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { formatNok, nexusCopy, type NexusItem, type NexusLang } from '@/lib/nexuspos'
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

/** "eks. mva" / "excl. VAT" suffix after a price. */
const EX_VAT: Record<NexusLang, string> = { no: 'eks. mva', en: 'excl. VAT', sv: 'exkl. moms', da: 'ekskl. moms', de: 'zzgl. MwSt.' }
export const exVat = (lang: NexusLang) => EX_VAT[lang]

const Mva = ({ lang }: { lang: NexusLang }) => <span className="text-xs font-medium text-sc-ink-500">{exVat(lang)}</span>

type Lang = { lang?: NexusLang }

/* ------------------------------------------------------- before/after */

const BEFORE_AFTER = {
  no: {
    eyebrow: 'Unified commerce',
    heading: 'Slutt på kasse her og nettbutikk der',
    lead: 'Unified commerce betyr at butikk og nett deler samme motor. Ingen synkronisering om natten, ingen dobbel registrering, ingen gjetting på hva som faktisk er på lager.',
    beforeTag: 'Før',
    beforeHeading: 'Fire systemer som ikke snakker sammen',
    before: [
      ['Kasse', 'Eget kassesystem'],
      ['Nettbutikk', 'Egne priser og varer'],
      ['Lager', 'Henger på nettbutikken'],
      ['Regnskap', 'Ser på det i etterkant'],
    ],
    beforeText: 'Varen selges i butikken, men står fortsatt til salgs på nett. Rapportene stemmer aldri helt.',
    afterTag: 'Med Nexus POS',
    afterHeading: 'Én Shopify for hele bedriften',
    after: [
      ['Kasse', 'Shopify POS + N950'],
      ['Nettbutikk', 'Samme varer og priser'],
      ['Lager', 'Oppdateres ved hvert salg'],
      ['Regnskap', 'Z-rapport og SAF-T'],
    ],
    bullets: ['Klikk og hent, retur på tvers av kanaler og felles kundeklubb', 'Ett dashboard for omsetning i butikk og på nett'],
  },
  en: {
    eyebrow: 'Unified commerce',
    heading: 'No more till here and online store there',
    lead: 'Unified commerce means the store and the web share one engine. No overnight sync, no double entry, no guessing what is actually in stock.',
    beforeTag: 'Before',
    beforeHeading: 'Four systems that do not talk to each other',
    before: [
      ['Till', 'Separate POS system'],
      ['Online store', 'Its own prices and products'],
      ['Inventory', 'Tied to the online store'],
      ['Accounting', 'Looked at after the fact'],
    ],
    beforeText: 'The item sells in the store but is still for sale online. The reports never quite add up.',
    afterTag: 'With Nexus POS',
    afterHeading: 'One Shopify for the whole business',
    after: [
      ['Till', 'Shopify POS + N950'],
      ['Online store', 'Same products and prices'],
      ['Inventory', 'Updated with every sale'],
      ['Accounting', 'Z report and SAF-T'],
    ],
    bullets: ['Click and collect, cross-channel returns and one shared loyalty club', 'One dashboard for revenue in store and online'],
  },
  sv: {
    eyebrow: 'Unified commerce',
    heading: 'Slut på kassa här och webbutik där',
    lead: 'Unified commerce betyder att butik och webb delar samma motor. Ingen synkronisering om natten, ingen dubbel registrering, ingen gissning om vad som faktiskt finns i lager.',
    beforeTag: 'Före',
    beforeHeading: 'Fyra system som inte pratar med varandra',
    before: [
      ['Kassa', 'Eget kassasystem'],
      ['Webbutik', 'Egna priser och varor'],
      ['Lager', 'Hänger på webbutiken'],
      ['Bokföring', 'Tittar på det i efterhand'],
    ],
    beforeText: 'Varan säljs i butiken men ligger fortfarande till salu på webben. Rapporterna stämmer aldrig helt.',
    afterTag: 'Med Nexus POS',
    afterHeading: 'En Shopify för hela företaget',
    after: [
      ['Kassa', 'Shopify POS + N950'],
      ['Webbutik', 'Samma varor och priser'],
      ['Lager', 'Uppdateras vid varje försäljning'],
      ['Bokföring', 'Z-rapport och SAF-T'],
    ],
    bullets: ['Klicka och hämta, returer över kanaler och gemensam kundklubb', 'En dashboard för omsättning i butik och på webben'],
  },
  da: {
    eyebrow: 'Unified commerce',
    heading: 'Slut med kasse her og webshop der',
    lead: 'Unified commerce betyder, at butik og web deler samme motor. Ingen synkronisering om natten, ingen dobbeltregistrering, ingen gætten på, hvad der faktisk er på lager.',
    beforeTag: 'Før',
    beforeHeading: 'Fire systemer, der ikke taler sammen',
    before: [
      ['Kasse', 'Eget kassesystem'],
      ['Webshop', 'Egne priser og varer'],
      ['Lager', 'Hænger på webshoppen'],
      ['Regnskab', 'Ser på det bagefter'],
    ],
    beforeText: 'Varen sælges i butikken, men står stadig til salg på nettet. Rapporterne stemmer aldrig helt.',
    afterTag: 'Med Nexus POS',
    afterHeading: 'Én Shopify til hele virksomheden',
    after: [
      ['Kasse', 'Shopify POS + N950'],
      ['Webshop', 'Samme varer og priser'],
      ['Lager', 'Opdateres ved hvert salg'],
      ['Regnskab', 'Z-rapport og SAF-T'],
    ],
    bullets: ['Klik og hent, returer på tværs af kanaler og fælles kundeklub', 'Ét dashboard for omsætning i butik og på nettet'],
  },
  de: {
    eyebrow: 'Unified Commerce',
    heading: 'Schluss mit Kasse hier und Onlineshop dort',
    lead: 'Unified Commerce bedeutet, dass Geschäft und Web denselben Motor teilen. Keine nächtliche Synchronisation, keine doppelte Erfassung, kein Raten, was wirklich auf Lager ist.',
    beforeTag: 'Vorher',
    beforeHeading: 'Vier Systeme, die nicht miteinander sprechen',
    before: [
      ['Kasse', 'Eigenes Kassensystem'],
      ['Onlineshop', 'Eigene Preise und Artikel'],
      ['Lager', 'Hängt am Onlineshop'],
      ['Buchhaltung', 'Wird im Nachhinein geprüft'],
    ],
    beforeText: 'Der Artikel wird im Geschäft verkauft, steht aber online weiter zum Verkauf. Die Berichte stimmen nie ganz.',
    afterTag: 'Mit Nexus POS',
    afterHeading: 'Ein Shopify für das ganze Unternehmen',
    after: [
      ['Kasse', 'Shopify POS + N950'],
      ['Onlineshop', 'Gleiche Artikel und Preise'],
      ['Lager', 'Bei jedem Verkauf aktualisiert'],
      ['Buchhaltung', 'Z-Bericht und SAF-T'],
    ],
    bullets: ['Click & Collect, Retouren über alle Kanäle und ein gemeinsames Kundenprogramm', 'Ein Dashboard für den Umsatz im Geschäft und online'],
  },
}

export function BeforeAfter({ lang = 'no' }: Lang) {
  const t = BEFORE_AFTER[lang]
  return (
    <section id="unified" className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} lead={t.lead} />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-lg border border-dashed border-sc-ink-300 bg-white p-6 lg:p-8">
            <span className={ui.tagOutline}>{t.beforeTag}</span>
            <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em] text-sc-ink-900">{t.beforeHeading}</h3>
            <div className="grid grid-cols-2 gap-3">
              {t.before.map(([h, s]) => (
                <div key={h} className="flex flex-col gap-0.5 rounded-lg border border-dashed border-sc-ink-300 p-3.5 text-[15px] font-semibold text-sc-ink-700">
                  {h}
                  <small className="text-[13px] font-normal text-sc-ink-500">{s}</small>
                </div>
              ))}
            </div>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{t.beforeText}</p>
          </div>
          <div className="flex flex-col gap-5 rounded-lg bg-sc-ink-900 p-6 text-white lg:p-8">
            <span className="inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200">{t.afterTag}</span>
            <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em]">{t.afterHeading}</h3>
            <div className="grid grid-cols-2 gap-3">
              {t.after.slice(0, 2).map(([h, s]) => (
                <div key={h} className="flex flex-col gap-0.5 rounded-lg border border-sc-cyan-500/30 bg-sc-cyan-500/10 p-3.5 text-[15px] font-semibold">
                  {h}
                  <small className="text-[13px] font-normal text-sc-ink-300">{s}</small>
                </div>
              ))}
              <span className="col-span-2 justify-self-center rounded-full bg-sc-cyan-500 px-4 py-1.5 font-mono text-[12px] font-bold tracking-[0.06em] text-sc-ink-900">SHOPIFY + NEXUS POS</span>
              {t.after.slice(2).map(([h, s]) => (
                <div key={h} className="flex flex-col gap-0.5 rounded-lg border border-sc-cyan-500/30 bg-sc-cyan-500/10 p-3.5 text-[15px] font-semibold">
                  {h}
                  <small className="text-[13px] font-normal text-sc-ink-300">{s}</small>
                </div>
              ))}
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-sc-ink-200">
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2.5"><Check dark />{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- case */

const CASE = {
  no: {
    eyebrow: 'Kundecase · vår første Nexus POS-kunde',
    quote: '«Før levde kassen og nettbutikken hver for seg, lageret hang på nettbutikken, og regnskapet var noe vi så på i etterkant. Nå henger alt sammen, og jeg har ett sted å gå for å se hvordan bedriften faktisk går. Det er kritisk fremover, både for vekst og for kontroll.»',
    role: 'Daglig leder, FLEWÉ',
    asideLabel: 'FLEWÉ i tall',
    about: 'Norsk merkevare innen trenings- og sportsklær. Butikk og nettbutikk på Shopify, med Nexus POS i kassen.',
    stats: [
      ['3', 'kassepunkter på Nexus POS'],
      ['1', 'system for kasse, nettbutikk, lager og regnskap'],
      ['Først ute', 'den første butikken i Norge på Nexus POS'],
    ],
    more: 'Se flere kundecaser',
  },
  en: {
    eyebrow: 'Customer case · our first Nexus POS customer',
    quote: '“Before, the till and the online store lived separate lives, inventory was tied to the online store, and accounting was something we looked at after the fact. Now everything is connected, and I have one place to go to see how the business is actually doing. That is critical going forward, both for growth and for control.”',
    role: 'CEO, FLEWÉ',
    asideLabel: 'FLEWÉ in numbers',
    about: 'Norwegian training and sportswear brand. Store and online store on Shopify, with Nexus POS at the till.',
    stats: [
      ['3', 'tills on Nexus POS'],
      ['1', 'system for till, online store, inventory and accounting'],
      ['First', 'the first store in Norway on Nexus POS'],
    ],
    more: 'See more customer cases',
  },
  sv: {
    eyebrow: 'Kundcase · vår första Nexus POS-kund',
    quote: '”Förut levde kassan och webbutiken var för sig, lagret hängde på webbutiken och bokföringen var något vi tittade på i efterhand. Nu hänger allt ihop, och jag har ett ställe att gå till för att se hur företaget faktiskt går. Det är avgörande framöver, både för tillväxt och för kontroll.”',
    role: 'VD, FLEWÉ',
    asideLabel: 'FLEWÉ i siffror',
    about: 'Norskt varumärke inom tränings- och sportkläder. Butik och webbutik på Shopify, med Nexus POS i kassan.',
    stats: [
      ['3', 'kassaplatser på Nexus POS'],
      ['1', 'system för kassa, webbutik, lager och bokföring'],
      ['Först ut', 'den första butiken i Norge på Nexus POS'],
    ],
    more: 'Se fler kundcase',
  },
  da: {
    eyebrow: 'Kundecase · vores første Nexus POS-kunde',
    quote: '»Før levede kassen og webshoppen hver for sig, lageret hang på webshoppen, og regnskabet var noget, vi kiggede på bagefter. Nu hænger alt sammen, og jeg har ét sted at gå hen for at se, hvordan virksomheden faktisk går. Det er afgørende fremover, både for vækst og for kontrol.«',
    role: 'Direktør, FLEWÉ',
    asideLabel: 'FLEWÉ i tal',
    about: 'Norsk brand inden for trænings- og sportstøj. Butik og webshop på Shopify, med Nexus POS i kassen.',
    stats: [
      ['3', 'kassepunkter på Nexus POS'],
      ['1', 'system til kasse, webshop, lager og regnskab'],
      ['Først ude', 'den første butik i Norge på Nexus POS'],
    ],
    more: 'Se flere kundecases',
  },
  de: {
    eyebrow: 'Kundenreferenz · unser erster Nexus POS-Kunde',
    quote: '„Früher lebten Kasse und Onlineshop getrennt voneinander, das Lager hing am Onlineshop, und die Buchhaltung war etwas, das wir im Nachhinein angeschaut haben. Jetzt hängt alles zusammen, und ich habe einen Ort, an dem ich sehe, wie das Unternehmen wirklich läuft. Das ist entscheidend für die Zukunft, für Wachstum wie für Kontrolle.“',
    role: 'Geschäftsführerin, FLEWÉ',
    asideLabel: 'FLEWÉ in Zahlen',
    about: 'Norwegische Marke für Trainings- und Sportbekleidung. Geschäft und Onlineshop auf Shopify, mit Nexus POS an der Kasse.',
    stats: [
      ['3', 'Kassen auf Nexus POS'],
      ['1', 'System für Kasse, Onlineshop, Lager und Buchhaltung'],
      ['Erste', 'das erste Geschäft in Norwegen auf Nexus POS'],
    ],
    more: 'Weitere Kundenreferenzen',
  },
}

export function CaseFlewe({ casesHref, lang = 'no' }: { casesHref: string } & Lang) {
  const t = CASE[lang]
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14`}>
        <div>
          <div className={`${ui.eyebrow} mb-5`}>{t.eyebrow}</div>
          <blockquote className="m-0">
            <p className="m-0 text-[22px] font-medium leading-[1.35] tracking-[-0.01em] text-sc-ink-900 lg:text-[30px]">
              {t.quote}
            </p>
          </blockquote>
          <div className="mt-7 flex items-center gap-3.5">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-sc-ink-900 font-mono text-sm font-bold text-sc-cyan-300" aria-hidden="true">MJ</span>
            <div className="text-[15px]">
              <b className="font-semibold text-sc-ink-900">Maren Johansen</b>
              <br />
              <span className="text-sc-ink-500">{t.role}</span>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-5 rounded-lg bg-sc-ink-900 p-6 text-white lg:p-8" aria-label={t.asideLabel}>
          <span className="text-[26px] font-bold tracking-[0.16em]">FLEWÉ</span>
          <p className="m-0 text-[15px] leading-relaxed text-sc-ink-200">{t.about}</p>
          {t.stats.map(([v, l]) => (
            <div key={l} className="flex flex-col gap-0.5 border-t border-white/10 pt-4">
              <b className="font-mono text-[26px] font-medium tracking-tight text-sc-cyan-300">{v}</b>
              <span className="text-sm text-sc-ink-200">{l}</span>
            </div>
          ))}
          <LocalizedLink href={casesHref} className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50">
            {t.more}
          </LocalizedLink>
        </aside>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- steps */

const STEPS = {
  no: { eyebrow: 'Slik fungerer det', heading: 'Fra iPad til kvittering på fire steg', lead: 'Kunden betaler som vanlig. Alt det kjedelige skjer automatisk i bakgrunnen.' },
  en: { eyebrow: 'How it works', heading: 'From iPad to receipt in four steps', lead: 'The customer pays as usual. All the boring parts happen automatically in the background.' },
  sv: { eyebrow: 'Så fungerar det', heading: 'Från iPad till kvitto i fyra steg', lead: 'Kunden betalar som vanligt. Allt det tråkiga sker automatiskt i bakgrunden.' },
  da: { eyebrow: 'Sådan fungerer det', heading: 'Fra iPad til kvittering i fire trin', lead: 'Kunden betaler som sædvanligt. Alt det kedelige sker automatisk i baggrunden.' },
  de: { eyebrow: 'So funktioniert es', heading: 'Vom iPad zum Beleg in vier Schritten', lead: 'Der Kunde zahlt wie gewohnt. Alles Lästige passiert automatisch im Hintergrund.' },
}

export function Steps({ lang = 'no' }: Lang) {
  const t = STEPS[lang]
  const steps = nexusCopy(lang).steps
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} lead={t.lead} />
        <ol className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
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

const PRICING = {
  no: {
    eyebrow: 'Priser',
    heading: 'Vit hva du betaler før du starter',
    lead: 'Tre tall. Oppstart én gang, lisens per kassepunkt og terminal til fast pris. Alle priser eks. mva.',
    order: 'Bestill',
    onboarding: ['Gjennomgang av dagens kasse og migrering', 'Oppsett av Nexus POS, Shopify POS og terminal', 'Opplæring av deg og de ansatte'],
    licence: ['Kvittering, journal, X/Z-rapporter og SAF-T', 'Inntil 2 timer support i måneden, svar neste virkedag', 'Løpende oppdateringer og videreutvikling'],
    terminal: { type: 'Engangs', name: 'Nets N950-terminal', unit: 'per terminal' },
    terminalLines: ['Mobil terminal med innebygd skriver', 'Kort, kontaktløst og Vipps', 'Har du N950 fra før? Den kan ofte gjenbrukes'],
    addon: 'Tillegg',
    perMonth: '/ mnd',
    askSla: 'Spør om SLA',
    terms: 'Ingen binding · 30 dagers oppsigelse · 14 dagers betalingsfrist · Årlig KPI-justering · Endringer utenfor avtalt omfang: 1 250 kr/t eks. mva, fastpris der det er mulig.',
  },
  en: {
    eyebrow: 'Prices',
    heading: 'Know what you pay before you start',
    lead: 'Three numbers. Onboarding once, a licence per till and a terminal at a fixed price. All prices excl. VAT.',
    order: 'Order',
    onboarding: ['Review of your current till and migration', 'Setup of Nexus POS, Shopify POS and the terminal', 'Training for you and your staff'],
    licence: ['Receipts, journal, X/Z reports and SAF-T', 'Up to 2 hours of support a month, next-business-day response', 'Ongoing updates and development'],
    terminal: { type: 'One-off', name: 'Nets N950 terminal', unit: 'per terminal' },
    terminalLines: ['Mobile terminal with a built-in printer', 'Cards, contactless and Vipps', 'Already have an N950? It can often be reused'],
    addon: 'Add-on',
    perMonth: '/ month',
    askSla: 'Ask about the SLA',
    terms: 'No lock-in · 30 days notice · 14-day payment terms · Annual CPI adjustment · Changes outside the agreed scope: 1 250 kr/h excl. VAT, fixed price where possible.',
  },
  sv: {
    eyebrow: 'Priser',
    heading: 'Vet vad du betalar innan du börjar',
    lead: 'Tre siffror. Uppstart en gång, licens per kassaplats och terminal till fast pris. Alla priser exkl. moms.',
    order: 'Beställ',
    onboarding: ['Genomgång av dagens kassa och migrering', 'Uppsättning av Nexus POS, Shopify POS och terminal', 'Utbildning av dig och personalen'],
    licence: ['Kvitto, journal, X/Z-rapporter och SAF-T', 'Upp till 2 timmars support per månad, svar nästa arbetsdag', 'Löpande uppdateringar och vidareutveckling'],
    terminal: { type: 'Engångs', name: 'Nets N950-terminal', unit: 'per terminal' },
    terminalLines: ['Mobil terminal med inbyggd skrivare', 'Kort, kontaktlöst och Vipps', 'Har du redan en N950? Den kan ofta återanvändas'],
    addon: 'Tillägg',
    perMonth: '/ mån',
    askSla: 'Fråga om SLA',
    terms: 'Ingen bindningstid · 30 dagars uppsägningstid · 14 dagars betalningsvillkor · Årlig KPI-justering · Ändringar utanför avtalad omfattning: 1 250 kr/h exkl. moms, fast pris där det är möjligt.',
  },
  da: {
    eyebrow: 'Priser',
    heading: 'Vid, hvad du betaler, før du starter',
    lead: 'Tre tal. Opstart én gang, licens per kassepunkt og terminal til fast pris. Alle priser ekskl. moms.',
    order: 'Bestil',
    onboarding: ['Gennemgang af den nuværende kasse og migrering', 'Opsætning af Nexus POS, Shopify POS og terminal', 'Oplæring af dig og dine medarbejdere'],
    licence: ['Kvittering, journal, X/Z-rapporter og SAF-T', 'Op til 2 timers support om måneden, svar næste hverdag', 'Løbende opdateringer og videreudvikling'],
    terminal: { type: 'Engangs', name: 'Nets N950-terminal', unit: 'per terminal' },
    terminalLines: ['Mobil terminal med indbygget printer', 'Kort, kontaktløs og Vipps', 'Har du en N950 i forvejen? Den kan ofte genbruges'],
    addon: 'Tillæg',
    perMonth: '/ md.',
    askSla: 'Spørg om SLA',
    terms: 'Ingen binding · 30 dages opsigelse · 14 dages betalingsfrist · Årlig regulering efter forbrugerprisindekset · Ændringer uden for aftalt omfang: 1 250 kr/t ekskl. moms, fast pris hvor det er muligt.',
  },
  de: {
    eyebrow: 'Preise',
    heading: 'Wissen Sie vor dem Start, was Sie zahlen',
    lead: 'Drei Zahlen. Onboarding einmalig, Lizenz pro Kasse und Terminal zum Festpreis. Alle Preise zzgl. MwSt.',
    order: 'Bestellen',
    onboarding: ['Prüfung Ihrer bisherigen Kasse und Migration', 'Einrichtung von Nexus POS, Shopify POS und Terminal', 'Schulung für Sie und Ihr Team'],
    licence: ['Beleg, Journal, X/Z-Berichte und SAF-T', 'Bis zu 2 Stunden Support pro Monat, Antwort am nächsten Werktag', 'Laufende Updates und Weiterentwicklung'],
    terminal: { type: 'Einmalig', name: 'Nets N950-Terminal', unit: 'pro Terminal' },
    terminalLines: ['Mobiles Terminal mit integriertem Drucker', 'Karte, kontaktlos und Vipps', 'Sie haben bereits ein N950? Es lässt sich oft weiterverwenden'],
    addon: 'Zusatz',
    perMonth: '/ Monat',
    askSla: 'Nach dem SLA fragen',
    terms: 'Keine Mindestlaufzeit · 30 Tage Kündigungsfrist · 14 Tage Zahlungsziel · Jährliche Anpassung an den Verbraucherpreisindex · Änderungen außerhalb des vereinbarten Umfangs: 1 250 kr/h zzgl. MwSt., Festpreis wo möglich.',
  },
}

function PriceCard({ item, dark, lines, contactHref, lang }: { item: NexusItem; dark?: boolean; lines: string[]; contactHref: string; lang: NexusLang }) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg border p-6 lg:p-7 ${dark ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
      <span className={dark ? 'inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200' : ui.tag}>{item.type}</span>
      <h3 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em]">{item.name}</h3>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[30px] font-medium tracking-tight">{formatNok(item.price)}</span>
        <span className={`text-sm ${dark ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{item.unit} · {exVat(lang)}</span>
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
          {PRICING[lang].order}
        </LocalizedLink>
      )}
    </div>
  )
}

export function Pricing({ items, contactHref, lang = 'no' }: { items: NexusItem[]; contactHref: string } & Lang) {
  const t = PRICING[lang]
  const get = (h: string) => items.find((i) => i.handle === h)!
  const oppstart = get('nexus-pos-oppstart')
  const lisens = get('nexus-pos-lisens')
  const terminal = get('nets-n950')
  const sla = get('nexus-pos-standard-sla')
  return (
    <section id="priser" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} lead={t.lead} />
        <div className="grid gap-5 md:grid-cols-3">
          <PriceCard item={oppstart} contactHref={contactHref} lang={lang} lines={t.onboarding} />
          <PriceCard item={lisens} dark contactHref={contactHref} lang={lang} lines={t.licence} />
          <PriceCard item={{ ...terminal, ...t.terminal }} contactHref={contactHref} lang={lang} lines={t.terminalLines} />
        </div>
        <div className="mt-5 flex flex-col gap-5 rounded-lg border border-dashed border-sc-ink-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-[720px]">
            <div className={`${ui.eyebrow} mb-2`}>{t.addon}</div>
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">
              {sla.name} – <span className="font-mono font-medium">{formatNok(sla.price)}</span> {t.perMonth} <Mva lang={lang} />
            </h3>
            <p className="mb-0 mt-2 text-[15px] leading-relaxed text-sc-ink-600">{sla.description}</p>
          </div>
          <LocalizedLink href={contactHref} className={`${ui.btnSecondary} flex-none`}>{t.askSla}</LocalizedLink>
        </div>
        <p className="mb-0 mt-5 text-sm leading-relaxed text-sc-ink-500">{t.terms}</p>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- kits */

const KITS = {
  no: { eyebrow: 'Ferdige kassepakker', heading: 'Alt du trenger på disken, i én pris', lead: 'Velg en pakke per kassepunkt. Har du utstyr som fungerer, gjenbruker vi det.', order: 'Bestill' },
  en: { eyebrow: 'Ready-made till kits', heading: 'Everything you need on the counter, in one price', lead: 'Choose one kit per till. If you have equipment that works, we reuse it.', order: 'Order' },
  sv: { eyebrow: 'Färdiga kassapaket', heading: 'Allt du behöver på disken, till ett pris', lead: 'Välj ett paket per kassaplats. Har du utrustning som fungerar återanvänder vi den.', order: 'Beställ' },
  da: { eyebrow: 'Færdige kassepakker', heading: 'Alt du skal bruge på disken, til én pris', lead: 'Vælg en pakke per kassepunkt. Har du udstyr, der virker, genbruger vi det.', order: 'Bestil' },
  de: { eyebrow: 'Fertige Kassenpakete', heading: 'Alles für die Theke, zu einem Preis', lead: 'Wählen Sie ein Paket pro Kasse. Funktionierende Ausstattung verwenden wir weiter.', order: 'Bestellen' },
}

export function Kits({ items, contactHref, lang = 'no' }: { items: NexusItem[]; contactHref: string } & Lang) {
  const t = KITS[lang]
  const kitContents = nexusCopy(lang).kitContents
  const kits = items.filter((i) => i.group === 'kit')
  return (
    <section id="pakker" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} lead={t.lead} />
        <div className="grid gap-5 lg:grid-cols-2">
          {kits.map((kit, i) => {
            const dark = i === kits.length - 1
            const c = kitContents[kit.handle as keyof typeof kitContents]
            return (
              <div key={kit.handle} className={`flex flex-col gap-4 rounded-lg border p-6 lg:p-8 ${dark ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-100 bg-white text-sc-ink-900'}`}>
                <span className={dark ? 'inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200' : ui.tag}>{kit.type}</span>
                <h3 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em]">{kit.name}</h3>
                <p className={`m-0 text-[15px] leading-relaxed ${dark ? 'text-sc-ink-200' : 'text-sc-ink-600'}`}>{kit.description}</p>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-[30px] font-medium tracking-tight">{formatNok(kit.price)}</span>
                  <span className={`text-sm ${dark ? 'text-sc-ink-300' : 'text-sc-ink-500'}`}>{kit.unit} · {exVat(lang)}</span>
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
                      {t.order} {kit.type}
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

const FIRST_YEAR = {
  no: {
    eyebrow: 'Regnestykket',
    heading: 'Hva koster første år?',
    lead: 'Eksempel: én butikk med ett kassepunkt og Pakke A. Ingen skjulte gebyrer fra oss. Det som faktureres av andre, står under.',
    note: 'Flere kassepunkter? Oppstarten betales én gang per butikk. Lisens og utstyr ganges med antall kassepunkter. Kjeder med flere butikker får eget tilbud.',
    tableLabel: 'Kostnad første år, ett kassepunkt',
    onboarding: 'Oppstart',
    kitA: 'Pakke A – full kassedisk inkl. N950',
    licence: 'Lisens, 12 mnd × ',
    total: 'Totalt første år',
    fromYearTwo: 'Fra år to: kun lisens',
    perYear: '/ år',
  },
  en: {
    eyebrow: 'The maths',
    heading: 'What does the first year cost?',
    lead: 'Example: one store with one till and Kit A. No hidden fees from us. What others invoice is listed below.',
    note: 'More tills? Onboarding is paid once per store. Licence and equipment are multiplied by the number of tills. Chains with several stores get a tailored quote.',
    tableLabel: 'First-year cost, one till',
    onboarding: 'Onboarding',
    kitA: 'Kit A – full counter incl. N950',
    licence: 'Licence, 12 months × ',
    total: 'Total first year',
    fromYearTwo: 'From year two: licence only',
    perYear: '/ year',
  },
  sv: {
    eyebrow: 'Räkneexemplet',
    heading: 'Vad kostar första året?',
    lead: 'Exempel: en butik med en kassaplats och Paket A. Inga dolda avgifter från oss. Det som faktureras av andra står nedan.',
    note: 'Fler kassaplatser? Uppstarten betalas en gång per butik. Licens och utrustning multipliceras med antalet kassaplatser. Kedjor med flera butiker får en egen offert.',
    tableLabel: 'Kostnad första året, en kassaplats',
    onboarding: 'Uppstart',
    kitA: 'Paket A – komplett kassadisk inkl. N950',
    licence: 'Licens, 12 mån × ',
    total: 'Totalt första året',
    fromYearTwo: 'Från år två: endast licens',
    perYear: '/ år',
  },
  da: {
    eyebrow: 'Regnestykket',
    heading: 'Hvad koster det første år?',
    lead: 'Eksempel: én butik med ét kassepunkt og Pakke A. Ingen skjulte gebyrer fra os. Det, der faktureres af andre, står nedenfor.',
    note: 'Flere kassepunkter? Opstarten betales én gang per butik. Licens og udstyr ganges med antallet af kassepunkter. Kæder med flere butikker får et eget tilbud.',
    tableLabel: 'Omkostning første år, ét kassepunkt',
    onboarding: 'Opstart',
    kitA: 'Pakke A – fuld kassedisk inkl. N950',
    licence: 'Licens, 12 md. × ',
    total: 'I alt første år',
    fromYearTwo: 'Fra år to: kun licens',
    perYear: '/ år',
  },
  de: {
    eyebrow: 'Die Rechnung',
    heading: 'Was kostet das erste Jahr?',
    lead: 'Beispiel: ein Geschäft mit einer Kasse und Paket A. Keine versteckten Gebühren von uns. Was andere abrechnen, steht unten.',
    note: 'Mehrere Kassen? Das Onboarding wird einmalig pro Geschäft berechnet. Lizenz und Ausstattung multiplizieren sich mit der Anzahl der Kassen. Ketten mit mehreren Geschäften erhalten ein individuelles Angebot.',
    tableLabel: 'Kosten im ersten Jahr, eine Kasse',
    onboarding: 'Onboarding',
    kitA: 'Paket A – komplette Kassentheke inkl. N950',
    licence: 'Lizenz, 12 Monate × ',
    total: 'Gesamt im ersten Jahr',
    fromYearTwo: 'Ab dem zweiten Jahr: nur Lizenz',
    perYear: '/ Jahr',
  },
}

export function FirstYear({ items, lang = 'no' }: { items: NexusItem[] } & Lang) {
  const t = FIRST_YEAR[lang]
  const get = (h: string) => items.find((i) => i.handle === h)!
  const oppstart = get('nexus-pos-oppstart').price
  const kitA = get('nexus-pos-pakke-a-full-kassedisk').price
  const lisens = get('nexus-pos-lisens').price * 12
  const rows: [string, number][] = [
    [t.onboarding, oppstart],
    [t.kitA, kitA],
    [t.licence + formatNok(get('nexus-pos-lisens').price), lisens],
  ]
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid items-start gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16`}>
        <div>
          <div className={`${ui.eyebrow} mb-2.5`}>{t.eyebrow}</div>
          <h2 className={ui.h2}>{t.heading}</h2>
          <p className="mb-0 mt-5 text-base leading-relaxed text-sc-ink-600 lg:text-lg">{t.lead}</p>
          <p className="mb-0 mt-5 text-[15px] leading-relaxed text-sc-ink-500">{t.note}</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-white" role="table" aria-label={t.tableLabel}>
          {rows.map(([l, v]) => (
            <div key={l} role="row" className="flex items-baseline justify-between gap-4 border-b border-sc-ink-100 px-5 py-4 text-[15px] lg:px-7">
              <span role="cell" className="text-sc-ink-700">{l}</span>
              <span role="cell" className="whitespace-nowrap font-mono font-medium text-sc-ink-900">{formatNok(v)} <Mva lang={lang} /></span>
            </div>
          ))}
          <div role="row" className="flex items-baseline justify-between gap-4 bg-sc-ink-900 px-5 py-4 text-white lg:px-7">
            <span role="cell" className="text-base font-semibold">{t.total}</span>
            <span role="cell" className="whitespace-nowrap font-mono text-[22px] font-medium">{formatNok(oppstart + kitA + lisens)} <span className="text-xs font-medium text-sc-ink-300">{exVat(lang)}</span></span>
          </div>
          <div role="row" className="flex items-baseline justify-between gap-4 bg-sc-ink-50 px-5 py-4 text-[15px] lg:px-7">
            <span role="cell" className="text-sc-ink-500">{t.fromYearTwo}</span>
            <span role="cell" className="whitespace-nowrap font-mono font-medium text-sc-ink-900">{formatNok(lisens)} {t.perYear}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ requirements */

const REQUIREMENTS = {
  no: { eyebrow: 'Greit å vite', heading: 'Hva du trenger, og hva andre fakturerer', needed: 'Dette må være på plass', billed: 'Faktureres av andre' },
  en: { eyebrow: 'Good to know', heading: 'What you need, and what others invoice', needed: 'This needs to be in place', billed: 'Invoiced by others' },
  sv: { eyebrow: 'Bra att veta', heading: 'Vad du behöver, och vad andra fakturerar', needed: 'Det här måste finnas på plats', billed: 'Faktureras av andra' },
  da: { eyebrow: 'Godt at vide', heading: 'Hvad du skal bruge, og hvad andre fakturerer', needed: 'Det skal være på plads', billed: 'Faktureres af andre' },
  de: { eyebrow: 'Gut zu wissen', heading: 'Was Sie brauchen, und was andere abrechnen', needed: 'Das muss vorhanden sein', billed: 'Wird von anderen abgerechnet' },
}

export function Requirements({ lang = 'no' }: Lang) {
  const t = REQUIREMENTS[lang]
  const req = nexusCopy(lang).requirements
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">{t.needed}</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-relaxed text-sc-ink-600">
              {req.needed.map((l) => <li key={l} className="flex gap-2.5"><Check />{l}</li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-7">
            <h3 className="m-0 text-[20px] font-bold leading-tight text-sc-ink-900">{t.billed}</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-relaxed text-sc-ink-600">
              {req.billedByOthers.map((l) => <li key={l} className="flex gap-2.5"><Dash />{l}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
