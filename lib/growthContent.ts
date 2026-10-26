/**
 * Written copy for the Growth marketing pages, keyed by service slug
 * (lib/growthServices.ts). Pages follow the Tjenester layout: hero, facts,
 * why, buying situations, deliverables, the first 90 days, FAQ and onward
 * links. A page without an entry here renders the template brief instead.
 *
 * Kept apart from growthServices.ts because that file also feeds the header
 * menu; this one is only loaded by the pages.
 *
 * Rules (docs/GROWTH-MARKETING.md §4): no invented prices, clients or numbers,
 * and keep each page to what matters most: one point of evidence, four
 * situations, six deliverables, three steps, three KPIs and four questions.
 */

/** Chart specs rendered by components/sections/growth/GrowthCharts.tsx. */
export type GrowthChart =
  | {
      kind: 'bars'
      /** Unit shown in the table header, e.g. "Korrelasjon". */
      valueLabel: string
      /** First column header in the table view. Defaults to "Faktor". */
      categoryLabel?: string
      /** "decimal" (0,664) or "percent" (82 %). Defaults to decimal. */
      format?: 'decimal' | 'percent'
      /** Leave out for a single series (all items emphasis): the title names it. */
      legend?: { emphasis: string; context: string }
      items: { label: string; value: number; emphasis: boolean }[]
    }
  | {
      kind: 'split'
      items: { label: string; value: number; emphasis: boolean }[]
    }
  | { kind: 'longShortConcept' }

/** One research point, optionally with a chart, always with its source. */
export interface GrowthInsight {
  title: string
  text: string
  chart?: GrowthChart
  source: { label: string; href: string }
}

/** Source → processing → destination diagram. */
export interface GrowthFlow {
  title: string
  stages: { title: string; items: string[] }[]
}

export interface GrowthPageContent {
  /** Part of the H1 rendered in brand cyan. */
  highlight?: string
  /** Three short proof points under the hero buttons. */
  highlights?: string[]
  /** "Kort fortalt": four facts. */
  facts?: { label: string; value: string; note?: string }[]
  /** Why the service matters, with at most one insight or one flow beside it. */
  why?: { title: string; paragraphs: string[]; insight?: GrowthInsight; flow?: GrowthFlow }
  /** "Når du trenger dette": four situations the reader recognises. */
  situations?: { title: string; text: string }[]
  /** "Leveranser": about six, in the order they happen. */
  deliverables?: { name: string; text: string }[]
  notIncluded?: string[]
  /** "De første 90 dagene": three steps. */
  process?: { period: string; title: string; text: string }[]
  /** What we steer by: three KPIs. */
  kpis?: { name: string; text: string }[]
  faq?: { question: string; answer: string }[]
  /** "Les videre": other growth services, by slug. Channel pages are added automatically. */
  related?: { slug: string; why: string }[]
}

