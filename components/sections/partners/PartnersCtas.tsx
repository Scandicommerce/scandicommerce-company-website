import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { partnerLang } from '@/lib/partnersCatalog'

interface Cta {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

const T = {
  no: {
    thread: 'Den røde tråden',
    quote: 'Vi gjør Shopify-delen og norsk ERP og compliance. Partnerne gjør det de er best på. ',
    quoteAccent: 'Ingen av oss selger timer på det andre.',
    forStores: 'For butikker',
    storeTitle: 'Usikker på hvilken løsning som passer?',
    storeText: '15 minutter med oss, så setter vi sammen stacken – med partnere vi stoler på og en fast pris.',
    storeButton: 'Bestill en uforpliktende samtale',
    forPartners: 'For partnere',
    partnerTitle: 'Vil du jobbe med oss?',
    partnerText: 'Vi ser etter partnere som deler verdiene våre og vil levere ordentlige løsninger til norske Shopify-butikker.',
    partnerButton: 'Ta kontakt om partnerskap',
  },
  en: {
    thread: 'The common thread',
    quote: 'We do the Shopify part and Norwegian ERP and compliance. Partners do what they do best. ',
    quoteAccent: 'Neither of us sells hours on the other.',
    forStores: 'For stores',
    storeTitle: 'Not sure which solution fits?',
    storeText: '15 minutes with us and we assemble the stack – with partners we trust and a fixed price.',
    storeButton: 'Book a call',
    forPartners: 'For partners',
    partnerTitle: 'Want to work with us?',
    partnerText: 'We look for partners who share our values and want to deliver proper solutions to Norwegian Shopify stores.',
    partnerButton: 'Get in touch about partnership',
  },
  sv: {
    thread: 'Den röda tråden',
    quote: 'Vi gör Shopify-delen och norsk ERP och compliance. Partnerna gör det de är bäst på. ',
    quoteAccent: 'Ingen av oss säljer timmar på det andra.',
    forStores: 'För butiker',
    storeTitle: 'Osäker på vilken lösning som passar?',
    storeText: '15 minuter med oss, så sätter vi ihop stacken – med partner vi litar på och ett fast pris.',
    storeButton: 'Boka ett förutsättningslöst samtal',
    forPartners: 'För partner',
    partnerTitle: 'Vill du jobba med oss?',
    partnerText: 'Vi söker partner som delar våra värderingar och vill leverera ordentliga lösningar till norska Shopify-butiker.',
    partnerButton: 'Kontakta oss om partnerskap',
  },
  da: {
    thread: 'Den røde tråd',
    quote: 'Vi laver Shopify-delen og norsk ERP og compliance. Partnerne gør det, de er bedst til. ',
    quoteAccent: 'Ingen af os sælger timer på det andet.',
    forStores: 'For butikker',
    storeTitle: 'Usikker på, hvilken løsning der passer?',
    storeText: '15 minutter med os, så sætter vi stacken sammen – med partnere, vi stoler på, og en fast pris.',
    storeButton: 'Book en uforpligtende samtale',
    forPartners: 'For partnere',
    partnerTitle: 'Vil du arbejde med os?',
    partnerText: 'Vi leder efter partnere, der deler vores værdier og vil levere ordentlige løsninger til norske Shopify-butikker.',
    partnerButton: 'Kontakt os om partnerskab',
  },
  de: {
    thread: 'Der rote Faden',
    quote: 'Wir übernehmen den Shopify-Teil sowie norwegisches ERP und Compliance. Die Partner machen, was sie am besten können. ',
    quoteAccent: 'Keiner von uns verkauft Stunden für das Gebiet des anderen.',
    forStores: 'Für Shops',
    storeTitle: 'Unsicher, welche Lösung passt?',
    storeText: '15 Minuten mit uns, und wir stellen den Stack zusammen – mit Partnern, denen wir vertrauen, und einem Festpreis.',
    storeButton: 'Unverbindliches Gespräch vereinbaren',
    forPartners: 'Für Partner',
    partnerTitle: 'Möchten Sie mit uns arbeiten?',
    partnerText: 'Wir suchen Partner, die unsere Werte teilen und norwegischen Shopify-Shops solide Lösungen liefern wollen.',
    partnerButton: 'Kontakt zum Thema Partnerschaft',
  },
}

/** The red thread quote, then two CTA cards: one for stores (from Sanity), one for would-be partners. */
export default function PartnersCtas({ cta, contactHref, lang }: { cta?: Cta; contactHref: string; lang: string }) {
  const t = T[partnerLang(lang)]
  const storeTitle = cta?.title || t.storeTitle
  const storeText = cta?.description || t.storeText
  const storeButton = cta?.buttonText || t.storeButton
  const storeHref = cta?.buttonLink && cta.buttonLink.startsWith('/') ? cta.buttonLink : contactHref
  return (
    <>
      <section className="relative overflow-hidden bg-sc-ink-900 py-16 text-white lg:py-24">
        <div className={ui.container}>
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{t.thread}</div>
          <p className="m-0 max-w-[960px] text-[24px] font-semibold leading-[1.25] tracking-[-0.015em] lg:text-[40px]">
            {t.quote}
            <span className="text-sc-cyan-300">{t.quoteAccent}</span>
          </p>
        </div>
      </section>
      <section className="bg-white py-16 lg:py-20">
        <div className={`${ui.container} grid gap-5 lg:grid-cols-2`}>
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-7 lg:p-9">
            <div className={ui.eyebrow}>{t.forStores}</div>
            <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[30px]">{storeTitle}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600 lg:text-base">{storeText}</p>
            <LocalizedLink href={storeHref} className={`${ui.btnPrimary} w-fit`}>{storeButton}</LocalizedLink>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-sc-ink-900 p-7 text-white lg:p-9">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{t.forPartners}</div>
            <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] lg:text-[30px]">{t.partnerTitle}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-200 lg:text-base">{t.partnerText}</p>
            <a href="mailto:post@scandicommerce.no?subject=Partnerskap" className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
              {t.partnerButton}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
