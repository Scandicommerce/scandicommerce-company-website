import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const aboutPageHeroSection = defineType({
  name: "aboutPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Full Title Text", type: "string" }),
        defineField({ name: "highlight", title: "Highlighted Text", type: "string", description: "Part of the title to highlight in cyan" }),
      ],
    }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
    defineField({
      name: "stats",
      title: "Stats",
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
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const aboutPageWhyDifferentSection = defineType({
  name: "aboutPageWhyDifferentSection",
  title: "Why we're different",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Section Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon Name", type: "string", description: "e.g., pricing, product, results" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Why we're different" };
    },
  },
});

export const aboutPageOurStorySection = defineType({
  name: "aboutPageOurStorySection",
  title: "Our story",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 6 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Our story" };
    },
  },
});

export const aboutPageOurValuesSection = defineType({
  name: "aboutPageOurValuesSection",
  title: "Our values",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Our values" };
    },
  },
});

export const aboutPageMeetTheTeamSection = defineType({
  name: "aboutPageMeetTheTeamSection",
  title: "Meet the team",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Section Subtitle", type: "string" }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "specialties", title: "Specialties", type: "string" }),
            defineField({ name: "funFact", title: "Fun Fact", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Meet the team" };
    },
  },
});

export const aboutPageTrustedPartnershipsSection = defineType({
  name: "aboutPageTrustedPartnershipsSection",
  title: "Trusted partnerships",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Section Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "partnerships",
      title: "Partnerships",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Company Name", type: "string" }),
            defineField({ name: "status", title: "Partnership Status", type: "string" }),
            defineField({
              name: "logo",
              title: "Logo Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Alt Text", type: "string" }),
              ],
            }),
            defineField({
              name: "logoIcon",
              title: "Logo Icon Name (fallback)",
              type: "string",
              description: "Fallback icon key used when no Logo Image is uploaded. e.g., shopify, klaviyo, google, meta",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Trusted partnerships" };
    },
  },
});

export const aboutPageCtaSection = defineType({
  name: "aboutPageCtaSection",
  title: "CTA (Want to work with us)",
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

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
        defineArrayMember({ type: "aboutPageHeroSection" }),
        defineArrayMember({ type: "aboutPageWhyDifferentSection" }),
        defineArrayMember({ type: "aboutPageOurStorySection" }),
        defineArrayMember({ type: "aboutPageOurValuesSection" }),
        defineArrayMember({ type: "aboutPageMeetTheTeamSection" }),
        defineArrayMember({ type: "aboutPageTrustedPartnershipsSection" }),
        defineArrayMember({ type: "aboutPageCtaSection" }),
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
        title: title || "Untitled About Page",
        subtitle: "About Page",
      };
    },
  },
});
