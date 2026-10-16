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
  /** "Henger sammen med": other growth services this one depends on, by slug. */
  related?: { slug: string; why: string }[]
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
