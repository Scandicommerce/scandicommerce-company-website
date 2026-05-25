import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import {
  seoExtendedField,
  legacySeoFieldMinimal,
} from "../_shared/seoFields";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const shopifyTcoCalculatorPageHeroSection = defineType({
  name: "shopifyTcoCalculatorPageHeroSection",
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
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 4 }),
    defineField({
      name: "platforms",
      title: "Platform Buttons",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "List of platform names for selection buttons (e.g., 'Woocommerce', 'Adobe (Magento)')",
    }),
  ],
  preview: {
    select: { t: "heroTitle.text" },
    prepare({ t }: { t?: string }) {
      return { title: t || "Hero" };
    },
  },
});

export const shopifyTcoCalculatorPageCalculatorSection = defineType({
  name: "shopifyTcoCalculatorPageCalculatorSection",
  title: "Calculator / HubSpot Form",
  type: "object",
  fields: [
    defineField({
      name: "formTitle",
      title: "Form Title",
      type: "string",
      description: "e.g. '3-Year ROI Calculator'",
    }),
    defineField({
      name: "hubspotPortalId",
      title: "HubSpot Portal ID",
      type: "string",
      description: "Numeric portal ID from your HubSpot account, e.g. 49119369",
    }),
    defineField({
      name: "hubspotFormId",
      title: "HubSpot Form ID",
      type: "string",
      description: "Form ID from HubSpot embed code, e.g. 10642b03-8cb9-4e6b-8fee-b000f8ccd434",
    }),
  ],
  preview: { prepare: () => ({ title: "Calculator / HubSpot Form" }) },
});

export const shopifyTcoCalculatorPage = defineType({
  name: "shopifyTcoCalculatorPage",
  title: "Shopify TCO Calculator Page",
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
        defineArrayMember({ type: "shopifyTcoCalculatorPageHeroSection" }),
        defineArrayMember({ type: "shopifyTcoCalculatorPageCalculatorSection" }),
      ],
    }),
    seoExtendedField,
    legacySeoFieldMinimal,
  ],
  preview: { select: { title: "pageTitle" } },
});
