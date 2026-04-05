import { defineArrayMember, defineField, defineType } from "sanity";
import { processSectionInitialValue } from "@/sanity/lib/landingPageSectionInitialValues";

const processSectionFields = [
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
];

export const processSectionType = defineType({
  name: "processSection",
  title: "Process Section",
  type: "object",
  initialValue: processSectionInitialValue,
  fields: processSectionFields,
  preview: {
    select: { title: "processTitle", subtitle: "processSubtitle" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Process",
        subtitle: subtitle || "Steps",
      };
    },
  },
});
