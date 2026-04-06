import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

function pageFilter({ document }: { document: Record<string, unknown> }) {
  const lang = (document as { language?: string }).language;
  if (!lang) return {};
  return { filter: "language == $lang", params: { lang } };
}

const pageReferenceTypes = [
  { type: "contactPage" },
  { type: "landingPage" },
  { type: "servicesPage" },
  { type: "aboutPage" },
  { type: "workPage" },
  { type: "blogPage" },
  { type: "allPackagesPage" },
  { type: "packageDetailPage" },
];

export const shopifyXPimPageHeroSection = defineType({
  name: "shopifyXPimPageHeroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Main Text", type: "string" }),
        defineField({ name: "highlight", title: "Highlighted Text", type: "string" }),
      ],
    }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const shopifyXPimPageWhatIsPimSection = defineType({
  name: "shopifyXPimPageWhatIsPimSection",
  title: "What is PIM",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
    defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
    defineField({
      name: "quote",
      title: "Quote Block",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Quote Text", type: "text", rows: 3 }),
        defineField({ name: "author", title: "Author", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "What is PIM" }) },
});

export const shopifyXPimPageIntegratingPimSection = defineType({
  name: "shopifyXPimPageIntegratingPimSection",
  title: "Integrating PIM",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
    defineField({ name: "leftColumnTitle", title: "Left Column Title", type: "string" }),
    defineField({ name: "leftColumnDescription", title: "Left Column Description", type: "text", rows: 2 }),
    defineField({
      name: "integrationPoints",
      title: "Integration Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "impactTitle", title: "Impact Title", type: "string" }),
    defineField({ name: "impactParagraph1", title: "Impact Paragraph 1", type: "text", rows: 3 }),
    defineField({ name: "impactParagraph2", title: "Impact Paragraph 2", type: "text", rows: 3 }),
    defineField({ name: "linkText", title: "Link Text", type: "string" }),
    defineField({
      name: "linkPage",
      title: "Link – Page (recommended)",
      type: "reference",
      to: pageReferenceTypes,
      description: "Select a page for the link. Used when link text is set.",
      options: { filter: pageFilter },
    }),
    defineField({
      name: "linkHref",
      title: "Link – Custom URL (fallback)",
      type: "string",
      description: "Used only when no page is selected. e.g. /contact or full URL.",
    }),
  ],
  preview: { prepare: () => ({ title: "Integrating PIM" }) },
});

export const shopifyXPimPageWhichBusinessesSection = defineType({
  name: "shopifyXPimPageWhichBusinessesSection",
  title: "Which businesses",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
    defineField({
      name: "businessCards",
      title: "Business Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Which businesses" }) },
});

export const shopifyXPimPageTimeSavingsSection = defineType({
  name: "shopifyXPimPageTimeSavingsSection",
  title: "Time savings",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
    defineField({
      name: "savingsCards",
      title: "Savings Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "hours", title: "Hours Saved", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "summaryTitle", title: "Summary Title", type: "string" }),
    defineField({ name: "summaryDescription", title: "Summary Description", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Time savings" }) },
});

export const shopifyXPimPageWhyGoodInvestmentSection = defineType({
  name: "shopifyXPimPageWhyGoodInvestmentSection",
  title: "Why good investment",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Why good investment" }) },
});

export const shopifyXPimCombinedSection = defineType({
  name: "shopifyXPimCombinedSection",
  title: "Combined (Choosing PIM, Getting started, FAQ, Transform)",
  type: "object",
  fields: [
    defineField({
      name: "choosingPim",
      title: "Choosing Right PIM",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
        defineField({ name: "leftColumnTitle", title: "Left Column Title", type: "string" }),
        defineField({ name: "leftColumnDescription", title: "Left Column Description", type: "text", rows: 2 }),
        defineField({
          name: "selectionCriteria",
          title: "Selection Criteria",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "impactParagraph1", title: "Impact Paragraph 1", type: "text", rows: 3 }),
        defineField({ name: "impactParagraph2", title: "Impact Paragraph 2", type: "text", rows: 3 }),
        defineField({ name: "linkText", title: "Link Text", type: "string" }),
        defineField({
          name: "linkPage",
          title: "Link – Page (recommended)",
          type: "reference",
          to: pageReferenceTypes,
          description: "Select a page for the link.",
          options: { filter: pageFilter },
        }),
        defineField({
          name: "linkHref",
          title: "Link – Custom URL (fallback)",
          type: "string",
          description: "Used only when no page is selected.",
        }),
      ],
    }),
    defineField({
      name: "gettingStarted",
      title: "Getting Started",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 2 }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
            }),
          ],
        }),
        defineField({ name: "bottomNote", title: "Bottom Note", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "items",
          title: "FAQ Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "question", title: "Question", type: "string" }),
                defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "transformExperience",
      title: "Transform Experience",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
        defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
        defineField({ name: "quoteText", title: "Quote Text", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Combined section" }) },
});

export const shopifyXPimPageCtaSection = defineType({
  name: "shopifyXPimPageCtaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "buttonText", title: "Button Text", type: "string" }),
    defineField({
      name: "buttonPage",
      title: "Button – Page (recommended)",
      type: "reference",
      to: pageReferenceTypes,
      description: "Select a page for the button.",
      options: { filter: pageFilter },
    }),
    defineField({
      name: "buttonLink",
      title: "Button – Custom URL (fallback)",
      type: "string",
      description: "Used only when no page is selected. Defaults to /contact.",
    }),
  ],
  preview: { prepare: () => ({ title: "CTA" }) },
});

export const shopifyXPimPage = defineType({
  name: "shopifyXPimPage",
  title: "Shopify x PIM Page",
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
      options: { source: "pageTitle", maxLength: 96, isUnique: isUniquePerLanguage },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder sections.",
      of: [
        defineArrayMember({ type: "shopifyXPimPageHeroSection" }),
        defineArrayMember({ type: "shopifyXPimPageWhatIsPimSection" }),
        defineArrayMember({ type: "shopifyXPimPageIntegratingPimSection" }),
        defineArrayMember({ type: "shopifyXPimPageWhichBusinessesSection" }),
        defineArrayMember({ type: "shopifyXPimPageTimeSavingsSection" }),
        defineArrayMember({ type: "shopifyXPimPageWhyGoodInvestmentSection" }),
        defineArrayMember({ type: "shopifyXPimCombinedSection" }),
        defineArrayMember({ type: "shopifyXPimPageCtaSection" }),
      ],
    }),
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
  preview: { select: { title: "pageTitle" } },
});
