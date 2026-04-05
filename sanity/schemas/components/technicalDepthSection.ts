import { defineArrayMember, defineField, defineType } from "sanity";
import { technicalDepthSectionInitialValue } from "@/sanity/lib/landingPageSectionInitialValues";

export const technicalDepthSectionType = defineType({
  name: "technicalDepthSection",
  title: "Technical Depth Section",
  type: "object",
  initialValue: technicalDepthSectionInitialValue,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "capabilities",
      title: "Capability Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "tags",
              title: "Tech Tags",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "icon" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Untitled",
                subtitle: subtitle || "",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Technical Depth Section",
        subtitle: "Capabilities grid",
      };
    },
  },
});
