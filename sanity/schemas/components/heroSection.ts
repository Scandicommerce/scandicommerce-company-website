import { defineArrayMember, defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "heroBadge",
      title: "Badge Text",
      type: "string",
      description: "Small text above the heading (e.g., 'WE UNDERSTAND A GREAT STACK')",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Main Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Word",
          type: "string",
          description: "Word(s) to highlight in teal color",
        }),
      ],
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroButtons",
      title: "Hero Buttons",
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
      name: "heroTagline",
      title: "Hero Tagline",
      type: "string",
      description: "Small text below buttons (e.g., 'Transparent pricing · Productized packages')",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Large image below the hero copy (2026 design). Optional.",
    }),
    defineField({
      name: "heroVideoFile",
      title: "Hero Video (upload)",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "Optional. Upload a short video (mp4/webm, ideally under ~10 MB) — replaces the hero image, plays muted on loop. For long videos use the URL field below (YouTube/Vimeo) instead.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video URL",
      type: "url",
      description:
        "Optional alternative to uploading: a direct video URL (.mp4/.webm) or a YouTube/Vimeo link. The uploaded file wins if both are set. The hero image is used as poster/fallback.",
    }),
    defineField({
      name: "heroPackages",
      title: "Hero Package Cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "package",
          title: "Package",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: "e.g., 'From 49.000 kr'",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heroTitle.text",
      subtitle: "heroBadge",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Hero",
        subtitle: subtitle || undefined,
      };
    },
  },
});
