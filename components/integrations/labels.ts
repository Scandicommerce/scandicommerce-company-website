/** Shared labels and types for the integrations pillar (no, en, sv, da, de). */

export type Lang = 'no' | 'en' | 'sv' | 'da' | 'de'

const LANGS: Lang[] = ['no', 'en', 'sv', 'da', 'de']
export const lang = (language: string): Lang => (LANGS.includes(language as Lang) ? (language as Lang) : 'en')

export type IntegrationCard = {
  _id: string
  _type: 'integrationPage'
  language?: string | null
  slug: string
  integrationName: string
  pageTitle: string
  shortDescription?: string | null
  integrationMethod?: 'make' | 'code' | 'app' | 'connector' | null
  status?: 'live' | 'pilot' | null
  syncDirection?: 'one-way' | 'two-way' | null
  capabilities?: string[] | null
  featured?: boolean | null
  logoUrl?: string | null
  category?: { title: string; key: string; slug: string } | null
  firstStep?: { from?: string; to?: string } | null
}

export type CategorySummary = {
  _id: string
  title: string
  key: string
  slug: string
  definition?: string | null
  count?: number
  vendors?: string[] | null
}

export const METHOD_LABEL: Record<string, Record<Lang, string>> = {
  make: { no: 'Make.com', en: 'Make.com', sv: 'Make.com', da: 'Make.com', de: 'Make.com' },
  code: { no: 'Egen kode', en: 'Custom code', sv: 'Egen kod', da: 'Egen kode', de: 'Eigener Code' },
  app: { no: 'App', en: 'App', sv: 'App', da: 'App', de: 'App' },
  connector: { no: 'Connector', en: 'Connector', sv: 'Connector', da: 'Connector', de: 'Connector' },
}

export const STATUS_LABEL: Record<string, Record<Lang, string>> = {
  pilot: { no: 'Pilot', en: 'Pilot', sv: 'Pilot', da: 'Pilot', de: 'Pilot' },
}

export const DIRECTION_LABEL: Record<string, Record<Lang, string>> = {
  'one-way': { no: 'Énveis', en: 'One-way', sv: 'Enkelriktad', da: 'Envejs', de: 'Einseitig' },
  'two-way': { no: 'Toveis', en: 'Two-way', sv: 'Dubbelriktad', da: 'Tovejs', de: 'Beidseitig' },
}

export const CAPABILITY_LABEL: Record<string, Record<Lang, string>> = {
  ordre: { no: 'Ordre', en: 'Orders', sv: 'Order', da: 'Ordrer', de: 'Bestellungen' },
  kunder: { no: 'Kunder', en: 'Customers', sv: 'Kunder', da: 'Kunder', de: 'Kunden' },
  faktura: { no: 'Faktura', en: 'Invoices', sv: 'Fakturor', da: 'Fakturaer', de: 'Rechnungen' },
  kreditnota: { no: 'Kreditnota', en: 'Credit notes', sv: 'Kreditnotor', da: 'Kreditnotaer', de: 'Gutschriften' },
  bilagsjournal: { no: 'Bilagsjournal', en: 'Voucher journal', sv: 'Verifikationsjournal', da: 'Bilagsjournal', de: 'Buchungsjournal' },
  lager: { no: 'Lager', en: 'Inventory', sv: 'Lager', da: 'Lager', de: 'Lagerbestand' },
  produkter: { no: 'Produkter', en: 'Products', sv: 'Produkter', da: 'Produkter', de: 'Produkte' },
  forsendelser: { no: 'Forsendelser', en: 'Shipments', sv: 'Försändelser', da: 'Forsendelser', de: 'Sendungen' },
  betaling: { no: 'Betaling', en: 'Payments', sv: 'Betalning', da: 'Betaling', de: 'Zahlungen' },
  edi: { no: 'EDI', en: 'EDI', sv: 'EDI', da: 'EDI', de: 'EDI' },
  sporing: { no: 'Sporing', en: 'Tracking', sv: 'Spårning', da: 'Sporing', de: 'Tracking' },
  booking: { no: 'Booking', en: 'Booking', sv: 'Bokning', da: 'Booking', de: 'Buchung' },
}

