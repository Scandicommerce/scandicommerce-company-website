import { defineField, defineType, defineArrayMember } from "sanity";

export const partnersPage = defineType({
  name: "partnersPage",
  title: "Partners Page",
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
    // Why Our Partnership Section
    defineField({
      name: "whyOurPartnership",
      title: "Why Our Partnership Section",
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
                defineField({ name: "icon", title: "Icon Name", type: "string", description: "e.g., support, certified, outcomes" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Partners Grid Section
    defineField({
      name: "partnersGrid",
      title: "Partners Grid Section",
      type: "object",
      fields: [
        defineField({
          name: "partners",
          title: "Partners",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "name", title: "Partner Name", type: "string" }),
                defineField({ name: "category", title: "Category", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                defineField({
                  name: "benefits",
                  title: "Benefits",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "image", title: "Partner Image", type: "image", options: { hotspot: true } }),
                defineField({ name: "logo", title: "Partner Logo (Optional)", type: "image", options: { hotspot: true } }),
              ],
              preview: {
                select: {
                  title: "name",
                  subtitle: "category",
                  media: "image",
                },
              },
            }),
          ],
        }),
      ],
    }),
    // CTA Section (Become A Partner)
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
        title: title || "Untitled Partners Page",
        subtitle: "Partners Page",
      };
    },
  },
});
