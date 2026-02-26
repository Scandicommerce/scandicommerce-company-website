import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

const PAGE_TYPES_FOR_NAV = [
  { type: "aboutPage" },
  { type: "contactPage" },
  { type: "workPage" },
  { type: "partnersPage" },
  { type: "blogPage" },
  { type: "allPackagesPage" },
  { type: "migratePage" },
  { type: "shopifyPosPage" },
  { type: "shopifyPosInfoPage" },
  { type: "shopifyXAiPage" },
  { type: "shopifyXPimPage" },
  { type: "whyShopifyPage" },
  { type: "shopifyPlatformPage" },
  { type: "vippsHurtigkassePage" },
  { type: "shopifyTcoCalculatorPage" },
  { type: "shopifyDevelopmentPage" },
  { type: "merchPage" },
];

/** Returns a filter that restricts page references to the same language as the header document. */
function pageReferenceFilter({ document }: { document: Record<string, unknown> }) {
  const lang = (document as { language?: string }).language;
  if (!lang) return {};
  return { filter: "language == $lang", params: { lang } };
}

const navItemFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "string",
    description: "Text shown in the menu",
  }),
  defineField({
    name: "page",
    title: "Page (recommended)",
    type: "reference",
    to: PAGE_TYPES_FOR_NAV,
    description: "Link to a page. The URL will follow this page's slug – when you change the slug in Sanity, the header link updates automatically.",
    options: { filter: pageReferenceFilter },
  }),
  defineField({
    name: "href",
    title: "Custom link",
    type: "string",
    description: "Used when no page is selected, or for external URLs (e.g. https://...)",
  }),
];

const navItemPreview = {
  select: { title: "label", href: "href" },
  prepare({ title, href }: { title?: string; href?: string }) {
    return { title: title || "Untitled", subtitle: href || "Page link" };
  },
};

export const headerSettings = defineType({
  name: "headerSettings",
  title: "Header Settings",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "settingsTitle",
      title: "Settings Title",
      type: "string",
      description: "Internal name for these settings",
      initialValue: "Header Settings",
      validation: (rule) => rule.required(),
    }),
    // Services Menu
    defineField({
      name: "servicesMenu",
      title: "Services Menu",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string", initialValue: "Services" }),
        defineField({
          name: "items",
          title: "Menu Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: navItemFields,
              preview: navItemPreview,
            }),
          ],
        }),
      ],
    }),
    // Shopify Menu
    defineField({
      name: "shopifyMenu",
      title: "Shopify Menu",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string", initialValue: "Shopify" }),
        defineField({
          name: "items",
          title: "Menu Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: navItemFields,
              preview: navItemPreview,
            }),
          ],
        }),
      ],
    }),
    // Main Navigation Links
    defineField({
      name: "mainNavLinks",
      title: "Main Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: navItemFields,
          preview: navItemPreview,
        }),
      ],
    }),
    // CTA Button
    defineField({
      name: "ctaButton",
      title: "CTA Button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", initialValue: "GET STARTED" }),
        defineField({
          name: "page",
          title: "Page (recommended)",
          type: "reference",
          to: PAGE_TYPES_FOR_NAV,
          description: "Link to a page. The URL will follow this page's slug.",
          options: { filter: pageReferenceFilter },
        }),
        defineField({
          name: "href",
          title: "Custom link",
          type: "string",
          initialValue: "/get-started",
          description: "Used when no page is selected, or for external URLs.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "settingsTitle" },
  },
});
