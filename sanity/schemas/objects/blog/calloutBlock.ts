import { defineField, defineType } from "sanity";

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout / Info Box",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Success", value: "success" },
          { title: "TL;DR (Cyan)", value: "tldr" },
        ],
        layout: "radio",
      },
      initialValue: "info",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional; e.g. 'TL;DR' or 'Note'",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", variant: "variant", content: "content" },
    prepare({ title, variant, content }) {
      const text = (content || "").slice(0, 50);
      return {
        title: title || variant || "Callout",
        subtitle: text ? `${text}${content && content.length > 50 ? "…" : ""}` : "",
      };
    },
  },
});
