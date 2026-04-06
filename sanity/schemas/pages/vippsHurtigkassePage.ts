import { defineType, defineField, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const vippsHurtigkassePageHeroSection = defineType({
  name: "vippsHurtigkassePageHeroSection",
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
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "text", title: "Button Text", type: "string" }),
            defineField({ name: "link", title: "Button Link", type: "string" }),
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

export const vippsHurtigkassePageFeaturesSection = defineType({
  name: "vippsHurtigkassePageFeaturesSection",
  title: "Features",
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
      of: [defineArrayMember({ type: "string" })],
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
          options: { hotspot: true },
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
  preview: { prepare: () => ({ title: "Features" }) },
});

export const vippsHurtigkassePageHowToGetStartedSection = defineType({
  name: "vippsHurtigkassePageHowToGetStartedSection",
  title: "How to get started",
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
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Step Title", type: "string" }),
            defineField({ name: "description", title: "Step Description", type: "text" }),
            defineField({
              name: "subSteps",
              title: "Sub-Steps",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "How to get started" }) },
});

export const vippsHurtigkassePagePricingSection = defineType({
  name: "vippsHurtigkassePagePricingSection",
  title: "Pricing",
  type: "object",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Section Title",
      type: "string",
      initialValue: "How much does it cost to use Quick Checkout for Vipps in Shopify",
    }),
    defineField({
      name: "priceItems",
      title: "Regional prices",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "priceText",
              type: "string",
              title: "Price",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "priceText" },
            prepare: ({ title }: { title?: string }) => ({ title: title || "Price" }),
          },
        }),
      ],
      initialValue: [{ priceText: "399 NOK" }, { priceText: "259 DKK" }, { priceText: "35 EUR" }],
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
  preview: { prepare: () => ({ title: "Pricing" }) },
});

export const vippsHurtigkassePageOrderFormSection = defineType({
  name: "vippsHurtigkassePageOrderFormSection",
  title: "Order form",
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
  preview: { prepare: () => ({ title: "Order form" }) },
});

export const vippsHurtigkassePageSupportSection = defineType({
  name: "vippsHurtigkassePageSupportSection",
  title: "Support",
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
  preview: { prepare: () => ({ title: "Support" }) },
});

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
        isUnique: isUniquePerLanguage,
      },
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "vippsHurtigkassePageHeroSection" }),
        defineArrayMember({ type: "vippsHurtigkassePageFeaturesSection" }),
        defineArrayMember({ type: "vippsHurtigkassePageHowToGetStartedSection" }),
        defineArrayMember({ type: "vippsHurtigkassePagePricingSection" }),
        defineArrayMember({ type: "vippsHurtigkassePageOrderFormSection" }),
        defineArrayMember({ type: "vippsHurtigkassePageSupportSection" }),
      ],
    }),
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
          initialValue:
            "Give your customers an easier shopping experience with Vipps Quick Checkout. Full integration with Shopify, support for capture, refund, shipping and discount codes.",
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
