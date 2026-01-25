import { defineArrayMember, defineField } from "sanity";

export const resultsSection = defineField({
  name: "results",
  title: "Results Section",
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
      name: "items",
      title: "Result Cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "result",
          title: "Result",
          type: "object",
          fields: [
            defineField({
              name: "clientImage",
              title: "Client Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "clientName",
              title: "Client Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "stat",
              title: "Stat Value",
              type: "string",
              description: "e.g., '+156%'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "metricName",
              title: "Metric Name",
              type: "string",
              description: "e.g., 'Conversion rate'",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "ctaText",
              title: "CTA Text",
              type: "string",
              description: "e.g., 'Read case study'",
            }),
            defineField({
              name: "ctaLink",
              title: "CTA Link",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
        ],
      },
      initialValue: "dark",
    }),
  ],
});
