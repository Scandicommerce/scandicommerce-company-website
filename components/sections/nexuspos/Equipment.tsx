import Image from 'next/image'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { formatNok, swatchLabel, type NexusItem, type NexusLang } from '@/lib/nexuspos'
import PackageAddToCart from '@/components/sections/services/all_packages/PackageAddToCart'
import { SectionHead, exVat } from './NexusSections'

const T = {
  no: {
    eyebrow: 'Utstyr',
    heading: 'Bygg din egen kasse',
    lead: 'Testet med Shopify POS og Nexus POS. Det meste har vi på lager, og vi setter det opp for deg.',
    order: 'Bestill →',
    standIn: 'i',
    standFeatures: ['350° rotasjon og 90° vinkling', 'Støpt aluminium, klar for Kensington-lås', 'Passer nettbrett fra 7 til 13", også iPad 11"', 'Kabelføring gjennom foten for et ryddig oppsett'],
    rentEyebrow: 'Pop-up og messe',
    rentHeading: 'Trenger du kasse for en helg?',
    rentText: 'Vi leier ut komplette kassepakker. Pris på forespørsel.',
    rentButton: 'Spør oss',
    footnote: 'Alle priser eks. mva. Hvite varianter av stativ og skuff leveres på forespørsel.',
    fromShopify: ' Priser og lagerstatus hentes fra nettbutikken vår.',
  },
  en: {
    eyebrow: 'Equipment',
    heading: 'Build your own till',
    lead: 'Tested with Shopify POS and Nexus POS. Most of it is in stock, and we set it up for you.',
    order: 'Order →',
    standIn: 'in',
    standFeatures: ['350° rotation and 90° tilt', 'Cast aluminium, ready for a Kensington lock', 'Fits tablets from 7 to 13", including iPad 11"', 'Cable routing through the base for a tidy setup'],
    rentEyebrow: 'Pop-up and trade shows',
    rentHeading: 'Need a till for a weekend?',
    rentText: 'We rent out complete till kits. Price on request.',
    rentButton: 'Ask us',
    footnote: 'All prices excl. VAT. White versions of the stand and drawer are available on request.',
    fromShopify: ' Prices and stock status come from our online store.',
  },
  sv: {
    eyebrow: 'Utrustning',
    heading: 'Bygg din egen kassa',
    lead: 'Testat med Shopify POS och Nexus POS. Det mesta har vi i lager, och vi sätter upp det åt dig.',
    order: 'Beställ →',
    standIn: 'i',
    standFeatures: ['350° rotation och 90° lutning', 'Gjuten aluminium, klar för Kensington-lås', 'Passar surfplattor från 7 till 13", även iPad 11"', 'Kabeldragning genom foten för en städad uppsättning'],
    rentEyebrow: 'Pop-up och mässa',
    rentHeading: 'Behöver du en kassa för en helg?',
    rentText: 'Vi hyr ut kompletta kassapaket. Pris på begäran.',
    rentButton: 'Fråga oss',
    footnote: 'Alla priser exkl. moms. Vita varianter av stativ och låda levereras på begäran.',
    fromShopify: ' Priser och lagerstatus hämtas från vår webbutik.',
  },
  da: {
    eyebrow: 'Udstyr',
    heading: 'Byg din egen kasse',
    lead: 'Testet med Shopify POS og Nexus POS. Det meste har vi på lager, og vi sætter det op for dig.',
    order: 'Bestil →',
    standIn: 'i',
    standFeatures: ['350° rotation og 90° vipning', 'Støbt aluminium, klar til Kensington-lås', 'Passer til tablets fra 7 til 13", også iPad 11"', 'Kabelføring gennem foden for en ryddelig opsætning'],
    rentEyebrow: 'Pop-up og messe',
    rentHeading: 'Har du brug for en kasse til en weekend?',
    rentText: 'Vi udlejer komplette kassepakker. Pris på forespørgsel.',
    rentButton: 'Spørg os',
    footnote: 'Alle priser ekskl. moms. Hvide varianter af stativ og skuffe leveres på forespørgsel.',
    fromShopify: ' Priser og lagerstatus hentes fra vores webshop.',
  },
  de: {
    eyebrow: 'Ausstattung',
    heading: 'Stellen Sie Ihre eigene Kasse zusammen',
    lead: 'Getestet mit Shopify POS und Nexus POS. Das meiste haben wir auf Lager, und wir richten es für Sie ein.',
    order: 'Bestellen →',
    standIn: 'in',
    standFeatures: ['350° Drehung und 90° Neigung', 'Aluminiumguss, vorbereitet für Kensington-Schloss', 'Passend für Tablets von 7 bis 13", auch iPad 11"', 'Kabelführung durch den Fuß für eine aufgeräumte Theke'],
    rentEyebrow: 'Pop-up und Messe',
    rentHeading: 'Brauchen Sie eine Kasse für ein Wochenende?',
    rentText: 'Wir vermieten komplette Kassenpakete. Preis auf Anfrage.',
    rentButton: 'Fragen Sie uns',
    footnote: 'Alle Preise zzgl. MwSt. Weiße Varianten von Ständer und Schublade auf Anfrage.',
    fromShopify: ' Preise und Lagerbestand stammen aus unserem Onlineshop.',
  },
}

