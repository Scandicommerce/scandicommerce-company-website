import { defineField, defineType, defineArrayMember } from "sanity";

export const headerSettings = defineType({
  name: "headerSettings",
  title: "Header Settings",
  type: "document",
  fields: [
    defineField({
      name: "settingsTitle",
      title: "Settings Title",
      type: "string",
      description: "Internal name for these settings",
      initialValue: "Header Settings",
      validation: (rule) => rule.required(),
    }),
    // Services Menu
    defineField({
      name: "servicesMenu",
      title: "Services Menu",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string", initialValue: "Services" }),
        defineField({
          name: "items",
          title: "Menu Items",
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
    }),
    // Shopify Menu
    defineField({
      name: "shopifyMenu",
      title: "Shopify Menu",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string", initialValue: "Shopify" }),
        defineField({
          name: "items",
          title: "Menu Items",
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
    }),
    // Main Navigation Links
    defineField({
      name: "mainNavLinks",
      title: "Main Navigation Links",
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
    // CTA Button
    defineField({
      name: "ctaButton",
      title: "CTA Button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", initialValue: "GET STARTED" }),
        defineField({ name: "href", title: "Link", type: "string", initialValue: "/get-started" }),
      ],
    }),
  ],
  preview: {
    select: { title: "settingsTitle" },
  },
});
