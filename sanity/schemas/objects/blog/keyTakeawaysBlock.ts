import { defineField, defineType } from "sanity";

export const keyTakeawaysBlock = defineType({
  name: "keyTakeawaysBlock",
  title: "Key Takeaways",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      description: "Rich text: headings, bold, lists, etc.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "e.g. #F8FAFA, #F0F2F5, #FEF9E7",
      initialValue: "#F8FAFA",
    }),
    defineField({
      name: "borderColor",
      title: "Border Color (sides & bottom)",
      type: "string",
      description: "e.g. #000000, #E53935",
      initialValue: "#E5E7EB",
    }),
    defineField({
      name: "topBorderColor",
      title: "Top Border Color",
      type: "string",
      description: "Thick accent bar at top. e.g. #03C1CA, #E53935",
      initialValue: "#03C1CA",
    }),
    defineField({
      name: "topBorderColorEnd",
      title: "Top Border Color End (gradient)",
      type: "string",
      description: "Optional. If set, top border uses a gradient from Top Border Color to this color (e.g. #03C1CA → #8B5CF6).",
    }),
  ],
  preview: {
    select: { content: "content" },
    prepare({ content }) {
      const blocks = Array.isArray(content) ? content : [];
      const first = blocks.find((b: { _type?: string }) => b._type === "block");
      const text =
        first && "children" in first
          ? (first as { children?: Array<{ text?: string }> }).children
              ?.map((c) => c.text)
              .join("") || ""
          : "";
      return {
        title: "Key Takeaways",
        subtitle: text ? `${text.slice(0, 40)}${text.length > 40 ? "…" : ""}` : "Rich text",
      };
    },
  },
});
