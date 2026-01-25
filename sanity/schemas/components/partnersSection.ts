import { defineArrayMember, defineField } from "sanity";

export const partnersSection = defineField({
  name: "partners",
  title: "Partners Section",
  type: "object",
  fields: [
    defineField({
      name: "partnersBadges",
      title: "Partner Badges",
      type: "array",
      description: "List of partner badges/links (e.g., 'Browse services', 'Klaviyo Partner')",
      of: [
        defineArrayMember({
          name: "badge",
          title: "Badge",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Badge Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Badge Link",
              type: "string",
              description: "URL to link to (e.g., '/services', '/partners/klaviyo')",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "partnersDescription",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Text below the badges (e.g., 'Official Shopify partner since 2018...')",
    }),
  ],
});
