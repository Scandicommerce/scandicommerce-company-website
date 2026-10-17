import type { ShopifyProduct } from '@/lib/shopify'

/**
 * Nexus POS catalog: everything the landing page sells, with prices eks. mva.
 *
 * The page merges this list with the "nexus-pos" collection in the Shopify
 * store (scandicommerce.myshopify.com): a product whose handle matches an
 * item here, or whose title matches its name, supplies the live price, image
 * and variant so the item can be added to the cart. Items with no product in
 * Shopify yet render from this file alone, without a cart button.
 *
 * Copy is Norwegian in the main fields; each item carries `en`, `sv`, `da`
 * and `de` blocks with the translations. `localizeNexusItems` swaps them in
 * for non-Norwegian pages (run it after `mergeNexusItems`, which matches on
 * the Norwegian name). Prices, handles, images and brand names are shared.
 */

export const NEXUS_COLLECTION_HANDLE = 'nexuspos'

export type NexusGroup = 'pricing' | 'kit' | 'equipment' | 'consumable'

/** The copy languages the page is written in. Unknown locales fall back to English. */
export type NexusLang = 'no' | 'en' | 'sv' | 'da' | 'de'
export const NEXUS_LANGS: NexusLang[] = ['no', 'en', 'sv', 'da', 'de']
export const nexusLang = (language: string): NexusLang => (NEXUS_LANGS.includes(language as NexusLang) ? (language as NexusLang) : 'en')

/** Translated text fields for one item; a missing field keeps the Norwegian value (brand names, model numbers). */
export interface NexusItemCopy {
  type?: string
  name?: string
  description?: string
  unit?: string
  badge?: string
}

export interface NexusSwatch {
  /** Norwegian label; also the stable key. */
  label: string
  /** Translated labels; missing languages fall back to English, then Norwegian. */
  labels?: Partial<Record<NexusLang, string>>
  swatch: string
  image?: string
}

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
  variants?: NexusSwatch[]
  badge?: string
  /** Translations of the text fields; applied by `localizeNexusItems`. */
  en?: NexusItemCopy
  sv?: NexusItemCopy
  da?: NexusItemCopy
  de?: NexusItemCopy
  /** Resolved from Shopify at request time. */
  variantId?: string
  shopifyTitle?: string
  shopifyImage?: string
}

