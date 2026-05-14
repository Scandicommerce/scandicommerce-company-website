import { defineField } from "sanity";

/**
 * Shared field helpers for the SEO migration.
 *
 * Every page document type should:
 *   1. Replace its existing inline `seo` field with `seoExtendedField`
 *   2. Add the matching legacy variant (`legacySeoFieldMinimal` for most
 *      pages, `legacySeoFieldWithOgImage` for `landingPage` and
 *      `servicesPage`) directly after it.
 *
 * The legacy field is `readOnly` and hidden when empty so existing data
 * isn't lost. It will be removed after the data migration
 * (`migrate-seo-to-seoExtended`) is run and verified.
 */

export const seoExtendedField = defineField({
  name: "seoExtended",
  title: "SEO",
  type: "seo",
  description: "Search engine and social sharing metadata.",
});

export const legacySeoFieldMinimal = defineField({
  name: "seo",
  title: "SEO (legacy — read-only)",
  type: "object",
  deprecated: {
    reason:
      "Use the new SEO field above. Will be removed once data is migrated.",
  },
  readOnly: true,
  hidden: ({ value }) => !value,
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
  ],
});

export const legacySeoFieldWithOgImage = defineField({
  name: "seo",
  title: "SEO (legacy — read-only)",
  type: "object",
  deprecated: {
    reason:
      "Use the new SEO field above. Will be removed once data is migrated.",
  },
  readOnly: true,
  hidden: ({ value }) => !value,
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
    }),
  ],
});
