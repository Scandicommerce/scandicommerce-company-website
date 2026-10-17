import type { ShopifyProduct } from '@/lib/shopify'

/**
 * Nexus POS catalog: everything the landing page sells, with prices eks. mva.
 *
 * The page merges this list with the "nexus-pos" collection in the Shopify
 * store (scandicommerce.myshopify.com): a product whose handle matches an
 * item here, or whose title matches its name, supplies the live price, image
 * and variant so the item can be added to the cart. Items with no product in
 * Shopify yet render from this file alone, without a cart button.
 */

export const NEXUS_COLLECTION_HANDLE = 'nexuspos'

export type NexusGroup = 'pricing' | 'kit' | 'equipment' | 'consumable'

export interface NexusItem {
  /** Shopify product handle this item maps to. */
  handle: string
  group: NexusGroup
  /** Short category shown above the name (Betalingsterminal, Stativ …). */
  type: string
  name: string
  description: string
  /** NOK eks. mva. Per unit; `unit` says per what. */
  price: number
  unit?: string
  image?: string
  /** Handle of the matching product in Shopify when it differs from `handle`. */
  shopifyHandle?: string
  /** Variant title to buy when the Shopify product has several (e.g. 'Med iPad'). */
  shopifyVariant?: string
  imageAlt?: string
  /** Second colourway, shown as swatches. */
  variants?: { label: string; swatch: string; image?: string }[]
  badge?: string
  /** Resolved from Shopify at request time. */
  variantId?: string
  shopifyTitle?: string
  shopifyImage?: string
}

