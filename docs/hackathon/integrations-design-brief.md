# Design brief: Integrations pillar for scandicommerce.no

Design canvas (Claude Design): https://claude.ai/artifact/LMYNNzjzegn2xegYPmnpff
Use the organization's **Scandicommerce Design System** as the source of truth. Do not
invent new tokens, radii, shadows or easing. When in doubt, prefer less.

---

## 0. Facts that must not be contradicted

- **No prices on integration pages.** No "fra X kr", no pricing signal, no cost bands.
  The existing `pricingSignal` field is removed from the schema.
- **Tripletex is one-way: Shopify → Tripletex.** Orders, customers, invoices,
  credit notes, optional monthly samlebilag. No inventory sync from Tripletex to
  Shopify. No payment status back. Shopify is the source of truth for inventory.
- **Omnium is in scope** and is the two-way example: Shopify → Omnium orders,
  Omnium → Shopify inventory, Omnium EDI (Coop, XXL, Sport Holding) → Tripletex.
- **Named clients need approval** before publishing. Mockups use real names so the
  design reads true, but each one is confirmed with the client first.
- The system list comes from active Make.com scenarios and the Brain integration
  docs, not from guesswork. See section 7.

## 1. What we are building

A new marketing pillar, **Integrations**, for a Norwegian Shopify Plus agency.
It explains how we connect Shopify to the systems a Nordic merchant already runs,
and shows the actual data flow for each one.

| # | Template | Norwegian URL | English URL |
|---|---|---|---|
| 1 | Integrations hub (pillar) | `/no/integrasjoner` | `/en/integrations` |
| 2 | Category page | `/no/integrasjoner/erp` | `/en/integrations/erp` |
| 3 | Integration detail | `/no/integrasjoner/tripletex` | `/en/integrations/tripletex` |
| 4 | Data-flow animation (Remotion) | embedded in 1 and 3 | same |

Routes are slug-driven from Sanity, per language. The header menu already links
to `/integrasjoner` and the categories erp, pim, logistikk, betaling. The hub shows
more categories than the menu does.

Navigation (`lib/navigation.ts`, header and footer components, `headerSettings`
schema) is owned by Øyvind during the hackathon. This pillar must not change any of
those files.

## 2. Brand and design constraints (hard rules)

- Wordmark in copy: `scandicommerce`, lowercase, one word.
- One typeface: Space Grotesk. Numbers, code, system names and direction labels in
  JetBrains Mono.
- Accent: `#1DEFFA` for the primary CTA fill (black text), `#16a7b3` (sc-cyan-500)
  for eyebrows, pulses, icon discs and inline accent. Never cyan body text.
- Neutrals: headings `#12181a`, body `#3a444a`, captions `#5a6670`, border
  `#eceef0`, alt section bg `#f6f7f8`, ink sections `#12181a`.
- Cards: white, 1px border, 8px radius, shadow-sm, hover lifts 4px.
- Buttons: square, uppercase, 0.10em tracking, 16px 32px padding.
- Casing: sentence case headings, UPPERCASE 0.12em eyebrows.
- Tone: plainspoken, technical. No emoji, no exclamation marks, no marketing
  adjectives. Say what is not included.
- Bilingual: no fixed-width chips or buttons.

## 3. Schema

### Existing on `integrationPage` (sanity/schemas/documents/pillarPage.ts)

language, pageTitle, slug, definition (40 to 60 words), intro, heroImage, author,
integrationName, vendorUrl, whatItIs, whyItMatters, implementationSteps[],
dataFlow (image, becomes the animation poster fallback), prerequisites[],
sections[], faq[], cta, namedClients[], pillar, clusterLinks[], relatedPages[],
relatedCaseStudies[], seoExtended.

**Remove:** `pricingSignal`.

### New fields on `integrationPage`

| Field | Type | Purpose |
|---|---|---|
| `logo` | image (SVG) | Vendor logo on cards and hero |
| `category` | ref to `integrationCategory` | Grouping and category pages |
| `shortDescription` | string, max 140 | Card teaser |
| `integrationMethod` | `make`, `code`, `app`, `connector` | Badge and animation variant |
| `status` | `live`, `pilot` | Pilot badge (Fiken) |
| `syncDirection` | `one-way`, `two-way` | Badge, return edge in animation |
| `systems[]` | {name, logo, role: source, middleware, target} | Animation nodes |
| `dataFlowSteps[]` | {from, to, payload, trigger, frequency} | Animation edges and the legend |
| `capabilities[]` | ordre, kunder, faktura, kreditnota, bilagsjournal, lager, produkter, forsendelser, betaling, edi, sporing, booking | Chips and matrix |
| `notIncluded[]` | strings | Honest "what this does not do" rows |
| `featured` | boolean | Pin on hub |

### New document `integrationCategory`

language, title, slug (erp, oms, pim, logistikk, betaling, pos, markedsforing,
booking), definition, intro, heroImage, order, seoExtended.

### Hub

