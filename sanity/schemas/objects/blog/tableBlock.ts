import { defineField, defineType, defineArrayMember } from "sanity";

export const tableBlock = defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "columns",
      title: "Column Headers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tableRow",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              const text = Array.isArray(cells) ? cells.join(" · ") : "";
              return { title: text ? text.slice(0, 40) + (text.length > 40 ? "…" : "") : "Row" };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", columns: "columns" },
    prepare({ title, columns }) {
      const colCount = Array.isArray(columns) ? columns.length : 0;
      return {
        title: title || "Table",
        subtitle: `${colCount} column${colCount !== 1 ? "s" : ""}`,
      };
    },
  },
});
