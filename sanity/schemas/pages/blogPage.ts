import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const blogPageHeroSection = defineType({
  name: "blogPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "Part of the title to highlight in cyan (appears first)",
        }),
        defineField({ name: "text", title: "Rest of Title", type: "string" }),
      ],
    }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 2 }),
    defineField({ name: "searchPlaceholder", title: "Search Placeholder", type: "string" }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const blogPageFeaturedArticleSection = defineType({
  name: "blogPageFeaturedArticleSection",
  title: "Featured article",
  type: "object",
  fields: [
    defineField({
      name: "article",
      title: "Featured Article",
      type: "reference",
      to: [{ type: "blogPost" }, { type: "post" }, { type: "caseStudy" }],
      description: "Link to a blog post, post (page builder), or case study. Leave empty to use manual fields below.",
      options: {
        filter: ({ document }) => {
          const pageLang = document?.language ?? "en";
          return {
            filter:
              '(_type == "blogPost" || _type == "post" || _type == "caseStudy") && (language == $pageLang || (!defined(language) && $pageLang == "en"))',
            params: { pageLang },
          };
        },
      },
    }),
    defineField({
      name: "image",
      title: "Featured Image (if no post selected)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "isPrimary",
              title: "Is Primary (Cyan Background)",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "title", title: "Title (override or manual)", type: "string" }),
    defineField({ name: "description", title: "Description (override or manual)", type: "text", rows: 2 }),
    defineField({ name: "date", title: "Date (override or manual)", type: "string" }),
    defineField({ name: "readTime", title: "Read Time (override or manual)", type: "string" }),
    defineField({ name: "link", title: "Article Link (override or manual)", type: "string" }),
    defineField({
      name: "buttonText",
      title: "CTA Button Text",
      type: "string",
      description: 'e.g. "READ THE POST" / "LES ARTIKKELEN"',
    }),
    defineField({
      name: "pageHeaderEyebrow",
      title: "Page Header — Eyebrow",
      type: "string",
      description: 'Small label above the page title. e.g. "Notes from the studio" / "Notater fra studioet"',
    }),
    defineField({
      name: "pageHeaderTitle",
      title: "Page Header — Title",
      type: "string",
      description: 'Large h1 at the top of the blog page. e.g. "What we shipped & learned." / "Hva vi sendte og lærte."',
    }),
  ],
  preview: { prepare: () => ({ title: "Featured article" }) },
});

export const blogPageArticlesGridSection = defineType({
  name: "blogPageArticlesGridSection",
  title: "Articles grid",
  type: "object",
  fields: [
    defineField({
      name: "articles",
      title: "Articles",
      type: "array",
      description:
        "Select blog posts, posts (page builder), or case studies to show in the grid. Only items in this page's language are listed. Order matters.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }, { type: "post" }, { type: "caseStudy" }],
          options: {
            filter: ({ document }) => {
              const pageLang = document?.language ?? "en";
              return {
                filter:
                  '(_type == "blogPost" || _type == "post" || _type == "caseStudy") && (language == $pageLang || (!defined(language) && $pageLang == "en"))',
                params: { pageLang },
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "latestPostsLabel",
      title: "Latest Posts Label",
      type: "string",
      description: 'Heading above the top 3 article cards. e.g. "Latest posts" / "Siste innlegg"',
    }),
    defineField({
      name: "archiveLabel",
      title: "Archive Label",
      type: "string",
      description: 'Heading above the filterable archive list. e.g. "Archive" / "Arkiv"',
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search Placeholder",
      type: "string",
      description: 'Placeholder in the archive search field. e.g. "Search archive…" / "Søk i arkivet…"',
    }),
  ],
  preview: { prepare: () => ({ title: "Articles grid" }) },
});

export const blogPageNewsletterCtaSection = defineType({
  name: "blogPageNewsletterCtaSection",
  title: "Newsletter CTA",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Newsletter CTA" }) },
});

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
        isUnique: isUniquePerLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "blogPageHeroSection" }),
        defineArrayMember({ type: "blogPageFeaturedArticleSection" }),
        defineArrayMember({ type: "blogPageArticlesGridSection" }),
        defineArrayMember({ type: "blogPageNewsletterCtaSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
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
