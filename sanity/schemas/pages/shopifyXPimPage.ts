import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";

export const shopifyXPimPage = defineType({
  name: "shopifyXPimPage",
  title: "Shopify x PIM Page",
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
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
      ],
    }),
    // What is PIM Section
    defineField({
      name: "whatIsPim",
      title: "What is PIM Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
        defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
        defineField({
          name: "quote",
          title: "Quote Block",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Quote Text", type: "text", rows: 3 }),
            defineField({ name: "author", title: "Author", type: "string" }),
          ],
        }),
      ],
    }),
    // Integrating PIM Section
    defineField({
      name: "integratingPim",
      title: "Integrating PIM Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
        defineField({ name: "leftColumnTitle", title: "Left Column Title", type: "string" }),
        defineField({ name: "leftColumnDescription", title: "Left Column Description", type: "text", rows: 2 }),
        defineField({
          name: "integrationPoints",
          title: "Integration Points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "impactTitle", title: "Impact Title", type: "string" }),
        defineField({ name: "impactParagraph1", title: "Impact Paragraph 1", type: "text", rows: 3 }),
        defineField({ name: "impactParagraph2", title: "Impact Paragraph 2", type: "text", rows: 3 }),
        defineField({ name: "linkText", title: "Link Text", type: "string" }),
      ],
    }),
    // Which Businesses Section
    defineField({
      name: "whichBusinesses",
      title: "Which Businesses Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
        defineField({
          name: "businessCards",
          title: "Business Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
            }),
          ],
        }),
        defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 2 }),
      ],
    }),
    // Time Savings Section
    defineField({
      name: "timeSavings",
      title: "Time Savings Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
        defineField({
          name: "savingsCards",
          title: "Savings Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                defineField({ name: "hours", title: "Hours Saved", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({ name: "summaryTitle", title: "Summary Title", type: "string" }),
        defineField({ name: "summaryDescription", title: "Summary Description", type: "text", rows: 3 }),
      ],
    }),
    // Why Good Investment Section
    defineField({
      name: "whyGoodInvestment",
      title: "Why Good Investment Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
        defineField({
          name: "benefits",
          title: "Benefits",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
            }),
          ],
        }),
        defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 3 }),
      ],
    }),
    // Combined Section (Choosing Right PIM, Getting Started, FAQ, Transform)
    defineField({
      name: "combinedSection",
      title: "Combined Section",
      type: "object",
      fields: [
        // Choosing Right PIM
        defineField({
          name: "choosingPim",
          title: "Choosing Right PIM",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Section Title", type: "string" }),
            defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
            defineField({ name: "leftColumnTitle", title: "Left Column Title", type: "string" }),
            defineField({ name: "leftColumnDescription", title: "Left Column Description", type: "text", rows: 2 }),
            defineField({
              name: "selectionCriteria",
              title: "Selection Criteria",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "impactParagraph1", title: "Impact Paragraph 1", type: "text", rows: 3 }),
            defineField({ name: "impactParagraph2", title: "Impact Paragraph 2", type: "text", rows: 3 }),
            defineField({ name: "linkText", title: "Link Text", type: "string" }),
          ],
        }),
        // Getting Started
        defineField({
          name: "gettingStarted",
          title: "Getting Started",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Section Title", type: "string" }),
            defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
            defineField({
              name: "steps",
              title: "Steps",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "title", title: "Title", type: "string" }),
                    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                  ],
                }),
              ],
            }),
            defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 2 }),
          ],
        }),
        // FAQ
        defineField({
          name: "faq",
          title: "FAQ",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Section Title", type: "string" }),
            defineField({
              name: "items",
              title: "FAQ Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "question", title: "Question", type: "string" }),
                    defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Transform Experience
        defineField({
          name: "transformExperience",
          title: "Transform Experience",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Section Title", type: "string" }),
            defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
            defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
            defineField({ name: "quoteText", title: "Quote Text", type: "text", rows: 3 }),
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
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
        defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
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
