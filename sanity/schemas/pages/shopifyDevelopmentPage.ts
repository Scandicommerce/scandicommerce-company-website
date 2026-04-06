import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const shopifyDevelopmentPageHeroSection = defineType({
  name: "shopifyDevelopmentPageHeroSection",
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
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const shopifyDevelopmentPageWhyShopifySection = defineType({
  name: "shopifyDevelopmentPageWhyShopifySection",
  title: "Why Shopify wins",
  type: "object",
  fields: [
    defineField({ name: "whyShopifyTitle", title: "Title", type: "string" }),
    defineField({ name: "whyShopifySubtitle", title: "Subtitle", type: "string" }),
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
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "e.g., 'cart', 'chart', 'shield', 'uptime'",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Why Shopify wins" }) },
});

export const shopifyDevelopmentPageScenariosSection = defineType({
  name: "shopifyDevelopmentPageScenariosSection",
  title: "Common scenarios",
  type: "object",
  fields: [
    defineField({ name: "scenariosTitle", title: "Title", type: "string" }),
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
  preview: { prepare: () => ({ title: "Common scenarios" }) },
});

export const shopifyDevelopmentPageHowWeWorkSection = defineType({
  name: "shopifyDevelopmentPageHowWeWorkSection",
  title: "How we work",
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
  preview: { prepare: () => ({ title: "How we work" }) },
});

export const shopifyDevelopmentPageTestimonialSection = defineType({
  name: "shopifyDevelopmentPageTestimonialSection",
  title: "Testimonial",
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
  preview: { prepare: () => ({ title: "Testimonial" }) },
});

export const shopifyDevelopmentPageCtaSection = defineType({
  name: "shopifyDevelopmentPageCtaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "ctaTitle", title: "Title", type: "string" }),
    defineField({ name: "ctaDescription", title: "Description", type: "text" }),
    defineField({ name: "ctaButtonText", title: "Button Text", type: "string" }),
    defineField({ name: "ctaButtonLink", title: "Button Link", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "CTA" }) },
});

export const shopifyDevelopmentPage = defineType({
  name: "shopifyDevelopmentPage",
  title: "Shopify Development Page",
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
      options: {
        source: "pageTitle",
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "shopifyDevelopmentPageHeroSection" }),
        defineArrayMember({ type: "shopifyDevelopmentPageWhyShopifySection" }),
        defineArrayMember({ type: "shopifyDevelopmentPageScenariosSection" }),
        defineArrayMember({ type: "shopifyDevelopmentPageHowWeWorkSection" }),
        defineArrayMember({ type: "shopifyDevelopmentPageTestimonialSection" }),
        defineArrayMember({ type: "shopifyDevelopmentPageCtaSection" }),
      ],
    }),
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