Existing `pillarPage` with slug `integrasjoner`. The children query already lists
integration pages by pillar reference.

## 4. Page designs

See the canvas. Section order per template is fixed there:

- **Hub:** hero with overview animation, category cards, filterable grid, Make.com
  vs custom code comparison, named clients, FAQ, CTA band, read next.
- **Category:** breadcrumb, hero, "what moves" cards with direction, grid, FAQ, CTA.
- **Detail:** breadcrumb, hero with method and direction badges and a delivery
  models card (no price), data-flow animation with mono legend, what it is and
  why, capability matrix with "not included" rows, implementation steps,
  prerequisites, named clients, long-form sections with TOC, case studies, FAQ,
  related integrations, CTA, read next.
- **Mobile 390:** same content, 1:1 animation crop, matrix as stacked rows.

## 5. Remotion

Three compositions, played with `@remotion/player`. 1600×900, 30 fps, ease-in-out,
no overshoot. Poster frame at about 60 percent. Reduced motion shows the poster.

- **A, Make.com path** (`integrationMethod = make`): Shopify → Make scenario card
  (trigger, filter, action modules light up in turn) → target. One-way.
- **B, custom code path** (`code`): Shopify → terminal card (receive, verify,
  map, send, retry on 429 in amber, success) → target. Return edge only when
  `syncDirection = two-way`. Omnium is the example.
- **C, hub overview**: Shopify as a tall bar in the centre, four category nodes,
  continuous low-key pulses, seamless 10 s loop.

Storyboards with six keyframes each are on the canvas. Node, edge, pulse and
label primitives are on the component sheet, light and ink variants.

## 6. Deliverables (done on the canvas)

1. Three page templates desktop, detail at mobile width.
2. Component sheet: integration card, category card, method, status and direction
   badges, capability chips, filter chips, direction label, legend row, Remotion
   primitives.
3. Three animation storyboards.
4. Schema map.

## 7. Systems, from Make.com and the Brain

| Category | Systems | Method | Direction |
|---|---|---|---|
| ERP og økonomi | Tripletex, 24SevenOffice (Finago), PowerOffice Go, Fiken (pilot), UniMicro (app), TRIMIT (inventory only) | Make.com, app | Shopify → ERP, except UniMicro and TRIMIT inventory back |
| OMS, lager og EDI | Omnium, Holio, Ongoing WMS, Sparklayer, EHF samlefaktura | Make.com + connector, app | Omnium two-way |
| PIM og produktdata | Vuuh, DatafeedWatch, Google Merchant Center | app | PIM → Shopify |
| Logistikk og frakt | Bring, Profrakt, nShift, Logistra, Quickship | app, Make.com | Shopify → carrier, tracking back |
| Betaling | Vipps Hurtigkasse, Klarna, Dintero, Shopify Payments | app | payment → Shopify, settlement → ERP |
| POS og butikk | Shopify POS, Front Systems, PCKasse (migration) | Make.com | Front two-way |
| Markedsføring og sporing | Klaviyo, MarketingPlatform, Tracklution, Judge.me, Lipscore | app, Make.com, custom code | Shopify → tool |
| Booking og annet | Podio, IzyRent, Moodle, Google Sheets | Make.com | Podio two-way |

Active Make.com scenarios behind this (team Scandicommerce): Tripletex B2C and B2B
per order (Fotobaren, Clubassist), samlebilag per month (Hanske-Hallen, Makeup
Mekka), Tripletex 72h invoicing and return income (Fotobaren), Finago B2B order
created and refunds to credit note (Julie Josephine), PowerOffice Go B2C and B2B
(BeautyHeaven, Babysensor, Universal Biology), Shopify → Omnium orders and Omnium →
Shopify inventory (Nsport, Eagle), Omnium EDI → Tripletex, TRIMIT inventory sync,
Front Systems (Tønnesen), Podio booking → Shopify and Profrakt (Fotobaren),
MarketingPlatform signup sync (Makeup Mekka), Moodle user creation (Note.no),
Fiken test. Brain docs: integrations/tripletex, omnium-edi, finago-24sevenoffice,
poweroffice-go, patterns/make-com.

### Tripletex detail page content

Definition: sends paid Shopify orders to Tripletex as order and invoice with
customer, shipping and VAT, per order or as monthly samlebilag. Refunds become
credit notes. One-way. Runs as a Make.com scenario in the client's own account.
Invoices are created but not sent until the accountant has reviewed them.

Delivery models: B2C per order, B2B per order with org number, samlebilag per
month (idempotent), EDI via Omnium.

Not included: inventory (Shopify is the source of truth, Omnium or Holio if OMS
is needed), payment status back (orders are already paid when sent).

Named clients: Fotobaren, Hanske-Hallen, Makeup Mekka, Clubassist. Confirm before
publishing.

## 8. Internal linking

