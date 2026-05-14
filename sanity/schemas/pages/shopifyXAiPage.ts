import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
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

export const shopifyXAiPageHeroSection = defineType({
  name: "shopifyXAiPageHeroSection",
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

export const shopifyXAiPageEnhancingWithAiSection = defineType({
  name: "shopifyXAiPageEnhancingWithAiSection",
  title: "Enhancing with AI",
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
  preview: { prepare: () => ({ title: "Enhancing with AI" }) },
});

export const shopifyXAiPageHowWeLeverageAiSection = defineType({
  name: "shopifyXAiPageHowWeLeverageAiSection",
  title: "How we leverage AI",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "capabilities",
      title: "AI Capabilities",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "bgColor",
              title: "Background Color",
              type: "string",
              description: "e.g., bg-[#03C1CA] or bg-[#1F1D1D]",
            }),
            defineField({
              name: "features",
              title: "Features",
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
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "How we leverage AI" }) },
});

export const shopifyXAiPageAiToolsToolkitSection = defineType({
  name: "shopifyXAiPageAiToolsToolkitSection",
  title: "AI tools toolkit",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "toolCategories",
      title: "Tool Categories",
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
    defineField({ name: "bottomText", title: "Bottom Text", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "AI tools toolkit" }) },
});

export const shopifyXAiPageHowWeApplyAiSection = defineType({
  name: "shopifyXAiPageHowWeApplyAiSection",
  title: "How we apply AI",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "applicationAreas",
      title: "Application Areas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "benefit", title: "Benefit", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "How we apply AI" }) },
});

export const shopifyXAiPageAiEnhancedProcessSection = defineType({
  name: "shopifyXAiPageAiEnhancedProcessSection",
  title: "AI enhanced process",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
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
  ],
  preview: { prepare: () => ({ title: "AI enhanced process" }) },
});

export const shopifyXAiPageFaqSection = defineType({
  name: "shopifyXAiPageFaqSection",
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
  preview: { prepare: () => ({ title: "FAQ" }) },
});

export const shopifyXAiPageCtaSection = defineType({
  name: "shopifyXAiPageCtaSection",
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

export const shopifyXAiPage = defineType({
  name: "shopifyXAiPage",
  title: "Shopify x AI Page",
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
        defineArrayMember({ type: "shopifyXAiPageHeroSection" }),
        defineArrayMember({ type: "shopifyXAiPageEnhancingWithAiSection" }),
        defineArrayMember({ type: "shopifyXAiPageHowWeLeverageAiSection" }),
        defineArrayMember({ type: "shopifyXAiPageAiToolsToolkitSection" }),
        defineArrayMember({ type: "shopifyXAiPageHowWeApplyAiSection" }),
        defineArrayMember({ type: "shopifyXAiPageAiEnhancedProcessSection" }),
        defineArrayMember({ type: "shopifyXAiPageFaqSection" }),
        defineArrayMember({ type: "shopifyXAiPageCtaSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: { select: { title: "pageTitle" } },
});
