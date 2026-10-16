/**
 * Written copy for the Growth marketing service pages, keyed by service slug
 * (lib/growthServices.ts). A page renders a real section for every field set
 * here and a labelled placeholder for the rest, so pages can be filled in one
 * section at a time.
 *
 * Kept apart from growthServices.ts because that file also feeds the header
 * menu; this one is only loaded by the pages.
 *
 * Rules (docs/GROWTH-MARKETING.md §4): no invented prices, clients or numbers.
 * Prices and proof stay placeholders until the team supplies them.
 */

/** Chart specs rendered by components/sections/growth/GrowthCharts.tsx. */
export type GrowthChart =
  | {
      kind: 'bars'
      /** Unit shown in the table header, e.g. "Korrelasjon". */
      valueLabel: string
      legend: { emphasis: string; context: string }
      items: { label: string; value: number; emphasis: boolean }[]
    }
  | {
      kind: 'split'
      items: { label: string; value: number; emphasis: boolean }[]
    }
  | { kind: 'longShortConcept' }

export interface GrowthPageContent {
  /** Short definition right under the hero: what the service is, in plain words. */
  intro?: { title: string; paragraphs: string[] }
  /** "Hva forskningen sier": evidence points, each optionally with a chart and its source. */
  insights?: { title: string; text: string; chart?: GrowthChart; source?: { label: string; href: string } }[]
  /** "Slik flyter dataene": source → processing → destination diagrams. */
  flows?: { title: string; text?: string; stages: { title: string; items: string[] }[] }[]
  /** "Plattformer og integrasjoner": grouped external links to tools we work with. */
  platforms?: { title: string; items: { label: string; href: string; text?: string }[] }[]
  /** "Kilder og videre lesning": external links shown at the end of the page. */
  sources?: { label: string; publisher: string; href: string }[]
  /** "Når du trenger dette": buying situations the reader recognises. */
  situations?: { title: string; text: string }[]
  /** "Hva du får". */
  deliverables?: {
    strategi: string[]
    gjennomforing: string[]
    rapportering: string[]
    ikkeInkludert?: string[]
  }
  /** "Pakker og pris". Leave `price` out to link to the package overview (/tjenester/alle-pakker), where prices live. */
  packages?: { name: string; kind: string; summary: string; includes: string[]; price?: string }[]
  /** "De første 90 dagene". */
  process?: { period: string; title: string; text: string }[]
  /** "Hva vi måler og rapporterer". */
  kpis?: { name: string; text: string }[]
  faq?: { question: string; answer: string }[]
  /** "Henger sammen med": other growth services this one depends on, by slug. */
  related?: { slug: string; why: string }[]
}

