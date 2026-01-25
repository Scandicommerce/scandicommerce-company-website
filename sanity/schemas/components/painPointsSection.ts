import { defineArrayMember, defineField } from "sanity";

export const painPointsSection = defineField({
  name: "painPoints",
  title: "Pain Points Section",
  type: "object",
  fields: [
    defineField({
      name: "painPointsTitle",
      title: "Section Title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Main Text",
          type: "string",
          description: "Full title text (e.g., 'Tired of proposal ping-pong with agencies?')",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Word",
          type: "string",
          description: "Word(s) to highlight in teal color (e.g., 'proposal ping-pong')",
        }),
      ],
    }),
    defineField({
      name: "painPointsItems",
      title: "Pain Point Items",
      type: "array",
      description: "List of pain points (max 4 recommended)",
      of: [
        defineArrayMember({
          name: "item",
          title: "Pain Point",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "painPointsBottomText",
      title: "Bottom Text",
      type: "string",
      description: "Text below the pain points (e.g., 'We built something different.')",
    }),
    defineField({
      name: "painPointsCta",
      title: "CTA Link",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Link Text",
          type: "string",
          description: "e.g., 'Explore our product-style services'",
        }),
        defineField({
          name: "url",
          title: "Link URL",
          type: "string",
          description: "e.g., '/services'",
        }),
      ],
    }),
  ],
});
