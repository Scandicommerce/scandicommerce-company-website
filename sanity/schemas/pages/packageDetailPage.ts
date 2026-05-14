import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const packageDetailPagePackageInfoSection = defineType({
  name: "packageDetailPagePackageInfoSection",
  title: "Package info",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({ name: "priceType", title: "Price Type", type: "string", description: "e.g., one-time payment" }),
    defineField({ name: "timeline", title: "Timeline", type: "string" }),
    defineField({ name: "rating", title: "Rating", type: "number" }),
    defineField({ name: "ratingValue", title: "Rating Value (Display)", type: "string" }),
    defineField({ name: "reviewCount", title: "Review Count", type: "number" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Package info" }) },
});

export const packageDetailPageHeroButtonsSection = defineType({
  name: "packageDetailPageHeroButtonsSection",
  title: "Hero buttons",
  type: "object",
  fields: [
    defineField({ name: "primaryButtonText", title: "Primary Button Text", type: "string", initialValue: "Book Discovery Call" }),
    defineField({ name: "primaryButtonLink", title: "Primary Button Link", type: "string", initialValue: "/contact" }),
  ],
  preview: { prepare: () => ({ title: "Hero buttons" }) },
});

export const packageDetailPageBestForSection = defineType({
  name: "packageDetailPageBestForSection",
  title: "Best for",
  type: "object",
  fields: [
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Best for" }) },
});

export const packageDetailPageIdealForSection = defineType({
  name: "packageDetailPageIdealForSection",
  title: "Ideal for",
  type: "object",
  fields: [
    defineField({
      name: "idealFor",
      title: "Ideal For",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Ideal for" }) },
});

export const packageDetailPageHighlightsSection = defineType({
  name: "packageDetailPageHighlightsSection",
  title: "Highlights",
  type: "object",
  fields: [
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Highlights" }) },
});

export const packageDetailPageMoreDeliverablesSection = defineType({
  name: "packageDetailPageMoreDeliverablesSection",
  title: "More deliverables count",
  type: "object",
  fields: [
    defineField({
      name: "moreDeliverablesCount",
      title: "More Deliverables Count",
      type: "number",
      description: "Number shown as '+X more deliverables included' in the hero card",
    }),
  ],
  preview: { prepare: () => ({ title: "More deliverables" }) },
});

export const packageDetailPageIncludedListSection = defineType({
  name: "packageDetailPageIncludedListSection",
  title: "Included (simple list)",
  type: "object",
  fields: [
    defineField({
      name: "included",
      title: "Included Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Included list" }) },
});

export const packageDetailPageIncludedCategoriesSection = defineType({
  name: "packageDetailPageIncludedCategoriesSection",
  title: "Included categories",
  type: "object",
  fields: [
    defineField({
      name: "includedCategories",
      title: "Included Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "category", title: "Category Name", type: "string" }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "category" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Included categories" }) },
});

export const packageDetailPageProcessStepsSection = defineType({
  name: "packageDetailPageProcessStepsSection",
  title: "Process steps",
  type: "object",
  fields: [
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "week", title: "Week", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Process steps" }) },
});

export const packageDetailPageFaqListSection = defineType({
  name: "packageDetailPageFaqListSection",
  title: "FAQ list",
  type: "object",
  fields: [
    defineField({
      name: "faq",
      title: "FAQ",
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

export const packageDetailPageReviewsListSection = defineType({
  name: "packageDetailPageReviewsListSection",
  title: "Reviews",
  type: "object",
  fields: [
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "rating", title: "Rating", type: "number" }),
            defineField({ name: "comment", title: "Comment", type: "text", rows: 2 }),
            defineField({ name: "title", title: "Title/Company", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "title" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Reviews" }) },
});

export const packageDetailPageTabLabelsSection = defineType({
  name: "packageDetailPageTabLabelsSection",
  title: "Tab labels",
  type: "object",
  description: "Labels for the tabs on the detail page. Leave empty to use English defaults.",
  fields: [
    defineField({ name: "overview", title: "Overview", type: "string", initialValue: "Overview" }),
    defineField({ name: "whatsIncluded", title: "What's Included", type: "string", initialValue: "What's Included" }),
    defineField({ name: "process", title: "Process", type: "string", initialValue: "Process" }),
    defineField({ name: "faq", title: "FAQ", type: "string", initialValue: "FAQ" }),
    defineField({ name: "reviews", title: "Reviews", type: "string", initialValue: "Reviews" }),
    defineField({ name: "idealFor", title: "Ideal For", type: "string", initialValue: "Ideal for:" }),
    defineField({ name: "bestFor", title: "Best For", type: "string", initialValue: "Best for:" }),
  ],
  preview: { prepare: () => ({ title: "Tab labels" }) },
});

export const packageDetailPageAddOnsSection = defineType({
  name: "packageDetailPageAddOnsSection",
  title: "Frequently added together",
  type: "object",
  fields: [
    defineField({ name: "sectionTitle", title: "Section Title", type: "string" }),
    defineField({ name: "sectionSubtitle", title: "Section Subtitle", type: "string" }),
    defineField({
      name: "items",
      title: "Add-on Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "price", title: "Price", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Add-ons" }) },
});

export const packageDetailPageCaseStudiesBannerSection = defineType({
  name: "packageDetailPageCaseStudiesBannerSection",
  title: "Case studies banner",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Case studies banner" }) },
});

const packageDetailSectionMembers = [
  defineArrayMember({ type: "packageDetailPagePackageInfoSection" }),
  defineArrayMember({ type: "packageDetailPageHeroButtonsSection" }),
  defineArrayMember({ type: "packageDetailPageBestForSection" }),
  defineArrayMember({ type: "packageDetailPageIdealForSection" }),
  defineArrayMember({ type: "packageDetailPageHighlightsSection" }),
  defineArrayMember({ type: "packageDetailPageMoreDeliverablesSection" }),
  defineArrayMember({ type: "packageDetailPageIncludedListSection" }),
  defineArrayMember({ type: "packageDetailPageIncludedCategoriesSection" }),
  defineArrayMember({ type: "packageDetailPageProcessStepsSection" }),
  defineArrayMember({ type: "packageDetailPageFaqListSection" }),
  defineArrayMember({ type: "packageDetailPageReviewsListSection" }),
  defineArrayMember({ type: "packageDetailPageTabLabelsSection" }),
  defineArrayMember({ type: "packageDetailPageAddOnsSection" }),
  defineArrayMember({ type: "packageDetailPageCaseStudiesBannerSection" }),
];

export const packageDetailPage = defineType({
  name: "packageDetailPage",
  title: "Package Detail Page",
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
      description: "URL slug for the package (e.g., foundation, growth, premium, enterprise)",
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections. Tab content blocks can be in any order; add-ons and banner typically go after.",
      of: packageDetailSectionMembers,
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: {
    select: {
      title: "pageTitle",
      subtitle: "packageInfo.price",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Package",
        subtitle: `Package Detail - ${subtitle || "No price"}`,
      };
    },
  },
});
