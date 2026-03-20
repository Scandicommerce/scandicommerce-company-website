import { defineField, defineType } from "sanity";

export const comparisonCardsBlock = defineType({
  name: "comparisonCardsBlock",
  title: "Comparison Cards",
  type: "object",
  fields: [
    defineField({
      name: "leftCard",
      title: "Left Card",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent",
          description: "Rich text content (bullets, paragraphs, etc.)",
          validation: (r) => r.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rightCard",
      title: "Right Card",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent",
          description: "Rich text content (bullets, paragraphs, etc.)",
          validation: (r) => r.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { left: "leftCard.title", right: "rightCard.title" },
    prepare({ left, right }) {
      return {
        title: "Comparison",
        subtitle: [left, right].filter(Boolean).join(" vs ") || "Two cards",
      };
    },
  },
});
