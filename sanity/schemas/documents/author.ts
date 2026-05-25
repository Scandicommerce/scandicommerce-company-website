import { defineField, defineType } from "sanity";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "e.g. Lead Developer, Strategist",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96, isUnique: isUniquePerLanguage },
      description: "e.g. magnus-andersen — used for /team/... links",
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Unnamed author", subtitle, media };
    },
  },
});