export const nexusItems: NexusItem[] = [
  // Pricing
  {
    handle: 'nexus-pos-oppstart', shopifyHandle: 'nexuspos-onboarding', group: 'pricing', type: 'Engangs', name: 'Oppstart', description: 'Gjennomgang av dagens kasse og migrering, oppsett av Nexus POS, Shopify POS og terminal, og opplæring av deg og de ansatte.', price: 15000, unit: 'én gang',
    en: { type: 'One-off', name: 'Onboarding', description: 'Review of your current till and migration, setup of Nexus POS, Shopify POS and the terminal, and training for you and your staff.', unit: 'one time' },
    sv: { type: 'Engångs', name: 'Uppstart', description: 'Genomgång av dagens kassa och migrering, uppsättning av Nexus POS, Shopify POS och terminal, samt utbildning av dig och personalen.', unit: 'en gång' },
    da: { type: 'Engangs', name: 'Opstart', description: 'Gennemgang af den nuværende kasse og migrering, opsætning af Nexus POS, Shopify POS og terminal samt oplæring af dig og dine medarbejdere.', unit: 'én gang' },
    de: { type: 'Einmalig', name: 'Onboarding', description: 'Prüfung Ihrer bisherigen Kasse und Migration, Einrichtung von Nexus POS, Shopify POS und Terminal sowie Schulung für Sie und Ihr Team.', unit: 'einmalig' },
  },
  {
    handle: 'nexus-pos-lisens', shopifyHandle: 'nexuspos-abonnement', shopifyVariant: 'Starter', group: 'pricing', type: 'Mest valgt', name: 'Nexus POS lisens', description: 'Kvittering, journal, X/Z-rapporter og SAF-T. Inntil 2 timer support i måneden, svar neste virkedag. Løpende oppdateringer og videreutvikling.', price: 2500, unit: 'per kassepunkt / mnd', badge: 'Mest valgt',
    en: { type: 'Most popular', name: 'Nexus POS licence', description: 'Receipts, journal, X/Z reports and SAF-T. Up to 2 hours of support a month, next-business-day response. Ongoing updates and development.', unit: 'per till / month', badge: 'Most popular' },
    sv: { type: 'Mest valt', name: 'Nexus POS-licens', description: 'Kvitto, journal, X/Z-rapporter och SAF-T. Upp till 2 timmars support per månad, svar nästa arbetsdag. Löpande uppdateringar och vidareutveckling.', unit: 'per kassaplats / mån', badge: 'Mest valt' },
    da: { type: 'Mest valgt', name: 'Nexus POS-licens', description: 'Kvittering, journal, X/Z-rapporter og SAF-T. Op til 2 timers support om måneden, svar næste hverdag. Løbende opdateringer og videreudvikling.', unit: 'per kassepunkt / md.', badge: 'Mest valgt' },
    de: { type: 'Am häufigsten gewählt', name: 'Nexus POS-Lizenz', description: 'Beleg, Journal, X/Z-Berichte und SAF-T. Bis zu 2 Stunden Support pro Monat, Antwort am nächsten Werktag. Laufende Updates und Weiterentwicklung.', unit: 'pro Kasse / Monat', badge: 'Am häufigsten gewählt' },
  },
  {
    handle: 'nexus-pos-standard-sla', group: 'pricing', type: 'Tillegg', name: 'POS Standard SLA', description: 'For butikker som vil ha mer enn grunnsupporten. Dekker inntil tre terminaler per kunde. Har du forvaltningsavtale på nettbutikken hos oss, får du rabatt.', price: 4500, unit: 'per mnd',
    en: { type: 'Add-on', description: 'For stores that want more than the basic support. Covers up to three terminals per customer. Discounted if we already manage your online store.', unit: 'per month' },
    sv: { type: 'Tillägg', description: 'För butiker som vill ha mer än grundsupporten. Täcker upp till tre terminaler per kund. Har du ett förvaltningsavtal för webbutiken hos oss får du rabatt.', unit: 'per mån' },
    da: { type: 'Tillæg', description: 'Til butikker, der vil have mere end basissupporten. Dækker op til tre terminaler per kunde. Har du en driftsaftale på webshoppen hos os, får du rabat.', unit: 'per md.' },
    de: { type: 'Zusatz', description: 'Für Geschäfte, die mehr als den Basis-Support wünschen. Deckt bis zu drei Terminals pro Kunde ab. Betreuen wir bereits Ihren Onlineshop, erhalten Sie einen Rabatt.', unit: 'pro Monat' },
  },
  // Kits
  {
    handle: 'nexus-pos-pakke-a-full-kassedisk', shopifyHandle: 'komplett-butikk-kit', shopifyVariant: 'Med iPad', group: 'kit', type: 'Pakke A', name: 'Full kassedisk', description: 'Klassisk oppsett med egen kvitteringsskriver og kasseskuff.', price: 25190, unit: 'per kassepunkt, inkl. N950',
    en: { type: 'Kit A', name: 'Full counter', description: 'The classic setup with a separate receipt printer and cash drawer.', unit: 'per till, incl. N950' },
    sv: { type: 'Paket A', name: 'Komplett kassadisk', description: 'Klassisk uppsättning med egen kvittoskrivare och kassalåda.', unit: 'per kassaplats, inkl. N950' },
    da: { type: 'Pakke A', name: 'Fuld kassedisk', description: 'Klassisk opsætning med separat bonprinter og pengeskuffe.', unit: 'per kassepunkt, inkl. N950' },
    de: { type: 'Paket A', name: 'Komplette Kassentheke', description: 'Klassische Einrichtung mit separatem Bondrucker und Kassenschublade.', unit: 'pro Kasse, inkl. N950' },
  },
  {
    handle: 'nexus-pos-pakke-b-kompakt-kasse', shopifyHandle: 'kompakt-kassepunkt', group: 'kit', type: 'Pakke B', name: 'Kompakt kasse', description: 'Skriver, skuff og nettbrettholder i én enhet. Perfekt der disken er trang.', price: 23990, unit: 'per kassepunkt, inkl. N950', badge: '1 200 kr billigere enn full kassedisk',
    en: { type: 'Kit B', name: 'Compact till', description: 'Printer, drawer and tablet holder in one unit. Perfect where counter space is tight.', unit: 'per till, incl. N950', badge: '1 200 kr less than the full counter' },
    sv: { type: 'Paket B', name: 'Kompakt kassa', description: 'Skrivare, låda och surfplattehållare i en enhet. Perfekt där disken är trång.', unit: 'per kassaplats, inkl. N950', badge: '1 200 kr billigare än komplett kassadisk' },
    da: { type: 'Pakke B', name: 'Kompakt kasse', description: 'Printer, skuffe og tabletholder i én enhed. Perfekt hvor disken er trang.', unit: 'per kassepunkt, inkl. N950', badge: '1 200 kr billigere end fuld kassedisk' },
    de: { type: 'Paket B', name: 'Kompakte Kasse', description: 'Drucker, Schublade und Tablet-Halter in einem Gerät. Ideal, wo der Platz an der Theke knapp ist.', unit: 'pro Kasse, inkl. N950', badge: '1 200 kr günstiger als die komplette Kassentheke' },
  },
  // Equipment
  {
    handle: 'nets-n950', shopifyHandle: 'nets-smartpos-n950', group: 'equipment', type: 'Betalingsterminal', name: 'Nets N950', description: 'Mobil terminal med innebygd skriver. Kort, kontaktløst og Vipps.', price: 8750, image: '/images/nexuspos/nets-n950.jpg',
    en: { type: 'Payment terminal', description: 'Mobile terminal with a built-in printer. Cards, contactless and Vipps.' },
    sv: { type: 'Betalterminal', description: 'Mobil terminal med inbyggd skrivare. Kort, kontaktlöst och Vipps.' },
    da: { type: 'Betalingsterminal', description: 'Mobil terminal med indbygget printer. Kort, kontaktløs og Vipps.' },
    de: { type: 'Zahlungsterminal', description: 'Mobiles Terminal mit integriertem Drucker. Karte, kontaktlos und Vipps.' },
  },
  {
    handle: 'apple-ipad-11-a16', shopifyHandle: 'ipad-for-kassepunkt', group: 'equipment', type: 'Nettbrett', name: 'Apple iPad 11" (A16)', description: 'Wi-Fi, 128 GB, sølv.', price: 5490, image: '/images/nexuspos/ipad-11.jpg',
    en: { type: 'Tablet', description: 'Wi-Fi, 128 GB, silver.' },
    sv: { type: 'Surfplatta', description: 'Wi-Fi, 128 GB, silver.' },
    da: { type: 'Tablet', description: 'Wi-Fi, 128 GB, sølv.' },
    de: { type: 'Tablet', description: 'Wi-Fi, 128 GB, Silber.' },
  },
  {
    handle: 'bouncepad-eddy', group: 'equipment', type: 'iPad-stativ', name: 'Bouncepad Eddy', description: 'Stativet som får disken til å se ferdig ut. Snu iPaden mot kunden med én hånd, og lås den fast når butikken stenger.', price: 1990, image: '/images/nexuspos/bouncepad-eddy-sort.jpg', badge: 'Kundefavoritt',
    variants: [
      { label: 'Sort', labels: { en: 'Black', sv: 'Svart', da: 'Sort', de: 'Schwarz' }, swatch: '#12181a', image: '/images/nexuspos/bouncepad-eddy-sort.jpg' },
      { label: 'Hvit', labels: { en: 'White', sv: 'Vit', da: 'Hvid', de: 'Weiß' }, swatch: '#ffffff', image: '/images/nexuspos/bouncepad-eddy-hvit.jpg' },
    ],
    en: { type: 'iPad stand', description: 'The stand that makes the counter look finished. Turn the iPad towards the customer with one hand, and lock it down when the store closes.', badge: 'Customer favourite' },
    sv: { type: 'iPad-stativ', description: 'Stativet som får disken att se färdig ut. Vänd iPaden mot kunden med en hand, och lås fast den när butiken stänger.', badge: 'Kundfavorit' },
    da: { type: 'iPad-stativ', description: 'Stativet, der får disken til at se færdig ud. Vend iPaden mod kunden med én hånd, og lås den fast, når butikken lukker.', badge: 'Kundefavorit' },
    de: { type: 'iPad-Ständer', description: 'Der Ständer, mit dem die Theke fertig aussieht. Drehen Sie das iPad mit einer Hand zum Kunden und sperren Sie es ab, wenn das Geschäft schließt.', badge: 'Kundenliebling' },
  },
  {
    handle: 'socket-mobile-s740', group: 'equipment', type: 'Trådløs strekkodeleser', name: 'Socket Mobile S740', description: 'Bluetooth-skanner for 1D- og 2D-koder. Gå ut på gulvet, skann og selg. Rundt 20 timer batteri.', price: 4500, image: '/images/nexuspos/socket-s740.jpg', badge: 'Populær',
    en: { type: 'Wireless barcode scanner', description: 'Bluetooth scanner for 1D and 2D codes. Walk the floor, scan and sell. Around 20 hours of battery.', badge: 'Popular' },
    sv: { type: 'Trådlös streckkodsläsare', description: 'Bluetooth-skanner för 1D- och 2D-koder. Gå ut på golvet, skanna och sälj. Cirka 20 timmars batteritid.', badge: 'Populär' },
    da: { type: 'Trådløs stregkodescanner', description: 'Bluetooth-scanner til 1D- og 2D-koder. Gå ud på gulvet, scan og sælg. Cirka 20 timers batteri.', badge: 'Populær' },
    de: { type: 'Kabelloser Barcodescanner', description: 'Bluetooth-Scanner für 1D- und 2D-Codes. Auf die Fläche gehen, scannen und verkaufen. Rund 20 Stunden Akkulaufzeit.', badge: 'Beliebt' },
  },
  {
    handle: 'ipad-stativ-dreiefot', shopifyHandle: 'ipad-stativ-for-kassa', group: 'equipment', type: 'Stativ', name: 'iPad-stativ med dreiefot', description: 'Snu skjermen mot kunden.', price: 1990, image: '/images/nexuspos/ipad-stativ.jpg',
    en: { type: 'Stand', name: 'iPad stand with swivel base', description: 'Turn the screen towards the customer.' },
    sv: { type: 'Stativ', name: 'iPad-stativ med vridbar fot', description: 'Vänd skärmen mot kunden.' },
    da: { type: 'Stativ', name: 'iPad-stativ med drejefod', description: 'Vend skærmen mod kunden.' },
    de: { type: 'Ständer', name: 'iPad-Ständer mit Drehfuß', description: 'Drehen Sie den Bildschirm zum Kunden.' },
  },
  {
    handle: 'zebra-ds9308', shopifyHandle: 'strekkodeskanner', group: 'equipment', type: 'Strekkodeleser', name: 'Zebra DS9308 2D', description: 'Bordskanner, USB. Også i hvit.', price: 3690, image: '/images/nexuspos/zebra-ds9308.jpg',
    en: { type: 'Barcode scanner', description: 'Desktop scanner, USB. Also in white.' },
    sv: { type: 'Streckkodsläsare', description: 'Bordsskanner, USB. Finns även i vitt.' },
    da: { type: 'Stregkodescanner', description: 'Bordscanner, USB. Fås også i hvid.' },
    de: { type: 'Barcodescanner', description: 'Tischscanner, USB. Auch in Weiß.' },
  },
  {
    handle: 'star-tsp143iv', group: 'equipment', type: 'Kvitteringsskriver', name: 'Star TSP143IV', description: '80 mm, Ethernet. Også i hvit.', price: 3690, image: '/images/nexuspos/star-tsp143iv.jpg',
    en: { type: 'Receipt printer', description: '80 mm, Ethernet. Also in white.' },
    sv: { type: 'Kvittoskrivare', description: '80 mm, Ethernet. Finns även i vitt.' },
    da: { type: 'Bonprinter', description: '80 mm, Ethernet. Fås også i hvid.' },
    de: { type: 'Bondrucker', description: '80 mm, Ethernet. Auch in Weiß.' },
  },
  {
    handle: 'kasseskuff-hs330', shopifyHandle: 'kassaskuff', group: 'equipment', type: 'Kasseskuff', name: 'Kasseskuff HS330', description: 'Åpnes av skriveren. Hvit på forespørsel.', price: 990, image: '/images/nexuspos/kasseskuff-hs330.jpg',
    en: { type: 'Cash drawer', name: 'Cash drawer HS330', description: 'Opened by the printer. White on request.' },
    sv: { type: 'Kassalåda', name: 'Kassalåda HS330', description: 'Öppnas av skrivaren. Vit på begäran.' },
    da: { type: 'Pengeskuffe', name: 'Pengeskuffe HS330', description: 'Åbnes af printeren. Hvid på forespørgsel.' },
    de: { type: 'Kassenschublade', name: 'Kassenschublade HS330', description: 'Wird vom Drucker geöffnet. Weiß auf Anfrage.' },
  },
  {
    handle: 'star-mpop', group: 'equipment', type: 'Skriver + skuff', name: 'Star mPOP', description: '58 mm skriver og skuff i ett.', price: 5490, image: '/images/nexuspos/star-mpop.jpg',
    en: { type: 'Printer + drawer', description: '58 mm printer and drawer in one.' },
    sv: { type: 'Skrivare + låda', description: '58 mm skrivare och låda i ett.' },
    da: { type: 'Printer + skuffe', description: '58 mm printer og skuffe i ét.' },
    de: { type: 'Drucker + Schublade', description: '58-mm-Drucker und Schublade in einem.' },
  },
  {
    handle: 'samsung-galaxy-tab-a11', shopifyHandle: 'kundedisplay', group: 'equipment', type: 'Kundedisplay', name: 'Samsung Galaxy Tab A11', description: 'Viser handlekurv og total til kunden.', price: 2490, image: '/images/nexuspos/galaxy-tab-a11.jpg',
    en: { type: 'Customer display', description: 'Shows the basket and total to the customer.' },
    sv: { type: 'Kunddisplay', description: 'Visar varukorg och totalsumma för kunden.' },
    da: { type: 'Kundedisplay', description: 'Viser kurv og total til kunden.' },
    de: { type: 'Kundendisplay', description: 'Zeigt dem Kunden Warenkorb und Gesamtsumme.' },
  },
  {
    handle: 'zebra-zd420d', shopifyHandle: 'etikettskriver', group: 'equipment', type: 'Etikettskriver', name: 'Zebra ZD420d', description: 'Pris- og hylleetiketter.', price: 5990, image: '/images/nexuspos/zebra-zd420d.jpg',
    en: { type: 'Label printer', description: 'Price and shelf labels.' },
    sv: { type: 'Etikettskrivare', description: 'Pris- och hyllkantsetiketter.' },
    da: { type: 'Etiketprinter', description: 'Pris- og hyldeetiketter.' },
    de: { type: 'Etikettendrucker', description: 'Preis- und Regaletiketten.' },
  },
  {
    handle: 'veggstativ-nettbrett', shopifyHandle: 'veggstativ-ipad', group: 'equipment', type: 'Stativ', name: 'Veggstativ for nettbrett', description: 'For 7–13" nettbrett.', price: 1190, image: '/images/nexuspos/veggstativ.jpg',
    en: { type: 'Stand', name: 'Wall mount for tablets', description: 'For 7–13" tablets.' },
    sv: { type: 'Stativ', name: 'Väggfäste för surfplatta', description: 'För 7–13" surfplattor.' },
    da: { type: 'Stativ', name: 'Vægbeslag til tablet', description: 'Til 7–13" tablets.' },
    de: { type: 'Ständer', name: 'Wandhalterung für Tablets', description: 'Für 7–13"-Tablets.' },
  },
  {
    handle: 'star-munite-gulvstativ', shopifyHandle: 'gulvstativ', group: 'equipment', type: 'Stativ', name: 'Star mUnite gulvstativ', description: 'Selvbetjening og pop-up. Svart eller hvit.', price: 3190, image: '/images/nexuspos/star-munite.jpg',
    en: { type: 'Stand', name: 'Star mUnite floor stand', description: 'Self-service and pop-up. Black or white.' },
    sv: { type: 'Stativ', name: 'Star mUnite golvstativ', description: 'Självbetjäning och pop-up. Svart eller vit.' },
    da: { type: 'Stativ', name: 'Star mUnite gulvstativ', description: 'Selvbetjening og pop-up. Sort eller hvid.' },
    de: { type: 'Ständer', name: 'Star mUnite Bodenständer', description: 'Selbstbedienung und Pop-up. Schwarz oder Weiß.' },
  },
  // Consumables
  {
    handle: 'kabelsett-pos', shopifyHandle: 'kabler-og-strom-kassepunkt', group: 'consumable', type: 'Tilbehør', name: 'Kabelsett – 2 × USB-C-lader + nettverkskabel', description: '', price: 590,
    en: { type: 'Accessories', name: 'Cable kit – 2 × USB-C charger + network cable' },
    sv: { type: 'Tillbehör', name: 'Kabelset – 2 × USB-C-laddare + nätverkskabel' },
    da: { type: 'Tilbehør', name: 'Kabelsæt – 2 × USB-C-oplader + netværkskabel' },
    de: { type: 'Zubehör', name: 'Kabelset – 2 × USB-C-Ladegerät + Netzwerkkabel' },
  },
  {
    handle: 'kvitteringspapir-80mm', shopifyHandle: 'kvitteringspapir', shopifyVariant: '80 mm', group: 'consumable', type: 'Forbruk', name: 'Kvitteringspapir 80 mm, 20 ruller', description: '', price: 440, unit: 'per pakke',
    en: { type: 'Consumables', name: 'Receipt paper 80 mm, 20 rolls', unit: 'per pack' },
    sv: { type: 'Förbrukning', name: 'Kvittopapper 80 mm, 20 rullar', unit: 'per förpackning' },
    da: { type: 'Forbrug', name: 'Bonpapir 80 mm, 20 ruller', unit: 'per pakke' },
    de: { type: 'Verbrauchsmaterial', name: 'Bonpapier 80 mm, 20 Rollen', unit: 'pro Packung' },
  },
  {
    handle: 'kvitteringspapir-58mm', shopifyHandle: 'kvitteringspapir', shopifyVariant: '58 mm', group: 'consumable', type: 'Forbruk', name: 'Kvitteringspapir 58 mm, 20 ruller', description: '', price: 280, unit: 'per pakke',
    en: { type: 'Consumables', name: 'Receipt paper 58 mm, 20 rolls', unit: 'per pack' },
    sv: { type: 'Förbrukning', name: 'Kvittopapper 58 mm, 20 rullar', unit: 'per förpackning' },
    da: { type: 'Forbrug', name: 'Bonpapir 58 mm, 20 ruller', unit: 'per pakke' },
    de: { type: 'Verbrauchsmaterial', name: 'Bonpapier 58 mm, 20 Rollen', unit: 'pro Packung' },
  },
]

