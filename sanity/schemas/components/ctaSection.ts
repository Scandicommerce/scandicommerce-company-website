import { defineArrayMember, defineField, defineType } from "sanity";
import { ctaSectionInitialValue } from "@/sanity/lib/landingPageSectionInitialValues";

const ctaSectionFields = [
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
    name: "buttons",
    title: "Buttons",
    type: "array",
    of: [
      defineArrayMember({
        name: "button",
        title: "Button",
        type: "object",
        fields: [
          defineField({
            name: "text",
            title: "Button Text",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "link",
            title: "Button Link",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "variant",
            title: "Variant",
            type: "string",
            options: {
              list: [
                { title: "Primary", value: "primary" },
                { title: "Secondary", value: "secondary" },
              ],
            },
            initialValue: "primary",
          }),
        ],
      }),
    ],
    validation: (rule) => rule.max(2),
  }),
  defineField({
    name: "backgroundColor",
    title: "Background Color",
    type: "string",
    options: {
      list: [
        { title: "Primary (Teal)", value: "primary" },
        { title: "Dark", value: "dark" },
      ],
    },
    initialValue: "primary",
  }),
];

export const ctaSectionType = defineType({
  name: "ctaSection",
  title: "CTA Section",
  type: "object",
  initialValue: ctaSectionInitialValue,
  fields: ctaSectionFields,
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return {
        title: title || "CTA",
        subtitle: subtitle || "",
      };
    },
  },
});

/** Embedded CTA block on e.g. services page (field name `cta`) */
export const ctaSection = defineField({
  name: "cta",
  title: "CTA Section",
  type: "ctaSection",
});