export const growthContent: Record<string, GrowthPageContent> = {
  'sporing-og-analyse': {
    intro: {
      title: 'Hvorfor server-side sporing?',
      paragraphs: [
        'Sporing som bare kjører i nettleseren mister data. Annonseblokkere stopper skript, Safari begrenser informasjonskapsler satt med JavaScript til sju dager, og samtykke må håndteres riktig. Resultatet er at Meta, Google og analyseverktøyene ser færre kjøp enn Shopify – og at budstrategiene lærer av et ufullstendig bilde.',
        'Med server-side sporing sendes hendelsene fra en server i tillegg til nettleseren, via løsninger som Metas Conversions API og Googles forbedrede konverteringer. Vi bruker Tracklution som standardpartner, og setter opp andre løsninger – som server-side Google Tag Manager – når det passer bedre. Samtykke er fortsatt et krav: server-side sporing endrer hvordan data sendes, ikke hvem som har sagt ja.',
      ],
    },
    flows: [
      {
        title: 'Server-side sporing med Tracklution',
        text: 'Tracklution kobles til Shopify via kundehendelser og en webhook for ordre, på et eget førstepartsdomene. Hendelsene sendes videre til annonseplattformene og analyse – med samtykke fra Shopifys samtykkebanner og Consent Mode v2.',
        stages: [
          { title: 'Shopify', items: ['Kundehendelser (sidevisning, handlekurv, kasse)', 'Webhook ved ny ordre', 'Samtykke fra Shopifys banner'] },
          { title: 'Tracklution', items: ['Førsteparts domene (DNS)', 'Server-side behandling', 'Datasenter i Stockholm (AWS)'] },
          { title: 'Plattformer', items: ['Meta (Conversions API)', 'Google Ads (forbedrede konverteringer)', 'Google Analytics 4', 'TikTok, Pinterest, Microsoft Ads, Klaviyo m.fl.'] },
        ],
      },
      {
        title: 'Analyse og dashboards i Google Cloud',
        text: 'For de som vil eie dataene sine og se alt samlet, henter vi data fra Shopify, GA4 og annonseplattformene inn i BigQuery og bygger dashboards og rapporter oppå.',
        stages: [
          { title: 'Kilder', items: ['Shopify', 'Google Analytics 4', 'Google Ads og Merchant Center', 'Meta, Klaviyo og andre'] },
          { title: 'Google Cloud', items: ['BigQuery-eksport fra GA4', 'BigQuery Data Transfer Service', 'Koblinger for øvrige kilder'] },
          { title: 'Innsikt', items: ['Egne dashboards', 'Rapporter på lønnsomhet og kanal', 'Integrasjoner mot andre systemer'] },
        ],
      },
    ],
    situations: [
      {
        title: 'Tallene i Shopify, GA4 og annonsene spriker',
        text: 'Ingen kilder er enige om hvor mange ordre markedsføringen ga, og du vet ikke hvilken du skal stole på.',
      },
      {
        title: 'Meta og Google ser for få kjøp',
        text: 'Lav hendelsesmatchkvalitet i Meta og manglende konverteringer i Google Ads gjør at kampanjene optimaliserer på for lite data.',
      },
      {
        title: 'Samtykket er ikke koblet riktig',
        text: 'Banneret er på plass, men Consent Mode og pikslene følger ikke valgene – enten mister du data, eller du sporer uten gyldig samtykke.',
      },
      {
        title: 'Pikslene er lagt inn i flere lag',
        text: 'Apper, temaet og Google Tag Manager sender de samme hendelsene, og kjøp telles dobbelt.',
      },
      {
        title: 'Dataene ligger i ti forskjellige verktøy',
        text: 'Du bruker timer på å lage rapporter for hånd, og ingen har en samlet oversikt over kanaler og lønnsomhet.',
      },
      {
        title: 'Du vil eie historikken din',
        text: 'Du trenger rådata og lang historikk til egne analyser, ikke bare det standardrapportene viser.',
      },
    ],
    deliverables: {
      strategi: [
        'Sporingsrevisjon: piksler, tagger, dobbelttelling og samtykke',
        'Måleplan: hvilke hendelser og måltall som skal spores, og hvorfor',
        'Valg av løsning: Tracklution som standard, andre løsninger ved behov',
        'Valg av analyseplattform og datamodell',
      ],
      gjennomforing: [
        'Tracklution i Shopify: kundehendelser, ordre-webhook og førsteparts domene',
        'Metas Conversions API og Googles forbedrede konverteringer',
        'Consent Mode v2 koblet til Shopifys samtykke',
        'GA4 med e-handelshendelser, og eksport til BigQuery',
        'Data fra Google Ads, Merchant Center og andre kilder inn i BigQuery',
        'Egne dashboards og integrasjoner mellom systemene dine',
        'På forespørsel: server-side Google Tag Manager (Stape eller Google Cloud Run) eller Google tag gateway',
      ],
      rapportering: [
        'Dashboards med omsetning, kanaler og lønnsomhet',
        'Månedlig kontroll av datakvalitet: avvik mot Shopify og hendelsesmatchkvalitet',
        'Varsling og retting når sporingen brytes, for eksempel etter en temaendring',
      ],
      ikkeInkludert: [
        'Lisens til Tracklution og kostnader i Google Cloud – det betaler du direkte',
        'Juridisk rådgivning om personvern; ansvaret for gyldig samtykke ligger hos deg',
        'Utvikling av egne apper i Shopify',
      ],
    },
    packages: [
      {
        name: 'Sporingsrevisjon',
        kind: 'Engangsleveranse',
        summary: 'Vi finner ut hva som spores, hva som mangler og hva som telles dobbelt.',
        includes: [
          'Gjennomgang av piksler, tagger og apper',
          'Samtykke og Consent Mode v2',
          'Avvik mellom Shopify, GA4 og annonseplattformene',
          'Prioritert tiltaksliste',
        ],
      },
      {
        name: 'Server-side sporing',
        kind: 'Engangsleveranse',
        summary: 'Komplett oppsett med Tracklution og kobling til annonseplattformene dine.',
        includes: [
          'Tracklution i Shopify med førsteparts domene',
          'Meta, Google Ads, GA4 og øvrige plattformer',
          'Samtykke koblet til Shopifys banner',
          'Test og kontroll mot ordre i Shopify',
        ],
      },
      {
        name: 'Analyse og dashboards',
        kind: 'Månedlig',
        summary: 'Data samlet i BigQuery, dashboards som oppdateres selv, og løpende kontroll.',
        includes: [
          'BigQuery-oppsett og datakilder',
          'Egne dashboards og rapporter',
          'Månedlig kontroll av datakvalitet',
          'Ingen bindingstid – 30 dagers oppsigelse',
        ],
      },
    ],
    process: [
      {
        period: '0–30 dager',
        title: 'Revisjon og plan',
        text: 'Vi kartlegger dagens sporing og samtykke, finner avvikene og lager en måleplan. Vi trenger tilgang til Shopify, GA4, annonsekontoene og domenets DNS.',
      },
      {
        period: '30–60 dager',
        title: 'Server-side på plass',
        text: 'Tracklution settes opp, plattformene kobles på, samtykket testes, og tallene kontrolleres mot ordrene i Shopify.',
      },
      {
        period: '60–90 dager',
        title: 'Analyse og dashboards',
        text: 'Data samles i BigQuery, og dashboardene bygges rundt måltallene dere faktisk styrer etter.',
      },
    ],
    kpis: [
      { name: 'Andel sporede ordre', text: 'Hvor mange av ordrene i Shopify som også registreres i annonseplattformene og GA4.' },
      { name: 'Hendelsesmatchkvalitet', text: 'Metas mål på hvor godt hendelsene kan kobles til riktige personer.' },
      { name: 'Avvik mot Shopify', text: 'Forskjellen mellom ordre og omsetning i Shopify og i plattformene, over tid.' },
      { name: 'Samtykkeandel', text: 'Hvor mange som godtar sporing, og hvordan endringer i banneret påvirker det.' },
      { name: 'Ferske data', text: 'Om dashboardene er oppdatert og kildene leverer som de skal.' },
    ],
    faq: [
      {
        question: 'Hva er server-side sporing?',
        answer: 'At hendelser som kjøp sendes fra en server direkte til for eksempel Meta og Google, i tillegg til fra nettleseren. Det gjør sporingen mindre sårbar for annonseblokkere og nettleserbegrensninger, og gir plattformene bedre data å optimalisere på.',
      },
      {
        question: 'Trenger vi fortsatt samtykke?',
        answer: 'Ja. Etter ekomloven § 3-15 krever lagring og lesing av informasjon på brukerens enhet samtykke, med unntak for det som er strengt nødvendig. Server-side sporing endrer ikke det. Vi kobler sporingen til samtykkebanneret og Consent Mode v2, slik at valgene til den besøkende følges.',
      },
      {
        question: 'Hvorfor Tracklution?',
        answer: 'Tracklution er en ferdig server-side løsning med koblinger til de vanligste annonse- og analyseplattformene, oppsett i Shopify via kundehendelser og datasenter i Stockholm. Det gir sikker sporing uten at du må drifte egne servere. Derfor er det vår standard.',
      },
      {
        question: 'Kan dere bruke andre løsninger?',
        answer: 'Ja. Vi setter også opp server-side Google Tag Manager – på Stape eller i Google Cloud Run – og Google tag gateway, og vi jobber med Shopifys egne integrasjoner mot Meta og Google. Valget avhenger av behov, budsjett og hvem som skal drifte det.',
      },
      {
        question: 'Hvilke analyseplattformer kan dere?',
        answer: 'Google Analytics 4 og Googles verktøy i Google Cloud, som BigQuery, og de mest brukte alternativene som Piwik PRO, Matomo, Plausible, Amplitude og Mixpanel, i tillegg til Shopify Analytics og verktøy for adferd som Microsoft Clarity og Hotjar.',
      },
      {
        question: 'Hva koster BigQuery?',
        answer: 'Google tar ikke betalt for selve eksporten fra GA4, men lagring og spørringer i BigQuery koster etter bruk. For de fleste nettbutikker er det håndterbart, men vi estimerer kostnaden før oppstart, slik at du vet hva du går til.',
      },
    ],
    platforms: [
      {
        title: 'Server-side sporing',
        items: [
          { label: 'Tracklution', href: 'https://www.tracklution.com/', text: 'Vår standardpartner' },
          { label: 'Tracklution for Shopify', href: 'https://www.tracklution.com/server-side-tracking/shopify/' },
          { label: 'Alle Tracklution-integrasjoner', href: 'https://www.tracklution.com/server-side-tracking/integrations/' },
          { label: 'Server-side Google Tag Manager', href: 'https://developers.google.com/tag-platform/tag-manager/server-side', text: 'På forespørsel' },
          { label: 'Stape', href: 'https://stape.io/', text: 'Hosting av server-side GTM' },
          { label: 'Google tag gateway', href: 'https://support.google.com/google-ads/answer/16214371', text: 'Googles tagger via eget domene' },
        ],
      },
      {
        title: 'Annonseplattformer via Tracklution',
        items: [
          { label: 'Meta', href: 'https://www.tracklution.com/server-side-tracking/meta/', text: 'Conversions API' },
          { label: 'Google Ads', href: 'https://www.tracklution.com/server-side-tracking/google-ads/', text: 'Forbedrede konverteringer' },
          { label: 'Google Analytics 4', href: 'https://www.tracklution.com/server-side-tracking/ga4/' },
          { label: 'TikTok', href: 'https://www.tracklution.com/server-side-tracking/tiktok/' },
          { label: 'Klaviyo', href: 'https://www.tracklution.com/server-side-tracking/klaviyo/' },
        ],
      },
      {
        title: 'Analyse',
        items: [
          { label: 'Google Analytics 4', href: 'https://marketingplatform.google.com/about/analytics/' },
          { label: 'Shopify Analytics', href: 'https://www.shopify.com/no/analytics' },
          { label: 'Piwik PRO', href: 'https://piwik.pro/' },
          { label: 'Matomo', href: 'https://matomo.org/' },
          { label: 'Plausible', href: 'https://plausible.io/' },
          { label: 'Amplitude', href: 'https://amplitude.com/' },
          { label: 'Mixpanel', href: 'https://mixpanel.com/home/' },
          { label: 'Microsoft Clarity', href: 'https://clarity.microsoft.com/' },
          { label: 'Hotjar', href: 'https://contentsquare.com/hotjar/' },
        ],
      },
      {
        title: 'Data, BigQuery og dashboards',
        items: [
          { label: 'GA4-eksport til BigQuery', href: 'https://support.google.com/analytics/answer/9358801' },
          { label: 'BigQuery Data Transfer Service', href: 'https://docs.cloud.google.com/bigquery/docs/dts-introduction' },
          { label: 'Google Ads til BigQuery', href: 'https://docs.cloud.google.com/bigquery/docs/google-ads-transfer' },
          { label: 'Merchant Center til BigQuery', href: 'https://docs.cloud.google.com/bigquery/docs/merchant-center-transfer' },
          { label: 'Looker', href: 'https://cloud.google.com/looker', text: 'Dashboards og BI' },
          { label: 'Fivetran', href: 'https://www.fivetran.com/connectors/shopify', text: 'Shopify-kobling' },
          { label: 'Airbyte', href: 'https://airbyte.com/connectors/shopify', text: 'Shopify-kobling' },
          { label: 'Supermetrics', href: 'https://supermetrics.com/', text: 'Markedsdata' },
        ],
      },
    ],
    sources: [
      { label: 'Tracking Prevention in WebKit', publisher: 'WebKit (Safari)', href: 'https://webkit.org/tracking-prevention/' },
      { label: 'Conversions API', publisher: 'Meta for Developers', href: 'https://developers.facebook.com/documentation/ads-commerce/conversions-api' },
      { label: 'Om hendelsesmatchkvalitet', publisher: 'Meta', href: 'https://www.facebook.com/business/help/765081237991954' },
      { label: 'Om forbedrede konverteringer', publisher: 'Google Ads-hjelp', href: 'https://support.google.com/google-ads/answer/9888656' },
      { label: 'Consent mode', publisher: 'Google for Developers', href: 'https://developers.google.com/tag-platform/security/guides/consent' },
      { label: 'Pixels and customer events', publisher: 'Shopify Help', href: 'https://help.shopify.com/en/manual/promoting-marketing/pixels/customer-events' },
      { label: 'Ekomloven § 3-15', publisher: 'Lovdata', href: 'https://lovdata.no/dokument/NL/lov/2024-12-13-76' },
      { label: 'Samtykke til informasjonskapsler og sporingsteknologier', publisher: 'Datatilsynet', href: 'https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/' },
      { label: 'Råd for analyse og sporing på nettsted', publisher: 'Datatilsynet', href: 'https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/rad-for-analyse-og-sporing-pa-nettsted/' },
    ],
    related: [
      { slug: 'sem/google-ads', why: 'Budstrategiene i Google Ads lærer av konverteringene sporingen sender.' },
      { slug: 'some/meta-ads', why: 'Conversions API og god hendelsesmatch er grunnlaget for Meta-kampanjene.' },
      { slug: 'cro', why: 'Riktig data viser hvor kundene faller fra – og hva som faktisk virker.' },
    ],
  },

  'merkevare-og-strategi': {
    intro: {
      title: 'Hvordan merkevarer vokser – også på nett',
      paragraphs: [
        'Forskningen fra Ehrenberg-Bass Institute, kjent fra boken How Brands Grow, viser at merkevarer først og fremst vokser ved å nå flere kjøpere – ikke ved å presse mer ut av de lojale. De fleste kundene dine handler sjelden, og de velger den butikken de kommer på først og finner lettest.',
        'For en nettbutikk betyr det to ting. Du må bli husket i situasjonene der folk skal kjøpe (mental tilgjengelighet), og du må være lett å finne og handle hos – i Google, i Shopping, i AI-svar og i kassen (fysisk tilgjengelighet). Merkevarearbeidet tar seg av det første. SEO, SEM, feed og CRO tar seg av det andre. Vi planlegger dem sammen.',
      ],
    },
    insights: [
      {
        title: 'Merkevare og salg virker på ulik tid',
        text: 'Binet og Field fant i IPAs database over effektive kampanjer at salgsaktivering gir raske topper som faller tilbake, mens merkevarebygging løfter grunnsalget gradvis. Over tid er det merkevaren som gjør at hver annonsekrone gir mer.',
        chart: { kind: 'longShortConcept' },
        source: {
          label: 'IPA: The Long and the Short of It (Binet & Field)',
          href: 'https://ipa.co.uk/knowledge/publications-reports/the-long-and-the-short-of-it-balancing-short-and-long-term-marketing-strategies',
        },
      },
      {
        title: 'Et utgangspunkt for fordelingen',
        text: 'For forbrukermerkevarer har rundt 60 % merkevarebygging og 40 % salgsaktivering vært IPAs utgangspunkt. Senere analyser viser at riktig fordeling varierer med kategori, størrelse og fase – mindre og nye merkevarer trenger ofte mer aktivering i starten. Vi setter fordelingen ut fra din situasjon, ikke fra en fasit.',
        chart: {
          kind: 'split',
          items: [
            { label: 'Merkevarebygging', value: 60, emphasis: true },
            { label: 'Salgsaktivering', value: 40, emphasis: false },
          ],
        },
        source: {
          label: 'IPA: Effectiveness in Context',
          href: 'https://ipa.co.uk/knowledge/publications-reports/effectiveness-in-context',
        },
      },
      {
        title: 'Merkevaren avgjør også synlighet i AI-søk',
        text: 'Ahrefs analyserte 75 000 merkevarer og fant at det som henger sterkest sammen med å bli nevnt i Googles AI-oversikter, er merkevaresignaler – omtale, merkenavn i lenker og søk på navnet – mer enn klassisk lenkebygging. Det er sammenheng, ikke bevist årsak, men retningen er tydelig: kjente merkevarer blir oftere anbefalt.',
        chart: {
          kind: 'bars',
          valueLabel: 'Korrelasjon',
          legend: { emphasis: 'Merkevaresignal', context: 'Lenke- og domenesignal' },
          items: [
            { label: 'Omtale av merkevaren', value: 0.664, emphasis: true },
            { label: 'Merkenavn i lenketekst', value: 0.527, emphasis: true },
            { label: 'Søk på merkenavnet', value: 0.392, emphasis: true },
            { label: 'Domenestyrke (DR)', value: 0.326, emphasis: false },
            { label: 'Lenkende domener', value: 0.295, emphasis: false },
            { label: 'Trafikk fra merkenavnsøk', value: 0.274, emphasis: true },
          ],
        },
        source: {
          label: 'Ahrefs: AI Overview Brand Visibility Factors (75K Brands Studied)',
          href: 'https://ahrefs.com/blog/ai-overview-brand-correlation/',
        },
      },
      {
        title: 'Mål merkevaren med søk',
        text: 'Les Binet viste at din andel av søkene på merkenavn i kategorien – share of search – er en tidlig indikator på markedsandel. Det kan måles gratis i Google Trends mot konkurrentene dine, måned for måned, lenge før det synes i omsetningen.',
        source: {
          label: 'IPA: Binet presents Share of Search',
          href: 'https://ipa.co.uk/news/binet-presents-fast-cheap-predictive-share-of-search-metric/',
        },
      },
    ],
    situations: [
      {
        title: 'Du konkurrerer bare på pris',
        text: 'Kundene ser ingen grunn til å velge deg fremfor neste butikk, så rabatten blir det eneste argumentet.',
      },
      {
        title: 'Annonsene blir dyrere, men ingen søker på navnet ditt',
        text: 'Du betaler for hver eneste kunde, fordi få kjenner merkevaren fra før.',
      },
      {
        title: 'Ingen vet helt hva dere står for',
        text: 'Budskap, tone og uttrykk varierer fra kanal til kanal, og ingenting setter seg.',
      },
      {
        title: 'Du er usynlig i AI-svar',
        text: 'ChatGPT og Googles AI-oversikter nevner konkurrentene når folk spør om produkter i kategorien din.',
      },
      {
        title: 'Kampanjene virker, men veksten flater ut',
        text: 'Hvert salg gir en topp, men grunnsalget mellom kampanjene står stille.',
      },
      {
        title: 'Nytt marked eller ny kategori',
        text: 'Du skal lansere i Sverige, åpne en ny produktlinje eller nå en ny målgruppe og trenger en plan.',
      },
    ],
    deliverables: {
      strategi: [
        'Posisjonering: hvorfor velge deg, sagt så kort at det huskes',
        'Kjøpssituasjoner: når og hvorfor folk handler i kategorien din',
        'Gjenkjennelige merkevareelementer: farger, form, tone og budskap som skal eies',
        'Fordeling mellom merkevarebygging og salgsaktivering',
        'Vekstplan for de neste 12 månedene',
      ],
      gjennomforing: [
        'Merkevareplattform og tone of voice som teamet kan bruke',
        'Retningslinjer for innhold, annonser og nettbutikk',
        'Kampanjekonsept som binder SEO, SEM, SoMe og e-post sammen',
        'Gjennomgang av nettbutikken: kommer merkevaren tydelig fram?',
      ],
      rapportering: [
        'Andel av søk mot konkurrentene, målt månedlig i Google Trends',
        'Merkevaresøk og direktetrafikk over tid',
        'Synlighet i AI-svar for de viktigste spørsmålene i kategorien',
      ],
      ikkeInkludert: [
        'Logodesign og full visuell identitet fra bunnen',
        'Produksjon av film og foto',
        'Medieinnkjøp',
      ],
    },
    packages: [
      {
        name: 'Merkevare- og vekststrategi',
        kind: 'Engangsleveranse',
        summary: 'En kort, konkret strategi dere faktisk bruker – ikke en rapport som blir liggende.',
        includes: [
          'Workshop og innsikt om kunder og konkurrenter',
          'Posisjonering, kjøpssituasjoner og merkevareelementer',
          'Fordeling mellom merkevare og aktivering',
          'Vekstplan og prioriterte tiltak',
        ],
      },
      {
        name: 'Strategisk partner',
        kind: 'Månedlig',
        summary: 'Vi følger strategien opp i kampanjer, innhold og kanaler, og måler om den virker.',
        includes: [
          'Månedlig strategimøte',
          'Oppfølging av merkevaren på tvers av kanaler',
          'Rapport på andel av søk og merkevaresøk',
          'Ingen bindingstid – 30 dagers oppsigelse',
        ],
      },
    ],
    process: [
      {
        period: '0–30 dager',
        title: 'Innsikt',
        text: 'Workshop, kundedata, konkurrenter og søkedata. Vi finner kjøpssituasjonene og hva som skiller deg ut.',
      },
      {
        period: '30–60 dager',
        title: 'Strategi',
        text: 'Posisjonering, merkevareelementer, fordeling mellom merkevare og aktivering, og en vekstplan.',
      },
      {
        period: '60–90 dager',
        title: 'Ut i kanalene',
        text: 'Strategien omsettes i kampanjer, innhold og nettbutikk – og vi starter målingen.',
      },
    ],
    kpis: [
      { name: 'Andel av søk', text: 'Din andel av merkenavnsøkene i kategorien, mot konkurrentene.' },
      { name: 'Merkevaresøk', text: 'Hvor mange som søker på navnet ditt, over tid.' },
      { name: 'Direktetrafikk', text: 'Besøk fra folk som skriver inn adressen eller kommer tilbake av seg selv.' },
      { name: 'Andel nye kunder', text: 'Om veksten kommer fra flere kjøpere, ikke bare de samme.' },
      { name: 'Synlighet i AI-svar', text: 'Om merkevaren nevnes når folk spør AI om produkter i kategorien.' },
    ],
    faq: [
      {
        question: 'Merkevare eller performance – hva bør vi satse på?',
        answer: 'Begge. Salgsaktivering gir salg nå, merkevarebygging gjør at det blir billigere å selge senere. Mindre og nye merkevarer trenger ofte mer aktivering i starten, men uten noe merkevarearbeid blir hver ny kunde dyrere å vinne.',
      },
      {
        question: 'Hvordan måler dere merkevare?',
        answer: 'Med tall som kan følges månedlig: andel av søk mot konkurrentene i Google Trends, merkevaresøk i Search Console, direktetrafikk, andel nye kunder og synlighet i AI-svar. Ved behov supplerer vi med en enkel kundeundersøkelse.',
      },
      {
        question: 'Er dette bare for store merkevarer?',
        answer: 'Nei. Små merkevarer har mest å vinne på å bli husket, fordi de ellers betaler full pris for hver kunde. Strategien tilpasses budsjettet – det viktigste er at den brukes konsekvent.',
      },
      {
        question: 'Hva er gjenkjennelige merkevareelementer?',
        answer: 'Det som får folk til å kjenne deg igjen uten å se navnet: farger, former, typografi, tone og faste formuleringer. Forskningen til Jenni Romaniuk viser at de må være både kjente og unike – og brukt likt over lang tid.',
      },
      {
        question: 'Hvorfor har merkevaren betydning for AI-søk?',
        answer: 'Fordi AI-tjenester gjengir det som sies om deg på nettet. Merkevarer som omtales ofte og søkes etter, nevnes oftere i AI-svar. Det gjør merkevarearbeid til en del av synligheten i søk, ikke noe ved siden av.',
      },
    ],
    sources: [
      { label: 'How Brands Grow og forskningen bak', publisher: 'Ehrenberg-Bass Institute for Marketing Science', href: 'https://marketingscience.info/' },
      { label: 'The Long and the Short of It (Binet & Field)', publisher: 'IPA', href: 'https://ipa.co.uk/knowledge/publications-reports/the-long-and-the-short-of-it-balancing-short-and-long-term-marketing-strategies' },
      { label: 'Effectiveness in Context', publisher: 'IPA', href: 'https://ipa.co.uk/knowledge/publications-reports/effectiveness-in-context' },
      { label: 'Share of Search (Les Binet, 2020)', publisher: 'IPA', href: 'https://ipa.co.uk/news/binet-presents-fast-cheap-predictive-share-of-search-metric/' },
      { label: 'AI Overview Brand Visibility Factors (75K Brands Studied)', publisher: 'Ahrefs, 2025 (oppdatert 2026)', href: 'https://ahrefs.com/blog/ai-overview-brand-correlation/' },
      { label: 'Google Trends – mål andel av søk selv', publisher: 'Google', href: 'https://trends.google.com/trends/' },
    ],
    related: [
      { slug: 'seo', why: 'Merkevaresignaler og synlighet i Google og AI-søk henger tett sammen.' },
      { slug: 'some', why: 'Sosiale medier er der merkevaren bygges bredt, også mot de som ikke leter ennå.' },
      { slug: 'sporing-og-analyse', why: 'Mål andel av søk, merkevaresøk og nye kunder, ikke bare siste klikk.' },
    ],
  },

  sem: {
    intro: {
      title: 'Hva er SEM?',
      paragraphs: [
        'SEM – search engine marketing – er betalt synlighet i søkemotorer. For en Shopify-butikk betyr det i praksis Google Ads og Microsoft Advertising (Bing): søkeannonser, Shopping-annonser med produktene dine og kampanjer som Performance Max som går på tvers av Google sine flater.',
        'Vi kjører SEM som én helhet med SEO, sporing og produktfeeden din. Målet er ikke flest mulig klikk, men mest mulig lønnsomt salg per krone du bruker.',
      ],
    },
    situations: [
      {
        title: 'Annonsekostnaden stiger, salget gjør det ikke',
        text: 'Du bruker mer enn før, men vet ikke hvilke kampanjer som faktisk tjener penger.',
      },
      {
        title: 'Du bruker for mye på ditt eget merkenavn',
        text: 'Merkevaresøk og gjenkjøp tar en stor del av budsjettet, og du har ikke kontroll på hva som faktisk gir nye kunder.',
      },
      {
        title: 'Du betaler for søk som aldri blir salg',
        text: 'Søkeordsrapporten er full av irrelevante treff, og ingen har ryddet med negative søkeord på lenge.',
      },
      {
        title: 'Performance Max er en svart boks',
        text: 'Du ser totalen, men ikke hva som skjer i Søk, Shopping og YouTube hver for seg.',
      },
      {
        title: 'Tallene i Google Ads og Shopify spriker',
        text: 'Sporing og samtykke er ikke satt opp riktig, så automatikken optimaliserer mot feil data.',
      },
      {
        title: 'Kampanjeperioden nærmer seg',
        text: 'Black Week eller sesongsalg kommer, og budsjett, budstrategi og feed må være klare i tide.',
      },
      {
        title: 'Du vil ha folk i kontoen, ikke flere møter',
        text: 'Du vil ha noen som jobber i kontoen din hver uke – ikke enda en statusrapport.',
      },
    ],
    deliverables: {
      strategi: [
        'Revisjon av konto, sporing og produktfeed',
        'Kanal- og budsjettplan for Google og Bing',
        'Søkeordsanalyse på tvers av betalt og organisk: hvor du allerede rangerer i SEO, og hvor betalt søk gir mest',
        'Skille mellom merkevaresøk og nye kunder, med tak på hva merkevaresøk får koste',
        'Måltall knyttet til margin, ikke bare omsetning',
      ],
      gjennomforing: [
        'Kampanjestruktur for Søk, Shopping og Performance Max',
        'Budstrategi (mål-ROAS / maks konverteringsverdi) og budsjettstyring',
        'Negative søkeordslister som bygges ut hver måned fra søkeordsrapporten',
        'Merkeutelukkelser og løpende søkeordsarbeid',
        'Annonsetekster og bildemateriell i samspill med merkevaren',
        'Microsoft Advertising som tillegg der det lønner seg',
      ],
      rapportering: [
        'Månedlig rapport på inntekt, lønnsomhet og nye kunder',
        'Gjennomgang av søkeordsrapporten og hva Googles automatikk faktisk gjør',
        'Fast møte med plan for neste periode',
      ],
      ikkeInkludert: [
        'Annonsebudsjett – det betaler du direkte til Google og Microsoft',
        'Produksjon av video og fotografering',
        'Annonsering i sosiale medier (se SoMe)',
      ],
    },
    packages: [
      {
        name: 'SEM-revisjon',
        kind: 'Engangsleveranse',
        summary: 'En grundig gjennomgang med konkret tiltaksliste du kan bruke selv eller med oss.',
        includes: [
          'Revisjon av Google Ads-konto og kampanjestruktur',
          'Sjekk av sporing, Consent Mode og konverteringer',
          'Feed-sjekk i Merchant Center',
          'Prioritert tiltaksliste og gjennomgang i møte',
        ],
      },
      {
        name: 'SEM løpende',
        kind: 'Månedlig',
        summary: 'Vi drifter og forbedrer kampanjene dine hver uke, med fast rapportering.',
        includes: [
          'Alt fra revisjonen, satt ut i livet',
          'Løpende drift av Google Ads og ved behov Bing',
          'Feedoptimalisering (titler, egendefinerte etiketter for margin og bestselgere) og budstrategi',
          'Månedlig rapport og statusmøte',
          'Ingen bindingstid – 30 dagers oppsigelse',
        ],
      },
    ],
    process: [
      {
        period: '0–30 dager',
        title: 'Rydd og mål',
        text: 'Revisjon, sporing på plass, feed i orden og en kampanjestruktur vi kan stole på. Vi trenger tilgang til Google Ads, Merchant Center, GA4 og Shopify.',
      },
      {
        period: '30–60 dager',
        title: 'Bygg og test',
        text: 'Ny struktur i drift, budstrategier stilt inn mot lønnsomhet og de første testene i gang.',
      },
      {
        period: '60–90 dager',
        title: 'Skaler det som virker',
        text: 'Mer budsjett til det som leverer, kutt i det som ikke gjør det, og plan for neste kvartal.',
      },
    ],
    kpis: [
      { name: 'ROAS og lønnsomhet', text: 'Inntekt per annonsekrone – og hva som er igjen etter varekost når marginene er med.' },
      { name: 'Kostnad per ny kunde', text: 'Hva det koster å vinne en kunde som ikke har handlet hos deg før.' },
      { name: 'Andel nye kunder', text: 'Hvor mye av salget som kommer fra nye kunder, ikke gjenkjøp og merkevaresøk.' },
      { name: 'Kostnad på merkevaresøk', text: 'Hvor stor del av budsjettet som går til ditt eget navn, og om det kan senkes.' },
      { name: 'Visningsandel', text: 'Hvor ofte du vises på søkene som betyr noe, og hva du taper på budsjett eller rangering.' },
      { name: 'Feed-helse', text: 'Andel godkjente produkter og feil i Merchant Center som stopper salg.' },
    ],
    faq: [
      {
        question: 'Hvor stort annonsebudsjett trenger jeg?',
        answer: 'Det avhenger av marginer, konkurranse og hvor mye etterspørsel som finnes. Vi anbefaler et budsjett etter revisjonen, når vi ser kontoen din – ikke før.',
      },
      {
        question: 'Bør jeg annonsere på Bing i tillegg til Google?',
        answer: 'Ofte, men ikke alltid. Bing er en liten del av søkene i Norge, men har gjerne lavere klikkpris og en annen målgruppe, særlig på desktop. Vi tester det som et tillegg når Google-kontoen er i orden.',
      },
      {
        question: 'Hvem eier kontoen og dataene?',
        answer: 'Du. Kontoene ligger hos deg, og vi jobber med tilgang du gir oss. Slutter du, beholder du alt.',
      },
      {
        question: 'Hvorfor ser dere på SEO når vi kjøper SEM?',
        answer: 'Fordi betalt og organisk søk konkurrerer om de samme klikkene. Rangerer du allerede godt organisk på et søkeord, kan det være bortkastet å by høyt på det – og omvendt viser søkeordsdata fra annonsene hvor det er verdt å satse på SEO. Vi ser på begge samtidig.',
      },
      {
        question: 'Hva gjør dere med negative søkeord?',
        answer: 'Vi går gjennom søkeordsrapporten jevnlig og bygger negative søkeordslister for søk som ikke fører til salg – på tvers av Søk, Shopping og Performance Max. Det er en av de raskeste måtene å kutte bortkastet budsjett på.',
      },
      {
        question: 'Hvorfor er sporing en del av SEM?',
        answer: 'Fordi Googles budstrategier lærer av konverteringsdataene dine. I EØS kreves Consent Mode v2 for at Google skal kunne bruke data til personlig tilpasning og modellering. Med feil eller manglende sporing optimaliserer automatikken mot feil mål.',
      },
      {
        question: 'Hvor raskt ser jeg resultater?',
        answer: 'Opprydding i struktur, feed og sporing gir ofte effekt i løpet av de første ukene. Nye budstrategier trenger noen uker med data før de kan vurderes rettferdig.',
      },
      {
        question: 'Har dere bindingstid?',
        answer: 'Nei. Løpende avtale kan sies opp med 30 dagers varsel.',
      },
    ],
    related: [
      { slug: 'affiliate', why: 'Produktfeeden er grunnmuren i Shopping og Performance Max – og den samme feeden går til CSS og affiliate.' },
      { slug: 'sporing-og-analyse', why: 'Riktig sporing og samtykke er det budstrategiene lærer av.' },
      { slug: 'seo', why: 'Betalt og organisk søk planlegges sammen, så du ikke betaler for klikk du allerede vinner.' },
    ],
  },

  'sem/google-ads': {
    intro: {
      title: 'Slik fungerer Google Ads for nettbutikker nå',
      paragraphs: [
        'Google Ads er mer automatisert enn noen gang: Performance Max, AI Max for Search og Smart Bidding tar mange av beslutningene som før ble tatt for hånd. Det gjør tre ting viktigere enn før – produktfeeden, sporingen og hvilke rammer du gir automatikken.',
        'Vi setter opp og driver Google Ads for Shopify-butikker med fokus på nettopp det: riktig data inn, tydelige mål og kontroll på hva Google gjør med pengene dine.',
      ],
    },
    situations: [
      {
        title: 'Produktene vises ikke i Shopping',
        text: 'Avviste varer i Merchant Center, manglende GTIN eller fraktinnstillinger som ikke stemmer med butikken.',
      },
      {
        title: 'Performance Max spiser budsjettet',
        text: 'Kampanjen bruker mye på merkevaresøk og gjenkjøp, og du ser ikke hva som skjer per kanal.',
      },
      {
        title: 'Ingen kontroll på søkeordene',
        text: 'Bredt samsvar og automatikk viser annonsene dine på søk du aldri ville valgt – og ingen negative søkeordslister holder det i sjakk.',
      },
      {
        title: 'Konverteringene stemmer ikke med Shopify',
        text: 'Dobbeltelling, manglende samtykkesignaler eller feil konverteringsverdi gjør at budstrategien styrer i blinde.',
      },
      {
        title: 'Du vet omsetningen, men ikke lønnsomheten',
        text: 'Høy ROAS på produkter med lav margin ser bra ut i rapporten, men gir lite igjen.',
      },
      {
        title: 'Kampanjene står stille',
        text: 'Kontoen ble satt opp for lenge siden og har ikke fulgt med på nye kampanjetyper og innstillinger.',
      },
    ],
    deliverables: {
      strategi: [
        'Kontorevisjon: struktur, budstrategier, søkeord og merkevareandel',
        'Søkeordsanalyse sammen med SEO, så betalt og organisk søk ikke konkurrerer om de samme klikkene',
        'Plan for Søk, Shopping, Performance Max og Demand Gen',
        'Mål på lønnsomhet og nye kunder, ikke bare ROAS',
      ],
      gjennomforing: [
        'Merchant Center og feed via Shopifys Google & YouTube-app – GTIN, titler, frakt, retur og bilder (minst 500 × 500 piksler)',
        'Egendefinerte etiketter i feeden for margin, bestselgere og sesong, så kampanjene kan styres etter lønnsomhet',
        'Google-tagg, forbedrede konverteringer og Consent Mode v2 koblet til Shopifys samtykke',
        'Varekost i feeden for rapportering på lønnsomhet',
        'Performance Max med merkeutelukkelser, negative søkeord og søketemaer',
        'Negative søkeordslister på kontonivå, oppdatert fra søkeordsrapporten hver måned',
        'Mål for nye kunder og kundelister der det gir mening',
        'AI Max for Search testet som eksperiment der det er tilgjengelig, med kontroll på merke og URL-er',
        'Vurdering av CSS-partner for Shopping-annonser',
      ],
      rapportering: [
        'Kanalrapport for Performance Max og innsikt i søkeord',
        'Liste over nye negative søkeord og hva de har spart',
        'Månedlig gjennomgang av hva automatikken har laget og vist',
        'Rapport på inntekt, lønnsomhet og nye kunder',
      ],
      ikkeInkludert: [
        'Annonsebudsjett til Google',
        'Videoproduksjon til YouTube',
        'Utvikling av egne feed-verktøy',
      ],
    },
    packages: [
      {
        name: 'Google Ads-revisjon',
        kind: 'Engangsleveranse',
        summary: 'Vi går gjennom konto, feed og sporing og gir deg en prioritert tiltaksliste.',
        includes: [
          'Kampanjestruktur, budstrategi og søkeord',
          'Merchant Center og produktfeed',
          'Konverteringssporing og Consent Mode v2',
          'Tiltaksliste og gjennomgang i møte',
        ],
      },
      {
        name: 'Google Ads løpende',
        kind: 'Månedlig',
        summary: 'Løpende drift og forbedring av Søk, Shopping og Performance Max.',
        includes: [
          'Ukentlig drift og optimalisering',
          'Feed-arbeid og kampanjeperioder (Black Week, salg)',
          'Månedlig rapport og statusmøte',
          'Ingen bindingstid – 30 dagers oppsigelse',
        ],
      },
    ],
    process: [
      {
        period: '0–30 dager',
        title: 'Data i orden',
        text: 'Feed, sporing og samtykke rettes opp, slik at Google lærer av riktige tall. Revisjonen gir oss planen.',
      },
      {
        period: '30–60 dager',
        title: 'Ny struktur',
        text: 'Merkevare og nye kunder skilles, Performance Max får rammer, og budstrategiene settes mot lønnsomhet.',
      },
      {
        period: '60–90 dager',
        title: 'Test og skaler',
        text: 'Eksperimenter med nye kampanjetyper og innstillinger, og mer budsjett til det som leverer.',
      },
    ],
    kpis: [
      { name: 'Konverteringsverdi og ROAS', text: 'Inntekt fra Google Ads per annonsekrone, målt mot Shopify.' },
      { name: 'Lønnsomhet', text: 'Bruttofortjeneste etter varekost når varekost ligger i feeden.' },
      { name: 'Nye kunder', text: 'Andel og kostnad per ny kunde, skilt fra gjenkjøp og merkevaresøk.' },
      { name: 'Shopping-dekning', text: 'Andel godkjente produkter og visningsandel i Shopping.' },
      { name: 'Søkeord og kanaler', text: 'Hvor Performance Max og AI Max faktisk vises, og hva det gir.' },
    ],
    faq: [
      {
        question: 'Performance Max eller vanlig Shopping?',
        answer: 'Det kommer an på kontoen. Performance Max gir rekkevidde på tvers av Google, mens vanlig Shopping gir mer kontroll. Mange butikker får best resultat med en kombinasjon, og vi tester heller enn å gjette.',
      },
      {
        question: 'Kan jeg styre søkeordene i Performance Max?',
        answer: 'Delvis. Du kan legge inn negative søkeord på kampanjenivå, utelukke merkenavn og gi søketemaer, og du får innsikt i hvilke søk kampanjen vises på. Vi bruker alt dette, og kombinerer med vanlige søkekampanjer der du trenger full kontroll.',
      },
      {
        question: 'Hva er en CSS, og trenger jeg det?',
        answer: 'I EØS, også Norge, plasseres Shopping-annonser gjennom en Comparison Shopping Service. Bruker du Googles egen, trekker Google en fast margin av budet ditt. Med en annen CSS-partner kan klikkprisen bli lavere. Vi vurderer om det lønner seg for deg og tester det på egne tall.',
      },
      {
        question: 'Bruker dere AI Max og automatiske anbefalinger?',
        answer: 'Ja, når det er testet og gir mer lønnsomt salg. Vi kjører nye funksjoner som eksperimenter med kontroll på merke og URL-er, og skrur av automatiske anbefalinger som endrer kontoen uten at vi har vurdert dem.',
      },
      {
        question: 'Fungerer det med Shopifys Google & YouTube-app?',
        answer: 'Ja. Appen sender produktdata til Merchant Center. Vi justerer innstillingene, for eksempel frakt, og legger på tilleggsdata der appen ikke strekker til.',
      },
      {
        question: 'Hva trenger dere fra oss for å starte?',
        answer: 'Tilgang til Google Ads, Merchant Center, Google Analytics 4 og Shopify, og en prat om marginer, sesonger og hvilke produkter som er viktigst.',
      },
    ],
    related: [
      { slug: 'affiliate', why: 'Feedoptimalisering og CSS – det som avgjør hvordan produktene dine vises i Shopping.' },
      { slug: 'sem/bing-ads', why: 'Importer kampanjene til Microsoft Advertising og nå søk Google ikke dekker.' },
      { slug: 'sporing-og-analyse', why: 'Konverteringer, verdier og samtykke som budstrategiene kan stole på.' },
    ],
  },

  affiliate: {
    intro: {
      title: 'Én feed, mange salgskanaler',
      paragraphs: [
        'Produktfeeden er listen over varene dine med pris, lager, bilder og egenskaper – og det er den Google Shopping, Performance Max, prissammenligningstjenester, affiliate-partnere og Meta bruker for å vise produktene dine. Er feeden svak, betaler du for det i alle kanalene samtidig.',
        'Vi optimaliserer feeden fra Shopify én gang og sender den ut dit den gir salg: Google Shopping via en CSS-partner, prissammenligning som Prisjakt, og affiliate-nettverk der partnere selger for deg mot provisjon.',
      ],
    },
    situations: [
      {
        title: 'Produktene blir avvist i Merchant Center',
        text: 'Manglende GTIN, feil frakt eller for små bilder gjør at varer ikke vises – og Google skjerper kravet til bildestørrelse.',
      },
      {
        title: 'Titlene er skrevet for butikken, ikke for søk',
        text: 'Produktnavnet i Shopify sier lite om merke, type og størrelse, så produktene matcher dårlig på det folk søker etter.',
      },
      {
        title: 'Du kan ikke styre etter margin',
        text: 'Alle produkter behandles likt i kampanjene, fordi feeden ikke sier noe om margin, bestselgere eller sesong.',
      },
      {
        title: 'Du er ikke der folk sammenligner priser',
        text: 'Kundene sjekker pris på sammenligningstjenester før de kjøper, men produktene dine er ikke med.',
      },
      {
        title: 'Du betaler full pris i Shopping',
        text: 'Shopping-annonsene går gjennom Googles egen CSS, og ingen har vurdert om en annen CSS-partner gir lavere klikkpris.',
      },
      {
        title: 'Affiliate gir lite – eller du vet ikke hva det gir',
        text: 'Partnerne har ikke gode produktdata, sporingen faller ut ved samtykke, eller kansellerte ordre gir likevel provisjon.',
      },
    ],
    deliverables: {
      strategi: [
        'Feed-revisjon: avvisninger, mangler og kvalitet per produkt',
        'Kanalplan: Google Shopping, CSS, prissammenligning, affiliate og Meta-katalog',
        'Vurdering av CSS-partner for Shopping-annonser i Norge',
        'Valg av affiliate-nettverk og provisjonsmodell',
      ],
      gjennomforing: [
        'Strukturerte produkttitler: merke, produkttype og viktigste egenskaper først',
        'GTIN, merke, produkttype og Google-kategori på plass',
        'Egendefinerte etiketter for margin, bestselgere, sesong og prisklasse',
        'Bilder som oppfyller Googles krav på minst 500 × 500 piksler – helst større',
        'Tilleggsfeeder og feed-regler for det Shopify-appen ikke dekker',
        'Feed til prissammenligning og affiliate-partnere, med samme priser som i butikken',
        'Affiliate-sporing i Shopify satt opp med samtykke, og kansellerte ordre trukket fra',
      ],
      rapportering: [
        'Feed-helse: godkjente produkter, avvisninger og advarsler',
        'Salg og kostnad per kanal og per etikett',
        'Provisjon og ordre fra affiliate-partnere, mot bekreftede ordre i Shopify',
      ],
      ikkeInkludert: [
        'Klikkostnader og provisjon til kanalene – det betaler du direkte',
        'Produktfotografering',
        'Rekruttering av enkeltinfluensere',
      ],
    },
    packages: [
      {
        name: 'Feed-revisjon',
        kind: 'Engangsleveranse',
        summary: 'Vi går gjennom produktfeeden og gir deg en prioritert liste over det som stopper salg.',
        includes: [
          'Avvisninger og advarsler i Merchant Center',
          'Titler, attributter og bilder',
          'Forslag til etiketter for margin og bestselgere',
          'Vurdering av CSS og prissammenligning',
        ],
      },
      {
        name: 'Feed og affiliate løpende',
        kind: 'Månedlig',
        summary: 'Løpende feedoptimalisering og drift av prissammenligning og affiliate.',
        includes: [
          'Feed-optimalisering og overvåking av avvisninger',
          'Distribusjon til CSS, prissammenligning og affiliate',
          'Oppfølging av affiliate-partnere og provisjon',
          'Månedlig rapport per kanal',
          'Ingen bindingstid – 30 dagers oppsigelse',
        ],
      },
    ],
    process: [
      {
        period: '0–30 dager',
        title: 'Feeden i orden',
        text: 'Revisjon, avvisninger rettet, titler og attributter strukturert, og etiketter for margin og bestselgere lagt inn.',
      },
      {
        period: '30–60 dager',
        title: 'Ut i kanalene',
        text: 'CSS-partner vurdert og koblet på, produktene ut til prissammenligning, og affiliate-nettverk satt opp med sporing.',
      },
      {
        period: '60–90 dager',
        title: 'Mer fra det som selger',
        text: 'Vi ser på salg per kanal og etikett, og flytter innsats dit marginen og volumet er best.',
      },
    ],
    kpis: [
      { name: 'Godkjente produkter', text: 'Andel av sortimentet som faktisk kan vises i Shopping og hos partnerne.' },
      { name: 'Klikkpris i Shopping', text: 'Utviklingen i klikkpris før og etter bytte av CSS, målt på dine egne tall.' },
      { name: 'Salg per kanal', text: 'Omsetning og kostnad fra Shopping, prissammenligning og affiliate hver for seg.' },
      { name: 'Lønnsomhet per etikett', text: 'Hvordan høy- og lavmarginprodukter presterer, så budsjettet går dit det tjener mest.' },
      { name: 'Affiliate-kvalitet', text: 'Andel ordre fra partnere som faktisk blir stående, og provisjon per bekreftet ordre.' },
    ],
    faq: [
      {
        question: 'Hva er feedoptimalisering?',
        answer: 'Å gjøre produktdataene dine så komplette og presise som mulig – titler, attributter, bilder, priser og etiketter – slik at Google og andre kanaler viser riktige produkter til riktige søk, og slik at du kan styre kampanjene etter margin.',
      },
      {
        question: 'Holder det med Shopifys Google & YouTube-app?',
        answer: 'Den er et godt utgangspunkt og sender produktene til Merchant Center. Men den gir begrenset kontroll over titler og etiketter, så vi legger ofte på tilleggsfeeder, feed-regler eller et feed-verktøy der det trengs.',
      },
      {
        question: 'Hva er en CSS?',
        answer: 'En Comparison Shopping Service plasserer Shopping-annonsene dine hos Google. I EØS, også Norge, må alle Shopping-annonser gå gjennom en CSS. Googles egen trekker en fast margin av budet, mens andre CSS-partnere kan gi lavere klikkpris. Vi måler effekten på dine egne tall i stedet for å love en prosent.',
      },
      {
        question: 'Hvilke affiliate-nettverk bruker dere?',
        answer: 'Det avhenger av bransje og hvilke partnere du vil nå. Flere nettverk som er aktive i Norge, for eksempel Adtraction og Awin, har egne Shopify-apper for sporing. Vi hjelper deg å velge, sette opp og følge opp.',
      },
      {
        question: 'Hva må vi passe på juridisk?',
        answer: 'Priser i feeden og hos partnere må stemme med butikken, og førpriser må følge regelen om laveste pris de siste 30 dagene. Partnere som markedsfører deg, må merke innholdet tydelig som reklame. Vi bygger dette inn i oppsettet, men det juridiske ansvaret ligger hos deg som annonsør.',
      },
      {
        question: 'Brukes feeden også i Meta?',
        answer: 'Ja. Shopifys Facebook- og Instagram-kanal synkroniserer en produktkatalog til Meta, som brukes i katalogannonser. Vi sørger for at det bare er én katalog, og at den holder samme kvalitet som feeden til Google.',
      },
    ],
    related: [
      { slug: 'sem/google-ads', why: 'Shopping og Performance Max bygger direkte på produktfeeden.' },
      { slug: 'some/meta-ads', why: 'Katalogannonser i Facebook og Instagram bruker den samme produktdataen.' },
      { slug: 'sporing-og-analyse', why: 'Sporing og samtykke som gjør at både Google og affiliate-partnere måler riktig.' },
    ],
  },
}

export function findGrowthContent(slug: string): GrowthPageContent | undefined {
  return growthContent[slug]
}