/**
 * Swap the Norwegian text fields for the page language. Prices, handles,
 * images and Shopify data pass through untouched. Norwegian returns the
 * same array; a language without its own block falls back to English.
 */
export function localizeNexusItems(items: NexusItem[], language: string): NexusItem[] {
  const lang = nexusLang(language)
  if (lang === 'no') return items
  return items.map((item) => {
    const copy = item[lang] ?? item.en
    if (!copy) return item
    return {
      ...item,
      type: copy.type ?? item.type,
      name: copy.name ?? item.name,
      description: copy.description ?? item.description,
      unit: copy.unit ?? item.unit,
      badge: copy.badge ?? item.badge,
    }
  })
}

/** Swatch label in the page language (Norwegian label is the fallback). */
export const swatchLabel = (v: NexusSwatch, lang: NexusLang) => (lang === 'no' ? v.label : v.labels?.[lang] ?? v.labels?.en ?? v.label)

type KitHandle = 'nexus-pos-pakke-a-full-kassedisk' | 'nexus-pos-pakke-b-kompakt-kasse'
type KitContents = Record<KitHandle, { lines: string[]; images: string[]; alts: string[] }>

const KIT_IMAGES: Record<KitHandle, string[]> = {
  'nexus-pos-pakke-a-full-kassedisk': ['/images/nexuspos/nets-n950.jpg', '/images/nexuspos/ipad-11.jpg', '/images/nexuspos/ipad-stativ.jpg', '/images/nexuspos/zebra-ds9308.jpg', '/images/nexuspos/star-tsp143iv.jpg', '/images/nexuspos/kasseskuff-hs330.jpg'],
  'nexus-pos-pakke-b-kompakt-kasse': ['/images/nexuspos/nets-n950.jpg', '/images/nexuspos/ipad-11.jpg', '/images/nexuspos/zebra-ds9308.jpg', '/images/nexuspos/star-mpop.jpg'],
}

