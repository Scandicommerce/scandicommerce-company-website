import { defineType, defineField } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Link Text",
      type: "string",
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
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "text",
      linkType: "linkType",
    },
    prepare({ title, linkType }) {
      return {
        title: title || "Untitled Link",
        subtitle: linkType === "external" ? "External Link" : "Internal Link",
      };
    },
  },
});