The SEO phase-1 work already gives us the plumbing: `relatedPages` on every
document type (minimum two, required on templates), `pillar`, `clusterLinks` and a
`children` query on the templates, BreadcrumbList JSON-LD on every sub-page, a
"Les videre" block, and an orphan check in `scripts/seo-health-check.mjs`. The
pillar has to use all of it. Link map is on the canvas (Internal linking map).

### Structure

| From | Must link to |
|---|---|
| Hub `/integrasjoner` | every category card, every integration (children list and grid), the Make.com vs code section anchors, two case studies, Alle pakker, Shopify-migrering, Partnere |
| Category `/integrasjoner/erp` | breadcrumb and intro link up to the hub, every integration in the category, two sibling categories, one service page (ERP → Enterprise-pakke, Betaling → Vipps Hurtigkasse, POS → Shopify POS, PIM → Shopify x PIM) |
| Detail `/integrasjoner/tripletex` | breadcrumb (hub, category), `pillar`, 2 to 4 siblings as `clusterLinks`, at least one case study, `relatedPages` with the category page plus one service page, inline first-mention links in the body (Omnium, samlebilag, Shopify POS), the matching blog post where one exists |

### Inbound from pages that already rank (Sanity edits, no code)

| Existing page | Add link to |
|---|---|
| Blog: Finago / 24SevenOffice-integrasjon mot Shopify Plus | 24SevenOffice detail, hub |
| Vipps Hurtigkasse page and blog post | Vipps detail, Betaling category |
| Shopify POS service and info pages | Front Systems detail, POS category |
| Enterprise package, Alle pakker | hub |
| Shopify-migrering | hub, "integrasjoner etter flytting" |
| Partnere | Omnium, Front Systems, Tracklution details |
| Shopify x PIM, Shopify-utvikling | PIM category, hub |

Navigation and footer already link the hub and four categories. That is Øyvind's
branch and stays as is.

### Rules

- Anchor text names the system and the action: "Tripletex-integrasjon for
  Shopify", "alle regnskapsintegrasjoner". Never "les mer" as the only link text
  on a card; the card title is the link.
- Every integration page has at least three inbound internal links at launch:
  hub, category, one sibling or related page. The orphan check must pass.
- Keep contextual links in body copy to about eight per detail page.
- Norwegian and English pages link within their own language. Cross-language
  links go through `lib/routes.ts` and are flagged.
- One Brain integration doc becomes one blog post later. Each post links to its
  detail page and the detail page links back under "Les videre".
- Section anchors (`#samlebilag`, `#feil`) are stable and used by the TOC, so
  other pages can deep-link to them.

## 9. Implementation status (2026-10-16, end of day)

Done on branch `hackathon/chris-marketing-pillar`, uncommitted:

- Schema: `integrationCategory` document; `integrationPage` gained logo, category,
  shortDescription, integrationMethod (make, code, app, connector), status,
  syncDirection, capabilities, notIncluded, systems, dataFlowSteps, featured.
  `pricingSignal` removed. Method label reads "Connector", not "Konnektor".
- Renderers: `integrationDetailPage.tsx`, `integrationCategoryPage.tsx`, hub
  sections injected into `templatePage.tsx` for the pillar at slug `integrasjoner`.
  Category cards use Lucide icons on the cyan disc. Hub bottom is a compact 2×2
  grid of the pillar sections plus FAQ, the duplicate link lists are gone.
- Remotion: `components/integrations/remotion/FlowComposition.tsx` plays every
  `dataFlowSteps` entry as a beat (trigger badge → pulse with payload → Make
  modules or terminal lines → receipt under the destination). Steps resolve their
  origin and destination by name across source, middleware and target, so
  Omnium → Tripletex plays as its own segment. Logos keep brand colours, Shopify
  stays green. Hub overview shows vendor logos per category. Static SVG poster is
  the reduced-motion and no-JS fallback. Pinned to remotion 4.0.258 and
  @remotion/player 4.0.258: 4.0.536 expects React 19 and the timeline never
  advanced on React 18.
- Seed: `scripts/seed-integrations.ts` writes 1 pillar, 8 categories, 35
  integration pages (incl. Business Central, Visma.net, Feed, Emfas, Vuuh,
  DataFeedWatch, Holio, Quickship, Logistra, Judge.me, Lipscore, Moodle, IZY,
  Google Sheets) with logos to the development dataset. Re-runnable.
- Logos: Emfas (emfas.ai), Feed (feed-pim.com) and Holio (holio.ai) fetched via
  the browser. Marks only: Bring, nShift, Judge.me, SparkLayer, Podio,
  Tracklution, Vuuh, Visma.
- Validation: `sanity documents validate --dataset development` reports 0 errors
  on the 44 seeded documents (42 pre-existing errors on other content types).
- Studio: chris@scandicommerce.no via Google is not a member of project
  fk1tt27l. The CLI session works, so the member identity is another provider
  or account. Log in with that one to review in Studio.

Open: commit checkpoint, English content, inbound links from existing pages in
Sanity, case study references, Studio visual check, align the hub hero width
(880) with the new sections (1100).