const kitContents = (a: { lines: string[]; alts: string[] }, b: { lines: string[]; alts: string[] }): KitContents => ({
  'nexus-pos-pakke-a-full-kassedisk': { ...a, images: KIT_IMAGES['nexus-pos-pakke-a-full-kassedisk'] },
  'nexus-pos-pakke-b-kompakt-kasse': { ...b, images: KIT_IMAGES['nexus-pos-pakke-b-kompakt-kasse'] },
})

export const nexusKitContents: KitContents = {
  'nexus-pos-pakke-a-full-kassedisk': {
    lines: ['Nets N950 · iPad 11" · iPad-stativ med dreiefot', '2D-strekkodeleser · 80 mm kvitteringsskriver · kasseskuff', 'Kabelsett med lader og nettverkskabel'],
    images: KIT_IMAGES['nexus-pos-pakke-a-full-kassedisk'],
    alts: ['Nets N950', 'iPad 11 tommer', 'iPad-stativ', 'Strekkodeleser', 'Kvitteringsskriver', 'Kasseskuff'],
  },
  'nexus-pos-pakke-b-kompakt-kasse': {
    lines: ['Nets N950 · iPad 11" · 2D-strekkodeleser', 'Star mPOP: 58 mm skriver, skuff og nettbrettholder i ett', 'Kabelsett med lader og nettverkskabel'],
    images: KIT_IMAGES['nexus-pos-pakke-b-kompakt-kasse'],
    alts: ['Nets N950', 'iPad 11 tommer', 'Strekkodeleser', 'Kombinert skriver og kasseskuff'],
  },
}

