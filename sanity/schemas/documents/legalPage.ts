import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import { languages, defaultLanguage } from "@/sanity/lib/languages";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

/**
 * Legal pages (privacy policy, terms of service, …) rendered at
 * /legal/[slug] on the frontend.
 *
 * Field names/types intentionally match the documents already in the
 * dataset (e.g. `drafts.1ae83a6c-9bd1-43e5-8422-1f4b0d541ded`,
 * slug `app-privacy-policy`) so existing drafts open as normal
 * editable documents.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: languages.map((lang) => ({
          title: lang.title,
          value: lang.id,
        })),
        layout: "radio",
      },
      initialValue: defaultLanguage,
    }),
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "pageTitle",
        isUnique: isUniquePerLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "pageTitle", subtitle: "language" },
  },
});
