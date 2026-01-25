import { defineField, defineType, defineArrayMember } from "sanity";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer Settings",
  type: "document",
  fields: [
    defineField({
      name: "settingsTitle",
      title: "Settings Title",
      type: "string",
      description: "Internal name for these settings",
      initialValue: "Footer Settings",
      validation: (rule) => rule.required(),
    }),
    // Footer Columns
    defineField({
      name: "columns",
      title: "Footer Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Column Title", type: "string" }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "href", title: "Link", type: "string" }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "href" },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
    }),
    // Connect Section
    defineField({
      name: "connectSection",
      title: "Connect Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string", initialValue: "Connect" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ 
                  name: "platform", 
                  title: "Platform", 
                  type: "string",
                  options: {
                    list: [
                      { title: "LinkedIn", value: "linkedin" },
                      { title: "Twitter/X", value: "twitter" },
                      { title: "Instagram", value: "instagram" },
                      { title: "Facebook", value: "facebook" },
                      { title: "YouTube", value: "youtube" },
                      { title: "GitHub", value: "github" },
                    ],
                  },
                }),
                defineField({ name: "url", title: "URL", type: "url" }),
              ],
              preview: {
                select: { title: "platform", subtitle: "url" },
              },
            }),
          ],
        }),
      ],
    }),
    // Bottom Section
    defineField({
      name: "bottomSection",
      title: "Bottom Section",
      type: "object",
      fields: [
        defineField({ name: "badgeText", title: "Badge Text", type: "string", initialValue: "Shopify Plus Partner" }),
        defineField({ name: "orgNumber", title: "Organization Number", type: "string" }),
        defineField({
          name: "legalLinks",
          title: "Legal Links",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
              ],
              preview: {
                select: { title: "label", subtitle: "href" },
              },
            }),
          ],
        }),
        defineField({ name: "copyrightText", title: "Copyright Text", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "settingsTitle" },
  },
});