const nexusKitContentsEn = kitContents(
  {
    lines: ['Nets N950 · iPad 11" · iPad stand with swivel base', '2D barcode scanner · 80 mm receipt printer · cash drawer', 'Cable kit with charger and network cable'],
    alts: ['Nets N950', 'iPad 11 inch', 'iPad stand', 'Barcode scanner', 'Receipt printer', 'Cash drawer'],
  },
  {
    lines: ['Nets N950 · iPad 11" · 2D barcode scanner', 'Star mPOP: 58 mm printer, drawer and tablet holder in one', 'Cable kit with charger and network cable'],
    alts: ['Nets N950', 'iPad 11 inch', 'Barcode scanner', 'Combined printer and cash drawer'],
  },
)

const nexusKitContentsSv = kitContents(
  {
    lines: ['Nets N950 · iPad 11" · iPad-stativ med vridbar fot', '2D-streckkodsläsare · 80 mm kvittoskrivare · kassalåda', 'Kabelset med laddare och nätverkskabel'],
    alts: ['Nets N950', 'iPad 11 tum', 'iPad-stativ', 'Streckkodsläsare', 'Kvittoskrivare', 'Kassalåda'],
  },
  {
    lines: ['Nets N950 · iPad 11" · 2D-streckkodsläsare', 'Star mPOP: 58 mm skrivare, låda och surfplattehållare i ett', 'Kabelset med laddare och nätverkskabel'],
    alts: ['Nets N950', 'iPad 11 tum', 'Streckkodsläsare', 'Kombinerad skrivare och kassalåda'],
  },
)

const nexusKitContentsDa = kitContents(
  {
    lines: ['Nets N950 · iPad 11" · iPad-stativ med drejefod', '2D-stregkodescanner · 80 mm bonprinter · pengeskuffe', 'Kabelsæt med oplader og netværkskabel'],
    alts: ['Nets N950', 'iPad 11 tommer', 'iPad-stativ', 'Stregkodescanner', 'Bonprinter', 'Pengeskuffe'],
  },
  {
    lines: ['Nets N950 · iPad 11" · 2D-stregkodescanner', 'Star mPOP: 58 mm printer, skuffe og tabletholder i ét', 'Kabelsæt med oplader og netværkskabel'],
    alts: ['Nets N950', 'iPad 11 tommer', 'Stregkodescanner', 'Kombineret printer og pengeskuffe'],
  },
)

const nexusKitContentsDe = kitContents(
  {
    lines: ['Nets N950 · iPad 11" · iPad-Ständer mit Drehfuß', '2D-Barcodescanner · 80-mm-Bondrucker · Kassenschublade', 'Kabelset mit Ladegerät und Netzwerkkabel'],
    alts: ['Nets N950', 'iPad 11 Zoll', 'iPad-Ständer', 'Barcodescanner', 'Bondrucker', 'Kassenschublade'],
  },
  {
    lines: ['Nets N950 · iPad 11" · 2D-Barcodescanner', 'Star mPOP: 58-mm-Drucker, Schublade und Tablet-Halter in einem', 'Kabelset mit Ladegerät und Netzwerkkabel'],
    alts: ['Nets N950', 'iPad 11 Zoll', 'Barcodescanner', 'Kombinierter Drucker und Kassenschublade'],
  },
)

