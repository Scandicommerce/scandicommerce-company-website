import { defineField } from "sanity";

/**
 * Shared SEO field. Every page/document type adds `seoExtendedField`
 * (type `seo`, see objects/seo.ts). The legacy inline `seo` object was
 * migrated into `seoExtended` and removed (scripts/sanity-migrate-seo.ts).
 */
export const seoExtendedField = defineField({
  name: "seoExtended",
  title: "SEO",
  type: "seo",
  description: "Search engine and social sharing metadata.",
});
