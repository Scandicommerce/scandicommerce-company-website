import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const whyShopifyPageHeroSection = defineType({
  name: "whyShopifyPageHeroSection",
  title: "Hero",
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
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const whyShopifyPageWhatIsShopifySection = defineType({
  name: "whyShopifyPageWhatIsShopifySection",
  title: "What is Shopify",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
    defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
  ],
  preview: { prepare: () => ({ title: "What is Shopify" }) },
});

export const whyShopifyPageShopifyFactsSection = defineType({
  name: "whyShopifyPageShopifyFactsSection",
  title: "Shopify facts",
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
  preview: { prepare: () => ({ title: "Shopify facts" }) },
});

export const whyShopifyPageWhyBusinessesChooseSection = defineType({
  name: "whyShopifyPageWhyBusinessesChooseSection",
  title: "Why businesses choose",
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
  preview: { prepare: () => ({ title: "Why businesses choose" }) },
});

export const whyShopifyPageWhyScandicommerceSpecializesSection = defineType({
  name: "whyShopifyPageWhyScandicommerceSpecializesSection",
  title: "Why Scandicommerce specializes",
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
  preview: { prepare: () => ({ title: "Why Scandicommerce specializes" }) },
});

export const whyShopifyPageShopifyAiSection = defineType({
  name: "whyShopifyPageShopifyAiSection",
  title: "Shopify + AI",
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
  preview: { prepare: () => ({ title: "Shopify + AI" }) },
});

export const whyShopifyPageCtaSection = defineType({
  name: "whyShopifyPageCtaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "CTA" }) },
});

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
      options: { source: "pageTitle", maxLength: 96, isUnique: isUniquePerLanguage },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "whyShopifyPageHeroSection" }),
        defineArrayMember({ type: "whyShopifyPageWhatIsShopifySection" }),
        defineArrayMember({ type: "whyShopifyPageShopifyFactsSection" }),
        defineArrayMember({ type: "whyShopifyPageWhyBusinessesChooseSection" }),
        defineArrayMember({ type: "whyShopifyPageWhyScandicommerceSpecializesSection" }),
        defineArrayMember({ type: "whyShopifyPageShopifyAiSection" }),
        defineArrayMember({ type: "whyShopifyPageCtaSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: { select: { title: "pageTitle" } },
});
