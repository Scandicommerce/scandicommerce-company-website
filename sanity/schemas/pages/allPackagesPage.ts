import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

function packagePageFilter({ document }: { document: Record<string, unknown> }) {
  const lang = (document as { language?: string }).language;
  if (!lang) return {};
  return { filter: "language == $lang", params: { lang } };
}

export const allPackagesPageHeroSection = defineType({
  name: "allPackagesPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Main Text",
          type: "string",
          description: "e.g., 'Choose your Shopify growth package'",
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "Text to highlight in teal (e.g., 'Shopify growth')",
        }),
      ],
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const allPackagesPagePackagesSection = defineType({
  name: "allPackagesPagePackagesSection",
  title: "Packages",
  type: "object",
  fields: [
    defineField({
      name: "packagesItems",
      title: "Package Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: "e.g., '3,500 NOK/month (~350 EUR)'",
            }),
            defineField({ name: "priceType", title: "Price Type", type: "string", description: "e.g., 'monthly'" }),
            defineField({ name: "timeline", title: "Timeline", type: "string", description: "e.g., 'Ongoing'" }),
            defineField({ name: "rating", title: "Rating", type: "number", validation: (rule) => rule.min(1).max(5) }),
            defineField({ name: "ratingValue", title: "Rating Display", type: "string", description: "e.g., '4.9'" }),
            defineField({
              name: "bestFor",
              title: "Best For",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "included",
              title: "What's Included",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
            defineField({
              name: "page",
              title: "Detail Page (recommended)",
              type: "reference",
              to: [{ type: "packageDetailPage" }],
              description: "Link to a package detail page. The URL will follow this page's slug automatically.",
              options: { filter: packagePageFilter },
            }),
            defineField({
              name: "href",
              title: "Custom Link (fallback)",
              type: "string",
              description: "Used only when no Detail Page is selected above.",
            }),
            defineField({
              name: "bookCallPage",
              title: "Book Call – Page (recommended)",
              type: "reference",
              to: [
                { type: "contactPage" },
                { type: "landingPage" },
                { type: "servicesPage" },
                { type: "aboutPage" },
                { type: "workPage" },
                { type: "blogPage" },
                { type: "allPackagesPage" },
                { type: "packageDetailPage" },
              ],
              description: "Select a page for the 'Book Call' button. The URL will follow this page's slug.",
              options: { filter: packagePageFilter },
            }),
            defineField({
              name: "bookCallHref",
              title: "Book Call – Custom link (fallback)",
              type: "string",
              description: "Used only when no page is selected above. e.g. /contact or a full URL (e.g. Calendly).",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Packages" }) },
});

export const allPackagesPageFaqSection = defineType({
  name: "allPackagesPageFaqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "faqTitle",
      title: "Title",
      type: "string",
      description: "e.g., 'Frequently asked questions'",
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "FAQ" }) },
});

export const allPackagesPage = defineType({
  name: "allPackagesPage",
  title: "All Packages Page",
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
        defineArrayMember({ type: "allPackagesPageHeroSection" }),
        defineArrayMember({ type: "allPackagesPagePackagesSection" }),
        defineArrayMember({ type: "allPackagesPageFaqSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
  },
});
