import { defineArrayMember, defineField, defineType } from "sanity";

export const shopifyPosInfoPage = defineType({
  name: "shopifyPosInfoPage",
  title: "Shopify POS Info Page",
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
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
        defineField({
          name: "stats",
          title: "Stats",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "value", title: "Value", type: "string" }),
                defineField({ name: "label", title: "Label", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Bleeding Money Section
    defineField({
      name: "bleedingMoney",
      title: "Bleeding Money Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "leftPoints",
          title: "Left Pain Points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "rightPoints",
          title: "Right Pain Points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),
    // Omnichannel Features Section
    defineField({
      name: "omnichannelFeatures",
      title: "Omnichannel Features Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "features",
          title: "Features",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                defineField({ name: "highlight", title: "Highlight Badge", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Revenue Form Section
    defineField({
      name: "revenueForm",
      title: "Revenue Form Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
        defineField({
          name: "testimonial",
          title: "Testimonial",
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "authorName", title: "Author Name", type: "string" }),
            defineField({ name: "authorRole", title: "Author Role", type: "string" }),
            defineField({ name: "authorCompany", title: "Author Company", type: "string" }),
            defineField({ name: "authorImage", title: "Author Image", type: "image", options: { hotspot: true } }),
          ],
        }),
        defineField({
          name: "form",
          title: "Form Settings",
          type: "object",
          fields: [
            defineField({ name: "formTitle", title: "Form Title", type: "string" }),
            defineField({ name: "formSubtitle", title: "Form Subtitle", type: "string" }),
            defineField({ name: "formDescription", title: "Form Description", type: "text", rows: 2 }),
            defineField({ name: "submitButtonText", title: "Submit Button Text", type: "string" }),
          ],
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
