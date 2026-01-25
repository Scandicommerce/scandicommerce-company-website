import { defineField, defineType, defineArrayMember } from "sanity";

export const packageDetailPage = defineType({
  name: "packageDetailPage",
  title: "Package Detail Page",
  type: "document",
  fields: [
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
      description: "URL slug for the package (e.g., foundation, growth, premium, enterprise)",
    }),
    // Package Info
    defineField({
      name: "packageInfo",
      title: "Package Info",
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
    }),
    // Hero Buttons
    defineField({
      name: "heroButtons",
      title: "Hero Buttons",
      type: "object",
      fields: [
        defineField({ name: "primaryButtonText", title: "Primary Button Text", type: "string", initialValue: "Book Discovery Call" }),
        defineField({ name: "primaryButtonLink", title: "Primary Button Link", type: "string", initialValue: "/contact" }),
        // defineField({ name: "secondaryButtonText", title: "Secondary Button Text", type: "string", initialValue: "Download Scope" }),
        // defineField({ name: "secondaryButtonLink", title: "Secondary Button Link", type: "string" }),
      ],
    }),
    // Best For (short list for overview)
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    // Ideal For (detailed list for Overview tab)
    defineField({
      name: "idealFor",
      title: "Ideal For",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    // Highlights (for hero card)
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    // More Deliverables Count (for hero card)
    defineField({
      name: "moreDeliverablesCount",
      title: "More Deliverables Count",
      type: "number",
      description: "Number shown as '+X more deliverables included' in the hero card",
    }),
    // Included (simple list)
    defineField({
      name: "included",
      title: "Included Items (Simple List)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    // Included Categories (categorized list)
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
    // Process Steps
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
    // FAQ
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
    // Reviews
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
    // Frequently Added Together (Add-ons)
    defineField({
      name: "addOns",
      title: "Frequently Added Together (Add-ons)",
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
    }),
    // Case Studies Banner
    defineField({
      name: "caseStudiesBanner",
      title: "Case Studies Banner",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
        defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
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