function Price({ value, className = '', lang }: { value: number; className?: string; lang: NexusLang }) {
  return (
    <span className={`font-mono font-medium tracking-tight ${className}`}>
      {formatNok(value)} <span className="text-xs font-sans font-medium text-sc-ink-500">{exVat(lang)}</span>
    </span>
  )
}

function Buy({ item, contactHref, dark, lang }: { item: NexusItem; contactHref: string; dark?: boolean; lang: NexusLang }) {
  if (item.variantId && item.shopifyTitle) return <PackageAddToCart variantId={item.variantId} productTitle={item.shopifyTitle} />
  return (
    <LocalizedLink href={contactHref} className={`text-sm font-semibold ${dark ? 'text-sc-cyan-300 hover:text-white' : 'text-sc-ink-900 hover:text-sc-cyan-600'}`}>
      {T[lang].order}
    </LocalizedLink>
  )
}

/**
 * Equipment grid: a featured pair on top (stand + wireless scanner), then the
 * full catalogue two-up on phones and four-up on desktop, then consumables as
 * chips. Prices and cart buttons come from Shopify when the product exists in
 * the nexus-pos collection; otherwise the card links to contact.
 */
export default function Equipment({ items, contactHref, fromShopify, lang = 'no' }: { items: NexusItem[]; contactHref: string; fromShopify: boolean; lang?: NexusLang }) {
  const t = T[lang]
  const gear = items.filter((i) => i.group === 'equipment')
  const stand = gear.find((i) => i.handle === 'bouncepad-eddy')
  const scanner = gear.find((i) => i.handle === 'socket-mobile-s740')
  const rest = gear.filter((i) => i !== stand && i !== scanner)
  const consumables = items.filter((i) => i.group === 'consumable')

  return (
    <section id="utstyr" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow={t.eyebrow} heading={t.heading} lead={t.lead} />

        {stand && scanner && (
          <div className="mb-5 grid gap-5 lg:grid-cols-[2fr_1fr]">
            <article className="grid gap-6 rounded-lg border border-sc-ink-100 bg-white p-6 sm:grid-cols-2 sm:items-center lg:p-8">
              <div className="grid grid-cols-2 gap-3">
                {(stand.variants ?? []).map((v) => {
                  const label = swatchLabel(v, lang)
                  return (
                  <figure key={v.label} className="m-0 flex flex-col gap-2">
                    <Image src={v.image ?? stand.image!} alt={`${stand.name} ${t.standIn} ${label.toLowerCase()}`} width={300} height={300} className="h-auto w-full rounded-lg object-cover" />
                    <figcaption className="flex items-center gap-2 text-[13px] font-semibold text-sc-ink-600">
                      <span className="inline-block h-3.5 w-3.5 rounded-full border border-sc-ink-300" style={{ background: v.swatch }} aria-hidden="true" />
                      {label}
                    </figcaption>
                  </figure>
                  )
                })}
              </div>
              <div className="flex flex-col gap-3">
                {stand.badge && <span className={ui.tag}>{stand.badge}</span>}
                <div className={ui.eyebrow}>{stand.type}</div>
                <h3 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900">{stand.name}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{stand.description}</p>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-sc-ink-600">
                  {t.standFeatures.map((l) => (
                    <li key={l} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-sc-cyan-500" />{l}</li>
                  ))}
                </ul>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
                  <Price value={stand.price} className="text-[26px] text-sc-ink-900" lang={lang} />
                  <Buy item={stand} contactHref={contactHref} lang={lang} />
                </div>
              </div>
            </article>
            <article className="flex flex-col gap-3 rounded-lg bg-sc-ink-900 p-6 text-white lg:p-7">
              <div className="flex h-[180px] items-center justify-center rounded-lg bg-white">
                <Image src={scanner.image!} alt={scanner.name} width={220} height={160} className="max-h-[160px] w-auto object-contain" />
              </div>
              {scanner.badge && <span className="inline-flex w-fit items-center rounded-md bg-sc-cyan-500/15 px-2.5 py-1 text-xs font-medium text-sc-cyan-200">{scanner.badge}</span>}
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{scanner.type}</div>
              <h3 className="m-0 text-[22px] font-bold leading-tight">{scanner.name}</h3>
              <p className="m-0 flex-1 text-[14px] leading-relaxed text-sc-ink-200">{scanner.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[24px] font-medium tracking-tight">{formatNok(scanner.price)} <span className="font-sans text-xs text-sc-ink-300">{exVat(lang)}</span></span>
                <Buy item={scanner} contactHref={contactHref} dark lang={lang} />
              </div>
            </article>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {rest.map((item) => (
            <article key={item.handle} className="flex flex-col gap-2 rounded-lg border border-sc-ink-100 bg-white p-4 transition-transform hover:-translate-y-1 lg:p-5">
              <div className="flex h-[110px] items-center justify-center lg:h-[150px]">
                {item.image && <Image src={item.image} alt={item.name} width={200} height={150} className="max-h-[110px] w-auto max-w-full object-contain lg:max-h-[150px]" />}
              </div>
              <div className={ui.eyebrow}>{item.type}</div>
              <h3 className="m-0 text-[16px] font-bold leading-snug text-sc-ink-900 lg:text-[17px]">{item.name}</h3>
              <p className="m-0 flex-1 text-[13px] leading-relaxed text-sc-ink-600 lg:text-[14px]">{item.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Price value={item.price} className="text-[18px] text-sc-ink-900" lang={lang} />
                <Buy item={item} contactHref={contactHref} lang={lang} />
              </div>
            </article>
          ))}
          <article className="col-span-2 flex flex-col justify-center gap-3 rounded-lg bg-sc-ink-900 p-5 text-white lg:col-span-1">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{t.rentEyebrow}</div>
            <h3 className="m-0 text-[20px] font-bold leading-tight">{t.rentHeading}</h3>
            <p className="m-0 text-[14px] leading-relaxed text-sc-ink-200">{t.rentText}</p>
            <LocalizedLink href={contactHref} className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
              {t.rentButton}
            </LocalizedLink>
          </article>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {consumables.map((c) => (
            <div key={c.handle} className="flex items-center justify-between gap-4 rounded-lg border border-sc-ink-100 bg-white px-4 py-3.5 text-[14px] text-sc-ink-700">
              <span>{c.name}</span>
              <Price value={c.price} className="whitespace-nowrap text-sc-ink-900" lang={lang} />
            </div>
          ))}
        </div>
        <p className="mb-0 mt-7 text-[13px] text-sc-ink-500">
          {t.footnote}
          {fromShopify ? t.fromShopify : ''}
        </p>
      </div>
    </section>
  )
}
