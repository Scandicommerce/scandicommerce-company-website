import { defineArrayMember, defineField, defineType } from "sanity";

export const shopifyDevelopmentPage = defineType({
  name: "shopifyDevelopmentPage",
  title: "Shopify Development Page",
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
              description: "e.g., 'Shopify for serious brands'",
            }),
            defineField({
              name: "highlight",
              title: "Highlighted Word",
              type: "string",
              description: "Word to highlight in teal (e.g., 'serious')",
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
    // Why Shopify Wins Section
    defineField({
      name: "whyShopify",
      title: "Why Shopify Wins Section",
      type: "object",
      fields: [
        defineField({
          name: "whyShopifyTitle",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "whyShopifySubtitle",
          title: "Subtitle",
          type: "string",
        }),
        defineField({
          name: "whyShopifyFeatures",
          title: "Features",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text" }),
                defineField({ name: "icon", title: "Icon Name", type: "string", description: "e.g., 'cart', 'chart', 'shield', 'uptime'" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Common Scenarios Section
    defineField({
      name: "scenarios",
      title: "Common Scenarios Section",
      type: "object",
      fields: [
        defineField({
          name: "scenariosTitle",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "scenariosItems",
          title: "Scenario Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text" }),
                defineField({ name: "link", title: "Link", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // How We Work Section
    defineField({
      name: "howWeWork",
      title: "How We Work Section",
      type: "object",
      fields: [
        defineField({
          name: "howWeWorkTitle",
          title: "Title",
          type: "string",
          description: "e.g., 'How we work with Shopify'",
        }),
        defineField({
          name: "howWeWorkSteps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "number", title: "Step Number", type: "number" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Testimonial Section
    defineField({
      name: "testimonial",
      title: "Testimonial Section",
      type: "object",
      fields: [
        defineField({
          name: "testimonialRating",
          title: "Star Rating",
          type: "number",
          description: "Number of stars (1-5)",
          validation: (rule) => rule.min(1).max(5),
        }),
        defineField({
          name: "testimonialQuote",
          title: "Quote",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "testimonialAuthorName",
          title: "Author Name",
          type: "string",
        }),
        defineField({
          name: "testimonialAuthorTitle",
          title: "Author Title",
          type: "string",
          description: "e.g., 'E-commerce Director, Nordic Lifestyle AS'",
        }),
        defineField({
          name: "testimonialButtonText",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "testimonialButtonLink",
          title: "Button Link",
          type: "string",
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