export const nexusItems: NexusItem[] = [
  // Pricing
  { handle: 'nexus-pos-oppstart', shopifyHandle: 'nexuspos-onboarding', group: 'pricing', type: 'Engangs', name: 'Oppstart', description: 'Gjennomgang av dagens kasse og migrering, oppsett av Nexus POS, Shopify POS og terminal, og opplæring av deg og de ansatte.', price: 15000, unit: 'én gang' },
  { handle: 'nexus-pos-lisens', shopifyHandle: 'nexuspos-abonnement', shopifyVariant: 'Starter', group: 'pricing', type: 'Mest valgt', name: 'Nexus POS lisens', description: 'Kvittering, journal, X/Z-rapporter og SAF-T. Inntil 2 timer support i måneden, svar neste virkedag. Løpende oppdateringer og videreutvikling.', price: 2500, unit: 'per kassepunkt / mnd', badge: 'Mest valgt' },
  { handle: 'nexus-pos-standard-sla', group: 'pricing', type: 'Tillegg', name: 'POS Standard SLA', description: 'For butikker som vil ha mer enn grunnsupporten. Dekker inntil tre terminaler per kunde. Har du forvaltningsavtale på nettbutikken hos oss, får du rabatt.', price: 4500, unit: 'per mnd' },
  // Kits
  { handle: 'nexus-pos-pakke-a-full-kassedisk', shopifyHandle: 'komplett-butikk-kit', shopifyVariant: 'Med iPad', group: 'kit', type: 'Pakke A', name: 'Full kassedisk', description: 'Klassisk oppsett med egen kvitteringsskriver og kasseskuff.', price: 25190, unit: 'per kassepunkt, inkl. N950' },
  { handle: 'nexus-pos-pakke-b-kompakt-kasse', shopifyHandle: 'kompakt-kassepunkt', group: 'kit', type: 'Pakke B', name: 'Kompakt kasse', description: 'Skriver, skuff og nettbrettholder i én enhet. Perfekt der disken er trang.', price: 23990, unit: 'per kassepunkt, inkl. N950', badge: '1 200 kr billigere enn full kassedisk' },
  // Equipment
  { handle: 'nets-n950', shopifyHandle: 'nets-smartpos-n950', group: 'equipment', type: 'Betalingsterminal', name: 'Nets N950', description: 'Mobil terminal med innebygd skriver. Kort, kontaktløst og Vipps.', price: 8750, image: '/images/nexuspos/nets-n950.jpg' },
  { handle: 'apple-ipad-11-a16', shopifyHandle: 'ipad-for-kassepunkt', group: 'equipment', type: 'Nettbrett', name: 'Apple iPad 11" (A16)', description: 'Wi-Fi, 128 GB, sølv.', price: 5490, image: '/images/nexuspos/ipad-11.jpg' },
  { handle: 'bouncepad-eddy', group: 'equipment', type: 'iPad-stativ', name: 'Bouncepad Eddy', description: 'Stativet som får disken til å se ferdig ut. Snu iPaden mot kunden med én hånd, og lås den fast når butikken stenger.', price: 1990, image: '/images/nexuspos/bouncepad-eddy-sort.jpg', badge: 'Kundefavoritt', variants: [{ label: 'Sort', swatch: '#12181a', image: '/images/nexuspos/bouncepad-eddy-sort.jpg' }, { label: 'Hvit', swatch: '#ffffff', image: '/images/nexuspos/bouncepad-eddy-hvit.jpg' }] },
  { handle: 'socket-mobile-s740', group: 'equipment', type: 'Trådløs strekkodeleser', name: 'Socket Mobile S740', description: 'Bluetooth-skanner for 1D- og 2D-koder. Gå ut på gulvet, skann og selg. Rundt 20 timer batteri.', price: 4500, image: '/images/nexuspos/socket-s740.jpg', badge: 'Populær' },
  { handle: 'ipad-stativ-dreiefot', shopifyHandle: 'ipad-stativ-for-kassa', group: 'equipment', type: 'Stativ', name: 'iPad-stativ med dreiefot', description: 'Snu skjermen mot kunden.', price: 1990, image: '/images/nexuspos/ipad-stativ.jpg' },
  { handle: 'zebra-ds9308', shopifyHandle: 'strekkodeskanner', group: 'equipment', type: 'Strekkodeleser', name: 'Zebra DS9308 2D', description: 'Bordskanner, USB. Også i hvit.', price: 3690, image: '/images/nexuspos/zebra-ds9308.jpg' },
  { handle: 'star-tsp143iv', group: 'equipment', type: 'Kvitteringsskriver', name: 'Star TSP143IV', description: '80 mm, Ethernet. Også i hvit.', price: 3690, image: '/images/nexuspos/star-tsp143iv.jpg' },
  { handle: 'kasseskuff-hs330', shopifyHandle: 'kassaskuff', group: 'equipment', type: 'Kasseskuff', name: 'Kasseskuff HS330', description: 'Åpnes av skriveren. Hvit på forespørsel.', price: 990, image: '/images/nexuspos/kasseskuff-hs330.jpg' },
  { handle: 'star-mpop', group: 'equipment', type: 'Skriver + skuff', name: 'Star mPOP', description: '58 mm skriver og skuff i ett.', price: 5490, image: '/images/nexuspos/star-mpop.jpg' },
  { handle: 'samsung-galaxy-tab-a11', shopifyHandle: 'kundedisplay', group: 'equipment', type: 'Kundedisplay', name: 'Samsung Galaxy Tab A11', description: 'Viser handlekurv og total til kunden.', price: 2490, image: '/images/nexuspos/galaxy-tab-a11.jpg' },
  { handle: 'zebra-zd420d', shopifyHandle: 'etikettskriver', group: 'equipment', type: 'Etikettskriver', name: 'Zebra ZD420d', description: 'Pris- og hylleetiketter.', price: 5990, image: '/images/nexuspos/zebra-zd420d.jpg' },
  { handle: 'veggstativ-nettbrett', shopifyHandle: 'veggstativ-ipad', group: 'equipment', type: 'Stativ', name: 'Veggstativ for nettbrett', description: 'For 7–13" nettbrett.', price: 1190, image: '/images/nexuspos/veggstativ.jpg' },
  { handle: 'star-munite-gulvstativ', shopifyHandle: 'gulvstativ', group: 'equipment', type: 'Stativ', name: 'Star mUnite gulvstativ', description: 'Selvbetjening og pop-up. Svart eller hvit.', price: 3190, image: '/images/nexuspos/star-munite.jpg' },
  // Consumables
  { handle: 'kabelsett-pos', shopifyHandle: 'kabler-og-strom-kassepunkt', group: 'consumable', type: 'Tilbehør', name: 'Kabelsett – 2 × USB-C-lader + nettverkskabel', description: '', price: 590 },
  { handle: 'kvitteringspapir-80mm', shopifyHandle: 'kvitteringspapir', shopifyVariant: '80 mm', group: 'consumable', type: 'Forbruk', name: 'Kvitteringspapir 80 mm, 20 ruller', description: '', price: 440, unit: 'per pakke' },
  { handle: 'kvitteringspapir-58mm', shopifyHandle: 'kvitteringspapir', shopifyVariant: '58 mm', group: 'consumable', type: 'Forbruk', name: 'Kvitteringspapir 58 mm, 20 ruller', description: '', price: 280, unit: 'per pakke' },
]