export const T = {
  no: {
    eyebrowAll: 'Alle integrasjoner',
    allHeading: 'Velg system, se hva som flyter',
    category: 'Kategori',
    method: 'Metode',
    all: 'Alle',
    readMore: 'Les mer',
    integrationsCount: (n: number) => `${n} integrasjon${n === 1 ? '' : 'er'}`,
    bySystem: 'Etter system',
    bySystemHeading: 'Systemene vi kobler til Shopify',
    howEyebrow: 'Slik integrerer vi',
    howHeading: 'Make.com der flyten skal være synlig. Kode der logikken krever det.',
    makeBody:
      'Visuelle scenarioer i din egen Make-konto. Hver kjøring kan åpnes og leses, modul for modul, når noe går galt. Riktig valg for regnskap, OMS og de fleste ordreflyter.',
    makeBullets: ['Levert på dager, ikke uker', 'Du eier scenarioet og tilkoblingene', 'Historikk per kjøring, synlig for deg og regnskapsfører', 'Passer best under noen tusen ordre per dag'],
    codeBody:
      'En egen Shopify-app eller tjeneste vi skriver, tester og drifter. Riktig valg når logikken er mer transformasjon enn flyt, når volumet er høyt, eller når du trenger konfigurator, kundeportal eller server-side sporing.',
    codeBullets: ['Full kontroll på mapping og validering', 'Kø, retry og logg som standard', 'Versjonskontroll og testmiljø', 'Kildekoden er din'],
    whatFlows: 'Hva som flyter',
    data: 'Data',
    direction: 'Retning',
    when: 'Når',
    note: 'Merknad',
    notIncluded: 'Ikke inkludert',
    trigger: { webhook: 'sanntid (webhook)', schedule: 'planlagt', manual: 'manuell' } as Record<string, string>,
    poster: 'Dataflyt',
    siblings: 'Relaterte integrasjoner',
    otherCategories: 'Andre kategorier',
    inThisCategory: 'Integrasjoner i denne kategorien',
    by: 'Av',
    updated: 'Oppdatert',
    vendor: 'Logg inn hos',
    whatIs: 'Hva det er',
    why: 'Hvorfor det betyr noe',
    steps: 'Slik implementerer vi',
    prereq: 'Forutsetninger',
    clients: 'Kjører hos',
    contents: 'Innhold',
    faq: 'Vanlige spørsmål',
    cases: 'Kundecaser',
    related: 'Les videre',
    pillarCrumb: 'Integrasjoner',
    confirmClients: 'Bekreft med hver kunde før publisering.',
    forShopify: 'for Shopify',
  },
  en: {
    eyebrowAll: 'All integrations',
    allHeading: 'Pick a system, see what flows',
    category: 'Category',
    method: 'Method',
    all: 'All',
    readMore: 'Read more',
    integrationsCount: (n: number) => `${n} integration${n === 1 ? '' : 's'}`,
    bySystem: 'By system',
    bySystemHeading: 'The systems we connect to Shopify',
    howEyebrow: 'How we integrate',
    howHeading: 'Make.com where the flow should be visible. Code where the logic demands it.',
    makeBody:
      'Visual scenarios in your own Make account. Every run can be opened and read, module by module, when something goes wrong. The right choice for accounting, OMS and most order flows.',
    makeBullets: ['Delivered in days, not weeks', 'You own the scenario and the connections', 'Run history visible to you and your accountant', 'Best below a few thousand orders a day'],
    codeBody:
      'A Shopify app or service we write, test and run. The right choice when the logic is mostly transformation, when volume is high, or when you need a configurator, customer portal or server-side tracking.',
    codeBullets: ['Full control of mapping and validation', 'Queue, retry and logging by default', 'Version control and a test environment', 'The source code is yours'],
    whatFlows: 'What flows',
    data: 'Data',
    direction: 'Direction',
    when: 'When',
    note: 'Note',
    notIncluded: 'Not included',
    trigger: { webhook: 'realtime (webhook)', schedule: 'scheduled', manual: 'manual' } as Record<string, string>,
    poster: 'Data flow',
    siblings: 'Related integrations',
    otherCategories: 'Other categories',
    inThisCategory: 'Integrations in this category',
    by: 'By',
    updated: 'Updated',
    vendor: 'Log in at',
    whatIs: 'What it is',
    why: 'Why it matters',
    steps: 'How we implement it',
    prereq: 'Prerequisites',
    clients: 'Running at',
    contents: 'Contents',
    faq: 'Frequently asked questions',
    cases: 'Case studies',
    related: 'Read next',
    pillarCrumb: 'Integrations',
    confirmClients: 'Confirm with each client before publishing.',
    forShopify: 'for Shopify',
  },
  sv: {
    eyebrowAll: 'Alla integrationer',
    allHeading: 'Välj system, se vad som flödar',
    category: 'Kategori',
    method: 'Metod',
    all: 'Alla',
    readMore: 'Läs mer',
    integrationsCount: (n: number) => `${n} integration${n === 1 ? '' : 'er'}`,
    bySystem: 'Efter system',
    bySystemHeading: 'Systemen vi kopplar till Shopify',
    howEyebrow: 'Så integrerar vi',
    howHeading: 'Make.com där flödet ska vara synligt. Kod där logiken kräver det.',
    makeBody:
      'Visuella scenarier i ditt eget Make-konto. Varje körning kan öppnas och läsas, modul för modul, när något går fel. Rätt val för bokföring, OMS och de flesta orderflöden.',
    makeBullets: ['Levererat på dagar, inte veckor', 'Du äger scenariot och anslutningarna', 'Historik per körning, synlig för dig och din redovisningskonsult', 'Passar bäst under några tusen order per dag'],
    codeBody:
      'En egen Shopify-app eller tjänst som vi skriver, testar och driftar. Rätt val när logiken är mer transformation än flöde, när volymen är hög eller när du behöver konfigurator, kundportal eller spårning på serversidan.',
    codeBullets: ['Full kontroll på mappning och validering', 'Kö, retry och logg som standard', 'Versionshantering och testmiljö', 'Källkoden är din'],
    whatFlows: 'Vad som flödar',
    data: 'Data',
    direction: 'Riktning',
    when: 'När',
    note: 'Anmärkning',
    notIncluded: 'Ingår inte',
    trigger: { webhook: 'realtid (webhook)', schedule: 'schemalagt', manual: 'manuellt' } as Record<string, string>,
    poster: 'Dataflöde',
    siblings: 'Relaterade integrationer',
    otherCategories: 'Andra kategorier',
    inThisCategory: 'Integrationer i den här kategorin',
    by: 'Av',
    updated: 'Uppdaterad',
    vendor: 'Logga in hos',
    whatIs: 'Vad det är',
    why: 'Varför det spelar roll',
    steps: 'Så implementerar vi',
    prereq: 'Förutsättningar',
    clients: 'Körs hos',
    contents: 'Innehåll',
    faq: 'Vanliga frågor',
    cases: 'Kundcase',
    related: 'Läs vidare',
    pillarCrumb: 'Integrationer',
    confirmClients: 'Bekräfta med varje kund före publicering.',
    forShopify: 'för Shopify',
  },
  da: {
    eyebrowAll: 'Alle integrationer',
    allHeading: 'Vælg system, se hvad der flyder',
    category: 'Kategori',
    method: 'Metode',
    all: 'Alle',
    readMore: 'Læs mere',
    integrationsCount: (n: number) => `${n} integration${n === 1 ? '' : 'er'}`,
    bySystem: 'Efter system',
    bySystemHeading: 'Systemerne vi kobler til Shopify',
    howEyebrow: 'Sådan integrerer vi',
    howHeading: 'Make.com hvor flowet skal være synligt. Kode hvor logikken kræver det.',
    makeBody:
      'Visuelle scenarier i din egen Make-konto. Hver kørsel kan åbnes og læses, modul for modul, når noget går galt. Det rigtige valg til regnskab, OMS og de fleste ordreflows.',
    makeBullets: ['Leveret på dage, ikke uger', 'Du ejer scenariet og forbindelserne', 'Historik pr. kørsel, synlig for dig og din bogholder', 'Passer bedst under nogle tusinde ordrer om dagen'],
    codeBody:
      'En egen Shopify-app eller tjeneste, som vi skriver, tester og drifter. Det rigtige valg når logikken er mere transformation end flow, når volumen er høj, eller når du har brug for konfigurator, kundeportal eller sporing på serversiden.',
    codeBullets: ['Fuld kontrol over mapping og validering', 'Kø, retry og log som standard', 'Versionsstyring og testmiljø', 'Kildekoden er din'],
    whatFlows: 'Hvad der flyder',
    data: 'Data',
    direction: 'Retning',
    when: 'Hvornår',
    note: 'Bemærkning',
    notIncluded: 'Ikke inkluderet',
    trigger: { webhook: 'realtid (webhook)', schedule: 'planlagt', manual: 'manuel' } as Record<string, string>,
    poster: 'Dataflow',
    siblings: 'Relaterede integrationer',
    otherCategories: 'Andre kategorier',
    inThisCategory: 'Integrationer i denne kategori',
    by: 'Af',
    updated: 'Opdateret',
    vendor: 'Log ind hos',
    whatIs: 'Hvad det er',
    why: 'Hvorfor det betyder noget',
    steps: 'Sådan implementerer vi',
    prereq: 'Forudsætninger',
    clients: 'Kører hos',
    contents: 'Indhold',
    faq: 'Ofte stillede spørgsmål',
    cases: 'Kundecases',
    related: 'Læs videre',
    pillarCrumb: 'Integrationer',
    confirmClients: 'Bekræft med hver kunde før publicering.',
    forShopify: 'til Shopify',
  },
  de: {
    eyebrowAll: 'Alle Integrationen',
    allHeading: 'System wählen, Datenfluss sehen',
    category: 'Kategorie',
    method: 'Methode',
    all: 'Alle',
    readMore: 'Mehr lesen',
    integrationsCount: (n: number) => `${n} Integration${n === 1 ? '' : 'en'}`,
    bySystem: 'Nach System',
    bySystemHeading: 'Die Systeme, die wir mit Shopify verbinden',
    howEyebrow: 'So integrieren wir',
    howHeading: 'Make.com, wo der Fluss sichtbar sein soll. Code, wo die Logik es verlangt.',
    makeBody:
      'Visuelle Szenarien in Ihrem eigenen Make-Konto. Jeder Lauf lässt sich öffnen und Modul für Modul nachlesen, wenn etwas schiefgeht. Die richtige Wahl für Buchhaltung, OMS und die meisten Bestellflüsse.',
    makeBullets: ['Geliefert in Tagen, nicht Wochen', 'Sie besitzen das Szenario und die Verbindungen', 'Verlauf pro Lauf, sichtbar für Sie und Ihre Buchhaltung', 'Am besten unter einigen tausend Bestellungen pro Tag'],
    codeBody:
      'Eine eigene Shopify-App oder ein Dienst, den wir schreiben, testen und betreiben. Die richtige Wahl, wenn die Logik mehr Transformation als Fluss ist, wenn das Volumen hoch ist oder wenn Sie Konfigurator, Kundenportal oder serverseitiges Tracking brauchen.',
    codeBullets: ['Volle Kontrolle über Mapping und Validierung', 'Warteschlange, Retry und Log als Standard', 'Versionskontrolle und Testumgebung', 'Der Quellcode gehört Ihnen'],
    whatFlows: 'Was fließt',
    data: 'Daten',
    direction: 'Richtung',
    when: 'Wann',
    note: 'Hinweis',
    notIncluded: 'Nicht enthalten',
    trigger: { webhook: 'Echtzeit (Webhook)', schedule: 'geplant', manual: 'manuell' } as Record<string, string>,
    poster: 'Datenfluss',
    siblings: 'Verwandte Integrationen',
    otherCategories: 'Weitere Kategorien',
    inThisCategory: 'Integrationen in dieser Kategorie',
    by: 'Von',
    updated: 'Aktualisiert',
    vendor: 'Anmelden bei',
    whatIs: 'Was es ist',
    why: 'Warum es wichtig ist',
    steps: 'So setzen wir es um',
    prereq: 'Voraussetzungen',
    clients: 'Im Einsatz bei',
    contents: 'Inhalt',
    faq: 'Häufige Fragen',
    cases: 'Kundenprojekte',
    related: 'Weiterlesen',
    pillarCrumb: 'Integrationen',
    confirmClients: 'Vor der Veröffentlichung mit jedem Kunden bestätigen.',
    forShopify: 'für Shopify',
  },
}

export const ui = {
  eyebrow: 'text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500',
  h2: 'text-[32px] lg:text-[44px] leading-[1.25] font-bold tracking-[-0.02em] text-sc-ink-900',
  btnPrimary:
    'inline-flex items-center justify-center min-h-[46px] rounded-lg bg-sc-ink-900 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-700',
  btnSecondary:
    'inline-flex items-center justify-center min-h-[46px] rounded-lg border border-sc-ink-300 bg-transparent px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50',
  tag: 'inline-flex items-center rounded-md bg-sc-cyan-50 px-2.5 py-1 text-xs font-medium text-sc-cyan-700',
  tagOutline: 'inline-flex items-center rounded-md border border-sc-ink-200 px-2.5 py-1 text-xs font-medium text-sc-ink-600',
  chip: 'inline-flex items-center rounded-full border border-sc-ink-200 px-2.5 py-1 text-xs text-sc-ink-600',
  card: 'flex flex-col gap-3.5 rounded-lg border border-sc-ink-100 bg-white p-6 transition-transform hover:-translate-y-1',
  mono: "font-mono text-[13px] text-sc-ink-500",
  container: 'max-w-[1100px] mx-auto px-5 lg:px-8',
}
