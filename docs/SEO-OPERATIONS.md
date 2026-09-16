# SEO operations — scandicommerce.no / scandicommerce.com

Implements `TECHNICAL-SEO-SPEC.md` Phase 1 + 2 and the buildable parts (§6–§8) of
`SITE-SEO-ARCHITECTURE.md`. This page is the runbook: what the code does, what must
be flipped by hand, and in which order.

## 1. Architecture in the code

| Concern | Where |
|---|---|
| The two origins, languages, hreflang codes | `lib/site-config.ts` (**only** place with domain names) |
| URL shapes (`/blogg/<slug>`, `/kundecaser/<slug>`, `/sv/...`) | `lib/routes.ts` — `docPath`, `publicPath`, `absoluteUrl`, `hrefFor` |
| Canonical + hreflang cluster | `lib/seo/buildHreflang.ts` → `lib/seo/buildMetadata.ts` |
| Host / locale / legacy-path normalisation (308s) | `middleware.ts` |
| Renamed and legacy Shopify URLs (308s, host-scoped) | `lib/seo/legacyRedirects.js` ← `lib/seo/url-plan.json` |
| Sanity-managed redirects (editorial) | `redirect` documents → `next.config.js` + middleware |
| Prefix-aware routing + canonical redirect | `lib/resolvePageByPath.ts`, `app/[lang]/[...slug]/page.tsx` |
| Sitemap per origin, robots per origin | `app/sitemap.xml/route.ts`, `app/robots.ts` |
| One JSON-LD `@graph` per page | `components/JsonLd.tsx` ← `lib/seo/pageJsonLd.ts` |
| Default OG image, favicon | `app/opengraph-image.tsx`, `app/icon.svg`, `app/apple-icon.png` |
| Preview noindex header | `next.config.js` `headers()` (VERCEL_ENV ≠ production) |
| SEO templates (pillar / integration / migration) | `sanity/schemas/documents/pillarPage.ts`, `app/[lang]/_pages/templatePage.tsx` |
| Verification | `npm run seo:verify`, `npm run seo:health` (see `scripts/seo/README.md`) |

Deployment model: **one Vercel project, two domains** (Option B in the spec, but without
request-time cost: every route is already `force-dynamic`). The site is resolved from the
`x-site` header set by middleware, falling back to the Host header. `NEXT_PUBLIC_SITE=no|com`
pins previews to one site if wanted. `NEXT_PUBLIC_SITE_URL*` env vars are no longer read.

## 2. Release sequence (do in this order)

1. **Merge + deploy** the branch. Old slugs keep working (resolver falls back through the URL plan).
2. **Publish the Sanity drafts** created on 2026-09-16 (82 slug renames + link fixes + `siteSettings-en`
   + 10 title/description rewrites). In Studio: *Review changes* on each, or publish the list in
   `scripts/seo/sanity-drafts-2026-09-16.json` via the Sanity MCP `publish_documents`.
   Until published, the new URLs still resolve; after publishing, the transitional fallback is unused.
3. **Vercel → Domains**: make `scandicommerce.no` and `scandicommerce.com` the primary domains and set
   `www.scandicommerce.no` / `www.scandicommerce.com` to *Redirect to* the apex with status **308**
   (Vercel defaults to 307 = temporary; pick permanent). Done for `.no` on 2026-09-16 but with 307, and
   `www.scandicommerce.com` still serves pages (200) instead of redirecting.
4. After step 3 is live, set the env var `SEO_ENFORCE_APEX_HOST=true` (production) and redeploy — the
   middleware then also 308s any legacy host that reaches the origin. **Never set it before step 3:**
   the two redirects would loop.
5. Run `npm run seo:verify -- --expect-apex` and `npm run seo:health`. Both must be green.
6. **Search Console**: add domain properties `scandicommerce.no`, `scandicommerce.com`; submit
   `https://scandicommerce.no/sitemap.xml` and `https://scandicommerce.com/sitemap.xml`; request
   indexing of both homepages, the nine priority URLs (§12.2) and the top redirected URLs.
7. **shopify.scandicommerce.no** (Task 6, Shopify admin, not this repo): URL Redirects for the 42
   indexed paths → the `.no` equivalents (use the same map as `lib/seo/legacyRedirects.js`
   `SHOPIFY_LEGACY` + `MERCH_HANDLES`; `/blogs/...` → the mapped `/blogg/...`), then
   `Disallow: /` in `robots.txt.liquid` and `<meta name="robots" content="noindex">` in `theme.liquid`
   if the store must stay reachable for merch checkout.

## 3. Content rules enforced by Sanity

- Slugs: lowercase, hyphens, no locale prefix, ≤3 segments (`sanity/lib/slugValidation.ts`).
- `seo.metaTitle` ≤60, `seo.metaDescription` ≤155 (errors). Do not put the brand in the title;
  the template appends ` | scandicommerce` unless the title already contains it.
- `relatedPages` ≥2 — warning on legacy types, error on pillar / integration / migration pages.
- Pillar pages: 4–8 sections, ≥4 FAQ items, definition of 40–60 words, named author, CTA.
- Integration pages: what/why/how (HowTo), data-flow diagram, prerequisites, pricing signal, ≥1 named client.
- Migration pages: source platform, transfers / does not transfer, timeline, risks, cost band, named case.

## 4. Visual editing (Presentation tool)

Draft mode is enabled through `/api/draft-mode/enable` (untouched by the SEO work). On 2026-09-16 that
route returned **500 on production**. Reproduced locally: a missing or invalid `SANITY_API_READ_TOKEN`
produces exactly that 500 (`client must have a token` / `Unauthorized - Session not found`); with a valid
token an unknown secret returns 401. Check the token in Vercel → Environment Variables (needs Viewer
access on project `fk1tt27l`) and redeploy. Everything else the Presentation tool needs (`/studio`,
`sanityPageFetch` draft perspective, `<VisualEditing />`) is unchanged.

## 5. Known content gaps (not code)

- No Norwegian `caseStudy` documents exist; `/kundecaser` shows English cases with absolute links to
  `.com` (flagged `data-cross-locale`). Create NO case studies for Slikkepott and Lanullva.
- `foundation` package pages are drafts in every language; links point to the packages index instead.
- `siteSettings-no` has no `defaultOgImage`; the generated `/opengraph-image` is used as fallback.
- `de` homepage is a draft: `/de` renders an empty homepage. Publish or remove the `de` locale.
