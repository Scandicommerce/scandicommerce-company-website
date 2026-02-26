# Slug-driven routing

Routes are driven by **Sanity slugs** so you can change the page URL by editing the slug in Sanity (per language).

## Structure

- **`app/page.tsx`** – Root redirects to default language (via middleware).
- **`app/[lang]/page.tsx`** – Homepage (landing page with `isHomepage: true` in Sanity).
- **`app/[lang]/[...slug]/page.tsx`** – Catch-all: resolves URL path to a Sanity document by slug + language, then renders the matching page.
- **`app/[lang]/_pages/`** – Page components used by the catch-all (one file per document type).

## How it works

1. User visits e.g. `/no/om-oss`.
2. Middleware ensures the first segment is a locale (`no`).
3. The catch-all receives `slug = ['om-oss']`, builds path `"om-oss"`, and calls `resolvePageByPath("om-oss", "no")`.
4. Sanity is queried for a document with `slug.current == "om-oss"` and `language == "no"`.
5. If found (e.g. `aboutPage`), the corresponding component from `_pages` is rendered.

So **the URL is exactly the slug** you set in Sanity for that page and language.

## Setting slugs in Sanity

- Use the **Slug** field on each page document.
- Slug can be one segment (`about`, `om-oss`) or multiple (`services/all_packages`, `shopify/why_shopify`). Use **one slug value** that contains the full path (e.g. `services/all_packages`), so the URL is `/[lang]/services/all_packages`.
- Each language version can have its own slug (e.g. English `about`, Norwegian `om-oss`).

## Current behaviour

- **Fixed routes** under `app/[lang]/` (e.g. `about`, `contact`, `shopify/...`) still exist. So both work:
  - `/en/about` (fixed route)
  - `/en/om-oss` (catch-all, if you have an about page with slug `om-oss` in Sanity for that language)
- To rely **only** on Sanity slugs, you would remove those fixed route folders and move each page’s content into `app/[lang]/_pages/` (so the catch-all is the only handler for those paths).

## Special cases

- **Homepage** – No slug in URL; served by `[lang]/page.tsx` using the landing page with `isHomepage: true`.
- **Blog post** – Path like `resources/my-article` is resolved to `blogPost` with slug `my-article`.
- **Package detail** – Path like `services/all_packages/growth-package` is resolved to `packageDetailPage` with slug `growth-package`.
- **Merch product** – Path `merch/product-handle` is resolved to the Shopify product with that handle (not a Sanity document).