export const growthContent: Record<string, GrowthPageContent> = {
  'merkevare-og-strategi': {
    highlight: 'vekststrategi',
    highlights: ['Posisjonering', 'Vekstplan for 12 måneder', 'Målt med andel av søk'],
    facts: [
      { label: 'Starter med', value: 'Workshop', note: 'innsikt om kunder og konkurrenter' },
      { label: 'Leveranse', value: 'Strategi', note: 'og vekstplan, som engangsleveranse' },
      { label: 'Videre', value: 'Partner', note: 'månedlig oppfølging i kanalene' },
      { label: 'Vi måler', value: 'Andel av søk', note: 'mot konkurrentene, hver måned' },
    ],
    why: {
      title: 'Vekst kommer fra flere kjøpere',
      paragraphs: [
        'Forskningen bak How Brands Grow viser at merkevarer vokser ved å nå flere kjøpere, ikke ved å presse mer ut av de lojale. For en nettbutikk betyr det to ting: å bli husket når folk skal handle, og å være lett å finne og kjøpe hos når de gjør det.',
        'Merkevarearbeidet tar seg av det første. Søk, feed og konvertering tar seg av det andre. Vi planlegger dem sammen.',
      ],
      insight: {
        title: 'Merkevare og salg virker på ulik tid',
        text: 'Salgsaktivering gir raske topper som faller tilbake. Merkevarebygging løfter grunnsalget gradvis, og gjør at hver annonsekrone gir mer over tid.',
        chart: { kind: 'longShortConcept' },
        source: {
          label: 'IPA: The Long and the Short of It (Binet & Field)',
          href: 'https://ipa.co.uk/knowledge/publications-reports/the-long-and-the-short-of-it-balancing-short-and-long-term-marketing-strategies',
        },
      },
    },
    situations: [
      { title: 'Du konkurrerer bare på pris', text: 'Kundene ser ingen grunn til å velge deg fremfor neste butikk, så rabatten blir det eneste argumentet.' },
      { title: 'Annonsene blir dyrere, men få søker på navnet ditt', text: 'Du betaler for hver eneste kunde, fordi få kjenner merkevaren fra før.' },
      { title: 'Du er usynlig i AI-svar', text: 'ChatGPT og Googles AI-oversikter nevner konkurrentene når folk spør om produkter i kategorien din.' },
      { title: 'Kampanjene virker, men veksten flater ut', text: 'Hvert salg gir en topp, men grunnsalget mellom kampanjene står stille.' },
    ],
    deliverables: [
      { name: 'Posisjonering', text: 'Hvorfor kundene skal velge deg, sagt så kort at det huskes.' },
      { name: 'Kjøpssituasjoner', text: 'Når og hvorfor folk handler i kategorien din, og hvor du må være synlig da.' },
      { name: 'Merkevareelementer', text: 'Farger, form, tone og budskap som skal eies og brukes likt i alle kanaler over tid.' },
      { name: 'Fordeling mellom merkevare og salg', text: 'Hvor mye som skal skape etterspørsel og hvor mye som skal fange den, ut fra fasen du er i.' },
      { name: 'Vekstplan', text: 'Prioriterte tiltak for de neste 12 månedene, på tvers av kanalene.' },
      { name: 'Måling og oppfølging', text: 'Andel av søk, merkevaresøk og nye kunder, fulgt opp hver måned.' },
    ],
    notIncluded: ['Logodesign og full visuell identitet', 'Film- og fotoproduksjon', 'Medieinnkjøp'],
    process: [
      { period: '0–30 dager', title: 'Innsikt', text: 'Workshop, kundedata, konkurrenter og søkedata. Vi finner kjøpssituasjonene og det som skiller deg ut.' },
      { period: '30–60 dager', title: 'Strategi', text: 'Posisjonering, merkevareelementer, fordeling mellom merkevare og salg, og en vekstplan.' },
      { period: '60–90 dager', title: 'Ut i kanalene', text: 'Strategien tas i bruk i kampanjer, innhold og nettbutikk, og målingen starter.' },
    ],
    kpis: [
      { name: 'Andel av søk', text: 'Din andel av merkenavnsøkene i kategorien, en tidlig indikator på markedsandel.' },
      { name: 'Merkevaresøk', text: 'Hvor mange som søker på navnet ditt, over tid.' },
      { name: 'Andel nye kunder', text: 'Om veksten kommer fra flere kjøpere, ikke bare de samme.' },
    ],
    faq: [
      {
        question: 'Merkevare eller performance – hva bør vi satse på?',
        answer: 'Begge. Salgsaktivering gir salg nå, merkevarebygging gjør det billigere å selge senere. Mindre og nye merkevarer trenger ofte mer aktivering i starten, men uten merkevarearbeid blir hver ny kunde dyrere å vinne.',
      },
      {
        question: 'Hvordan måler dere merkevare?',
        answer: 'Med tall som kan følges hver måned: andel av søk mot konkurrentene i Google Trends, merkevaresøk i Search Console, andel nye kunder og synlighet i AI-svar.',
      },
      {
        question: 'Hvorfor betyr merkevaren noe for AI-søk?',
        answer: 'AI-tjenester gjengir det som sies om deg på nettet. En analyse av 75 000 merkevarer fra Ahrefs fant at omtale av merkevaren og søk på navnet henger sterkere sammen med synlighet i Googles AI-oversikter enn lenker gjør. Det er sammenheng, ikke bevist årsak, men retningen er tydelig.',
      },
      {
        question: 'Er dette bare for store merkevarer?',
        answer: 'Nei. Små merkevarer har mest å vinne på å bli husket, fordi de ellers betaler full pris for hver kunde. Strategien tilpasses budsjettet. Det viktigste er at den brukes konsekvent.',
      },
    ],
    related: [
      { slug: 'some', why: 'Der merkevaren bygges bredt, også mot dem som ikke leter ennå.' },
      { slug: 'seo', why: 'Merkevaresignaler og synlighet i Google og AI-søk henger tett sammen.' },
    ],
  },

  some: {
    highlight: 'sosiale medier',
    highlights: ['Meta og TikTok', 'Nye kreativer hver måned', 'Målt på nye kunder'],
    facts: [
      { label: 'Kanaler', value: 'Meta · TikTok', note: 'og andre der kundene dine er' },
      { label: 'Starter med', value: 'Revisjon', note: 'og kreativ plan' },
      { label: 'Videre', value: 'Løpende drift', note: 'med nye kreativer hver måned' },
      { label: 'Vi måler', value: 'Nye kunder', note: 'ikke bare siste klikk' },
    ],
    why: {
      title: 'Sosiale medier skaper etterspørsel',
      paragraphs: [
        'Søk fanger etterspørsel som allerede finnes. I sosiale medier når du folk før de begynner å lete, slik at det er deg de kommer på når behovet melder seg.',
        'Algoritmene til Meta og TikTok velger selv hvem som ser hvilken annonse, ut fra kreativene du gir dem. Gode og varierte kreativer er derfor den viktigste målrettingen du har.',
      ],
      insight: {
        title: 'Kreativet er målrettingen',
        text: 'Metas annonsesystem Andromeda snevrer titalls millioner annonser inn til noen tusen kandidater for hver person. Meta skriver at flere og mer varierte kreativer gir systemet mer å matche mot. Derfor jobber vi med bred målretting og mange kreativer.',
        source: {
          label: 'Meta Engineering: Meta Andromeda (2024)',
          href: 'https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/',
        },
      },
    },
    situations: [
      { title: 'Kampanjene lever på retargeting', text: 'Det meste av budsjettet går til folk som allerede har besøkt butikken, og publikummet krymper hver måned.' },
      { title: 'Annonsene ser like ut og slites fort', text: 'Noen få kreativer går lenge, resultatene faller, og ingen har en plan for nye.' },
      { title: 'Ingen kjenner merkevaren utenfor kundebasen', text: 'Nye kunder kommer bare når dere setter ned prisen.' },
      { title: 'ROAS ser bra ut, men veksten uteblir', text: 'Rapportene gir æren til siste klikk, mens det som skaper nye kunder, ikke blir målt.' },
    ],
    deliverables: [
      { name: 'Kanalplan', text: 'Meta, TikTok og andre kanaler der kundene dine er, med fordeling mellom rekkevidde og salg.' },
      { name: 'Kreativ plattform', text: 'Faste merkevareelementer og budskap som går igjen, så annonsene kjennes igjen.' },
      { name: 'Mange kreative varianter', text: 'Video i 9:16, UGC-stil, bilder og karuseller, byttet ut før de slites ut.' },
      { name: 'Kampanjer for rekkevidde og salg', text: 'Egne kampanjer for å nå nye kunder, ved siden av salgskampanjer med bred målretting og produktkatalog.' },
      { name: 'Organisk innhold og skapere', text: 'Innholdsplan med rød tråd, og samarbeid med skapere med riktig reklamemerking.' },
      { name: 'Kreativrapport', text: 'Hva som virker og hvorfor, med nye kunder og merkevaresøk over tid.' },
    ],
    notIncluded: ['Annonsebudsjett, som du betaler direkte til plattformene', 'Større film- og fotoproduksjoner', 'Honorarer til influensere og skapere'],
    process: [
      { period: '0–30 dager', title: 'Innsikt og kreativ plattform', text: 'Revisjon av kontoer og kreativer, målgrupper og kjøpssituasjoner, og faste merkevareelementer.' },
      { period: '30–60 dager', title: 'Lansering og testing', text: 'Nye kampanjer for rekkevidde og salg, med mange kreative varianter som testes mot hverandre.' },
      { period: '60–90 dager', title: 'Skaler det som virker', text: 'Mer budsjett til kreativene som gir nye kunder, og en fast rytme for nye kreativer.' },
    ],
    kpis: [
      { name: 'Kostnad per ny kunde', text: 'Hva det koster å vinne kunder som ikke har handlet før.' },
      { name: 'Inkrementell effekt', text: 'Salg som ikke ville kommet uten annonsene, målt med løftstester der det går.' },
      { name: 'Merkevaresøk', text: 'Om flere søker på navnet ditt, et tegn på at etterspørselen vokser.' },
    ],
    faq: [
      {
        question: 'Hvorfor fokus på merkevare når vi vil selge?',
        answer: 'Salgskampanjer treffer bare dem som allerede vurderer å kjøpe. Merkevarebygging gjør at flere kommer på deg når behovet oppstår, og at salgskampanjene, søket og e-posten din fungerer bedre. Vi kjører begge, med hver sin jobb.',
      },
      {
        question: 'Hvor mange kreativer trenger vi?',
        answer: 'Det finnes ikke et magisk tall, og Meta oppgir ikke ett. Det viktige er variasjon i konsepter, formater og vinkler, og at kreativene byttes ut før de slites ut. Vi lager en fast rytme som passer budsjettet ditt.',
      },
      {
        question: 'Hvordan måler dere effekten?',
        answer: 'Siste klikk undervurderer sosiale medier, fordi mange ser annonsen og kjøper senere via søk. Vi følger nye kunder og merkevaresøk, og bruker konverteringsløftstester i Meta der det er mulig.',
      },
      {
        question: 'Hva må vi passe på med influensere?',
        answer: 'Reklame skal være tydelig merket, og merkingen bør komme først. Forbrukertilsynet mener plattformenes egen merking ikke er tydelig nok, og anbefaler å legge til «reklame» eller «annonse». Det bygger vi inn i alle samarbeid.',
      },
    ],
    related: [{ slug: 'merkevare-og-strategi', why: 'Posisjonering og merkevareelementer gir kreativene en rød tråd.' }],
  },

  'sporing-og-analyse': {
    highlight: 'Sporing og analyse',
    highlights: ['Server-side med Tracklution', 'GA4 og BigQuery', 'Egne dashboards'],
    facts: [
      { label: 'Standard', value: 'Tracklution', note: 'server-side sporing' },
      { label: 'Starter med', value: 'Revisjon', note: 'piksler, tagger og samtykke' },
      { label: 'Analyse', value: 'GA4 · BigQuery', note: 'data du eier selv' },
      { label: 'Vi måler', value: 'Sporede ordre', note: 'mot ordrene i nettbutikken' },
    ],
    why: {
      title: 'Alt annet lærer av disse dataene',
      paragraphs: [
        'Sporing som bare kjører i nettleseren mister data. Annonseblokkere stopper skript, og Safari begrenser informasjonskapsler satt med JavaScript til sju dager. Da ser Meta, Google og GA4 færre kjøp enn nettbutikken, og budstrategiene lærer av et ufullstendig bilde.',
        'Med server-side sporing sendes hendelsene også fra en server. Samtykke er fortsatt et krav: det endrer hvordan data sendes, ikke hvem som har sagt ja.',
      ],
      flow: {
        title: 'Server-side sporing med Tracklution',
        stages: [
          { title: 'Nettbutikken', items: ['Hendelser og ordre', 'Samtykke fra banneret'] },
          { title: 'Tracklution', items: ['Eget førstepartsdomene', 'Datasenter i Stockholm (AWS)'] },
          { title: 'Plattformer', items: ['Meta (Conversions API)', 'Google Ads og GA4', 'TikTok, Klaviyo m.fl.'] },
        ],
      },
    },
    situations: [
      { title: 'Tallene i nettbutikken, GA4 og annonsene spriker', text: 'Ingen kilder er enige om hvor mange ordre markedsføringen ga, og du vet ikke hvilken du skal stole på.' },
      { title: 'Meta og Google ser for få kjøp', text: 'Kampanjene optimaliserer på for lite data, og budstrategiene treffer dårligere.' },
      { title: 'Samtykket er ikke koblet riktig', text: 'Banneret er på plass, men pikslene følger ikke valgene. Enten mister du data, eller du sporer uten gyldig samtykke.' },
      { title: 'Dataene ligger i ti forskjellige verktøy', text: 'Rapportene lages for hånd, og ingen har en samlet oversikt over kanaler og lønnsomhet.' },
    ],
    deliverables: [
      { name: 'Sporingsrevisjon og måleplan', text: 'Piksler, tagger, dobbelttelling og samtykke, og en plan for hvilke hendelser og måltall som skal spores.' },
      { name: 'Server-side med Tracklution', text: 'Eget førstepartsdomene, i Shopify via kundehendelser og en ordre-webhook. Server-side Google Tag Manager når det passer bedre.' },
      { name: 'Plattformene koblet på', text: 'Metas Conversions API, Googles forbedrede konverteringer, GA4 og øvrige annonseplattformer.' },
      { name: 'Samtykke', text: 'Consent Mode v2 koblet til samtykkebanneret, så valgene til den besøkende følges.' },
      { name: 'BigQuery og dashboards', text: 'Data fra nettbutikken, GA4 og annonseplattformene samlet, med dashboards for omsetning, kanaler og lønnsomhet.' },
      { name: 'Kontroll av datakvalitet', text: 'Månedlig sjekk av avvik mot nettbutikken og av hendelsesmatchkvaliteten i Meta.' },
    ],
    notIncluded: ['Lisens til Tracklution og kostnader i Google Cloud, som du betaler direkte', 'Juridisk rådgivning om personvern'],
    process: [
      { period: '0–30 dager', title: 'Revisjon og plan', text: 'Vi kartlegger sporing og samtykke, finner avvikene og lager en måleplan.' },
      { period: '30–60 dager', title: 'Server-side på plass', text: 'Tracklution settes opp, plattformene kobles på, og tallene kontrolleres mot ordrene i nettbutikken.' },
      { period: '60–90 dager', title: 'Analyse og dashboards', text: 'Data samles i BigQuery, og dashboardene bygges rundt måltallene dere styrer etter.' },
    ],
    kpis: [
      { name: 'Andel sporede ordre', text: 'Hvor mange av ordrene i nettbutikken som også registreres i plattformene og GA4.' },
      { name: 'Hendelsesmatchkvalitet', text: 'Metas mål på hvor godt hendelsene kan kobles til riktige personer.' },
      { name: 'Avvik mot nettbutikken', text: 'Forskjellen mellom ordre og omsetning i nettbutikken og i plattformene, over tid.' },
    ],
    faq: [
      {
        question: 'Hva er server-side sporing?',
        answer: 'At hendelser som kjøp sendes fra en server direkte til for eksempel Meta og Google, i tillegg til fra nettleseren. Det gjør sporingen mindre sårbar for annonseblokkere og nettleserbegrensninger, og gir plattformene bedre data å optimalisere på.',
      },
      {
        question: 'Trenger vi fortsatt samtykke?',
        answer: 'Ja. Etter ekomloven § 3-15 krever lagring og lesing av informasjon på brukerens enhet samtykke, med unntak for det som er strengt nødvendig. Vi kobler sporingen til samtykkebanneret og Consent Mode v2.',
      },
      {
        question: 'Hvorfor Tracklution?',
        answer: 'Tracklution er en ferdig server-side løsning med koblinger til de vanligste annonse- og analyseplattformene, oppsett for blant annet Shopify, WooCommerce og Magento, og datasenter i Stockholm. Du slipper å drifte egne servere.',
      },
      {
        question: 'Hva koster BigQuery?',
        answer: 'Google tar ikke betalt for selve eksporten fra GA4, men lagring og spørringer koster etter bruk. Vi estimerer kostnaden før oppstart, så du vet hva du går til.',
      },
    ],
    related: [
      { slug: 'sem/google-ads', why: 'Budstrategiene i Google Ads lærer av konverteringene sporingen sender.' },
      { slug: 'some/meta-ads', why: 'Conversions API og god hendelsesmatch er grunnlaget for Meta-kampanjene.' },
    ],
  },

  sem: {
    highlight: 'Betalt søk',
    highlights: ['Google og Bing', 'Søk, Shopping og Performance Max', 'Styrt mot lønnsomhet'],
    facts: [
      { label: 'Kanaler', value: 'Google · Bing', note: 'Bing som tillegg der det lønner seg' },
      { label: 'Starter med', value: 'Revisjon', note: 'konto, sporing og feed' },
      { label: 'Videre', value: 'Løpende drift', note: 'arbeid i kontoen hver uke' },
      { label: 'Vi måler', value: 'Lønnsomhet', note: 'og kostnad per ny kunde' },
    ],
    why: {
      title: 'Lønnsomt salg, ikke flest klikk',
      paragraphs: [
        'SEM er betalt synlighet i søkemotorer: søkeannonser, Shopping-annonser med produktene dine og Performance Max på tvers av Googles flater.',
        'Vi kjører det sammen med SEO, sporing og produktfeeden. Betalt og organisk søk konkurrerer om de samme klikkene, og budstrategiene er bare så gode som dataene de lærer av.',
      ],
    },
    situations: [
      { title: 'Annonsekostnaden stiger, salget gjør det ikke', text: 'Du bruker mer enn før, men vet ikke hvilke kampanjer som faktisk tjener penger.' },
      { title: 'Du bruker for mye på ditt eget merkenavn', text: 'Merkevaresøk og gjenkjøp tar en stor del av budsjettet, og du ser ikke hva som gir nye kunder.' },
      { title: 'Du betaler for søk som aldri blir salg', text: 'Søkeordsrapporten er full av irrelevante treff, og ingen har ryddet med negative søkeord på lenge.' },
      { title: 'Performance Max er en svart boks', text: 'Du ser totalen, men ikke hva som skjer i Søk, Shopping og YouTube hver for seg.' },
    ],
    deliverables: [
      { name: 'Revisjon', text: 'Konto, sporing og produktfeed, med en prioritert tiltaksliste.' },
      { name: 'Søkeordsanalyse sammen med SEO', text: 'Hvor du allerede rangerer organisk, og hvor betalt søk gir mest.' },
      { name: 'Kontroll på merkevaresøk', text: 'Merkevaresøk skilt fra nye kunder, med et tak på hva ditt eget navn får koste.' },
      { name: 'Kampanjestruktur og budstrategi', text: 'Søk, Shopping og Performance Max, med budstrategi mot lønnsomhet.' },
      { name: 'Negative søkeordslister', text: 'Bygget ut hver måned fra søkeordsrapporten, på tvers av kampanjetypene.' },
      { name: 'Månedlig rapport og møte', text: 'Inntekt, lønnsomhet og nye kunder, med plan for neste periode.' },
    ],
    notIncluded: ['Annonsebudsjett, som du betaler direkte til Google og Microsoft', 'Produksjon av video og foto', 'Annonsering i sosiale medier'],
    process: [
      { period: '0–30 dager', title: 'Rydd og mål', text: 'Revisjon, sporing på plass, feed i orden og en kampanjestruktur vi kan stole på.' },
      { period: '30–60 dager', title: 'Bygg og test', text: 'Ny struktur i drift, budstrategier stilt inn mot lønnsomhet og de første testene i gang.' },
      { period: '60–90 dager', title: 'Skaler det som virker', text: 'Mer budsjett til det som leverer, kutt i det som ikke gjør det, og plan for neste kvartal.' },
    ],
    kpis: [
      { name: 'Lønnsomhet', text: 'Inntekt per annonsekrone, og hva som er igjen etter varekost.' },
      { name: 'Kostnad per ny kunde', text: 'Hva det koster å vinne en kunde som ikke har handlet hos deg før.' },
      { name: 'Kostnad på merkevaresøk', text: 'Hvor stor del av budsjettet som går til ditt eget navn, og om det kan senkes.' },
    ],
    faq: [
      {
        question: 'Hvor stort annonsebudsjett trenger jeg?',
        answer: 'Det avhenger av marginer, konkurranse og hvor mye etterspørsel som finnes. Vi anbefaler et budsjett etter revisjonen, når vi har sett kontoen din.',
      },
      {
        question: 'Hvorfor ser dere på SEO når vi kjøper SEM?',
        answer: 'Fordi betalt og organisk søk konkurrerer om de samme klikkene. Rangerer du allerede godt organisk på et søkeord, kan det være bortkastet å by høyt på det. Omvendt viser søkeordsdata fra annonsene hvor det er verdt å satse på SEO.',
      },
      {
        question: 'Bør jeg annonsere på Bing i tillegg til Google?',
        answer: 'Ofte, men ikke alltid. Bing er en liten del av søkene i Norge, men har gjerne lavere klikkpris og en annen målgruppe, særlig på desktop. Vi tester det som et tillegg når Google-kontoen er i orden.',
      },
      {
        question: 'Hvem eier kontoen og dataene?',
        answer: 'Du. Kontoene ligger hos deg, og vi jobber med tilgangen du gir oss. Slutter du, beholder du alt.',
      },
    ],
    related: [{ slug: 'affiliate', why: 'Produktfeeden er grunnmuren i Shopping og Performance Max.' }],
  },

  'sem/google-ads': {
    highlight: 'Google Ads',
    highlights: ['Søk, Shopping og Performance Max', 'Feed og sporing i orden', 'Kontroll på automatikken'],
    facts: [
      { label: 'Kampanjer', value: 'Søk · Shopping', note: 'og Performance Max' },
      { label: 'Starter med', value: 'Revisjon', note: 'konto, feed og sporing' },
      { label: 'Feed', value: 'Merchant Center', note: 'med etiketter for margin' },
      { label: 'Vi måler', value: 'Lønnsomhet', note: 'og nye kunder' },
    ],
    why: {
      title: 'Automatikken er bare så god som dataene',
      paragraphs: [
        'Performance Max, AI Max for Search og Smart Bidding tar mange av beslutningene som før ble tatt for hånd. Det gjør tre ting viktigere enn før: produktfeeden, sporingen og rammene du gir automatikken.',
        'Det er der vi starter. Riktig data inn, tydelige mål og kontroll på hva Google gjør med pengene dine.',
      ],
    },
    situations: [
      { title: 'Produktene vises ikke i Shopping', text: 'Avviste varer i Merchant Center, manglende GTIN eller fraktinnstillinger som ikke stemmer med butikken.' },
      { title: 'Performance Max spiser budsjettet', text: 'Kampanjen bruker mye på merkevaresøk og gjenkjøp, og du ser ikke hva som skjer per kanal.' },
      { title: 'Ingen kontroll på søkeordene', text: 'Annonsene vises på søk du aldri ville valgt, og ingen negative søkeordslister holder det i sjakk.' },
      { title: 'Konverteringene stemmer ikke med nettbutikken', text: 'Dobbelttelling, manglende samtykkesignaler eller feil verdier gjør at budstrategien styrer i blinde.' },
    ],
    deliverables: [
      { name: 'Merchant Center og feed', text: 'GTIN, titler, frakt og bilder i orden, og egendefinerte etiketter for margin, bestselgere og sesong.' },
      { name: 'Sporing og samtykke', text: 'Google-tagg, forbedrede konverteringer og Consent Mode v2 koblet til samtykkebanneret.' },
      { name: 'Performance Max med rammer', text: 'Merkeutelukkelser, negative søkeord og søketemaer.' },
      { name: 'Negative søkeordslister', text: 'På kontonivå, oppdatert fra søkeordsrapporten hver måned.' },
      { name: 'Styring mot lønnsomhet', text: 'Mål for nye kunder og varekost i feeden, så budstrategien styrer mot det som tjener penger.' },
      { name: 'Tester av nye funksjoner', text: 'AI Max for Search og andre nyheter testet som eksperimenter, der det er tilgjengelig.' },
    ],
    notIncluded: ['Annonsebudsjett til Google', 'Videoproduksjon til YouTube'],
    process: [
      { period: '0–30 dager', title: 'Data i orden', text: 'Feed, sporing og samtykke rettes opp, slik at Google lærer av riktige tall.' },
      { period: '30–60 dager', title: 'Ny struktur', text: 'Merkevare og nye kunder skilles, Performance Max får rammer, og budstrategiene settes mot lønnsomhet.' },
      { period: '60–90 dager', title: 'Test og skaler', text: 'Eksperimenter med nye kampanjetyper, og mer budsjett til det som leverer.' },
    ],
    kpis: [
      { name: 'Konverteringsverdi og ROAS', text: 'Inntekt fra Google Ads per annonsekrone, målt mot nettbutikken.' },
      { name: 'Nye kunder', text: 'Andel og kostnad per ny kunde, skilt fra gjenkjøp og merkevaresøk.' },
      { name: 'Shopping-dekning', text: 'Andel godkjente produkter og visningsandel i Shopping.' },
    ],
    faq: [
      {
        question: 'Performance Max eller vanlig Shopping?',
        answer: 'Det kommer an på kontoen. Performance Max gir rekkevidde på tvers av Google, mens vanlig Shopping gir mer kontroll. Mange butikker får best resultat med en kombinasjon, og vi tester heller enn å gjette.',
      },
      {
        question: 'Kan jeg styre søkeordene i Performance Max?',
        answer: 'Delvis. Du kan legge inn negative søkeord på kampanjenivå, utelukke merkenavn og gi søketemaer, og du får innsikt i hvilke søk kampanjen vises på. Trenger du full kontroll, kombinerer vi med vanlige søkekampanjer.',
      },
      {
        question: 'Hva er en CSS, og trenger jeg det?',
        answer: 'I EØS, også Norge, plasseres Shopping-annonser gjennom en Comparison Shopping Service. Googles egen trekker en fast margin av budet ditt, mens en annen CSS-partner kan gi lavere klikkpris. Vi tester det på dine egne tall.',
      },
      {
        question: 'Fungerer det med Shopifys Google & YouTube-app?',
        answer: 'Ja. Appen sender produktdata til Merchant Center. Vi justerer innstillingene og legger på tilleggsdata der appen ikke strekker til.',
      },
    ],
    related: [
      { slug: 'affiliate', why: 'Feedoptimalisering og CSS avgjør hvordan produktene vises i Shopping.' },
      { slug: 'sporing-og-analyse', why: 'Konverteringer og samtykke som budstrategiene kan stole på.' },
    ],
  },

  affiliate: {
    highlight: 'feedoptimalisering',
    highlights: ['Én feed, mange kanaler', 'Google Shopping via CSS', 'Prissammenligning og affiliate'],
    facts: [
      { label: 'Kjernen', value: 'Produktfeeden', note: 'optimalisert én gang' },
      { label: 'Kanaler', value: 'Shopping · Prisjakt', note: 'CSS, affiliate og Meta-katalog' },
      { label: 'Starter med', value: 'Feed-revisjon', note: 'det som stopper salg' },
      { label: 'Vi måler', value: 'Salg per kanal', note: 'mot bekreftede ordre' },
    ],
    why: {
      title: 'Én feed, mange salgskanaler',
      paragraphs: [
        'Produktfeeden er listen over varene dine med pris, lager, bilder og egenskaper. Google Shopping, Performance Max, prissammenligning, affiliate-partnere og Meta bruker alle den samme. Er feeden svak, betaler du for det i alle kanalene samtidig.',
        'Vi optimaliserer feeden én gang og sender den dit den gir salg: Google Shopping via en CSS-partner, prissammenligning som Prisjakt, og affiliate-nettverk der partnere selger for deg mot provisjon.',
      ],
    },
    situations: [
      { title: 'Produktene blir avvist i Merchant Center', text: 'Manglende GTIN, feil frakt eller for små bilder gjør at varer ikke vises, og Google skjerper kravet til bildestørrelse.' },
      { title: 'Du kan ikke styre etter margin', text: 'Alle produkter behandles likt i kampanjene, fordi feeden ikke sier noe om margin, bestselgere eller sesong.' },
      { title: 'Du betaler full pris i Shopping', text: 'Annonsene går gjennom Googles egen CSS, og ingen har vurdert om en annen partner gir lavere klikkpris.' },
      { title: 'Du vet ikke hva affiliate gir', text: 'Partnerne mangler gode produktdata, sporingen faller ut ved samtykke, eller kansellerte ordre gir likevel provisjon.' },
    ],
    deliverables: [
      { name: 'Feed-revisjon', text: 'Avvisninger, mangler og kvalitet per produkt, med en prioritert liste.' },
      { name: 'Titler og attributter', text: 'Merke, produkttype og viktigste egenskaper først, og GTIN, kategori og bilder på minst 500 × 500 piksler.' },
      { name: 'Etiketter for margin', text: 'Egendefinerte etiketter for margin, bestselgere og sesong, så kampanjene kan styres etter lønnsomhet.' },
      { name: 'CSS-partner', text: 'Vurdering og oppsett av CSS for Shopping-annonser, målt på dine egne tall.' },
      { name: 'Prissammenligning og affiliate', text: 'Feed til Prisjakt og affiliate-nettverk, med samme priser som i butikken.' },
      { name: 'Sporing og oppfølging', text: 'Affiliate-sporing med samtykke, og provisjon kontrollert mot bekreftede ordre.' },
    ],
    notIncluded: ['Klikkostnader og provisjon, som du betaler direkte', 'Produktfotografering'],
    process: [
      { period: '0–30 dager', title: 'Feeden i orden', text: 'Avvisninger rettet, titler og attributter strukturert, og etiketter for margin lagt inn.' },
      { period: '30–60 dager', title: 'Ut i kanalene', text: 'CSS-partner koblet på, produktene ut til prissammenligning og affiliate satt opp med sporing.' },
      { period: '60–90 dager', title: 'Mer fra det som selger', text: 'Vi ser på salg per kanal og etikett, og flytter innsatsen dit marginen og volumet er best.' },
    ],
    kpis: [
      { name: 'Godkjente produkter', text: 'Andel av sortimentet som faktisk kan vises i Shopping og hos partnerne.' },
      { name: 'Salg per kanal', text: 'Omsetning og kostnad fra Shopping, prissammenligning og affiliate hver for seg.' },
      { name: 'Affiliate-kvalitet', text: 'Andel ordre fra partnere som blir stående, og provisjon per bekreftet ordre.' },
    ],
    faq: [
      {
        question: 'Hva er feedoptimalisering?',
        answer: 'Å gjøre produktdataene så komplette og presise som mulig – titler, attributter, bilder, priser og etiketter – slik at kanalene viser riktige produkter til riktige søk, og du kan styre kampanjene etter margin.',
      },
      {
        question: 'Holder det med Shopifys Google & YouTube-app?',
        answer: 'Den er et godt utgangspunkt, men gir begrenset kontroll over titler og etiketter. Vi legger ofte på tilleggsfeeder, feed-regler eller et feed-verktøy der det trengs.',
      },
      {
        question: 'Hva er en CSS?',
        answer: 'En Comparison Shopping Service plasserer Shopping-annonsene dine hos Google. I EØS, også Norge, må alle Shopping-annonser gå gjennom en. Googles egen trekker en fast margin av budet, mens andre partnere kan gi lavere klikkpris. Vi måler effekten på dine tall i stedet for å love en prosent.',
      },
      {
        question: 'Hva må vi passe på juridisk?',
        answer: 'Priser i feeden og hos partnere må stemme med butikken, og førpriser må følge regelen om laveste pris de siste 30 dagene. Partnere som markedsfører deg, må merke innholdet som reklame. Vi bygger det inn i oppsettet, men ansvaret ligger hos deg som annonsør.',
      },
    ],
    related: [
      { slug: 'sem/google-ads', why: 'Shopping og Performance Max bygger direkte på produktfeeden.' },
      { slug: 'some/meta-ads', why: 'Katalogannonser i Facebook og Instagram bruker de samme produktdataene.' },
    ],
  },
}

