import { defineField, defineType } from "sanity";

export const dividerBlock = defineType({
  name: "dividerBlock",
  title: "Divider / Spacing",
  type: "object",
  fields: [
    defineField({
      name: "spacing",
      title: "Spacing",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Divider", subtitle: "Visual spacing" };
    },
  },
});