export const nexusSteps = [
  { n: '01', title: 'Kasse', text: 'Du slår inn salget i Shopify POS på iPaden, akkurat som i dag.' },
  { n: '02', title: 'Bro', text: 'Nexus POS sender beløpet til Nets-terminalen i sanntid.' },
  { n: '03', title: 'Betaling', text: 'Terminalen tar kort, kontaktløst og Vipps, med PIN og bekreftelse.' },
  { n: '04', title: 'Regelverk', text: 'Hver transaksjon logges til journal, X/Z-rapporter og SAF-T. Automatisk.' },
]

const nexusStepsEn = [
  { n: '01', title: 'Till', text: 'You ring up the sale in Shopify POS on the iPad, just like today.' },
  { n: '02', title: 'Bridge', text: 'Nexus POS sends the amount to the Nets terminal in real time.' },
  { n: '03', title: 'Payment', text: 'The terminal takes cards, contactless and Vipps, with PIN and confirmation.' },
  { n: '04', title: 'Compliance', text: 'Every transaction is logged to the journal, X/Z reports and SAF-T. Automatically.' },
]

const nexusStepsSv = [
  { n: '01', title: 'Kassa', text: 'Du slår in försäljningen i Shopify POS på iPaden, precis som i dag.' },
  { n: '02', title: 'Brygga', text: 'Nexus POS skickar beloppet till Nets-terminalen i realtid.' },
  { n: '03', title: 'Betalning', text: 'Terminalen tar kort, kontaktlöst och Vipps, med PIN och bekräftelse.' },
  { n: '04', title: 'Regelverk', text: 'Varje transaktion loggas till journal, X/Z-rapporter och SAF-T. Automatiskt.' },
]

const nexusStepsDa = [
  { n: '01', title: 'Kasse', text: 'Du slår salget ind i Shopify POS på iPaden, præcis som i dag.' },
  { n: '02', title: 'Bro', text: 'Nexus POS sender beløbet til Nets-terminalen i realtid.' },
  { n: '03', title: 'Betaling', text: 'Terminalen tager kort, kontaktløs og Vipps, med PIN og bekræftelse.' },
  { n: '04', title: 'Regler', text: 'Hver transaktion logges til journal, X/Z-rapporter og SAF-T. Automatisk.' },
]

