# SEO tooling

| Script | Purpose |
|---|---|
| `npm run seo:verify -- --origin=https://scandicommerce.no --origin=https://scandicommerce.com` | TECHNICAL-SEO-SPEC Task 11: canonicals, sitemap, redirects (GSC inventory), hreflang reciprocity, locale hygiene, noindex coverage, structured data, metadata, internal links. Exit 1 on failure. Add `--expect-apex` once the Vercel domain flip (www → apex) is live, `--preview-url=<vercel preview>` to check D8, `--base=http://localhost:3000` to test a local build with Host-header spoofing. |
| `npm run seo:health` | Sanity-driven: every published document → expected canonical URL → live 200 + self-canonical; slug taxonomy, SEO field limits, related-pages (orphan) coverage, unpublished translation siblings. |
| `npm run seo:plan` | Regenerates `lib/seo/url-plan.json` from a dataset dump (`*[!(_id in path("drafts.**"))]` saved as JSON). Feeds the generated redirects and the middleware's static path vocabulary. |

Inventory CSVs in `scripts/seo/inventory/` are the Google Search Console *Pages* exports (92 days to the date in the filename). Every URL in them must resolve to a 200 or a single 301/308 to a 200.
