import { defineArrayMember, defineField, defineType } from "sanity";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "expertise", title: "Expertise & SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      group: "profile",
      description: "e.g. Lead Developer, Strategist",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      group: "profile",
      options: { hotspot: true },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "profile",
      options: { source: "name", maxLength: 96, isUnique: isUniquePerLanguage },
      description: "e.g. magnus-andersen — the author page lives at /team/<slug>",
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      group: "profile",
      rows: 3,
      description: "One or two sentences, shown in article bylines and cards.",
    }),
    defineField({
      name: "longBio",
      title: "Full bio",
      type: "array",
      group: "profile",
      of: [defineArrayMember({ type: "block" })],
      description: "Longer profile text shown on the author page (/team/<slug>).",
    }),

    // ── Expertise & SEO (E-E-A-T) ──
    defineField({
      name: "expertise",
      title: "Areas of expertise",
      type: "array",
      group: "expertise",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description:
        'Topics this author covers, e.g. "Shopify Plus", "Migrering", "CRO". Shown as tags on the author page and used for SEO expertise signals.',
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      group: "expertise",
      description: "Used as a sameAs link in structured data (Google E-E-A-T).",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "expertise",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Unnamed author", subtitle, media };
    },
  },
});
