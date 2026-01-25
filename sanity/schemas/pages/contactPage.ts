import { defineField, defineType, defineArrayMember } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
            defineField({ name: "text", title: "Full Title Text", type: "string" }),
            defineField({ name: "highlight", title: "Highlighted Text", type: "string", description: "Part of the title to highlight in cyan" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 2 }),
      ],
    }),
    // Contact Cards Section
    defineField({
      name: "contactCards",
      title: "Contact Cards Section",
      type: "object",
      fields: [
        defineField({
          name: "cards",
          title: "Contact Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "icon", title: "Icon Name", type: "string", description: "e.g., email, phone, location" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
                defineField({ name: "detail", title: "Detail", type: "string" }),
                defineField({ name: "href", title: "Link (optional)", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Booking Section
    defineField({
      name: "bookingSection",
      title: "Booking Section",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "meetingTypes",
          title: "Meeting Types",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({ name: "confirmButtonText", title: "Confirm Button Text", type: "string" }),
      ],
    }),
    // Message Section
    defineField({
      name: "messageSection",
      title: "Message Section",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "submitButtonText", title: "Submit Button Text", type: "string" }),
      ],
    }),
    // Benefits
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon Name", type: "string", description: "e.g., check, clock" }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
        }),
      ],
    }),
    // Map Section
    defineField({
      name: "mapSection",
      title: "Map Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    // FAQ Section
    defineField({
      name: "faq",
      title: "FAQ Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "subtitle", title: "Section Subtitle", type: "text", rows: 2 }),
        defineField({
          name: "faqs",
          title: "FAQs",
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
        title: title || "Untitled Contact Page",
        subtitle: "Contact Page",
      };
    },
  },
});
