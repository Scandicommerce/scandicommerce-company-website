import { defineType, defineField } from "sanity";
import { languageField } from "../objects/language";

export const vippsHurtigkassePage = defineType({
  name: "vippsHurtigkassePage",
  title: "Vipps Hurtigkasse Page",
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
      initialValue: "Vipps Quick Checkout",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "pageTitle",
        maxLength: 96,
      },
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
              title: "Title Text",
              type: "string",
              initialValue: "Scandicommerce Quick Checkout for Vipps in Shopify",
            }),
            defineField({
              name: "highlight",
              title: "Highlighted Word",
              type: "string",
              description: "The word to highlight in a different color",
              initialValue: "Vipps",
            }),
          ],
        }),
        defineField({
          name: "heroDescription",
          title: "Hero Description",
          type: "text",
          initialValue: "Accept payments with Quick Checkout for Vipps in your online store",
        }),
        defineField({
          name: "heroButtons",
          title: "Hero Buttons",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "text",
                  title: "Button Text",
                  type: "string",
                }),
                defineField({
                  name: "link",
                  title: "Button Link",
                  type: "string",
                }),
                defineField({
                  name: "variant",
                  title: "Button Variant",
                  type: "string",
                  options: {
                    list: [
                      { title: "Primary", value: "primary" },
                      { title: "Secondary", value: "secondary" },
                    ],
                  },
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // Features Section
    defineField({
      name: "features",
      title: "Features Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Accept payments with Quick Checkout for Vipps in your online store",
        }),
        defineField({
          name: "paragraphs",
          title: "Feature Paragraphs",
          type: "array",
          of: [{ type: "string" }],
          description: "List of feature description paragraphs",
        }),
        defineField({
          name: "demoStore",
          title: "Demo Store Info",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Demo Store Text",
              type: "string",
              initialValue: "Check out our demo store here:",
            }),
            defineField({
              name: "url",
              title: "Demo Store URL",
              type: "url",
              initialValue: "https://scandicommerce-demo.myshopify.com/",
            }),
            defineField({
              name: "password",
              title: "Demo Store Password",
              type: "string",
              initialValue: "demo123",
            }),
          ],
        }),
        defineField({
          name: "productImage",
          title: "Product Image",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              initialValue: "Vipps Quick Checkout on product page",
            }),
          ],
        }),
      ],
    }),

    // How To Get Started Section
    defineField({
      name: "howToGetStarted",
      title: "How To Get Started Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "How to get started:",
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Step Title",
                  type: "string",
                }),
                defineField({
                  name: "description",
                  title: "Step Description",
                  type: "text",
                }),
                defineField({
                  name: "subSteps",
                  title: "Sub-Steps",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // Pricing Section
    defineField({
      name: "pricing",
      title: "Pricing Section",
      type: "object",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "string",
          initialValue: "How much does it cost to use Quick Checkout for Vipps in Shopify",
        }),
        // defineField({
        //   name: "price",
        //   title: "Price (used when no regional prices below)",
        //   type: "string",
        //   initialValue: "kr 399",
        // }),
        defineField({
          name: "priceItems",
          title: "Regional prices",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "priceText", type: "string", title: "Price", validation: (Rule) => Rule.required() },
              ],
              preview: { select: { title: "priceText" }, prepare: ({ title }) => ({ title: title || "Price" }) },
            },
          ],
          initialValue: [
            { priceText: "399 NOK" },
            { priceText: "259 DKK" },
            { priceText: "35 EUR" },
          ],
        }),
        defineField({
          name: "priceNote",
          title: "Price Note",
          type: "string",
          initialValue: "ex. VAT per month",
        }),
        defineField({
          name: "supportText",
          title: "Support Text",
          type: "string",
          initialValue: "free support via email",
        }),
      ],
    }),

    // Order Form Section
    defineField({
      name: "orderForm",
      title: "Order Form Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Order Vipps Quick Checkout here",
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "string",
          initialValue: "Fill out the order form and we will respond via email",
        }),
      ],
    }),

    // Support Section
    defineField({
      name: "support",
      title: "Support Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Do you have a problem with your Quick Checkout for Shopify?",
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Contact us here",
        }),
        defineField({
          name: "buttonLink",
          title: "Button Link",
          type: "string",
          initialValue: "/contact",
        }),
      ],
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          initialValue: "Vipps Quick Checkout for Shopify | Scandicommerce",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          initialValue: "Give your customers an easier shopping experience with Vipps Quick Checkout. Full integration with Shopify, support for capture, refund, shipping and discount codes.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Vipps Hurtigkasse Page",
      };
    },
  },
});
