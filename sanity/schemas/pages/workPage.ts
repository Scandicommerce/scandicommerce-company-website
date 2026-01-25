import { defineField, defineType, defineArrayMember } from "sanity";

export const workPage = defineType({
  name: "workPage",
  title: "Work / Portfolio Page",
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
            defineField({ name: "text", title: "Full Title Text", type: "string" }),
            defineField({ name: "highlight", title: "Highlighted Text", type: "string", description: "Part of the title to highlight in cyan" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
      ],
    }),
    // Case Studies Section
    defineField({
      name: "caseStudies",
      title: "Case Studies Section",
      type: "object",
      fields: [
        defineField({
          name: "studies",
          title: "Case Studies",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "category", title: "Category", type: "string" }),
                defineField({
                  name: "tags",
                  title: "Tags",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "challenge", title: "Challenge", type: "text", rows: 2 }),
                defineField({ name: "solution", title: "Solution", type: "text", rows: 2 }),
                defineField({
                  name: "results",
                  title: "Results",
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
                defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
                defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
                defineField({ name: "link", title: "Case Study Link", type: "string" }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "category",
                  media: "image",
                },
              },
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
  preview: {
    select: {
      title: "pageTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled Work Page",
        subtitle: "Work / Portfolio Page",
      };
    },
  },
});
