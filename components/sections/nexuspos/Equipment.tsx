import Image from 'next/image'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'
import { formatNok, type NexusItem } from '@/lib/nexuspos'
import PackageAddToCart from '@/components/sections/services/all_packages/PackageAddToCart'
import { SectionHead } from './NexusSections'

function Price({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`font-mono font-medium tracking-tight ${className}`}>
      {formatNok(value)} <span className="text-xs font-sans font-medium text-sc-ink-500">eks. mva</span>
    </span>
  )
}

function Buy({ item, contactHref, dark }: { item: NexusItem; contactHref: string; dark?: boolean }) {
  if (item.variantId && item.shopifyTitle) return <PackageAddToCart variantId={item.variantId} productTitle={item.shopifyTitle} />
  return (
    <LocalizedLink href={contactHref} className={`text-sm font-semibold ${dark ? 'text-sc-cyan-300 hover:text-white' : 'text-sc-ink-900 hover:text-sc-cyan-600'}`}>
      Bestill →
    </LocalizedLink>
  )
}

/**
 * Equipment grid: a featured pair on top (stand + wireless scanner), then the
 * full catalogue two-up on phones and four-up on desktop, then consumables as
 * chips. Prices and cart buttons come from Shopify when the product exists in
 * the nexus-pos collection; otherwise the card links to contact.
 */
export default function Equipment({ items, contactHref, fromShopify }: { items: NexusItem[]; contactHref: string; fromShopify: boolean }) {
  const gear = items.filter((i) => i.group === 'equipment')
  const stand = gear.find((i) => i.handle === 'bouncepad-eddy')
  const scanner = gear.find((i) => i.handle === 'socket-mobile-s740')
  const rest = gear.filter((i) => i !== stand && i !== scanner)
  const consumables = items.filter((i) => i.group === 'consumable')

  return (
    <section id="utstyr" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <SectionHead eyebrow="Utstyr" heading="Bygg din egen kasse" lead="Testet med Shopify POS og Nexus POS. Det meste har vi på lager, og vi setter det opp for deg." />

        {stand && scanner && (
          <div className="mb-5 grid gap-5 lg:grid-cols-[2fr_1fr]">
            <article className="grid gap-6 rounded-lg border border-sc-ink-100 bg-white p-6 sm:grid-cols-2 sm:items-center lg:p-8">
              <div className="grid grid-cols-2 gap-3">
                {(stand.variants ?? []).map((v) => (
                  <figure key={v.label} className="m-0 flex flex-col gap-2">
                    <Image src={v.image ?? stand.image!} alt={`${stand.name} i ${v.label.toLowerCase()}`} width={300} height={300} className="h-auto w-full rounded-lg object-cover" />
                    <figcaption className="flex items-center gap-2 text-[13px] font-semibold text-sc-ink-600">
                      <span className="inline-block h-3.5 w-3.5 rounded-full border border-sc-ink-300" style={{ background: v.swatch }} aria-hidden="true" />
                      {v.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {stand.badge && <span className={ui.tag}>{stand.badge}</span>}
                <div className={ui.eyebrow}>{stand.type}</div>
                <h3 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900">{stand.name}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{stand.description}</p>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-sc-ink-600">
                  {['350° rotasjon og 90° vinkling', 'Støpt aluminium, klar for Kensington-lås', 'Passer nettbrett fra 7 til 13", også iPad 11"', 'Kabelføring gjennom foten for et ryddig oppsett'].map((l) => (
                    <li key={l} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-sc-cyan-500" />{l}</li>
                  ))}
                </ul>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
                  <Price value={stand.price} className="text-[26px] text-sc-ink-900" />
                  <Buy item={stand} contactHref={contactHref} />
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
                <span className="font-mono text-[24px] font-medium tracking-tight">{formatNok(scanner.price)} <span className="font-sans text-xs text-sc-ink-300">eks. mva</span></span>
                <Buy item={scanner} contactHref={contactHref} dark />
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
                <Price value={item.price} className="text-[18px] text-sc-ink-900" />
                <Buy item={item} contactHref={contactHref} />
              </div>
            </article>
          ))}
          <article className="col-span-2 flex flex-col justify-center gap-3 rounded-lg bg-sc-ink-900 p-5 text-white lg:col-span-1">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">Pop-up og messe</div>
            <h3 className="m-0 text-[20px] font-bold leading-tight">Trenger du kasse for en helg?</h3>
            <p className="m-0 text-[14px] leading-relaxed text-sc-ink-200">Vi leier ut komplette kassepakker. Pris på forespørsel.</p>
            <LocalizedLink href={contactHref} className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
              Spør oss
            </LocalizedLink>
          </article>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {consumables.map((c) => (
            <div key={c.handle} className="flex items-center justify-between gap-4 rounded-lg border border-sc-ink-100 bg-white px-4 py-3.5 text-[14px] text-sc-ink-700">
              <span>{c.name}</span>
              <Price value={c.price} className="whitespace-nowrap text-sc-ink-900" />
            </div>
          ))}
        </div>
        <p className="mb-0 mt-7 text-[13px] text-sc-ink-500">
          Alle priser eks. mva. Hvite varianter av stativ og skuff leveres på forespørsel.
          {fromShopify ? ' Priser og lagerstatus hentes fra nettbutikken vår.' : ''}
        </p>
      </div>
    </section>
  )
}
