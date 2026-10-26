import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import type { NexusLang } from '@/lib/nexuspos'
import UnifiedCommerceVisual from './UnifiedCommerceVisual'

const T = {
  no: {
    news: 'Nyhet',
    pill: 'Unified commerce er endelig tilgjengelig i Norge',
    h1: 'Kasse, nettbutikk, lager og regnskap.',
    h1Accent: 'Endelig i ett system.',
    lead: 'Nexus POS gjør Shopify POS klar for norsk kasselov, med Nets-terminal, kvittering, journal, X/Z-rapporter og SAF-T. Dermed blir Shopify det ene stedet der butikken og nettbutikken møtes. Samme varer, samme lager, samme kunder og ett tall for hvordan bedriften faktisk går.',
    prices: 'Se hva det koster',
    book: 'Bestill en uforpliktende samtale',
    terms: 'Faste priser · Ingen binding · 30 dagers oppsigelse',
  },
  en: {
    news: 'New',
    pill: 'Unified commerce is finally available in Norway',
    h1: 'Till, online store, inventory and accounting.',
    h1Accent: 'Finally in one system.',
    lead: 'Nexus POS makes Shopify POS compliant with the Norwegian Cash Register Act, with a Nets terminal, receipts, journal, X/Z reports and SAF-T. Shopify becomes the one place where the store and the online store meet. Same products, same inventory, same customers and one number for how the business is actually doing.',
    prices: 'See what it costs',
    book: 'Book a no-obligation call',
    terms: 'Fixed prices · No lock-in · 30 days notice',
  },
  sv: {
    news: 'Nyhet',
    pill: 'Unified commerce är äntligen tillgängligt i Norge',
    h1: 'Kassa, webbutik, lager och bokföring.',
    h1Accent: 'Äntligen i ett system.',
    lead: 'Nexus POS gör Shopify POS redo för den norska kassalagen, med Nets-terminal, kvitto, journal, X/Z-rapporter och SAF-T. Därmed blir Shopify det enda stället där butiken och webbutiken möts. Samma varor, samma lager, samma kunder och en siffra för hur företaget faktiskt går.',
    prices: 'Se vad det kostar',
    book: 'Boka ett förutsättningslöst samtal',
    terms: 'Fasta priser · Ingen bindningstid · 30 dagars uppsägningstid',
  },
  da: {
    news: 'Nyhed',
    pill: 'Unified commerce er endelig tilgængelig i Norge',
    h1: 'Kasse, webshop, lager og regnskab.',
    h1Accent: 'Endelig i ét system.',
    lead: 'Nexus POS gør Shopify POS klar til den norske kasselov, med Nets-terminal, kvittering, journal, X/Z-rapporter og SAF-T. Dermed bliver Shopify det ene sted, hvor butikken og webshoppen mødes. Samme varer, samme lager, samme kunder og ét tal for, hvordan virksomheden faktisk går.',
    prices: 'Se hvad det koster',
    book: 'Book en uforpligtende samtale',
    terms: 'Faste priser · Ingen binding · 30 dages opsigelse',
  },
  de: {
    news: 'Neu',
    pill: 'Unified Commerce ist endlich in Norwegen verfügbar',
    h1: 'Kasse, Onlineshop, Lager und Buchhaltung.',
    h1Accent: 'Endlich in einem System.',
    lead: 'Nexus POS macht Shopify POS fit für das norwegische Kassengesetz, mit Nets-Terminal, Beleg, Journal, X/Z-Berichten und SAF-T. Damit wird Shopify zum einen Ort, an dem Geschäft und Onlineshop zusammenkommen. Gleiche Artikel, gleiches Lager, gleiche Kunden und eine Zahl dafür, wie das Unternehmen wirklich läuft.',
    prices: 'Preise ansehen',
    book: 'Unverbindliches Gespräch vereinbaren',
    terms: 'Festpreise · Keine Mindestlaufzeit · 30 Tage Kündigungsfrist',
  },
}

export default function NexusHero({ contactHref, lang = 'no' }: { contactHref: string; lang?: NexusLang }) {
  const t = T[lang]
  return (
    <section className="bg-white">
      <div className={`${ui.container} grid grid-cols-1 items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16`}>
        <div>
          <span className="mb-5 inline-flex max-w-full items-center gap-2.5 rounded-full border border-sc-ink-100 bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold text-sc-ink-900 shadow-sm">
            <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-sc-cyan-50 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-sc-cyan-700">
              <span className="relative h-2 w-2 rounded-full bg-sc-cyan-500" aria-hidden="true" />
              {t.news}
            </span>
            <span className="truncate">{t.pill}</span>
          </span>
          <div className={`${ui.eyebrow} mb-4`}>Nexus POS</div>
          <h1 className="mb-5 text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:mb-6 lg:text-[60px]">
            {t.h1} <span className="text-sc-cyan-500">{t.h1Accent}</span>
          </h1>
          <p className="m-0 max-w-[600px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">
            {t.lead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#priser" className={ui.btnPrimary}>{t.prices}</a>
            <LocalizedLink href={contactHref} className={ui.btnSecondary}>{t.book}</LocalizedLink>
          </div>
          <p className="mb-0 mt-6 text-sm text-sc-ink-500">{t.terms}</p>
        </div>
        <UnifiedCommerceVisual lang={lang} />
      </div>
    </section>
  )
}
