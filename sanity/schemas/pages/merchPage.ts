import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const merchPageHeroSection = defineType({
  name: "merchPageHeroSection",
  title: "Hero",
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
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const merchPageQualityShowcaseSection = defineType({
  name: "merchPageQualityShowcaseSection",
  title: "Quality showcase",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "products",
      title: "Featured Products",
      description: "Add Shopify product handles to display specific products. Leave empty to auto-select.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "handle",
              title: "Product Handle",
              type: "string",
              description: "The Shopify product handle (URL slug)",
            }),
            defineField({
              name: "name",
              title: "Display Name (Optional)",
              type: "string",
              description: "Optional override for product name",
            }),
          ],
          preview: {
            select: { title: "handle", subtitle: "name" },
            prepare({ title, subtitle }) {
              return {
                title: subtitle || title || "No handle",
                subtitle: subtitle ? title : undefined,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Quality showcase" }) },
});

export const merchPageNewsletterSection = defineType({
  name: "merchPageNewsletterSection",
  title: "Newsletter",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({ name: "successMessage", title: "Success Message", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Newsletter" }) },
});

export const merchPage = defineType({
  name: "merchPage",
  title: "Merch Page",
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
        defineArrayMember({ type: "merchPageHeroSection" }),
        defineArrayMember({ type: "merchPageQualityShowcaseSection" }),
        defineArrayMember({ type: "merchPageNewsletterSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: { select: { title: "pageTitle" } },
});
