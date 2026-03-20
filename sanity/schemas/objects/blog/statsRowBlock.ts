import { defineField, defineType, defineArrayMember } from "sanity";

export const statsRowBlock = defineType({
  name: "statsRowBlock",
  title: "Stats Row",
  type: "object",
  fields: [
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { value: "value", label: "label" },
            prepare({ value, label }) {
              return { title: value || "—", subtitle: label || "" };
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4).required(),
    }),
  ],
  preview: {
    select: { stats: "stats" },
    prepare({ stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return {
        title: "Stats Row",
        subtitle: `${count} stat${count !== 1 ? "s" : ""}`,
      };
    },
  },
});
