import { defineArrayMember, defineField, defineType } from "sanity";

export const shopifyPosPage = defineType({
  name: "shopifyPosPage",
  title: "Shopify POS Page",
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
              description: "e.g., 'Shopify POS: Online meets offline'",
            }),
            defineField({
              name: "highlight",
              title: "Highlighted Text",
              type: "string",
              description: "Text to highlight in teal (e.g., 'Shopify POS:')",
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
          name: "heroButtonText",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "heroButtonLink",
          title: "Button Link",
          type: "string",
        }),
      ],
    }),
    // Omnichannel Features Section
    defineField({
      name: "features",
      title: "Features Section",
      type: "object",
      fields: [
        defineField({
          name: "featuresTitle",
          title: "Title",
          type: "string",
          description: "e.g., 'Built for omnichannel retail'",
        }),
        defineField({
          name: "featuresItems",
          title: "Feature Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text" }),
                defineField({
                  name: "icon",
                  title: "Icon Name",
                  type: "string",
                  description: "e.g., 'inventory', 'collect', 'calendar', 'staff'",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Perfect For Section
    defineField({
      name: "perfectFor",
      title: "Perfect For Section",
      type: "object",
      fields: [
        defineField({
          name: "perfectForTitle",
          title: "Title",
          type: "string",
          description: "e.g., 'Perfect for'",
        }),
        defineField({
          name: "perfectForItems",
          title: "Use Cases",
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
