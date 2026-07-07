import { defineField, defineType } from "sanity";

/**
 * Homepage "Nyheter og guider" section (2026 design).
 * The post list is fetched automatically (latest posts for the page language),
 * so editors only manage the heading copy — the section never goes stale.
 */
export const blogTeaserSection = defineType({
  name: "blogTeaserSection",
  title: "Blog Teaser (latest posts)",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "Blogg",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Nyheter og guider",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkText",
      title: "Link Text",
      type: "string",
      description: 'e.g. "Til bloggen →"',
      initialValue: "Til bloggen",
    }),
    defineField({
      name: "linkHref",
      title: "Link URL",
      type: "string",
      description: "Where the link goes. Bare path — the domain decides language.",
      initialValue: "/blogg",
    }),
    defineField({
      name: "count",
      title: "Number of posts",
      type: "number",
      initialValue: 3,
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Blog Teaser", subtitle: "Latest posts (automatic)" };
    },
  },
});
