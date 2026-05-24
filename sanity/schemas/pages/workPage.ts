import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const workPageHeroSection = defineType({
  name: "workPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Full Title Text", type: "string" }),
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "Part of the title to highlight in cyan",
        }),
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

export const workPageCaseStudiesSection = defineType({
  name: "workPageCaseStudiesSection",
  title: "Case studies",
  type: "object",
  fields: [
    defineField({ name: "ctaText", title: "Case Study Link Text", type: "string", description: "e.g. 'Les hele case studien' or 'Read full case study'" }),
    defineField({
      name: "studies",
      title: "Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "category", title: "Category", type: "string" }),
            defineField({
              name: "tags",
              title: "Tags",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "challenge",
              title: "Challenge",
              type: "blockContent",
              description: "Use the toolbar for headings, lists, bold, and links.",
            }),
            defineField({
              name: "solution",
              title: "Solution",
              type: "blockContent",
              description: "Use the toolbar for headings, lists, bold, and links.",
            }),
            defineField({
              name: "results",
              title: "Results",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "value", title: "Value", type: "string" }),
                    defineField({ name: "label", title: "Label", type: "string" }),
                  ],
                }),
              ],
            }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
            defineField({ name: "link", title: "Case Study Link", type: "string" }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Case studies" };
    },
  },
});

export const workPageCtaSection = defineType({
  name: "workPageCtaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "CTA" };
    },
  },
});

export const workPage = defineType({
  name: "workPage",
  title: "Work / Portfolio Page",
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
        defineArrayMember({ type: "workPageHeroSection" }),
        defineArrayMember({ type: "workPageCaseStudiesSection" }),
        defineArrayMember({ type: "workPageCtaSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled Work Page",
        subtitle: "Work / Portfolio Page",
      };
    },
  },
});
