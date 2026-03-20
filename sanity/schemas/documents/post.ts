import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";
import {
  richTextBlock,
  keyTakeawaysBlock,
  statsRowBlock,
  tableBlock,
  comparisonCardsBlock,
  calloutBlock,
  prosConsBlock,
  codeBlock,
  faqBlock,
  ctaBlock,
  gradientTitleBlock,
  imageBlock,
  dividerBlock,
} from "../objects/blog";

export const post = defineType({
  name: "post",
  title: "Post (Page Builder)",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "URL path after /resources/. Use Generate from title or type manually.",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Card / Featured Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Used in blog featured section and article grid cards.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      description: "Used in blog featured card tag chips.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "isPrimary",
              title: "Primary Tag",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", isPrimary: "isPrimary" },
            prepare({ title, isPrimary }) {
              return {
                title: title || "Tag",
                subtitle: isPrimary ? "Primary" : "Secondary",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      description: "Add, remove, and reorder blocks. Order is dynamic.",
      of: [
        defineArrayMember({ type: richTextBlock.name }),
        defineArrayMember({ type: keyTakeawaysBlock.name }),
        defineArrayMember({ type: statsRowBlock.name }),
        defineArrayMember({ type: tableBlock.name }),
        defineArrayMember({ type: comparisonCardsBlock.name }),
        defineArrayMember({ type: calloutBlock.name }),
        defineArrayMember({ type: prosConsBlock.name }),
        defineArrayMember({ type: codeBlock.name }),
        defineArrayMember({ type: faqBlock.name }),
        defineArrayMember({ type: ctaBlock.name }),
        defineArrayMember({ type: gradientTitleBlock.name }),
        defineArrayMember({ type: imageBlock.name }),
        defineArrayMember({ type: dividerBlock.name }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Post",
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "Post (Page Builder)",
      };
    },
  },
});
