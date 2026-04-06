import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const migratePageHeroSection = defineType({
  name: "migratePageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Main Text",
          type: "string",
          description: "e.g., 'Migrate to Shopify without the risk'",
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "Text to highlight in teal (e.g., 'Shopify without')",
        }),
      ],
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroButtons",
      title: "Hero Buttons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "text", title: "Button Text", type: "string" }),
            defineField({ name: "link", title: "Button Link", type: "string" }),
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
              options: { list: ["primary", "secondary"] },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const migratePagePlatformsSection = defineType({
  name: "migratePagePlatformsSection",
  title: "Platforms",
  type: "object",
  fields: [
    defineField({
      name: "platformsTitle",
      title: "Title",
      type: "string",
      description: "e.g., 'We migrate from any platform'",
    }),
    defineField({
      name: "platformsItems",
      title: "Platform Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Platform Name", type: "string" }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: "e.g., 'Typical: 4-6 weeks'",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Platforms" }) },
});

export const migratePageRisksProtectionSection = defineType({
  name: "migratePageRisksProtectionSection",
  title: "Risks & protection",
  type: "object",
  fields: [
    defineField({
      name: "risksTitle",
      title: "Risks Title",
      type: "string",
      description: "e.g., 'Migration risks we eliminate'",
    }),
    defineField({
      name: "risksItems",
      title: "Risk Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "text", title: "Risk Text", type: "string" })],
        }),
      ],
    }),
    defineField({
      name: "protectionTitle",
      title: "Protection Title",
      type: "string",
      description: "e.g., 'How we protect your business'",
    }),
    defineField({
      name: "protectionItems",
      title: "Protection Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Risks & protection" }) },
});

export const migratePageProcessSection = defineType({
  name: "migratePageProcessSection",
  title: "Migration process",
  type: "object",
  fields: [
    defineField({
      name: "processTitle",
      title: "Title",
      type: "string",
      description: "e.g., 'Our migration process'",
    }),
    defineField({
      name: "processSubtitle",
      title: "Subtitle",
      type: "string",
      description: "e.g., 'Typical 6-week timeline for standard migrations'",
    }),
    defineField({
      name: "processPhases",
      title: "Process Phases",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "week",
              title: "Week",
              type: "string",
              description: "e.g., 'Week 1'",
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "activities",
              title: "Activities",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Migration process" }) },
});

export const migratePageResultsSection = defineType({
  name: "migratePageResultsSection",
  title: "Results",
  type: "object",
  fields: [
    defineField({
      name: "resultsTitle",
      title: "Title",
      type: "string",
      description: "e.g., 'Real migration results'",
    }),
    defineField({
      name: "resultsItems",
      title: "Result Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "metric",
              title: "Metric",
              type: "string",
              description: "e.g., '-73%'",
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Results" }) },
});

export const migratePageCtaSection = defineType({
  name: "migratePageCtaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "ctaTitle", title: "Title", type: "string" }),
    defineField({ name: "ctaDescription", title: "Description", type: "text" }),
    defineField({ name: "ctaButtonText", title: "Button Text", type: "string" }),
    defineField({ name: "ctaButtonLink", title: "Button Link", type: "string" }),
  ],
  preview: {
    select: { t: "ctaTitle" },
    prepare({ t }: { t?: string }) {
      return { title: t || "CTA" };
    },
  },
});

export const migratePage = defineType({
  name: "migratePage",
  title: "Migrate Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
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
      options: {
        source: "pageTitle",
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "migratePageHeroSection" }),
        defineArrayMember({ type: "migratePagePlatformsSection" }),
        defineArrayMember({ type: "migratePageRisksProtectionSection" }),
        defineArrayMember({ type: "migratePageProcessSection" }),
        defineArrayMember({ type: "migratePageResultsSection" }),
        defineArrayMember({ type: "migratePageCtaSection" }),
      ],
    }),
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
  preview: {
    select: {
      title: "pageTitle",
    },
  },
});
