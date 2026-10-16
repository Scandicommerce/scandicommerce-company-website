/** Shared labels and types for the integrations pillar (no + en). */

export type Lang = 'no' | 'en'

export const lang = (language: string): Lang => (language === 'no' ? 'no' : 'en')

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
  make: { no: 'Make.com', en: 'Make.com' },
  code: { no: 'Egen kode', en: 'Custom code' },
  app: { no: 'App', en: 'App' },
  connector: { no: 'Connector', en: 'Connector' },
}

export const STATUS_LABEL: Record<string, Record<Lang, string>> = {
  pilot: { no: 'Pilot', en: 'Pilot' },
}

export const DIRECTION_LABEL: Record<string, Record<Lang, string>> = {
  'one-way': { no: 'Énveis', en: 'One-way' },
  'two-way': { no: 'Toveis', en: 'Two-way' },
}

export const CAPABILITY_LABEL: Record<string, Record<Lang, string>> = {
  ordre: { no: 'Ordre', en: 'Orders' },
  kunder: { no: 'Kunder', en: 'Customers' },
  faktura: { no: 'Faktura', en: 'Invoices' },
  kreditnota: { no: 'Kreditnota', en: 'Credit notes' },
  bilagsjournal: { no: 'Bilagsjournal', en: 'Voucher journal' },
  lager: { no: 'Lager', en: 'Inventory' },
  produkter: { no: 'Produkter', en: 'Products' },
  forsendelser: { no: 'Forsendelser', en: 'Shipments' },
  betaling: { no: 'Betaling', en: 'Payments' },
  edi: { no: 'EDI', en: 'EDI' },
  sporing: { no: 'Sporing', en: 'Tracking' },
  booking: { no: 'Booking', en: 'Booking' },
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
  },
}

export const ui = {
  eyebrow: 'text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500',
  h2: 'text-[32px] lg:text-[44px] leading-[1.25] font-bold tracking-[-0.02em] text-sc-ink-900',
  btnPrimary:
    'inline-flex items-center justify-center min-h-[46px] rounded-lg bg-[#1EEFFA] px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-teal',
  btnSecondary:
    'inline-flex items-center justify-center min-h-[46px] rounded-lg border border-sc-ink-200 bg-[#1EEFFA] px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-teal transition-colors',
  tag: 'inline-flex items-center rounded-md bg-sc-cyan-50 px-2.5 py-1 text-xs font-medium text-sc-cyan-700',
  tagOutline: 'inline-flex items-center rounded-md border border-sc-ink-200 px-2.5 py-1 text-xs font-medium text-sc-ink-600',
  chip: 'inline-flex items-center rounded-full border border-sc-ink-200 px-2.5 py-1 text-xs text-sc-ink-600',
  card: 'flex flex-col gap-3.5 rounded-lg border border-sc-ink-100 bg-white p-6 transition-transform hover:-translate-y-1',
  mono: "font-mono text-[13px] text-sc-ink-500",
  container: 'max-w-[1100px] mx-auto px-5 lg:px-8',
}
