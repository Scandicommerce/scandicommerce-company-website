# Growth marketing — tjenesteområde på scandicommerce.no

Arbeidsdokument for Growth marketing-sidene på nettsiden: hva vi bygger, hvordan det
er strukturert, hvilke regler vi følger og hva som er besluttet. Oppdateres i samme
commit som endringen den beskriver.

**Branch:** `growth/growth-marketing-seo` · **Bygger på:** `tjenester` (ny IA, Øyvind)

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
| Samleside og 10 tjenestesider | Dummyer med mal og plassholdere, `noindex`, ikke i XML-sitemap |
| Menyforslag | Ligger i `lib/growthServices.ts` (`growthNavItem()`). **Ikke koblet inn** i headeren ennå (se §5) |
| Ekte innhold | Ikke startet. Neste steg: samlesiden og SEO |
| Innhold i Sanity | Ikke startet. Innholdet ligger i kode til tekstene er klare |

## 3. Struktur

### Meny (forslag, følger de andre fanene)

```
Growth marketing ▾
  STRATEGI OG INNSIKT          ANNONSERING     EGNE KANALER
  Growth marketing oversikt    SEM             SEO
  Merkevare og strategi        SoMe            E-postmarkedsføring
  Sporing og analyse                           CRO
```

Regler for menyen:
- **Overskrifter:** Kolonner med overskrift, som Tjenester og Integrasjoner.
- **Oversikt først:** Oversiktslenken står først i første kolonne.
- **Bare navn:** Ingen undertekster i Growth-menyen.
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

**Før push:** `npx tsc -p tsconfig.typecheck.json --noEmit` og `npx next lint`.

## 7. Åpne spørsmål

- [ ] **Navnekollisjon:** Shopify-pakken heter «Growth» (`/tjenester/alle-pakker/growth`, 8 000 kr/mnd). Gi pakken nytt navn, eller behold? *(Avventer.)*
- [ ] **Kolonner:** Tre kolonner i Growth-menyen, mot to i de andre fanene. OK?
- [ ] **Øyvind:** Kobler han inn `growthNavItem()`? Til da viser headeren den gamle Growth-menyen, der bare SEO-lenken treffer en av sidene våre.
- [ ] **Priser:** Priser for growth-pakkene.
- [ ] **Sanity:** Når teksten er klar, skal innholdet flyttes til en egen sidetype i Sanity.
- [ ] **Låsefil:** `package-lock.json` er ute av synk med `package.json` (eksisterte fra før). Bør fikses i egen commit.

## 8. Beslutningslogg

| Dato | Beslutning | Begrunnelse |
|---|---|---|
| 2026-10-16 | Growth-arbeidet bygger på `tjenester` / `feature/website-updates` (ny IA), ikke `main` | Den nye IA-en har allerede en Growth marketing-meny |
| 2026-10-16 | URL-er under `/growth-marketing/<tjeneste>` | Følger IA-en; samler sidene i én klynge for Google og AI-søk |
| 2026-10-16 | GEO / AI-synlighet er en del av SEO, ikke egen side | Én tydelig SEO-tjeneste |
| 2026-10-16 | SEM med Google Ads og Bing Ads som undersider; SoMe med Meta Ads | Kanalene får egne sider uten å fylle menyen |
| 2026-10-16 | «Direkte markedsføring» → «E-postmarkedsføring», med 1:1 som vinkling | Det folk søker på og det vi leverer (Klaviyo); «direkte markedsføring» er tvetydig på norsk |
| 2026-10-16 | Ikke SMS i navn eller meny | Fokus på e-post |
| 2026-10-16 | Ingen undersider og ingen undertekster i menyen | Menyen ble for tung |
| 2026-10-16 | Menyen grupperes i Strategi og innsikt · Annonsering · Egne kanaler | Følger strukturen i de andre fanene; skiller betalt og eid |
| 2026-10-16 | CRO flyttes til `/growth-marketing/cro` | Fjernet fra Tjenester-menyen av Øyvind (e13b72b) |
| 2026-10-16 | `lib/navigation.ts` eies av Øyvind; Growth endrer den ikke | Unngå merge-konflikter |
| 2026-10-16 | Dummysidene ligger i kode, med noindex | Ingen skrivetilgang til Sanity; sidene skal ikke indekseres med plassholdertekst |
