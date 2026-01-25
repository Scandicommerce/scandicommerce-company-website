import { defineArrayMember, defineField, defineType } from "sanity";

export const shopifyTcoCalculatorPage = defineType({
  name: "shopifyTcoCalculatorPage",
  title: "Shopify TCO Calculator Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "pageTitle", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    // Hero Section
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "heroTitle",
          title: "Hero Title",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Main Text", type: "string" }),
            defineField({ name: "highlight", title: "Highlighted Text", type: "string" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 4 }),
        defineField({
          name: "platforms",
          title: "Platform Buttons",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "List of platform names for selection buttons (e.g., 'Woocommerce', 'Adobe (Magento)')",
        }),
      ],
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: { select: { title: "pageTitle" } },
});
