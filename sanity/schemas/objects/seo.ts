import { defineField, defineType } from "sanity";

/**
 * Reusable SEO object — referenced as `type: 'seo'` from the
 * `seoExtended` field on every page document type.
 *
 * Source of truth: production Sanity schema (project `fk1tt27l`,
 * dataset `production`). Extended via MCP on 2026-05-14.
 *
 * The legacy inline `seo` field on each page type is kept read-only
 * until the data migration (`migrate-seo-to-seoExtended`) runs.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description:
    "Search engine and social sharing metadata. All fields are optional.",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Overrides the page title in browser tabs and search results. Aim for 50–60 characters.",
      validation: (Rule) =>
        Rule.max(70).warning("Meta titles should be under 70 characters"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "Shown in search engine result snippets. Aim for 140–160 characters.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Meta descriptions should be under 160 characters"
        ),
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL override",
      type: "url",
      description:
        "Optional. Only set this if this page is a duplicate of another page.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "ogTitle",
      title: "Social title",
      type: "string",
      description: "Optional. Falls back to meta title.",
      validation: (Rule) =>
        Rule.max(95).warning("Keep social titles under 95 characters"),
    }),
    defineField({
      name: "ogDescription",
      title: "Social description",
      type: "text",
      rows: 3,
      description: "Optional. Falls back to meta description.",
      validation: (Rule) =>
        Rule.max(200).warning(
          "Keep social descriptions under 200 characters"
        ),
    }),
    defineField({
      name: "ogImage",
      title: "Social sharing image",
      type: "image",
      description:
        "1200×630 px recommended. Falls back to site-wide default OG image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "ogImageAlt",
      title: "Social image alt text",
      type: "string",
      description: "Describes the social image for accessibility.",
    }),
    defineField({
      name: "structuredDataType",
      title: "Structured data type (JSON-LD)",
      type: "string",
      description:
        "Tells the frontend which schema.org type to emit on this page.",
      options: {
        list: [
          { title: "None (default)", value: "none" },
          { title: "Article (blog posts, guides)", value: "Article" },
          { title: "Service (service/package pages)", value: "Service" },
          { title: "FAQPage (FAQ-heavy pages)", value: "FAQPage" },
          { title: "AboutPage", value: "AboutPage" },
          { title: "ContactPage", value: "ContactPage" },
          {
            title: "CollectionPage (blog index, listings)",
            value: "CollectionPage",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "none",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Adds noindex robots directive.",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "Do not follow links on this page",
      type: "boolean",
      description: "Adds nofollow to robots meta. Rarely needed.",
      initialValue: false,
    }),
  ],
});
