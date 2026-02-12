import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "pageTitle",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    // Hero Section
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "heroTitle",
          title: "Hero Title",
          type: "object",
          fields: [
            defineField({ name: "highlight", title: "Highlighted Text", type: "string", description: "Part of the title to highlight in cyan (appears first)" }),
            defineField({ name: "text", title: "Rest of Title", type: "string" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 2 }),
        defineField({ name: "searchPlaceholder", title: "Search Placeholder", type: "string" }),
      ],
    }),
    // Featured Article (link to a Blog Post or enter manually)
    defineField({
      name: "featuredArticle",
      title: "Featured Article",
      type: "object",
      fields: [
        defineField({
          name: "article",
          title: "Blog Post",
          type: "reference",
          to: [{ type: "blogPost" }],
          description: "Link to a blog post for title, image, date, etc. Leave empty to use manual fields below.",
          options: {
            filter: ({ document }) => {
              const pageLang = document?.language ?? "en";
              return {
                filter:
                  '_type == "blogPost" && (language == $pageLang || (!defined(language) && $pageLang == "en"))',
                params: { pageLang },
              };
            },
          },
        }),
        defineField({ name: "image", title: "Featured Image (if no post selected)", type: "image", options: { hotspot: true } }),
        defineField({
          name: "tags",
          title: "Tags",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "isPrimary", title: "Is Primary (Cyan Background)", type: "boolean", initialValue: false }),
              ],
            }),
          ],
        }),
        defineField({ name: "title", title: "Title (override or manual)", type: "string" }),
        defineField({ name: "description", title: "Description (override or manual)", type: "text", rows: 2 }),
        defineField({ name: "date", title: "Date (override or manual)", type: "string" }),
        defineField({ name: "readTime", title: "Read Time (override or manual)", type: "string" }),
        defineField({ name: "link", title: "Article Link (override or manual)", type: "string" }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
      ],
    }),
    // Articles Grid (references to Blog Posts)
    defineField({
      name: "articlesGrid",
      title: "Articles Grid",
      type: "object",
      fields: [
        defineField({
          name: "articles",
          title: "Articles",
          type: "array",
          description:
            "Select blog posts to show in the grid. Only posts in this page's language are listed. Order matters.",
          of: [
            defineArrayMember({
              type: "reference",
              to: [{ type: "blogPost" }],
              options: {
                filter: ({ document }) => {
                  const pageLang = document?.language ?? "en";
                  return {
                    filter:
                      '_type == "blogPost" && (language == $pageLang || (!defined(language) && $pageLang == "en"))',
                    params: { pageLang },
                  };
                },
              },
            }),
          ],
        }),
        defineField({ name: "loadMoreButtonText", title: "Load More Button Text", type: "string" }),
      ],
    }),
    // Newsletter CTA Section
    defineField({
      name: "newsletterCta",
      title: "Newsletter CTA Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "string" }),
        defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
      ],
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled Blog Page",
        subtitle: "Blog Page",
      };
    },
  },
});
