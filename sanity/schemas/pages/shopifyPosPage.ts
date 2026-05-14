import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const shopifyPosPageHeroSection = defineType({
  name: "shopifyPosPageHeroSection",
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
    defineField({ name: "heroButtonText", title: "Button Text", type: "string" }),
    defineField({ name: "heroButtonLink", title: "Button Link", type: "string" }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const shopifyPosPageFeaturesSection = defineType({
  name: "shopifyPosPageFeaturesSection",
  title: "Features",
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
  preview: { prepare: () => ({ title: "Features" }) },
});

export const shopifyPosPagePerfectForSection = defineType({
  name: "shopifyPosPagePerfectForSection",
  title: "Perfect for",
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
  preview: { prepare: () => ({ title: "Perfect for" }) },
});

export const shopifyPosPageCtaSection = defineType({
  name: "shopifyPosPageCtaSection",
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

export const shopifyPosPage = defineType({
  name: "shopifyPosPage",
  title: "Shopify POS Page",
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
        defineArrayMember({ type: "shopifyPosPageHeroSection" }),
        defineArrayMember({ type: "shopifyPosPageFeaturesSection" }),
        defineArrayMember({ type: "shopifyPosPagePerfectForSection" }),
        defineArrayMember({ type: "shopifyPosPageCtaSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
  },
});
