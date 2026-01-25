import { defineArrayMember, defineField, defineType } from "sanity";

export const migratePage = defineType({
  name: "migratePage",
  title: "Migrate Page",
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
      options: {
        source: "pageTitle",
        maxLength: 96,
      },
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
    }),
    // Platforms Section
    defineField({
      name: "platforms",
      title: "Platforms Section",
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
                defineField({ name: "duration", title: "Duration", type: "string", description: "e.g., 'Typical: 4-6 weeks'" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Risks and Protection Section
    defineField({
      name: "risksProtection",
      title: "Risks & Protection Section",
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
              fields: [
                defineField({ name: "text", title: "Risk Text", type: "string" }),
              ],
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
    }),
    // Migration Process Section
    defineField({
      name: "process",
      title: "Migration Process Section",
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
                defineField({ name: "week", title: "Week", type: "string", description: "e.g., 'Week 1'" }),
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
    }),
    // Results Section
    defineField({
      name: "results",
      title: "Results Section",
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
                defineField({ name: "metric", title: "Metric", type: "string", description: "e.g., '-73%'" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // CTA Section
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({
          name: "ctaTitle",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "ctaDescription",
          title: "Description",
          type: "text",
        }),
        defineField({
          name: "ctaButtonText",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "ctaButtonLink",
          title: "Button Link",
          type: "string",
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
  preview: {
    select: {
      title: "pageTitle",
    },
  },
});