/** A stage in the growth model. `label` is the short form used in eyebrows. */
export interface GrowthStage {
  label: string
  title: string
  text: string
  services: string[]
}

/** The /growth-marketing hub: the working model (which doubles as navigation) and principles. */
export interface GrowthHubContent {
  highlight: string
  highlights: string[]
  intro: string
  model: { stages: GrowthStage[]; foundation: GrowthStage }
  principles: { title: string; text: string }[]
  process: NonNullable<GrowthPageContent['process']>
  kpis: NonNullable<GrowthPageContent['kpis']>
  faq: NonNullable<GrowthPageContent['faq']>
}

export const growthHubContent: GrowthHubContent = {
  highlight: 'for nettbutikker',
  highlights: ['Bare netthandel', 'Fastpris', 'Styrt etter lønnsomhet'],
  intro:
    'Nettbutikker vokser ved å nå flere kjøpere: bli husket når folk skal handle, og vær lett å finne og kjøpe hos når de gjør det. Derfor ser vi på hele veien fra første inntrykk til gjenkjøp, med riktig data i bunnen.',
  model: {
    stages: [
      {
        label: 'Skap etterspørsel',
        title: 'Skap etterspørsel',
        text: 'Bli husket av dem som ikke leter ennå.',
        services: ['merkevare-og-strategi', 'some'],
      },
      {
        label: 'Fang etterspørselen',
        title: 'Fang etterspørselen',
        text: 'Vær der når folk søker og sammenligner.',
        services: ['seo', 'sem', 'affiliate'],
      },
      {
        label: 'Selg mer og behold',
        title: 'Selg mer og behold kundene',
        text: 'Flere kjøp fra trafikken du har, og flere som kommer tilbake.',
        services: ['cro', 'e-postmarkedsforing'],
      },
    ],
    foundation: {
      label: 'Grunnmuren',
      title: 'Grunnmuren: riktig data',
      text: 'Sporing, samtykke og analyse som alle kanalene og budstrategiene lærer av.',
      services: ['sporing-og-analyse'],
    },
  },
  principles: [
    {
      title: 'Merkevare og salg sammen',
      text: 'Kampanjer som skaper etterspørsel og kampanjer som fanger den, med hver sin jobb og en fordeling tilpasset fasen du er i.',
    },
    {
      title: 'Data først',
      text: 'Sporing og samtykke på plass før vi skalerer. Automatikken i Google og Meta er bare så god som dataene den lærer av.',
    },
    {
      title: 'Lønnsomhet, ikke klikk',
      text: 'Vi styrer etter margin og nye kunder, og planlegger betalt og organisk søk sammen, så du ikke betaler for det du vinner uansett.',
    },
    {
      title: 'Bare netthandel',
      text: 'Vi jobber kun med e-handel, på Shopify og andre plattformer. Du betaler ikke for at vi skal lære bransjen.',
    },
  ],
  process: [
    { period: '0–30 dager', title: 'Revisjon og måling', text: 'Vi går gjennom sporing, kontoer, feed og merkevare, og setter opp målingen vi skal styre etter.' },
    { period: '30–60 dager', title: 'Plan og oppsett', text: 'Vekstplan på tvers av kanalene, data i orden og de første kampanjene og testene i gang.' },
    { period: '60–90 dager', title: 'Skaler det som virker', text: 'Mer innsats der lønnsomheten og de nye kundene kommer fra, og en fast rytme for oppfølging.' },
  ],
  kpis: [
    { name: 'Lønnsomhet', text: 'Hva som er igjen etter varekost og markedsføring, ikke bare omsetning.' },
    { name: 'Nye kunder', text: 'Andel og kostnad per ny kunde, skilt fra gjenkjøp og merkevaresøk.' },
    { name: 'Andel av søk', text: 'Din andel av merkenavnsøkene i kategorien, en tidlig indikator på markedsandel.' },
  ],
  faq: [
    {
      question: 'Må vi kjøpe alle tjenestene?',
      answer: 'Nei. Du kan starte med én tjeneste, for eksempel sporing eller Google Ads. Vi ser likevel på helheten, slik at det du kjøper, spiller sammen med resten.',
    },
    {
      question: 'Hvor bør vi starte?',
      answer: 'Som regel med sporing og en revisjon. Uten riktige data vet du ikke hva som virker, og budstrategiene i Google og Meta optimaliserer mot feil mål.',
    },
    {
      question: 'Jobber dere sammen med andre byråer?',
      answer: 'Ja. Mange kunder har allerede et kreativt byrå, en innholdsprodusent eller et internt team. Vi tar den delen som trengs og samarbeider med resten.',
    },
    {
      question: 'Hvordan fungerer pris og avtale?',
      answer: 'Tjenestene leveres med fastpris, som engangsleveranser og løpende avtaler. Alle pakker og priser står i pakkeoversikten.',
    },
  ],
}

export function findGrowthContent(slug: string): GrowthPageContent | undefined {
  return growthContent[slug]
}

/** The model stage a service belongs to; channel pages inherit their parent's. */
export function growthStageOf(slug: string): GrowthStage | undefined {
  const { stages, foundation } = growthHubContent.model
  const root = slug.split('/')[0]
  return [...stages, foundation].find((stage) => stage.services.includes(root))
}
