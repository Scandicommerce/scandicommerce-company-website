import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

/** Nested booking settings (used inside booking group block). */
export const contactPageBookingNested = defineType({
  name: "contactPageBookingNested",
  title: "Booking settings",
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
                title: date
                  ? new Date(date + "T12:00:00").toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick a date",
              };
            },
          },
        }),
      ],
    }),
    defineField({ name: "confirmButtonText", title: "Confirm Button Text", type: "string" }),
  ],
});

export const contactPageMessageNested = defineType({
  name: "contactPageMessageNested",
  title: "Message form",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "submitButtonText", title: "Submit Button Text", type: "string" }),
  ],
});

export const contactPageHeroSection = defineType({
  name: "contactPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Full Title Text", type: "string" }),
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "Part of the title to highlight in cyan",
        }),
      ],
    }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const contactPageCardsSection = defineType({
  name: "contactPageCardsSection",
  title: "Contact cards",
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
  preview: { prepare: () => ({ title: "Contact cards" }) },
});

export const contactPageBookingGroupSection = defineType({
  name: "contactPageBookingGroupSection",
  title: "Booking & contact form",
  type: "object",
  description: "Calendar / Calendly, message form, and benefits stay together as one section.",
  fields: [
    defineField({
      name: "bookingSection",
      title: "Booking",
      type: "contactPageBookingNested",
    }),
    defineField({
      name: "messageSection",
      title: "Message form",
      type: "contactPageMessageNested",
    }),
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
  ],
  preview: { prepare: () => ({ title: "Booking & contact form" }) },
});

export const contactPageMapSection = defineType({
  name: "contactPageMapSection",
  title: "Map",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
      description: "e.g. 59.9242 — find your coordinates at maps.google.com (right-click → What's here?)",
      validation: (rule) => rule.min(-90).max(90),
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
      description: "e.g. 10.6994",
      validation: (rule) => rule.min(-180).max(180),
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }: { title?: string }) => ({ title: title || "Map" }) },
});

export const contactPageFaqSection = defineType({
  name: "contactPageFaqSection",
  title: "FAQ",
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
  preview: { prepare: () => ({ title: "FAQ" }) },
});

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
        defineArrayMember({ type: "contactPageHeroSection" }),
        defineArrayMember({ type: "contactPageCardsSection" }),
        defineArrayMember({ type: "contactPageBookingGroupSection" }),
        defineArrayMember({ type: "contactPageMapSection" }),
        defineArrayMember({ type: "contactPageFaqSection" }),
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
        title: title || "Untitled Contact Page",
        subtitle: "Contact Page",
      };
    },
  },
});
