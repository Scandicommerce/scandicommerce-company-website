import { defineArrayMember, defineField } from "sanity";

export const ctaSection = defineField({
  name: "cta",
  title: "CTA Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [
        defineArrayMember({
          name: "button",
          title: "Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              validation: (rule) => rule.required(),
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
              },
              initialValue: "primary",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      options: {
        list: [
          { title: "Primary (Teal)", value: "primary" },
          { title: "Dark", value: "dark" },
        ],
      },
      initialValue: "primary",
    }),
  ],
});
