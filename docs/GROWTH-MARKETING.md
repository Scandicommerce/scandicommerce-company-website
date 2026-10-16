# Growth marketing — tjenesteområde på scandicommerce.no

Arbeidsdokument for Growth marketing-sidene på nettsiden: hva vi bygger, hvordan det
er strukturert, hvilke regler vi følger og hva som er besluttet. Oppdateres i samme
commit som endringen den beskriver.

**Branch:** `growth/growth-marketing-seo` · **Bygger på:** `tjenester` (ny IA, Øyvind) · **PR:** [#2](https://github.com/Scandicommerce/scandicommerce-company-website/pull/2) (draft, mot `tjenester`)

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
| Affiliate (inkl. CSS for Google Shopping) | `/growth-marketing/affiliate` |
| SEO (inkl. GEO / AI-søk) | `/growth-marketing/seo` |
| E-postmarkedsføring | `/growth-marketing/e-postmarkedsforing` |
| CRO | `/growth-marketing/cro` |

Kanalsider, som lenkes fra forelderen og **ikke** fra menyen eller samlesiden:
`/growth-marketing/sem/google-ads`, `/growth-marketing/sem/bing-ads` og
`/growth-marketing/some/meta-ads`.

Samleside: `/growth-marketing`. Gjelder bare norsk side (.no). Andre språk gir 404.

## 2. Status

| Del | Status |
|---|---|
| Samleside og 11 tjenestesider | Dummyer med mal og plassholdere, `noindex`, ikke i XML-sitemap |
| Menyforslag | Ligger i `lib/growthServices.ts` (`growthNavItem()`). **Ikke koblet inn** i headeren ennå (se §5) |
| Ekte innhold | **SEM** og **Google Ads** har tekstutkast til gjennomlesning (alle seksjoner unntatt bevis; priser mangler). Resten er dummyer |
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

Rekkefølgen er fast. Plassholderne på dummysidene er briefen for den som skriver teksten.

1. **Hero:** Brødsmuler, H1 «[Tjeneste] for Shopify-butikker», én setning om hvem, hva og pris, og knappene «Book møte» og «Se pakker».
2. **Når du trenger dette:** 4–6 konkrete kjøpssituasjoner.
3. **Hva du får:** Strategi · Gjennomføring · Rapportering, og hva som *ikke* er inkludert.
4. **Pakker og pris:** Fastpris, med «fra»-pris.
5. **De første 90 dagene:** Hva som skjer når.
6. **Resultater og folkene bak:** Kundecase med tall, navngitt spesialist og partnermerker.
7. **Hva vi måler og rapporterer:** 3–5 måltall.
8. **FAQ:** 5–8 ekte spørsmål.
9. **Avsluttende CTA.**

SEM og SoMe viser i tillegg kanalene sine som kort under hero.

## 4. Retningslinjer for innhold

**Merkevare.** Følg designsystemet: https://claude.ai/artifact/SrBevWGhR5ojNANtxzniqu
(README: tone, skriveregler, farger).
- **Tone:** Direkte, vennlig og pragmatisk, aldri korporativ. «Vi» og «du».
- **Overskrifter:** Stor forbokstav bare på første ord. Ingen emoji. Midtprikk (·) som skilletegn.
- **Tall:** Konkrete tall, ikke superlativer.
- **Posisjonering:** «… for Shopify-butikker». Vi jobber bare med Shopify, og det skal synes.
- **Ikoner:** Lucide (`lucide-react`), strek 1,75, brukt sparsomt, slik designsystemet sier. Ikonvalget per tjeneste ligger i `SERVICE_ICONS` i `components/sections/growth/GrowthPages.tsx`. Bare kortene på samlesiden har tjenesteikon; i tillegg brukes pil på kort, chevron i brødsmuler og info på utkastbanneret.

**SEO.** Følg i tillegg `docs/SEO-OPERATIONS.md`, §4.
- **Grenser:** `metaTitle` ≤ 60 tegn, `metaDescription` ≤ 155 tegn, ikke merkenavn i tittelen.
- **Svar tidlig:** Hvem, hva og pris skal stå i første avsnitt. AI-søk siterer mest fra toppen av siden.
- **Ekte ekspertise:** Navngitt forfatter eller spesialist og egne tall. Ikke masseprodusert tekst.
- **Ikke ranger oss selv:** Ingen «beste SEO-byrå»-lister der vi står øverst. Slike sider har mistet synlighet i Google siden januar 2026.
- **Ingen egne stjerner:** Ingen stjernemerking av egne anmeldelser. FAQ-markering gir ikke lenger egen visning i Google, så skriv FAQ for leseren.
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
- `lib/growthContent.ts`: Teksten per tjenesteside (intro, kjøpssituasjoner, leveranser, pakker, 90 dager, måltall, FAQ). Seksjoner uten tekst vises som plassholder. Bevis vises alltid som plassholder til vi har ekte case.
- `components/sections/growth/GrowthPages.tsx`: Samleside og tjenestesidemal.
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

**Må bekreftes før SEM og Google Ads publiseres:**
- [ ] Priser for SEM-revisjon, SEM løpende, Google Ads-revisjon og Google Ads løpende.
- [ ] Vilkår: «Ingen bindingstid – 30 dagers oppsigelse» er hentet fra Growth-pakken. Gjelder det også her?
- [ ] Leveranser: Stemmer listene med det vi faktisk gjør (Bing som tillegg, CSS-vurdering, AI Max-tester, Demand Gen)?
- [ ] Bevis: Kundecase med tall fra annonsering, og navngitt spesialist.

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