const nexusStepsDe = [
  { n: '01', title: 'Kasse', text: 'Sie erfassen den Verkauf in Shopify POS auf dem iPad, genau wie heute.' },
  { n: '02', title: 'Brücke', text: 'Nexus POS sendet den Betrag in Echtzeit an das Nets-Terminal.' },
  { n: '03', title: 'Zahlung', text: 'Das Terminal nimmt Karte, kontaktlos und Vipps an, mit PIN und Bestätigung.' },
  { n: '04', title: 'Compliance', text: 'Jede Transaktion wird in Journal, X/Z-Berichten und SAF-T protokolliert. Automatisch.' },
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

const nexusRequirementsEn = {
  needed: [
    'Internet in the store – wifi or mobile data is enough',
    'At least one free power socket by the till – ideally two, so everything can charge',
    'iPad with iPadOS 15.1 or newer',
    'PC or Mac for administration in Shopify',
    'Acquiring agreement with Nets – we help you set it up',
  ],
  billedByOthers: [
    'Shopify POS Pro licence per location – from Shopify',
    'Transaction fees – from Nets',
    'Accounting integration beyond CSV and API export',
    'Travel for installation outside Oslo and Tønsberg, billed as incurred',
  ],
}

const nexusRequirementsSv = {
  needed: [
    'Internet i butiken – wifi eller mobildata räcker',
    'Minst ett ledigt eluttag vid kassan – helst två, så att allt kan laddas',
    'iPad med iPadOS 15.1 eller senare',
    'PC eller Mac för administration i Shopify',
    'Inlösenavtal med Nets – vi hjälper dig att sätta upp det',
  ],
  billedByOthers: [
    'Shopify POS Pro-licens per plats – från Shopify',
    'Transaktionsavgifter – från Nets',
    'Bokföringsintegration utöver CSV- och API-export',
    'Resa vid installation utanför Oslo och Tønsberg, enligt faktisk kostnad',
  ],
}

const nexusRequirementsDa = {
  needed: [
    'Internet i butikken – wifi eller mobildata er nok',
    'Mindst én ledig stikkontakt ved kassen – helst to, så alt kan lades',
    'iPad med iPadOS 15.1 eller nyere',
    'PC eller Mac til administration i Shopify',
    'Indløsningsaftale med Nets – vi hjælper dig med at sætte den op',
  ],
  billedByOthers: [
    'Shopify POS Pro-licens per lokation – fra Shopify',
    'Transaktionsgebyrer – fra Nets',
    'Regnskabsintegration ud over CSV- og API-eksport',
    'Rejse ved installation uden for Oslo og Tønsberg, efter forbrug',
  ],
}

const nexusRequirementsDe = {
  needed: [
    'Internet im Geschäft – WLAN oder Mobilfunk genügt',
    'Mindestens eine freie Steckdose an der Kasse – besser zwei, damit alles geladen werden kann',
    'iPad mit iPadOS 15.1 oder neuer',
    'PC oder Mac für die Verwaltung in Shopify',
    'Acquiring-Vertrag mit Nets – wir helfen Ihnen bei der Einrichtung',
  ],
  billedByOthers: [
    'Shopify POS Pro-Lizenz pro Standort – von Shopify',
    'Transaktionsgebühren – von Nets',
    'Buchhaltungsintegration über CSV- und API-Export hinaus',
    'Anreise bei Installation außerhalb von Oslo und Tønsberg, nach Aufwand',
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

const nexusFaqEn = [
  { question: 'Do I have to stop using Shopify POS?', answer: 'No. You keep using Shopify POS as before. Nexus POS sits between the till and the Nets terminal and handles payment and Norwegian compliance. Products, inventory, customers and orders stay in Shopify.' },
  { question: 'Does Nexus POS comply with the Norwegian Cash Register Act?', answer: 'We have filed a product declaration for Nexus POS with the Norwegian Tax Administration. Nexus POS gives you a Norwegian sales receipt with VAT breakdown, an electronic journal stored in Norway, automatic X and Z reports and SAF-T export. Responsibility for the till setup in the store rests with the business, so do check with your accountant.' },
  { question: 'Do I need an agreement with Nets?', answer: 'Yes, to accept cards you need an acquiring agreement with Nets. We set it up together with you. Transaction fees are invoiced directly by Nets.' },
  { question: 'Can I use the terminal and iPad I already have?', answer: 'Often, yes. A Nets N950 you already own can usually be kept, and the same goes for an iPad on iPadOS 15.1 or newer. We check your equipment during onboarding, so you only buy what is missing.' },
  { question: 'What does the 15 000 kr onboarding include?', answer: 'Review of your current till and migration, setup of Nexus POS, Shopify POS and the terminal, and training for you and your staff. Onboarding is paid once per store.' },
  { question: 'Is there a lock-in period?', answer: 'No. The licence runs month to month with 30 days notice. Prices are adjusted annually in line with the consumer price index.' },
  { question: 'What about Shopify POS Pro?', answer: 'You need Shopify POS Pro for each physical location. The licence is bought from and invoiced by Shopify, on top of Nexus POS.' },
  { question: 'Can I take Vipps at the till?', answer: 'Yes. The Nets terminal takes cards, contactless payment and Vipps.' },
  { question: 'How long until we are up and running?', answer: 'Most of the equipment is in stock. Some items, like the customer display and floor stand, have a lead time of around three days. We agree on an installation date once the equipment is ordered.' },
  { question: 'We have several stores. What applies to us?', answer: 'Chains and stores with many tills get a tailored quote. Get in touch and we will put together the numbers for the whole chain.' },
]

const nexusFaqSv = [
  { question: 'Måste jag sluta använda Shopify POS?', answer: 'Nej. Du fortsätter i Shopify POS som förut. Nexus POS ligger mellan kassan och Nets-terminalen och tar hand om betalning och norska krav. Produkter, lager, kunder och ordrar stannar i Shopify.' },
  { question: 'Uppfyller Nexus POS den norska kassalagen?', answer: 'Vi har lämnat in produktdeklaration för Nexus POS till norska Skatteetaten. Nexus POS ger dig norskt kvitto med momsspecifikation, elektronisk journal lagrad i Norge, automatiska X- och Z-rapporter och SAF-T-export. Ansvaret för kassauppsättningen i butiken ligger hos verksamheten, så stäm gärna av med din redovisningskonsult.' },
  { question: 'Behöver jag ett avtal med Nets?', answer: 'Ja, för att ta emot kort behöver du ett inlösenavtal med Nets. Vi sätter upp det tillsammans med dig. Transaktionsavgifterna faktureras direkt från Nets.' },
  { question: 'Kan jag använda terminalen och iPaden jag redan har?', answer: 'Ofta, ja. En Nets N950 du redan har kan som regel användas vidare, och detsamma gäller en iPad med iPadOS 15.1 eller senare. Vi kontrollerar din utrustning under uppstarten, så att du bara köper det som saknas.' },
  { question: 'Vad ingår i uppstarten för 15 000 kr?', answer: 'Genomgång av dagens kassa och migrering, uppsättning av Nexus POS, Shopify POS och terminal, samt utbildning av dig och personalen. Uppstarten betalas en gång per butik.' },
  { question: 'Finns det någon bindningstid?', answer: 'Nej. Licensen löper månad för månad med 30 dagars uppsägningstid. Priserna justeras årligen enligt KPI.' },
  { question: 'Hur är det med Shopify POS Pro?', answer: 'Du behöver Shopify POS Pro för varje fysisk plats. Licensen köps från och faktureras av Shopify, och tillkommer utöver Nexus POS.' },
  { question: 'Kan jag ta Vipps i kassan?', answer: 'Ja. Nets-terminalen tar kort, kontaktlös betalning och Vipps.' },
  { question: 'Hur lång tid tar det innan vi är igång?', answer: 'Det mesta av utrustningen har vi i lager. Vissa varor, som kunddisplay och golvstativ, har cirka tre dagars leveranstid. Vi bokar installationsdatum när utrustningen är beställd.' },
  { question: 'Vi har flera butiker. Vad gäller för oss?', answer: 'Kedjor och butiker med många kassaplatser får en egen offert. Hör av dig, så räknar vi på hela kedjan.' },
]

const nexusFaqDa = [
  { question: 'Skal jeg stoppe med Shopify POS?', answer: 'Nej. Du fortsætter i Shopify POS som før. Nexus POS ligger mellem kassen og Nets-terminalen og tager sig af betaling og norske krav. Produkter, lager, kunder og ordrer bliver i Shopify.' },
  { question: 'Opfylder Nexus POS den norske kasselov?', answer: 'Vi har indleveret produkterklæring for Nexus POS til det norske Skatteetaten. Nexus POS giver dig norsk salgskvittering med momsspecifikation, elektronisk journal gemt i Norge, automatiske X- og Z-rapporter og SAF-T-eksport. Ansvaret for kasseopsætningen i butikken ligger hos virksomheden, så afklar det gerne med din revisor.' },
  { question: 'Har jeg brug for en aftale med Nets?', answer: 'Ja, for at tage imod kort skal du have en indløsningsaftale med Nets. Vi sætter den op sammen med dig. Transaktionsgebyrerne faktureres direkte fra Nets.' },
  { question: 'Kan jeg bruge den terminal og iPad, jeg allerede har?', answer: 'Ofte, ja. En Nets N950, du allerede har, kan som regel bruges videre, og det samme gælder en iPad med iPadOS 15.1 eller nyere. Vi tjekker dit udstyr under opstarten, så du kun køber det, der mangler.' },
  { question: 'Hvad er inkluderet i opstarten til 15 000 kr?', answer: 'Gennemgang af den nuværende kasse og migrering, opsætning af Nexus POS, Shopify POS og terminal samt oplæring af dig og dine medarbejdere. Opstarten betales én gang per butik.' },
  { question: 'Er der bindingsperiode?', answer: 'Nej. Licensen løber måned for måned med 30 dages opsigelse. Priserne justeres årligt efter forbrugerprisindekset.' },
  { question: 'Hvad med Shopify POS Pro?', answer: 'Du skal bruge Shopify POS Pro for hver fysisk lokation. Licensen købes og faktureres af Shopify og kommer oven i Nexus POS.' },
  { question: 'Kan jeg tage Vipps i kassen?', answer: 'Ja. Nets-terminalen tager kort, kontaktløs betaling og Vipps.' },
  { question: 'Hvor lang tid går der, før vi er i gang?', answer: 'Det meste af udstyret har vi på lager. Nogle varer, som kundedisplay og gulvstativ, har omkring tre dages leveringstid. Vi aftaler installationsdato, når udstyret er bestilt.' },
  { question: 'Vi har flere butikker. Hvad gælder for os?', answer: 'Kæder og butikker med mange kassepunkter får et eget tilbud. Kontakt os, så sætter vi et regnestykke op for hele kæden.' },
]

const nexusFaqDe = [
  { question: 'Muss ich Shopify POS aufgeben?', answer: 'Nein. Sie arbeiten wie bisher in Shopify POS weiter. Nexus POS sitzt zwischen Kasse und Nets-Terminal und übernimmt Zahlung und die norwegischen Vorgaben. Produkte, Lager, Kunden und Bestellungen bleiben in Shopify.' },
  { question: 'Erfüllt Nexus POS das norwegische Kassengesetz?', answer: 'Wir haben für Nexus POS eine Produkterklärung bei der norwegischen Steuerbehörde eingereicht. Nexus POS liefert Ihnen einen norwegischen Kassenbeleg mit MwSt.-Ausweis, ein in Norwegen gespeichertes elektronisches Journal, automatische X- und Z-Berichte und SAF-T-Export. Die Verantwortung für die Kasseneinrichtung im Geschäft liegt beim Unternehmen, stimmen Sie sich daher gern mit Ihrer Buchhaltung ab.' },
  { question: 'Brauche ich einen Vertrag mit Nets?', answer: 'Ja, um Karten anzunehmen, brauchen Sie einen Acquiring-Vertrag mit Nets. Wir richten ihn gemeinsam mit Ihnen ein. Die Transaktionsgebühren rechnet Nets direkt ab.' },
  { question: 'Kann ich mein vorhandenes Terminal und iPad weiterverwenden?', answer: 'Oft ja. Ein vorhandenes Nets N950 lässt sich in der Regel weiter nutzen, ebenso ein iPad mit iPadOS 15.1 oder neuer. Wir prüfen Ihre Ausstattung beim Onboarding, damit Sie nur kaufen, was fehlt.' },
  { question: 'Was ist im Onboarding für 15 000 kr enthalten?', answer: 'Prüfung Ihrer bisherigen Kasse und Migration, Einrichtung von Nexus POS, Shopify POS und Terminal sowie Schulung für Sie und Ihr Team. Das Onboarding wird einmalig pro Geschäft berechnet.' },
  { question: 'Gibt es eine Mindestlaufzeit?', answer: 'Nein. Die Lizenz läuft monatlich mit 30 Tagen Kündigungsfrist. Die Preise werden jährlich an den Verbraucherpreisindex angepasst.' },
  { question: 'Was ist mit Shopify POS Pro?', answer: 'Sie benötigen Shopify POS Pro für jeden physischen Standort. Die Lizenz wird bei Shopify gekauft und von Shopify abgerechnet, zusätzlich zu Nexus POS.' },
  { question: 'Kann ich Vipps an der Kasse annehmen?', answer: 'Ja. Das Nets-Terminal nimmt Karte, kontaktlose Zahlung und Vipps an.' },
  { question: 'Wie lange dauert es, bis wir loslegen können?', answer: 'Den Großteil der Ausstattung haben wir auf Lager. Einige Artikel, etwa Kundendisplay und Bodenständer, haben rund drei Tage Lieferzeit. Den Installationstermin vereinbaren wir, sobald die Ausstattung bestellt ist.' },
  { question: 'Wir haben mehrere Geschäfte. Was gilt für uns?', answer: 'Ketten und Geschäfte mit vielen Kassen erhalten ein individuelles Angebot. Melden Sie sich, und wir rechnen das für die ganze Kette durch.' },
]

type NexusPageCopy = { kitContents: KitContents; steps: typeof nexusSteps; requirements: typeof nexusRequirements; faq: typeof nexusFaq }

const NEXUS_COPY: Record<NexusLang, NexusPageCopy> = {
  no: { kitContents: nexusKitContents, steps: nexusSteps, requirements: nexusRequirements, faq: nexusFaq },
  en: { kitContents: nexusKitContentsEn, steps: nexusStepsEn, requirements: nexusRequirementsEn, faq: nexusFaqEn },
  sv: { kitContents: nexusKitContentsSv, steps: nexusStepsSv, requirements: nexusRequirementsSv, faq: nexusFaqSv },
  da: { kitContents: nexusKitContentsDa, steps: nexusStepsDa, requirements: nexusRequirementsDa, faq: nexusFaqDa },
  de: { kitContents: nexusKitContentsDe, steps: nexusStepsDe, requirements: nexusRequirementsDe, faq: nexusFaqDe },
}

/** All list-shaped copy for the page in one language. */
export function nexusCopy(language: string): NexusPageCopy {
  return NEXUS_COPY[nexusLang(language)]
}

export const formatNok = (n: number) => `${new Intl.NumberFormat('nb-NO').format(n).replace(/ /g, ' ')} kr`

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
