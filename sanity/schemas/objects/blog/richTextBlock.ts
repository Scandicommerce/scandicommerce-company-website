import { defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { body: "body" },
    prepare({ body }) {
      const blocks = Array.isArray(body) ? body : [];
      const first = blocks.find((b: { _type?: string }) => b._type === "block");
      const text =
        first && "children" in first
          ? (first as { children?: Array<{ text?: string }> }).children
              ?.map((c) => c.text)
              .join("") || ""
          : "";
      return {
        title: "Rich Text",
        subtitle: text ? `${text.slice(0, 50)}${text.length > 50 ? "…" : ""}` : "",
      };
    },
  },
});
