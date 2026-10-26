import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { seoExtendedField } from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";
import { validatePublicSlug } from "@/sanity/lib/slugValidation";

export const workPageHeroSection = defineType({
  name: "workPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small label above the title. Defaults to 'Kundecaser' / 'Case studies' in the page language.",
    }),
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
    defineField({
      name: "hideJumpLinks",
      title: "Hide jump links",
      type: "boolean",
      initialValue: false,
      description: "The hero shows one chip per case that scrolls to it. Turn on to hide them.",
    }),
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
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Optional small label above the list heading." }),
    defineField({ name: "heading", title: "Heading", type: "string", description: "Optional heading above the case cards." }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, description: "Optional short paragraph under the heading." }),
    defineField({ name: "featuredLabel", title: "Featured label", type: "string", description: "Eyebrow over the first (featured) case. Defaults to 'Utvalgt kundecase'." }),
    defineField({ name: "deckLabel", title: "Cards label", type: "string", description: "Eyebrow over the three small cards. Defaults to 'Flere kundecaser'." }),
    defineField({ name: "archiveLabel", title: "List label", type: "string", description: "Eyebrow over the list of remaining cases. Defaults to 'Alle kundecaser'." }),
    defineField({ name: "ctaText", title: "Case Study Link Text", type: "string", description: "Button on the featured case, e.g. 'Les hele casen'. Defaults per language." }),
    defineField({
      name: "includeDocuments",
      title: "Add case studies and case-tagged posts automatically",
      type: "boolean",
      initialValue: true,
      description: "After the curated studies below, every Case Study document and every blog post tagged 'Case study' / 'Case-studie' that is not already covered is added as a card. The first study below is the featured one, the next three are cards, the rest a list.",
    }),
    defineField({
      name: "studies",
      title: "Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "client",
              title: "Client name",
              type: "string",
              description: "Shown on the card and in the hero jump links, e.g. 'Lanullva'.",
            }),
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
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, description: "Optional. Without one, the image of the blog post in 'Case Study Link' is used." }),
            defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
            defineField({ name: "link", title: "Case Study Link", type: "string", description: "Path to the full story, e.g. /blogg/lanullva-... or /kundecaser/slikkepott." }),
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
    defineField({ name: "buttonText", title: "Button Text", type: "string", description: "Primary button. Defaults to 'Book en samtale' linking to the contact page." }),
    defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
    defineField({ name: "secondaryButtonText", title: "Secondary Button Text", type: "string", description: "Defaults to 'Se pakkene' linking to the packages page." }),
    defineField({ name: "secondaryButtonLink", title: "Secondary Button Link", type: "string" }),
    defineField({ name: "hideSecondaryButton", title: "Hide secondary button", type: "boolean", initialValue: false }),
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
      validation: (rule) => rule.required().custom(validatePublicSlug),
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
