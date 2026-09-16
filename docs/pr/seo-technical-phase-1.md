# Technical SEO remediation — Phase 1 + 2, templates and verification

Implements `TECHNICAL-SEO-SPEC.md` (Tasks 1–5, 7–11) and the buildable parts of `SITE-SEO-ARCHITECTURE.md` (§6 URL taxonomy, §7 templates + schema, §8 internal linking, orphan check). Runbook with the manual release steps: `docs/SEO-OPERATIONS.md`.

## Deployment model
One Vercel project, two domains (spec Option B). Zero extra request-time cost: every route was already `force-dynamic`. The site is resolved from the `x-site` header set by middleware (fallback: Host). `NEXT_PUBLIC_SITE_URL*` are no longer read; the two origins live only in `lib/site-config.ts`.

## What changes for visitors and crawlers
- **Canonicals** are self-referencing on the serving origin (D1). `.com` no longer declares itself a duplicate of `.no`.
- **hreflang** clusters are reciprocal, keyed `nb-NO` / `en` / `sv-SE` / `da-DK` / `de-DE` / `x-default`(= .com), emitted only for published, indexable siblings (D6).
- **Locale prefixes** on `.no` and Norwegian paths on `.com` 308 to the right origin in one hop, including `/da/da/…` doubles and `/resources/<slug>` legacy shapes (D4, D5).
- **URL taxonomy**: lowercase, hyphens, ≤3 segments. 82 Sanity slugs renamed (drafts, publish after deploy); 303 generated host-scoped 308s + the old Shopify storefront paths; case studies move to `/kundecaser|/work/<client>`, articles to `/blogg|/blog/<slug>`.
- **Sitemaps** per origin with alternates, `lastmod` from Sanity, no priority/changefreq; **robots.txt** per origin; previews send `X-Robots-Tag: noindex` (D8); `/merch/*` and `/sitemap` are noindex (D7).
- **JSON-LD**: one `@graph` per page — Organization (with `sameAs` to the other domain, `taxID`, `contactPoint`), LocalBusiness on `.no` home/contact, WebSite, BreadcrumbList, Service/Offer on service pages, Article + client Organization on case studies, BlogPosting on posts, FAQPage where FAQ rows exist.
- **Titles**: brand suffix applied once (no more `… | scandicommerce | scandicommerce`), hard limits 60/155 with word-boundary truncation, branded default OG image at `/opengraph-image`, trefoil favicon (`app/icon.svg`, `app/apple-icon.png`).
- **Internal links** go through `lib/routes.ts`; cross-language links are absolute to the right origin and flagged `data-cross-locale`; the language switcher follows the page's hreflang alternates.
- Fixed: empty hero `<img src="">`, `/no/merch` footer link, `/team` (non-existent) → `#team`.

## Sanity
- `seo.metaTitle` ≤60 / `metaDescription` ≤155 are errors; canonical override must be https apex lowercase.
- Slug validation on all 25 slug fields (`sanity/lib/slugValidation.ts`).
- `relatedPages` reference array (warning on legacy types, required on templates).
- New document types `pillarPage`, `integrationPage`, `migrationPage` with the §7 required fields, rendered by `app/[lang]/_pages/templatePage.tsx`; `caseStudy` gains `seoExtended`.
- `siteSettings-en` created (draft) — `.com` had no site settings at all.

## Verification
- `npm run seo:verify` — Task 11 checks 1–11 against both origins (+ GSC inventory of 2026-09-16), fails CI on violations.
- `npm run seo:health` — Sanity-driven: every published doc → live 200 + self-canonical, taxonomy, SEO limits, related-pages coverage.
- `.github/workflows/seo-verify.yml` runs both daily.

## Manual steps after merge (in this order — see runbook)
1. Publish the Sanity drafts listed in `scripts/seo/sanity-drafts-2026-09-16.json`.
2. Vercel domains: apex primary, `www.` → redirect to apex.
3. Then set `SEO_ENFORCE_APEX_HOST=true` and redeploy.
4. `npm run seo:verify -- --expect-apex`; submit both sitemaps in GSC.
5. Shopify: redirects + noindex on `shopify.scandicommerce.no` (Task 6).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
