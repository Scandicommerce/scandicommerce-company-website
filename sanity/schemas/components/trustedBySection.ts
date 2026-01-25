import { defineArrayMember, defineField } from "sanity";

export const trustedBySection = defineField({
  name: "trustedBy",
  title: "Trusted By Section",
  type: "object",
  description: "Brand logos section showing trusted partners",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g., 'Trusted by 50+ Norwegian brands'",
      initialValue: "Trusted by 50+ Norwegian brands",
    }),
    defineField({
      name: "brands",
      title: "Brand Logos",
      type: "array",
      description: "List of brand logos to display",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Brand Name",
              type: "string",
              description: "e.g., 'Telenor Group', 'Yara', 'DNB'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Accessibility text for the logo",
            }),
            defineField({
              name: "link",
              title: "Link URL",
              type: "string",
              description: "Optional link to brand website or case study",
            }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        }),
      ],
    }),
  ],
});
