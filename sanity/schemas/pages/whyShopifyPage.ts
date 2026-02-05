import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";

export const whyShopifyPage = defineType({
  name: "whyShopifyPage",
  title: "Why Shopify Page",
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
            defineField({ name: "highlight", title: "Highlighted Text (optional)", type: "string" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
      ],
    }),
    // What Is Shopify Section
    defineField({
      name: "whatIsShopify",
      title: "What Is Shopify Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
        defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
      ],
    }),
    // Shopify Facts Section
    defineField({
      name: "shopifyFacts",
      title: "Shopify Facts Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "facts",
          title: "Facts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "statistic", title: "Statistic", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                defineField({ name: "source", title: "Source", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Why Businesses Choose Shopify Section
    defineField({
      name: "whyBusinessesChoose",
      title: "Why Businesses Choose Shopify Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "reasons",
          title: "Reasons",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                defineField({
                  name: "bulletPoints",
                  title: "Bullet Points (optional)",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "concludingParagraph", title: "Concluding Paragraph (optional)", type: "text", rows: 2 }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Why Scandicommerce Specializes Section
    defineField({
      name: "whyScandicommerceSpecializes",
      title: "Why Scandicommerce Specializes Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
        defineField({
          name: "specializations",
          title: "Specializations",
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
      ],
    }),
    // Shopify AI Section
    defineField({
      name: "shopifyAi",
      title: "Shopify + AI Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
        defineField({
          name: "aiSolutions",
          title: "AI Solutions",
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
