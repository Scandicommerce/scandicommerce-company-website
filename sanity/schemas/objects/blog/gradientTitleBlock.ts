import { defineField, defineType } from "sanity";

export const gradientTitleBlock = defineType({
  name: "gradientTitleBlock",
  title: "Gradient Title",
  type: "object",
  description: "Bold heading with gradient underlines (cyan to purple).",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Full heading text (e.g. THE BOTTOM LINE: CHOOSE PERFORMANCE, CHOOSE FUNCTIONS)",
    }),
    defineField({
      name: "highlightPrefix",
      title: "Highlight Prefix",
      type: "string",
      description: "Optional. The first part of the title that gets the short gradient underline (e.g. THE BOTTOM LINE:). Leave empty for no short underline.",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: "Gradient Title",
        subtitle: title ? `${title.slice(0, 50)}${title.length > 50 ? "…" : ""}` : "",
      };
    },
  },
});
