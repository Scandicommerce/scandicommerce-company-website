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

export interface GrowthPageContent {
  /** Short definition right under the hero: what the service is, in plain words. */
  intro?: { title: string; paragraphs: string[] }
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
}

export const growthContent: Record<string, GrowthPageContent> = {
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
          'Feed-optimalisering og budstrategi',
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
        'Merchant Center og feed via Shopifys Google & YouTube-app – GTIN, frakt, retur og bilder',
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
  },
}

export function findGrowthContent(slug: string): GrowthPageContent | undefined {
  return growthContent[slug]
}