export const nexusKitContents: Record<'nexus-pos-pakke-a-full-kassedisk' | 'nexus-pos-pakke-b-kompakt-kasse', { lines: string[]; images: string[]; alts: string[] }> = {
  'nexus-pos-pakke-a-full-kassedisk': {
    lines: ['Nets N950 · iPad 11" · iPad-stativ med dreiefot', '2D-strekkodeleser · 80 mm kvitteringsskriver · kasseskuff', 'Kabelsett med lader og nettverkskabel'],
    images: ['/images/nexuspos/nets-n950.jpg', '/images/nexuspos/ipad-11.jpg', '/images/nexuspos/ipad-stativ.jpg', '/images/nexuspos/zebra-ds9308.jpg', '/images/nexuspos/star-tsp143iv.jpg', '/images/nexuspos/kasseskuff-hs330.jpg'],
    alts: ['Nets N950', 'iPad 11 tommer', 'iPad-stativ', 'Strekkodeleser', 'Kvitteringsskriver', 'Kasseskuff'],
  },
  'nexus-pos-pakke-b-kompakt-kasse': {
    lines: ['Nets N950 · iPad 11" · 2D-strekkodeleser', 'Star mPOP: 58 mm skriver, skuff og nettbrettholder i ett', 'Kabelsett med lader og nettverkskabel'],
    images: ['/images/nexuspos/nets-n950.jpg', '/images/nexuspos/ipad-11.jpg', '/images/nexuspos/zebra-ds9308.jpg', '/images/nexuspos/star-mpop.jpg'],
    alts: ['Nets N950', 'iPad 11 tommer', 'Strekkodeleser', 'Kombinert skriver og kasseskuff'],
  },
}

export const nexusSteps = [
  { n: '01', title: 'Kasse', text: 'Du slår inn salget i Shopify POS på iPaden, akkurat som i dag.' },
  { n: '02', title: 'Bro', text: 'Nexus POS sender beløpet til Nets-terminalen i sanntid.' },
  { n: '03', title: 'Betaling', text: 'Terminalen tar kort, kontaktløst og Vipps, med PIN og bekreftelse.' },
  { n: '04', title: 'Regelverk', text: 'Hver transaksjon logges til journal, X/Z-rapporter og SAF-T. Automatisk.' },
]

export const nexusRequirements = {
  needed: [
    'Internett i butikken – wifi eller mobildata holder',
    'Minst ett ledig strømuttak ved kassen – helst to, så alt kan lades',
    'iPad med iPadOS 15.1 eller nyere',
    'PC eller Mac til administrasjon i Shopify',
    'Innløsningsavtale med Nets – vi hjelper deg å sette den opp',
  ],
  billedByOthers: [
    'Shopify POS Pro-lisens per lokasjon – fra Shopify',
    'Transaksjonsgebyrer – fra Nets',
    'Regnskapsintegrasjon utover CSV- og API-eksport',
    'Reise ved installasjon utenfor Oslo og Tønsberg, etter medgått',
  ],
}

