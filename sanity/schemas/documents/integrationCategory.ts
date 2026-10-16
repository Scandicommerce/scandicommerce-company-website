import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import { seoExtendedField } from "../_shared/seoFields";
import { relatedPagesField } from "../_shared/relatedPagesField";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";
import { validatePublicSlug } from "@/sanity/lib/slugValidation";

/** Fixed category keys. The four the header menu links to come first. */
export const INTEGRATION_CATEGORY_KEYS = [
  { title: "ERP og økonomi", value: "erp" },
  { title: "PIM og produktdata", value: "pim" },
  { title: "Logistikk og frakt", value: "logistikk" },
  { title: "Betaling", value: "betaling" },
  { title: "OMS, lager og EDI", value: "oms" },
  { title: "POS og butikk", value: "pos" },
  { title: "Markedsføring og sporing", value: "markedsforing" },
  { title: "Booking og annet", value: "booking" },
] as const;

/**
 * Integration category — one per group of systems (ERP, OMS, PIM …).
 * Lives under the integrations pillar: slug `integrasjoner/erp`.
 * Lists every integrationPage that references it.
 */
export const integrationCategory = defineType({
  name: "integrationCategory",
  title: "Integration category",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "cluster", title: "Cluster & links" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "key",
      title: "Category key",
      type: "string",
      group: "settings",
      description: "Stable key used for filtering and the hub grid. Same across languages.",
      options: { list: [...INTEGRATION_CATEGORY_KEYS], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL path)",
      type: "slug",
      group: "content",
      description: "Under the pillar, e.g. `integrasjoner/erp` (no) or `integrations/erp` (en).",
      options: { source: "title", maxLength: 120, isUnique: isUniquePerLanguage },
      validation: (r) => r.required().custom(validatePublicSlug),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "settings",
      initialValue: 10,
    }),
    defineField({
      name: "definition",
      title: "Extractable definition (40–60 words)",
      type: "text",
      rows: 3,
      group: "content",
      description: "Opens the page. Answers “what is an X integration” in plain language.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "heroImage",
      title: "Hero / OG image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "faqItems",
      group: "content",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
        defineField({ name: "buttonLabel", title: "Button label", type: "string" }),
        defineField({
          name: "buttonHref",
          title: "Button link (relative path)",
          type: "string",
          validation: (r) => r.custom((v) => (!v || v.startsWith("/") ? true : "Use a relative path starting with /")),
        }),
      ],
    }),
    relatedPagesField({ required: false, group: "cluster" }),
    { ...seoExtendedField, group: "settings" },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "heroImage" },
  },
});
