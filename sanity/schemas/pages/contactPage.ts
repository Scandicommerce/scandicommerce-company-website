import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
        defineField({
          name: "enabled",
          title: "Enable booking",
          type: "boolean",
          description: "When off, the booking section is hidden and only the contact form is shown.",
          initialValue: true,
        }),
        defineField({
          name: "useCalendly",
          title: "Use Calendly",
          type: "boolean",
          description: "When on, show Calendly scheduling (embed or link) instead of the built-in calendar. Set your Calendly URL below.",
          initialValue: false,
        }),
        defineField({
          name: "calendlySchedulingUrl",
          title: "Calendly scheduling URL",
          type: "url",
          description: "Your Calendly scheduling page, e.g. https://calendly.com/your-username/30min. Used when 'Use Calendly' is on.",
          hidden: ({ parent }) => !parent?.useCalendly,
        }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "meetingTypes",
          title: "Meeting Types",
          type: "array",
          description: "Types of meetings users can book (e.g. 30-min discovery, 60-min strategy).",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
                defineField({
                  name: "durationMinutes",
                  title: "Duration (minutes)",
                  type: "number",
                  description: "e.g. 30 or 60",
                  validation: (rule) => rule.min(15).max(120),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "availableSlots",
          title: "Available dates & times",
          type: "array",
          description: "For each date, choose which time slots are available. When empty, default business hours (09:00–17:00) are used for any date.",
          of: [
            defineArrayMember({
              type: "object",
              name: "dateSlot",
              title: "Date & times",
              fields: [
                defineField({
                  name: "date",
                  title: "Date",
                  type: "date",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "times",
                  title: "Available times on this date",
                  type: "array",
                  of: [{ type: "string" }],
                  options: {
                    list: [
                      { title: "08:00", value: "08:00" },
                      { title: "09:00", value: "09:00" },
                      { title: "10:00", value: "10:00" },
                      { title: "11:00", value: "11:00" },
                      { title: "12:00", value: "12:00" },
                      { title: "13:00", value: "13:00" },
                      { title: "14:00", value: "14:00" },
                      { title: "15:00", value: "15:00" },
                      { title: "16:00", value: "16:00" },
                      { title: "17:00", value: "17:00" },
                      { title: "18:00", value: "18:00" },
                    ],
                  },
                }),
              ],
              preview: {
                select: { date: "date" },
                prepare({ date }: { date?: string }) {
                  return {
                    title: date ? new Date(date + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Pick a date",
                  };
                },
              },
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