export const nexusFaq = [
  { question: 'Må jeg slutte med Shopify POS?', answer: 'Nei. Du fortsetter i Shopify POS som før. Nexus POS ligger mellom kassen og Nets-terminalen og tar seg av betaling og norske krav. Produkter, lager, kunder og ordre blir i Shopify.' },
  { question: 'Oppfyller Nexus POS kassasystemlova?', answer: 'Vi har levert produkterklæring for Nexus POS til Skatteetaten. Nexus POS gir deg norsk salgskvittering med mva-spesifikasjon, elektronisk journal lagret i Norge, automatiske X- og Z-rapporter og SAF-T-eksport. Ansvaret for kasseoppsettet i butikken ligger hos virksomheten, så avklar gjerne med regnskapsføreren din.' },
  { question: 'Trenger jeg avtale med Nets?', answer: 'Ja, for å ta imot kort trenger du en innløsningsavtale med Nets. Vi setter den opp sammen med deg. Transaksjonsgebyrene faktureres direkte fra Nets.' },
  { question: 'Kan jeg bruke terminalen og iPaden jeg har?', answer: 'Ofte, ja. En Nets N950 du allerede har kan som regel brukes videre, og det samme gjelder iPad med iPadOS 15.1 eller nyere. Vi sjekker utstyret ditt i oppstarten, så du bare kjøper det som mangler.' },
  { question: 'Hva er inkludert i oppstarten på 15 000 kr?', answer: 'Gjennomgang av dagens kasse og migrering, oppsett av Nexus POS, Shopify POS og terminal, og opplæring av deg og de ansatte. Oppstarten betales én gang per butikk.' },
  { question: 'Er det bindingstid?', answer: 'Nei. Lisensen løper måned for måned med 30 dagers oppsigelse. Prisene justeres årlig etter KPI.' },
  { question: 'Hva med Shopify POS Pro?', answer: 'Du trenger Shopify POS Pro for hver fysiske lokasjon. Lisensen kjøpes og faktureres av Shopify, og kommer i tillegg til Nexus POS.' },
  { question: 'Kan jeg ta Vipps i kassen?', answer: 'Ja. Nets-terminalen tar kort, kontaktløs betaling og Vipps.' },
  { question: 'Hvor lang tid tar det før vi er i gang?', answer: 'Det meste av utstyret har vi på lager. Noen varer, som kundedisplay og gulvstativ, har rundt tre dagers leveringstid. Vi avtaler installasjonsdato når utstyret er bestilt.' },
  { question: 'Vi har flere butikker. Hva gjelder for oss?', answer: 'Kjeder og butikker med mange kassepunkter får eget tilbud. Ta kontakt, så setter vi opp et regnestykke for hele kjeden.' },
]

export const formatNok = (n: number) => `${new Intl.NumberFormat('nb-NO').format(n).replace(/ /g, ' ')} kr`

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

/**
 * Overlay live Shopify data on the catalog. Match on the Shopify handle (or
 * the catalog handle), then on a normalised title. The bought variant is the
 * one named in `shopifyVariant`, else the first that is for sale. Shopify wins
 * on price; the catalog keeps its own photo when it has one.
 */
export function mergeNexusItems(items: NexusItem[], products: ShopifyProduct[]): NexusItem[] {
  if (products.length === 0) return items
  const byHandle = new Map(products.map((p) => [p.handle, p]))
  const byTitle = new Map(products.map((p) => [norm(p.title), p]))
  return items.map((item) => {
    const hit = byHandle.get(item.shopifyHandle ?? item.handle) ?? byTitle.get(norm(item.name))
    if (!hit) return item
    const variants = hit.variants ?? []
    const wanted = item.shopifyVariant ? variants.find((v) => norm(v.title).startsWith(norm(item.shopifyVariant!))) : undefined
    const variant = wanted ?? variants.find((v) => v.availableForSale) ?? variants[0]
    const price = variant?.price ?? hit.price
    return {
      ...item,
      price: price > 0 ? Math.round(price) : item.price,
      shopifyImage: hit.image || undefined,
      image: item.image ?? (hit.image || undefined),
      variantId: variant?.id,
      shopifyTitle: hit.title,
    }
  })
}

export const nexusByGroup = (items: NexusItem[], group: NexusGroup) => items.filter((i) => i.group === group)
export const nexusItem = (items: NexusItem[], handle: string) => items.find((i) => i.handle === handle)
