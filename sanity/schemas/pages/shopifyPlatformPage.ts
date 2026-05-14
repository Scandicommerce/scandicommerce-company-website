import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const shopifyPlatformPageHeroSection = defineType({
  name: "shopifyPlatformPageHeroSection",
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
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const shopifyPlatformPageBleedingMoneySection = defineType({
  name: "shopifyPlatformPageBleedingMoneySection",
  title: "Bleeding money",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "leftPoints",
      title: "Left Pain Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "rightPoints",
      title: "Right Pain Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "bottomPoint", title: "Bottom Pain Point", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Bleeding money" }) },
});

export const shopifyPlatformPageShopifyEmpiresSection = defineType({
  name: "shopifyPlatformPageShopifyEmpiresSection",
  title: "Shopify empires",
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
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "highlight", title: "Highlight Badge", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Shopify empires" }) },
});

export const shopifyPlatformPageRevenueFormSection = defineType({
  name: "shopifyPlatformPageRevenueFormSection",
  title: "Revenue form",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
        defineField({ name: "authorName", title: "Author Name", type: "string" }),
        defineField({ name: "authorRole", title: "Author Role", type: "string" }),
        defineField({ name: "authorCompany", title: "Author Company", type: "string" }),
        defineField({ name: "authorImage", title: "Author Image", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "form",
      title: "Form Settings",
      type: "object",
      fields: [
        defineField({ name: "formTitle", title: "Form Title", type: "string" }),
        defineField({ name: "formSubtitle", title: "Form Subtitle", type: "string" }),
        defineField({ name: "formDescription", title: "Form Description", type: "text", rows: 2 }),
        defineField({ name: "submitButtonText", title: "Submit Button Text", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Revenue form" }) },
});

export const shopifyPlatformPageSuccessStoriesSection = defineType({
  name: "shopifyPlatformPageSuccessStoriesSection",
  title: "Success stories",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Section Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "clientName", title: "Client Name", type: "string" }),
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Image", type: "image" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Success stories" }) },
});

export const shopifyPlatformPage = defineType({
  name: "shopifyPlatformPage",
  title: "Shopify Platform Page",
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
        defineArrayMember({ type: "shopifyPlatformPageHeroSection" }),
        defineArrayMember({ type: "shopifyPlatformPageBleedingMoneySection" }),
        defineArrayMember({ type: "shopifyPlatformPageShopifyEmpiresSection" }),
        defineArrayMember({ type: "shopifyPlatformPageRevenueFormSection" }),
        defineArrayMember({ type: "shopifyPlatformPageSuccessStoriesSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: { select: { title: "pageTitle" } },
});
