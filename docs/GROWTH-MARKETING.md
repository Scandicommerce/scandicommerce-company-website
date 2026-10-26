# Growth marketing — tjenesteområde på scandicommerce.no

Arbeidsdokument for Growth marketing-sidene på nettsiden: hva vi bygger, hvordan det
er strukturert, hvilke regler vi følger og hva som er besluttet. Oppdateres i samme
commit som endringen den beskriver.

**Branch:** `growth/growth-marketing-seo` · **Bygger på:** `main` (`tjenester` ble merget inn 22. oktober) · **PR:** [#2](https://github.com/Scandicommerce/scandicommerce-company-website/pull/2) (draft, mot `main`)

---

## 1. Scope

Første fase handler bare om nettsiden: hvordan vi presenterer tjenestene vi leverer
innen growth marketing. Ikke kampanjer, sporing av egen markedsføring eller annonsering.

Tjenestene vi leverer:

| Tjeneste | Side |
|---|---|
| Merkevare og strategi | `/growth-marketing/merkevare-og-strategi` |
| Sporing og analyse | `/growth-marketing/sporing-og-analyse` |
| SEM (betalt søk) | `/growth-marketing/sem` |
| SoMe | `/growth-marketing/some` |
| Affiliate, CSS og feedoptimalisering | `/growth-marketing/affiliate` |
| SEO (inkl. GEO / AI-søk) | `/growth-marketing/seo` |
| E-postmarkedsføring | `/growth-marketing/e-postmarkedsforing` |
| CRO | `/growth-marketing/cro` |

Kanalsider, som lenkes fra forelderen og **ikke** fra menyen eller samlesiden:
`/growth-marketing/sem/google-ads`, `/growth-marketing/sem/bing-ads`, `/growth-marketing/sem/ai-sok`,
`/growth-marketing/some/meta-ads`, `/growth-marketing/some/tiktok` og `/growth-marketing/some/snapchat`.

Samleside: `/growth-marketing`. Gjelder bare norsk side (.no). Andre språk gir 404.

## 2. Status

| Del | Status |
|---|---|
| Samleside | Tekstutkast. Modellen er også navigasjonen: alle tjenester og kanalsider står i sitt steg. Deretter prinsipper (4), oppstart og måltall, FAQ og CTA |
| Tjenestesider (11) | `noindex`, ikke i XML-sitemap. Status per side: se «Ekte innhold» |
| Menyforslag | Ligger i `lib/growthServices.ts` (`growthNavItem()`). **Ikke koblet inn** i headeren ennå (se §5) |
| Ekte innhold | Alle sider unntatt **SEO** har tekstutkast etter malen: Merkevare og strategi, Sporing og analyse, SoMe, Meta Ads, TikTok, Snapchat, SEM, Google Ads, Bing Ads, AI-søk, Affiliate, E-post og CRO (2026-10-26). SEO skrives av andre og viser malen som brief |
| Layout | Samme byggeklosser og stil som tjenestesidene i `main` (`ServiceHero`, `Faq`, `CtaBand`, `ui`-tokens) |
| Innhold i Sanity | Ikke startet. Innholdet ligger i kode til tekstene er klare |

## 3. Struktur

### Meny (forslag, følger de andre fanene)

```
Growth marketing ▾
  STRATEGI OG INNSIKT          ANNONSERING     EGNE KANALER
  Growth marketing oversikt    SEM             SEO
  Merkevare og strategi        SoMe            E-post
  Sporing og analyse           Affiliate       CRO
```

Regler for menyen:
- **Overskrifter:** Kolonner med overskrift, som Tjenester og Integrasjoner.
- **Oversikt først:** Oversiktslenken står først i første kolonne.
- **Bare navn:** Ingen undertekster i Growth-menyen. Korte navn (SEO, SEM, SoMe, CRO, E-post); H1 og URL bruker søkeordet (f.eks. «E-postmarkedsføring»).
- **Ingen undersider:** Kanalsidene (Google Ads, Bing Ads, Meta Ads) står ikke i menyen.

### Mal for tjenestesider

Følger tjenestesidene under `/tjenester` (Shopify, Migrering, Utvikling), så hele nettstedet ser likt ut. Rekkefølgen er fast, og hver seksjon har en fast lengde, slik at bare det viktigste står der:

1. **Hero** (`ServiceHero`): Eyebrow med stedet i modellen («Steg 2 · Fang etterspørselen»), H1 «[Tjeneste] for nettbutikker» med ett uthevet ord, ingress, knappene «Book møte» og «Se pakkene», og tre korte poenger. Til høyre står **«Her i modellen»**: de tre stegene og grunnmuren, med denne tjenesten markert.
2. **Kort fortalt:** Fire fakta (kanaler eller kjerne, hva vi starter med, hvordan vi jobber videre, hva vi måler).
3. **Hvorfor:** To korte avsnitt, med **ett** forskningspunkt med kilde, eller én dataflyt.
4. **Når du trenger dette:** Fire situasjoner.
5. **Leveranser:** Rundt seks, nummerert i den rekkefølgen de skjer, pluss én linje om hva som ikke er inkludert.
6. **Slik kommer vi i gang:** Tre steg (uke 1–2: tilganger, mål og plan; uke 3–4: oppsett og første tiltak; fra måned 2: løpende forbedring) og tre måltall («Det vi styrer etter»). Ingress: «Vi er raskt i gang når tilgangene er på plass og mål og strategi er avklart.»
7. **Vanlige spørsmål:** Fire.
8. **Les videre:** Inntil tre kort. Kanalsidene kommer først, deretter relaterte tjenester med stedet i modellen.
9. **CTA** (`CtaBand`).

**Den røde tråden:** Modellen (skap etterspørsel → fang etterspørselen → selg mer og behold kundene, med riktig data som grunnmur) står i eyebrow, i hero-panelet og på kortene i «Les videre». Samlesiden viser den samme modellen som navigasjon.

**Tatt bort ved forkortingen (2026-10-26):** Egne pakkekort (prisene ligger i pakkeoversikten, og «Se pakkene» står i hero), plassholdere for bevis, lange kildelister og plattformlister, og ekstra forskningsgrafer. Faktagrunnlaget i §8 gjelder fortsatt og kan hentes inn igjen ved behov.

Sider uten tekst viser hero og malen som en nummerert brief.

## 4. Retningslinjer for innhold

**Merkevare.** Følg designsystemet: https://claude.ai/artifact/SrBevWGhR5ojNANtxzniqu
(README: tone, skriveregler, farger).
- **Tone:** Direkte, vennlig og pragmatisk, aldri korporativ. «Vi» og «du».
- **Overskrifter:** Stor forbokstav bare på første ord. Ingen emoji. Midtprikk (·) som skilletegn.
- **Tall:** Konkrete tall, ikke superlativer.
- **Posisjonering:** «… for nettbutikker». Growth-tjenestene er åpne for de fleste e-handelsbedrifter, ikke bare Shopify. Shopify nevnes der det gjelder konkret teknikk (apper, kundehendelser, integrasjoner), som en styrke, men ikke som en betingelse.
- **Ikoner:** Lucide (`lucide-react`), strek 1,75, brukt sparsomt, slik designsystemet sier. Ikonvalget per tjeneste ligger i `SERVICE_ICONS` i `components/sections/growth/GrowthPages.tsx`. Bare kortene på samlesiden har tjenesteikon; i tillegg brukes pil på kort, chevron i brødsmuler og info på utkastbanneret.

**SEO.** Følg i tillegg `docs/SEO-OPERATIONS.md`, §4.
- **Grenser:** `metaTitle` ≤ 60 tegn, `metaDescription` ≤ 155 tegn, ikke merkenavn i tittelen.
- **Svar tidlig:** Hvem, hva og pris skal stå i første avsnitt. AI-søk siterer mest fra toppen av siden.
- **Ekte ekspertise:** Navngitt forfatter eller spesialist og egne tall. Ikke masseprodusert tekst.
- **Ikke ranger oss selv:** Ingen «beste SEO-byrå»-lister der vi står øverst. Slike sider har mistet synlighet i Google siden januar 2026.
- **Ingen egne stjerner:** Ingen stjernemerking av egne anmeldelser. FAQ-markering gir ikke lenger egen visning i Google, så skriv FAQ for leseren.
- **Grafer:** Én farge pluss grå: det som er poenget i cyan 600, konteksten i grått. All tekst i blekkfarger. Datagrafer har «Vis tallene»-tabell og kilde. Prinsippskisser merkes «Prinsippskisse, ikke målte data». Bare tall vi har kilde på.
- **Eksterne lenker:** Til primærkilder (forskning, Google, IPA osv.), åpnes i ny fane. Sjekk at lenken virker og går til riktig side før publisering.
- **Priser:** Står i pakkeoversikten (`/tjenester/alle-pakker`), ikke på tjenestesidene. Pakkekortene lenker dit. Én kilde for priser, så de ikke spriker.
- **Fjern noindex først når ekte tekst er på plass:** `seo.noIndex = true` i `app/[lang]/growth-marketing/[[...slug]]/page.tsx`.

## 5. Samarbeid i repoet

Flere jobber i samme repo samtidig. Slik unngår vi konflikter:

| Fil / område | Eier | Regel |
|---|---|---|
| `lib/navigation.ts` (meny og footer) | Øyvind | **Vi endrer den ikke.** Forslag leveres via `growthNavItem()` eller som melding |
| `lib/growthServices.ts`, `components/sections/growth/*`, `app/[lang]/growth-marketing/*` | Growth (denne branchen) | Fritt fram |
| `sanity/lib/queries.ts`, `sanity/schemas/*` | Delt | Avklar før endring |

Git-regler:
- **Hent ofte:** `git pull` før du begynner og før du pusher.
- **Merge, ikke rebase:** Endringer fra `tjenester` eller `main` merges inn. Vi rebaser aldri en branch andre har hentet.
- **Aldri force-push.**
- **Små commits:** Én ting per commit, og en melding som sier hvorfor.
- **Ved mer enn to personer på Growth:** Lag egne korte brancher fra `growth/growth-marketing-seo` og PR inn dit.
- **Preview:** Hver push gir en Vercel-preview. Se GitHub → commit → Deployments. Krever innlogging i Vercel.

For å koble menyen inn må Øyvind gjøre dette i `lib/navigation.ts`:
`import { growthNavItem } from '@/lib/growthServices'`, og erstatte Growth marketing-objektet
i `navigationNo` med `growthNavItem()`.

## 6. Teknisk

**Filer**
- `lib/growthServices.ts`: Alle tjenester (slug, gruppe, navn, H1, ingress), grupper og menyforslag. **Eneste sted å endre tjenestelisten.**
- `lib/growthContent.ts`: Teksten per tjenesteside (`highlight`, `highlights`, `facts`, `why` med `insight` eller `flow`, `situations`, `deliverables`, `notIncluded`, `process`, `kpis`, `faq` og `related`), og `growthHubContent`, som er modellen, prinsippene og resten av samlesiden. `growthStageOf(slug)` gir steget en tjeneste hører til; kanalsider arver fra forelderen.
- `components/sections/growth/GrowthPages.tsx`: Samleside og tjenestesidemal på byggeklossene fra tjenestesidene (`ServiceHero`, `Faq`, `CtaBand`, `ui` fra `components/integrations/labels`). Vi endrer ikke de delte komponentene. Seksjonene som trenger egen form (fakta, leveranser, prosess, lenker), ligger i denne filen med de samme klassene.
- `lib/growthServices.ts`: `heroTitle` er en valgfri H1 med myke bindestreker, for lange ord som ikke får plass på mobil (CRO).
- `components/sections/growth/GrowthCharts.tsx`: SVG-grafer uten bibliotek: stolper, delt stolpe og prinsippskisse for kort og lang effekt.
- `app/[lang]/growth-marketing/[[...slug]]/page.tsx`: Rute og metadata (noindex).

**Ny tjeneste:** Legg til et objekt i `growthServices`, med `group` og eventuelt `parent`.
Siden, samlesiden og menyforslaget oppdateres automatisk.

**Kjøre lokalt** (Node 20):
```
cp env.example .env.local   # sett NEXT_PUBLIC_SANITY_PROJECT_ID=fk1tt27l, NEXT_PUBLIC_SANITY_DATASET=production
npm install                 # ikke npm ci, låsefilen er ute av synk med package.json
npm run dev                 # http://localhost:3000/no/growth-marketing
```

**Se menyforslaget lokalt:** Erstatt Growth marketing-objektet i `navigationNo` med `growthNavItem()` (og importen) i `lib/navigation.ts`, men **ikke commit** det. Tilbakestill med `git checkout -- lib/navigation.ts`.

**Før push:** `npx tsc -p tsconfig.typecheck.json --noEmit` og `npx next lint`, og sjekk at `lib/navigation.ts` ikke er med i commiten.

## 7. Åpne spørsmål

**Menyen (nytt etter merge av `main`):** Øyvind har satt `live: false` på Growth marketing i `lib/navigation.ts`, så menyen er skjult. Oppføringen der følger fortsatt den gamle IA-en (`/geo`, `/google-ads`, `/analyse`), som ikke stemmer med URL-ene våre. Ifølge commit-meldingen hans (fc15d00) skal branchen som leverer en seksjon, fjerne flagget i samme endring. Det kolliderer med regelen vår i §5. Avklares med Øyvind: enten bytter han inn `growthNavItem()`, eller så gjør vi det selv i PR-en. **Merk (2026-10-26):** Headeren bruker menyen fra Sanity (`headerSettingsQuery` i `HeaderWrapper`) når den finnes. `navigation.ts` er bare en reserve. Growth-menyen må derfor også legges inn i header-innstillingene i Sanity for å vises på nettsiden. Det gjelder også lokalt, så menyforslaget kan ikke forhåndsvises ved å endre `navigation.ts`.

**Må bekreftes før SEM og Google Ads publiseres:**
- [ ] Priser: Pakkekortene lenker til pakkeoversikten (`/tjenester/alle-pakker`) i stedet for å vise pris. **Pakkeoversikten viser i dag bare Shopify-pakkene.** SEM- og Google Ads-pakkene må legges inn der (i Sanity) før lenken gir mening.
- [ ] Vilkår: «Ingen bindingstid – 30 dagers oppsigelse» er hentet fra Growth-pakken. Gjelder det også her?
- [ ] Leveranser: Stemmer listene med det vi faktisk gjør (Bing som tillegg, CSS-vurdering, AI Max-tester, Demand Gen)?
- [ ] Affiliate og feed: Stemmer leveransene (feed-revisjon, distribusjon til prissammenligning, oppfølging av affiliate-partnere)? Nevner vi riktige eksempler (Prisjakt; Adtraction og Awin)? Hvilke feed-verktøy bruker vi?
- [ ] Bevis: Kundecase med tall fra annonsering, og navngitt spesialist. Plassholderne er fjernet fra sidene; når vi har case, legges de inn som kort i «Les videre» (kundecasesidene finnes nå i `main`).
- [ ] Samlesiden: Stemmer modellen (merkevare og etterspørsel → fange etterspørselen → salg og gjenkjøp, med data som grunnmur) og de seks prinsippene med hvordan vi jobber? FAQ-en om samarbeid med andre byråer bygger på FAQ-en til Growth-pakken i Sanity.
- [ ] SoMe: Stemmer pakkene (revisjon og kreativ plan, løpende drift med nye kreativer hver måned)? Hvilke kanaler leverer vi i praksis (Meta, TikTok, Snapchat, Pinterest, LinkedIn)? Lager vi kreativer selv, eller med partnere?
- [ ] Sporing og analyse: Stemmer leveransene og de tre pakkene (sporingsrevisjon, server-side sporing, analyse og dashboards månedlig)? Lover vi «varsling og retting når sporingen brytes»? Hvilke dashboardverktøy bruker vi i praksis (Looker, Looker Studio, annet)?
- [ ] Merkevare og strategi: Stemmer leveransene og pakkene (strategi som engangsleveranse, strategisk partner månedlig)? «Logodesign og full visuell identitet» står som ikke inkludert. Stemmer det?

**Må bekreftes for de nye sidene (2026-10-26):**
- [ ] E-post: Leverer vi SMS? Siden sier «ikke inkludert». Klaviyo-lisens betales av kunden. Stemmer flytene (velkomst, forlatt handlekurv, sett produkt, etter kjøp og tilbakevinning)?
- [ ] CRO: Bruker vi Shopify Rollouts og Microsoft Clarity i praksis? Er «nytt tema eller redesign» et eget prosjekt (Shopify-tjenestene)?
- [ ] Meta Ads: Lager vi kreativene selv? Samme spørsmål som for SoMe.
- [ ] Bing Ads: Anbefaler vi Microsoft Channel-appen, eller feed direkte til Microsoft Merchant Center?
- [ ] TikTok og Snapchat: Leverer vi disse kanalene i dag? Hvem lager kreativene? AR-linser står som ikke inkludert.
- [ ] AI-søk: Bør Copilot og ChatGPT nevnes før de er åpnet i Norge? Siden sier at vi tester dem når de åpner.
- [ ] «Les videre» viser inntil tre kort. På SEM og SoMe fyller nå kanalsidene alle tre, så Affiliate og Merkevare ikke lenger lenkes derfra. Er det OK?

**Fra kvalitetskontrollen 2026-10-26 (beslutninger som gjenstår):**
- [ ] **Bevis:** Ingen av sidene har kundecase, egne tall eller navngitt spesialist. Dette er den største svakheten for konvertering og E-E-A-T. Vi trenger tillatelse til 2–3 case med tall, og en navngitt spesialist med bilde per område.
- [ ] **Pris og «Se pakkene»:** Samlesiden sier «fastpris», og «Se pakkene» går til pakkeoversikten. Der finnes bare Shopify-pakker, én av dem heter «Growth» (8 000 kr/mnd), og den inneholder allerede «E-post og markedsføringsautomatisering» og «Analyse og sporing». Enten lager vi Growth-pakker med pris, eller så fjerner vi «fastpris» og «Se pakkene» og avklarer forholdet til Shopify-pakken.
- [ ] **Neste steg:** Et konkret inngangstilbud (for eksempel en revisjon med omfang, varighet og pris), og «Før vi starter» med minstebudsjett, oppsigelse og oppstartstid, slik tjenestesidene har.
- [ ] **Overlapp mellom sidene:** SEM og Google Ads, og SoMe og kanalsidene, dekker mye av det samme. Forslag: SEM og SoMe handler om valg av kanal og fordeling av budsjett, og detaljene står bare på kanalsidene. Kanalsidene får hver sin egen vinkel, så de ikke leses som samme mal.
- [ ] **Hero for besøkende fra Google:** «Steg 2 · Fang etterspørselen» og modellpanelet er intern logikk. Vurder bevis i hero og modellen lenger ned, særlig på mobil.
- [ ] **To grupperinger:** Menyen (Strategi og innsikt · Annonsering · Egne kanaler) og modellen (Skap · Fang · Selg og behold · Grunnmur) plasserer SEO ulikt. Velg én.
- [ ] **Titler og beskrivelser:** Ingen titler har kommersiell hensikt (for eksempel «byrå»), og meta-beskrivelsen er ingressen, ofte under 100 tegn.
- [ ] **Ferskvare:** Tall og status for plattformene (Statcounter september 2026, Ipsos 2023, Snap 2023, AI-søk, TikTok Shop) må sjekkes hvert kvartal. Vurder «Sist oppdatert» og en eier.

**Øvrige:**

- [ ] **Navnekollisjon:** Shopify-pakken heter «Growth» (`/tjenester/alle-pakker/growth`, 8 000 kr/mnd). Gi pakken nytt navn, eller behold? *(Avventer.)*
- [ ] **Kolonner:** Tre kolonner i Growth-menyen, mot to i de andre fanene. OK?
- [ ] **Øyvind:** Kobler han inn `growthNavItem()`? Til da viser headeren den gamle Growth-menyen, der bare SEO-lenken treffer en av sidene våre.
- [ ] **Priser:** Priser for growth-pakkene.
- [ ] **Sanity:** Når teksten er klar, skal innholdet flyttes til en egen sidetype i Sanity.
- [ ] **Låsefil:** `package-lock.json` er ute av synk med `package.json` (eksisterte fra før). Bør fikses i egen commit.

## 8. Faktagrunnlag for innhold

Tekstene skal bare inneholde påstander vi kan stå for. Tidsavhengige fakta sjekkes på nytt før publisering.

**SEM og Google Ads** (research 2026-10-16):
- CSS: Shopping-annonser i EØS, også Norge, plasseres via en CSS, og Googles egen CSS trekker en fast margin av budet. Kilde: Google Merchant Center-hjelp 12652686 og 12653197. Vi oppgir **ikke** rabatt i prosent: tallene på 15–20 % kommer fra CSS-leverandører, ikke fra Google.
- Consent Mode v2: Kreves i EØS for personlig tilpasning og modellering (siden mars 2024). Shopify bruker ikke EØS-data til personlige annonser uten gyldig samtykke. Kilde: Shopify Help, «Consent».
- Performance Max: Har nå kanalrapport, negative søkeord på kampanjenivå, merkeutelukkelser og mål for nye kunder (2025).
- AI Max for Search: Rullet ut i 2025, men Norge er ikke bekreftet. Derfor skriver vi «der det er tilgjengelig». AI Max for Shopping er usikkert og nevnes ikke.
- Bing: Liten andel av søk i Norge, men høyere på desktop (Statcounter, 2026). Vi oppgir ikke tall eller klikkpriser.
- Benchmarks: Bare tall fra USA eller globalt finnes. De brukes ikke.

**Merkevare og strategi** (research 2026-10-16, alle lenker sjekket):
- How Brands Grow og Ehrenberg-Bass: Vekst kommer først og fremst fra flere kjøpere (penetrasjon), og mental og fysisk tilgjengelighet er det som driver den. Lenke: marketingscience.info. Undersiden om How Brands Grow sender videre til forsiden deres.
- Binet & Field, The Long and the Short of It (IPA): Salgsaktivering gir kortsiktige topper, merkevarebygging gir langsiktig vekst. Om lag 60:40 for B2C er et utgangspunkt, og Effectiveness in Context (IPA) viser at fordelingen varierer. Grafen for kort og lang effekt er en **prinsippskisse**, ikke data.
- Share of search (Binet, IPA 2020): Andelen merkenavnsøk er en tidlig indikator på markedsandel, og den kan måles i Google Trends.
- Ahrefs (75 000 merkevarer, publisert 26. mai 2025, oppdatert 27. april 2026): Korrelasjon med synlighet i AI-oversikter. Omtale av merkevaren 0,664, merkenavn i lenketekst 0,527, søk på merkenavnet 0,392, domenestyrke 0,326, lenkende domener 0,295 og trafikk fra merkenavnsøk 0,274. Tallene er sjekket mot artikkelen. Det er korrelasjon, ikke årsak, og det står i teksten.
- Romaniuk, Building Distinctive Brand Assets (2018): Elementene må være kjente og unike. Forlagets side svarer 403, så den lenkes ikke.

**SoMe** (research 2026-10-16, alle lenker sjekket; Meta, Forbrukertilsynet og TikTok blokkerer curl, så de er lest med eget hentverktøy):
- Meta Andromeda (Meta Engineering, 2. desember 2024): Systemet snevrer «tens of millions» annonser inn til «a few thousand» kandidater. Meta skriver (27. mars 2025) at flere kreativer støtter «a diversification strategy». Vi oppgir **ikke** antall kreativer, og heller ikke Metas eller byråenes tall i prosent.
- Binet & Field: 60:40 (2013), 62:38 i Effectiveness in Context (2018). Binet sier i Marketing Week (2024) at merkevare og performance ikke bør presses samtidig. Grafen er en prinsippskisse.
- System1, The Extraordinary Cost of Dull (2024): Over 100 000 tester, om lag halvparten av reaksjonene er nøytrale. Gjelder **TV** og er leverandørens modell, og det står i teksten.
- Nielsens «47 % av salgseffekten» er ikke funnet i primærkilden og brukes ikke.
- Ipsos: Profilandel blant nordmenn over 18 år i fjerde kvartal 2023 er Facebook 82, Snapchat 67, Instagram 66, TikTok 29 og X 27 %. Sjekket mot siden. Om lag 8 av 10 bruker sosiale medier daglig (2024). Nyere tall ligger bak betalingsmur.
- TikTok Shop: Ikke lansert i Norge i TikToks oversikt fra 28. mai 2026.
- Forbrukertilsynet: Standardmerkingen i plattformene er ikke tydelig nok, og de **anbefaler** å legge til «reklame» eller «annonse». Merkingen bør komme først i teksten.
- Måling: Konverteringsløftstester i Meta og de åpne verktøyene for markedsmiksmodeller, Robyn (Meta) og Meridian (Google).

**Sporing og analyse** (research 2026-10-16, alle lenker sjekket):
- Tracklution (Tracklution Oy, Finland): Server-side sporing som tjeneste. I Shopify settes det opp med egen piksel under Kundehendelser, en webhook for ny ordre og en CNAME for førstepartsdomene. Kilde: Tracklution docs. Ingen app i Shopify App Store er bekreftet, så vi skriver ikke «app».
- Tracklutions integrasjoner: Hentet fra integrasjonssiden deres. Vi nevner bare plattformer som står der.
- Data: AWS, «primary data centers in Northern Europe (Stockholm)». Kilde: Tracklutions side om personvern og sikkerhet. Vi skriver **ikke** «bare i EU».
- Samtykke: Tracklution leser Shopifys samtykkebanner og støtter Consent Mode v2 (oppgitt av leverandøren). Ekomloven § 3-15 krever samtykke uansett. Det står i teksten.
- Safari ITP: Informasjonskapsler satt med JavaScript begrenses til 7 dager. Kilde: webkit.org.
- GA4 til BigQuery: Google tar ikke betalt for eksporten, men lagring og spørringer koster. Standardeiendommer kan eksportere maks 1 million hendelser per dag. Kilde: Google Analytics-hjelp 9358801. Vi skriver ikke «gratis».
- Shopifys egen kobling til BigQuery (Data Transfer Service) har uavklart status (forhåndsversjon?) og nevnes ikke.
- Looker Studio: Lenken sender videre til en side som heter «Data Studio», så navnet er uklart og produktet nevnes ikke. Looker lenkes.
- Ikke brukt: Tracklutions egne påstander om forbedring i prosent, priser og grenser for antall hendelser, og Datatilsynets vedtak om Google Analytics (ikke bekreftet som endelig).

**Affiliate, CSS og feed** (research 2026-10-16):
- Bilder: Minst 500 × 500 piksler for `image_link` og `additional_image_link`. Advarsler siden 14. april 2026, håndheves fra 31. januar 2027. Kilde: Google Merchant Center-hjelp 16989427.
- Nye feed-attributter (2026): `video_link`, `handling_cutoff_time`, `minimum_order_value` og lojalitetsnivåer i frakt. Samme kilde. Nevnes ikke i teksten ennå.
- Samtaleattributter for AI-handel er ikke dokumentert i Googles spesifikasjon. Nevnes ikke.
- Prisjakt: Norsk prissammenligning; butikker betaler per klikk eller en andel av ordreverdien. Kilde: prisjakt.no. Status for Prisguiden/PriceRunner og Kelkoo i Norge er ikke bekreftet, så de nevnes ikke.
- Affiliate: Adtraction har kontor i Norge og en Shopify-app. Awin har en offisiell Shopify-app (developer.awin.com/docs/shopify). Andre nettverk er ikke bekreftet.
- Førpris: Laveste pris de siste 30 dagene (prisopplysningsforskriften § 9a, fra 1. oktober 2023). Forbrukertilsynet har ilagt gebyr for ulovlige førpriser (juni 2025).
- Merking av reklame: Forbrukertilsynets veiledning sier at merkingen skal komme tydelig og først. Ingen egen regel for affiliate-lenker er funnet, så vi skriver generelt.

**Meta Ads** (research 2026-10-26; Metas hjelpesider blokkerer henting, så teksten er hentet gjennom Metas eget hjelpeverktøy, mens Shopify- og utviklersidene er lest direkte):
- Advantage+ salgskampanjer: Budsjettaket for eksisterende kunder er fjernet, og det samme gjøres manuelt med ekskluderte kundelister eller egne annonsesett. Kilde: Meta Business Help Center 1142614290190459.
- Katalogannonser: `content_ids` i hendelsene må stemme med ID-ene i katalogen. Meta anbefaler et samsvar over 75 %, og helst over 90 %. Kilde: Meta Business Help Center 1183006658734497.
- Hendelsesmatchkvalitet: Gis på en skala fra 1 til 10. Kilde: developers.facebook.com (Conversions API, verifying setup).
- Attribusjon: Standard er 7 dagers klikk eller 1 dags visning. Kilde: Meta Business Help Center 1997130013754737. At 7 og 28 dagers visning ble fjernet i januar 2026, er bare omtalt i blogger og brukes **ikke**.
- Butikker og kasse: Norge er i åpen beta. Kasse i appene støttes ikke lenger, og kjøpet skjer i nettbutikken. Vi skriver **ikke** «bare i USA».
- Ikke brukt: Metas påstander om forbedring i prosent.

**Bing Ads** (research 2026-10-26):
- Statcounter, september 2026: Bing har 20,66 % av søkene på desktop i Norge og 6,38 % på tvers av alle enheter. Siden sier «om lag 21 %» og «om lag 6 %».
- Import fra Google Ads med planlagt synkronisering. Kilde: learn.microsoft.com (google-ads-import).
- Shopping-kampanjer: Norge er støttet salgsland. Kilde: GetBSCCountries.
- UET: Samtykkesignaler kreves for besøk fra EØS siden 5. mai 2025. Uten dem stopper sporingen av konverteringer og remarketinglistene. Kilde: Microsoft Advertising-blogg (mars 2025) og FAQ om UET-samtykke.
- Microsoft Channel-appen finnes i Shopify App Store, men har vurderingen 2,9.
- Ikke brukt: Annonser i Copilot (ingen primærkilde for Norge), hvor Audience Network vises, og klikkpriser.

**E-post** (research 2026-10-26):
- Markedsføringsloven § 15: Samtykke kreves før markedsføring på e-post til forbrukere. Unntaket er egne kunder, for lignende varer, med enkel og gratis avmelding. Forbrukertilsynets veileder (oppdatert mai 2026) anbefaler å samle inn samtykke.
- Gmail: Avsendere med over 5 000 e-poster om dagen må ha SPF, DKIM og DMARC, avmelding med ett klikk og en spamrate under 0,30 %. Kilde: support.google.com/a/answer/81126. Yahoo har tilsvarende krav.
- Apple Mail Privacy Protection gjør åpninger upålitelige. Kilde: Klaviyo-hjelp 4416791883163.
- Klaviyo: Anbefalte flyter (velkomst, forlatt handlekurv, etter kjøp, tilbakevinning), og «sett produkt» som egen flyt. Prediksjonene krever blant annet minst 500 kunder med ordre og 180 dagers historikk. Standard attribusjon er 5 dager for åpning og klikk.
- Ikke brukt: Personlige produktanbefalinger (ikke bekreftet) og bransjetall.

**CRO** (research 2026-10-26):
- Baymard: 70,22 % forlatte handlekurver i snitt over 50 studier. Grunner: ekstrakostnader 40 %, treg levering 20 %, manglende tillit 19 %, krav om konto 18 % og komplisert kasse 17 %.
- Core Web Vitals «god»: LCP ≤ 2,5 s, INP ≤ 200 ms og CLS ≤ 0,1. Kilde: web.dev.
- Shopify Rollouts: A/B-tester (Experiments) krever Grow-plan eller høyere. Lanseringsdato er ikke bekreftet.
- Microsoft Clarity er gratis, og krever samtykkesignal for besøk fra EØS fra 31. oktober 2025.
- Vipps MobilePay har **ikke** Hurtigkasse for Shopify, ifølge deres egen dokumentasjon.
- EUs tilgjengelighetsdirektiv er ikke innført i Norge (Bufdir). **Rettet 2026-10-26:** Norske regler om universell utforming av IKT (likestillings- og diskrimineringsloven og IKT-forskriften, WCAG 2.0 for private) gjelder også private nettløsninger rettet mot allmennheten, og Uutilsynet fører tilsyn. Kilde: uutilsynet.no (IKT i privat sektor). CRO-siden sier dette.
- Ikke brukt: Rakuten-caset fra web.dev (bare ett selskap) og antall Vipps-brukere i Norge (ikke bekreftet).

**AI-søk** (research 2026-10-26):
- Googles annonser over og under AI-oversikter kan vises i alle markeder der AI-oversiktene vises, fra Søk, Shopping og Performance Max. Annonser inne i selve AI-oversikten: bare engelsk, i 12 land, ikke Norge. Ingen egen rapportering. Kilde: Google Ads-hjelp 16297775.
- AI Max for Search: global beta fra mai 2025, med søkeordsutvidelse, tekstgenerering, utvidelse av landingsside og kontroll på merke og URL. Kilde: blog.google. Status som ferdig produkt og støtte for norsk er ikke bekreftet.
- Annonser i AI Mode testes (Google Marketing Live 2026), men det er ikke bekreftet hvilke land de finnes i. Nevnes ikke.
- Copilot-annonser er bekreftet bare for engelsk, fransk og tysk. Norge nevnes ikke.
- ChatGPT: OpenAI tester annonser, men at det gjelder Norge, kommer bare fra sekundærkilder. Siden sier at vi tester det når norske annonsører får tilgang.
- Shopify Agentic Storefronts kobler katalogen til ChatGPT, Copilot, AI Mode og Gemini, men landene er ikke oppgitt. Perplexity er ikke bekreftet og nevnes ikke.

**TikTok** (research 2026-10-26):
- Smart+ automatiserer målretting, kreativer og budsjett, hver for seg. Spark Ads bruker egne innlegg og innlegg fra skapere, med tillatelse. Kreative råd: 9:16, lyd, tilbudet i løpet av de første 3 sekundene og en krok i løpet av de første 6. Kilde: TikTok Ads Help (creative best practices).
- Tracklution sender til TikTok Events API med deduplisering.
- Ikke brukt: produktannonser fra katalog i Norge (ikke bekreftet), TikToks mål for samsvarskvalitet (bare tredjepartskilde) og nyere norske brukstall enn Ipsos 4. kvartal 2023 (29 % over 18 år).

**Snapchat** (research 2026-10-26; Snapchats hjelpesider for annonsører blokkerer henting):
- SSB, Norsk mediebarometer 2025: 58 % bruker Snapchat en gjennomsnittsdag, og Facebook 63 %.
- Snap, 2023: Over 3 millioner månedlige brukere i Norge, og over 60 % av dem er 25 år eller eldre.
- Formater: Snap Ads (9:16, 3–180 sekunder), Story, Collection, Dynamic Product Ads og Sponsored Snaps (i chatten; ikke tillatt med tilbud eller rabatter). Kilde: forbusiness.snapchat.com.
- Attribusjon som standard: 28 dager etter sveip og 1 dag etter visning (Ads API).
- Tracklution sender til Snap-pikselen og Conversions API. Snapchat-appen i Shopify synkroniserer katalogen og legger inn pikselen.
- Ikke bekreftet: at produktannonser fra katalog er tilgjengelige i Norge (bare en sekundærkilde fra 2020). Siden lover det ikke som noe bare Norge har, men beskriver formatet.

## 9. Beslutningslogg

| Dato | Beslutning | Begrunnelse |
|---|---|---|
| 2026-10-16 | Growth-arbeidet bygger på `tjenester` / `feature/website-updates` (ny IA), ikke `main` | Den nye IA-en har allerede en Growth marketing-meny |
| 2026-10-16 | URL-er under `/growth-marketing/<tjeneste>` | Følger IA-en; samler sidene i én klynge for Google og AI-søk |
| 2026-10-16 | GEO / AI-synlighet er en del av SEO, ikke egen side | Én tydelig SEO-tjeneste |
| 2026-10-16 | SEM med Google Ads og Bing Ads som undersider; SoMe med Meta Ads | Kanalene får egne sider uten å fylle menyen |
| 2026-10-16 | «Direkte markedsføring» → «E-postmarkedsføring», med 1:1 som vinkling | Det folk søker på og det vi leverer (Klaviyo); «direkte markedsføring» er tvetydig på norsk |
| 2026-10-16 | Ikke SMS i navn eller meny | Fokus på e-post |
| 2026-10-16 | Menynavn «E-post»; H1 og URL beholder «E-postmarkedsføring» | Kort som de andre punktene; «CRM» forveksles med CRM-systemer, «EDM» er lite brukt i Norge |
| 2026-10-16 | Ingen undersider og ingen undertekster i menyen | Menyen ble for tung |
| 2026-10-16 | Menyen grupperes i Strategi og innsikt · Annonsering · Egne kanaler | Følger strukturen i de andre fanene; skiller betalt og eid |
| 2026-10-16 | CRO flyttes til `/growth-marketing/cro` | Fjernet fra Tjenester-menyen av Øyvind (e13b72b) |
| 2026-10-16 | `lib/navigation.ts` eies av Øyvind; Growth endrer den ikke | Unngå merge-konflikter |
| 2026-10-16 | Dummysidene ligger i kode, med noindex | Ingen skrivetilgang til Sanity; sidene skal ikke indekseres med plassholdertekst |
| 2026-10-16 | Affiliate (inkl. CSS-partnere for Google Shopping) legges til under Annonsering | Vi bistår kunder med det i dag; betalt kanal med provisjon, nær SEM/SoMe |
| 2026-10-16 | Ikoner fra designsystemets bibliotek (Lucide, strek 1,75) på samlesidekort, kortpiler, brødsmuler og utkastbanner | Designsystemet bruker Lucide sparsomt; tjenesteikon bare på samlesiden for å unngå gjentakelse på kanalkortene |
| 2026-10-16 | Draft-PR #2 fra `growth/growth-marketing-seo` til `tjenester` | Growth-arbeidet følger IA-arbeidet inn i `main`; Øyvind ser og kommenterer alt på ett sted |
| 2026-10-16 | Første tekstutkast for SEM og Google Ads, i `lib/growthContent.ts` | Bygget på oppdatert research (se §8); bare bekreftede påstander; priser og bevis står igjen som plassholdere |
| 2026-10-16 | SEM og Google Ads: «for mye på eget merkenavn» i stedet for «betaler for ditt eget merkenavn»; SEO-søkeordsanalyse og negative søkeordslister løftet fram i leveranser, måltall og FAQ | Tydeligere problem (mangler kontroll); viser at SEM og SEO jobber sammen og hvordan vi kutter bortkastet budsjett |
| 2026-10-16 | Pakkekort på tjenestesidene lenker til pakkeoversikten i stedet for å vise pris | Prisene ligger ett sted, så de ikke spriker mellom sidene |
| 2026-10-16 | Affiliate-siden blir «Affiliate, CSS og feedoptimalisering», med feeden som kjerne; menynavnet forblir «Affiliate» | Den samme feeden driver Shopping, CSS, prissammenligning, affiliate og Meta-katalog; menyen holdes kort |
| 2026-10-16 | Sporing og analyse: server-side sporing med Tracklution som standardpartner, andre løsninger på forespørsel; analyse i GA4, Google Cloud og BigQuery; egne dashboards og integrasjoner | Slik leverer vi i dag (fra brukeren); nye seksjoner for dataflyt (`flows`) og plattformlenker (`platforms`) |
| 2026-10-16 | Ny seksjon «Fungerer best sammen med» på tjenestesidene (felt `related`) | Viser at tjenestene henger sammen, og gir intern lenking for SEO |
| 2026-10-16 | Merkevare og strategi får tekstutkast med forskningsinnsikt, tre grafer og eksterne kilder | Brukeren ba om oppdatert merkevareinnsikt med grafer og lenker; forskningen kobles til hvordan nettbutikker vokser (mental og fysisk tilgjengelighet) |
| 2026-10-16 | SoMe: fokus på merkevarebygging, gode og varierte kreativer, og på å skape etterspørsel, ikke bare fange den | Brukerens prioritering; støttet av Meta (Andromeda), Binet & Field, System1 og Ipsos |
| 2026-10-16 | Samlesiden viser vår måte å jobbe på: en modell i tre steg (bygg merkevare og etterspørsel → fang den → gjør besøk til salg og kunder til gjengangere) på en grunnmur av data, pluss seks prinsipper | Samler det vi har landet på for tjenestene: merkevare og salg sammen, data først, én feed, kreativ variasjon, lønnsomhet, bare Shopify |
| 2026-10-16 | Growth-området posisjoneres mot nettbutikker generelt, ikke bare Shopify («… for nettbutikker»); prinsippet «Bare Shopify» blir «Bare netthandel» | Vi tar de fleste e-handelsbedrifter innen growth; Shopify er fortsatt hjemmebanen |
| 2026-10-16 | Samlesiden er også navigasjonsside, og layouten er strammet inn: tjenesteoversikt med alle undersider rett under hero, mindre luft og titler, færre og sammenslåtte seksjoner | Brukeren ville ha mindre luft, og siden skal fungere som hub; alle undersider ett klikk unna gir også intern lenking |
| 2026-10-26 | `main` merget inn (inkludert `tjenester`), og PR #2 skal gå mot `main` | `tjenester` ble merget til `main` 22. oktober |
| 2026-10-26 | Growth-sidene bygges på de samme byggeklossene og den samme stilen som tjenestesidene (`ServiceHero`, `Faq`, `CtaBand`, `ui`-tokens) | Hele nettstedet skal se likt ut |
| 2026-10-26 | Innholdet kortes ned til en fast mal: 4 fakta, ett forskningspunkt eller én flyt, 4 situasjoner, ~6 leveranser, 3 steg, 3 måltall, 4 spørsmål i FAQ og inntil 3 kort i «Les videre». Pakkekort, plassholdere, kildelister og plattformlister er tatt bort | Brukeren ville ha bare det viktigste og en rød tråd |
| 2026-10-26 | Modellen er den røde tråden: hver side viser steget sitt i eyebrow og i «Her i modellen» i hero, og på samlesiden er modellen også navigasjonen | Leseren ser hvordan tjenestene henger sammen, og den doble tjenesteoversikten på samlesiden forsvinner |
| 2026-10-26 | Samlesiden: fire prinsipper (i stedet for seks), ingen forskningsgraf | «Én feed» og «Kreativet er målrettingen» står på Affiliate og SoMe; grafen for kort og lang effekt står på Merkevare og strategi |
| 2026-10-26 | Tekstutkast for E-post, CRO, Meta Ads og Bing Ads etter den nye malen; SEO overlates til andre | Brukeren ba om å fylle på der innholdet manglet; research med kilder først (se §8) |
| 2026-10-26 | Nye kanalsider: AI-søk under SEM, og TikTok og Snapchat under SoMe | Brukeren ville ha kanalene med; AI-søk dekker den betalte delen, mens GEO blir under SEO |
| 2026-10-26 | Oppstarten kortes fra 0–30/30–60/60–90 dager til uke 1–2, uke 3–4 og fra måned 2, og seksjonen heter «Slik kommer vi i gang» | Brukeren: vi er raskt i gang når tilganger, strategi og mål er på plass. Stemmer med Growth-pakken («De to første ukene kartlegger vi butikken …») |
| 2026-10-26 | Kvalitetskontroll: rettet universell utforming (CRO), Ahrefs-påstand, unntaket i § 15 og attribusjon (E-post), påstander om billigere klikk uten kilde (Bing), produktannonser og daglig bruk (Snapchat), forbehold om AI Max og nye flater (AI-søk), samtykkeforbehold for server-side på annonsesidene, én definisjon av lønnsomhet, språk; «Les videre» viser inntil fire kort | Uavhengig gjennomgang (Opus) og egne sjekker; strategiske funn står i §7 |
