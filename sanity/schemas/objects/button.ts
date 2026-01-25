import { defineType, defineField } from "sanity";

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internalLink",
      title: "Internal Link",
      type: "reference",
      to: [
        { type: "landingPage" },
        { type: "servicesPage" },
        { type: "aboutPage" },
        { type: "contactPage" },
        { type: "workPage" },
        { type: "blogPage" },
      ],
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "mailto", "tel"],
        }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
    defineField({
      name: "variant",
      title: "Button Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Outline", value: "outline" },
          { title: "Ghost", value: "ghost" },
        ],
      },
      initialValue: "primary",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "text",
      variant: "variant",
    },
    prepare({ title, variant }) {
      return {
        title: title || "Untitled Button",
        subtitle: variant ? `${variant} button` : "Button",
      };
    },
  },
});
