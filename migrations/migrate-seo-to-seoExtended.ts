import { at, defineMigration, setIfMissing } from "sanity/migrate";

/**
 * One-shot migration: copy legacy `seo.*` fields into the new
 * `seoExtended.*` across every page document type.
 *
 * RUN ORDER:
 *
 *   # 1. Dry run (default — safe, no writes)
 *   npx sanity@latest migration run migrate-seo-to-seoExtended
 *
 *   # 2. Review the dry-run output. Confirm the doc count looks right.
 *
 *   # 3. Execute for real
 *   npx sanity@latest migration run migrate-seo-to-seoExtended --no-dry-run
 *
 * Run this only AFTER the Studio code in this repo has been deployed,
 * so that the `seoExtended` field is part of the live schema.
 *
 * Idempotent: the GROQ filter `defined(seo) && !defined(seoExtended)`
 * ensures only docs that haven't been migrated yet are touched.
 */

const PAGE_TYPES = [
  "landingPage",
  "blogPost",
  "post",
  "aboutPage",
  "contactPage",
  "servicesPage",
  "workPage",
  "blogPage",
  "shopifyDevelopmentPage",
  "migratePage",
  "shopifyPosPage",
  "shopifyPosInfoPage",
  "allPackagesPage",
  "shopifyPlatformPage",
  "shopifyTcoCalculatorPage",
  "shopifyXPimPage",
  "shopifyXAiPage",
  "whyShopifyPage",
  "partnersPage",
  "packageDetailPage",
  "merchPage",
  "vippsHurtigkassePage",
];

export default defineMigration({
  title: "Migrate inline seo to seoExtended across all page types",
  documentTypes: PAGE_TYPES,
  filter: "defined(seo) && !defined(seoExtended)",
  migrate: {
    document(doc) {
      const oldSeo = doc.seo as
        | {
            metaTitle?: string;
            metaDescription?: string;
            ogImage?: unknown;
          }
        | undefined;

      if (!oldSeo) return;
      if (doc.seoExtended) return;

      const newSeo: Record<string, unknown> = {};
      if (oldSeo.metaTitle) newSeo.metaTitle = oldSeo.metaTitle;
      if (oldSeo.metaDescription)
        newSeo.metaDescription = oldSeo.metaDescription;
      if (oldSeo.ogImage) newSeo.ogImage = oldSeo.ogImage;

      if (Object.keys(newSeo).length === 0) return;

      return [at("seoExtended", setIfMissing(newSeo))];
    },
  },
});
