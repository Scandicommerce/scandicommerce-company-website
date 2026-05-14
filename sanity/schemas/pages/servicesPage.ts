import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldWithOgImage,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
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
      name: "hero",
      title: "Hero Section",
      type: "heroSection",
    }),
    // Introduction
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({ name: "content", type: "text", title: "Content", rows: 4 }),
      ],
    }),
    // Services List
    defineField({
      name: "services",
      title: "Services List",
      type: "array",
      of: [
        defineArrayMember({
          name: "service",
          title: "Service",
          type: "object",
          fields: [
            defineField({ name: "icon", type: "string", title: "Icon Name" }),
            defineField({ name: "title", type: "string", title: "Title", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", title: "Description", rows: 3 }),
            defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
            defineField({ name: "features", type: "array", title: "Features", of: [{ type: "string" }] }),
            defineField({ name: "link", type: "string", title: "Learn More Link" }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSection",
    }),
    seoExtendedField,
    legacySeoFieldWithOgImage,
  ],
  preview: {
    select: {
      title: "pageTitle",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Untitled Services Page",
        subtitle: `Services Page • ${language || "en"}`,
      };
    },
  },
});
