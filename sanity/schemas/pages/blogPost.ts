import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "author", title: "Author" },
    { name: "structure", title: "Structure" },
    { name: "related", title: "Related" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleHighlight",
      title: "Title Highlight",
      type: "string",
      group: "content",
      description: "Part of the title to highlight in cyan (e.g. '10 Essential')",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "URL path after /resources/ only. Example: for https://yoursite.com/en/resources/10-essential-shopify-apps-norwegian-ecommerce-2025 enter: 10-essential-shopify-apps-norwegian-ecommerce-2025 (no /resources/, no /en/, no slashes). Use 'Generate' from title or type manually.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 2,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      group: "content",
      description: "e.g. Jan 15, 2025",
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      group: "content",
      description: "e.g. 8 min read",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Main article image (in content and cards)",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Optional; falls back to Image if not set",
    }),
    // Author
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      group: "author",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "role", title: "Role", type: "text", rows: 2 }),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "slug", title: "Slug", type: "string", description: "e.g. magnus-andersen for /team/magnus-andersen" }),
      ],
    }),
    // Table of contents
    defineField({
      name: "tableOfContents",
      title: "Table of Contents",
      type: "array",
      group: "structure",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "id", title: "ID", type: "string", description: "Anchor id (e.g. why-apps-matter)" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "number", title: "Number", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      group: "structure",
      rows: 4,
    }),
    // Sections (body)
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "structure",
      of: [
        defineArrayMember({
          type: "object",
          name: "articleSection",
          fields: [
            defineField({ name: "id", title: "ID", type: "string", description: "Anchor id, must match table of contents" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "content", title: "Content", type: "text", rows: 6 }),
            defineField({
              name: "proTip",
              title: "Pro Tip",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", initialValue: "Pro Tip" }),
                defineField({ name: "content", title: "Content", type: "text", rows: 3 }),
              ],
            }),
            defineField({
              name: "apps",
              title: "App Recommendations",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "name", title: "Name", type: "string" }),
                    defineField({ name: "category", title: "Category", type: "string" }),
                    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                    defineField({
                      name: "features",
                      title: "Features",
                      type: "array",
                      of: [defineArrayMember({ type: "string" })],
                    }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Section" };
            },
          },
        }),
      ],
    }),
    // Related articles (reference other blog posts)
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      group: "related",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Blog Post",
        subtitle: subtitle || "Blog Post",
      };
    },
  },
});
