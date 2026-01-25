import { defineArrayMember, defineField } from "sanity";

export const processSection = defineField({
  name: "process",
  title: "Process Section",
  type: "object",
  fields: [
    defineField({
      name: "processTitle",
      title: "Title",
      type: "string",
      description: "e.g., 'How we work'",
    }),
    defineField({
      name: "processSubtitle",
      title: "Subtitle",
      type: "string",
      description: "e.g., 'Simple, transparent, and effective'",
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        defineArrayMember({
          name: "step",
          title: "Step",
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Step Number",
              type: "number",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
});
