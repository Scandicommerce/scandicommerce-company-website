import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
      description: "Rich text: paragraphs, lists, bold, italic, etc.",
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
            }),
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url", variant: "variant" },
            prepare({ title, subtitle, variant }) {
              return {
                title: title || "Button",
                subtitle: `${variant || "primary"} · ${subtitle || ""}`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: "heading", buttons: "buttons" },
    prepare({ heading, buttons }) {
      const count = Array.isArray(buttons) ? buttons.length : 0;
      return {
        title: heading || "CTA",
        subtitle: `${count} button${count === 1 ? "" : "s"}`,
      };
    },
  },
});
