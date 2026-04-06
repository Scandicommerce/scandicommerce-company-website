import { defineField, defineType } from "sanity";

export const technicalDepthSection = defineType({
  name: "technicalDepthSection",
  title: "Technical depth",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 8,
      description: "Supporting copy for technical or detailed messaging.",
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return { title: title || "Technical depth" };
    },
  },
});
