import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

const PAGE_TYPES_FOR_NAV = [
  { type: "aboutPage" },
  { type: "contactPage" },
  { type: "workPage" },
  { type: "partnersPage" },
  { type: "blogPage" },
  { type: "allPackagesPage" },
  { type: "packageDetailPage" },
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
  // Template-driven pages the new IA leans on (/integrasjoner/*, /tjenester/*)
  { type: "pillarPage" },
  { type: "integrationPage" },
  { type: "migrationPage" },
  { type: "legalPage" },
];

/** Returns a filter that restricts page references to the same language as the header document. */
function pageReferenceFilter({ document }: { document: Record<string, unknown> }) {
  const lang = (document as { language?: string }).language;
  if (!lang) return {};
  return { filter: "language == $lang", params: { lang } };
}

const linkFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "string",
    description: "Text shown in the menu",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "page",
    title: "Page (recommended)",
    type: "reference",
    to: PAGE_TYPES_FOR_NAV,
    description:
      "Link to a page. The URL will follow this page's slug – when you change the slug in Sanity, the header link updates automatically.",
    options: { filter: pageReferenceFilter },
  }),
  defineField({
    name: "href",
    title: "Custom link",
    type: "string",
    description: "Used when no page is selected, or for external URLs (e.g. https://...)",
  }),
];

/** A link inside a dropdown column: label, destination, optional supporting copy. */
const menuLink = defineArrayMember({
  type: "object",
  name: "menuLink",
  title: "Link",
  fields: [
    ...linkFields,
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Optional one-line explanation shown under the label in the dropdown",
    }),
    defineField({
      name: "indent",
      title: "Nested under the link above",
      type: "boolean",
      description:
        "Indents this link as a child of the entry above it – used for the package tiers under All packages.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", href: "href", description: "description", indent: "indent" },
    prepare({
      title,
      href,
      description,
      indent,
    }: {
      title?: string;
      href?: string;
      description?: string;
      indent?: boolean;
    }) {
      return {
        title: `${indent ? "— " : ""}${title || "Untitled"}`,
        subtitle: description || href || "Page link",
      };
    },
  },
});

/** One column inside a dropdown panel. */
const menuColumn = defineArrayMember({
  type: "object",
  name: "menuColumn",
  title: "Column",
  fields: [
    defineField({
      name: "title",
      title: "Column heading",
      type: "string",
      description: "Small uppercase label above the links. Leave empty for an unheaded column.",
    }),
    defineField({
      name: "items",
      title: "Links",
      type: "array",
      of: [menuLink],
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare({ title, items }: { title?: string; items?: unknown[] }) {
      const count = items?.length ?? 0;
      return {
        title: title || "Untitled column",
        subtitle: `${count} link${count === 1 ? "" : "s"}`,
      };
    },
  },
});

export const headerSettings = defineType({
  name: "headerSettings",
  title: "Header Settings",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
    { name: "legacy", title: "Legacy (unused)" },
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
    // Main menu: any number of top-level items, each a plain link or a dropdown
    defineField({
      name: "menu",
      title: "Main Menu",
      type: "array",
      group: "content",
      description:
        "Top-level menu, left to right. An item with no columns is a plain link; add columns to turn it into a dropdown. Leave the whole array empty to use the built-in menu for this language.",
      of: [
        defineArrayMember({
          type: "object",
          name: "menuItem",
          title: "Menu item",
          fields: [
            ...linkFields,
            defineField({
              name: "columns",
              title: "Dropdown columns",
              type: "array",
              description:
                "Leave empty for a plain link. One or two columns render side by side in the dropdown panel.",
              of: [menuColumn],
            }),
          ],
          preview: {
            select: { title: "label", href: "href", columns: "columns" },
            prepare({
              title,
              href,
              columns,
            }: {
              title?: string;
              href?: string;
              columns?: { items?: unknown[] }[];
            }) {
              if (!columns?.length) {
                return { title: title || "Untitled", subtitle: href || "Page link" };
              }
              const links = columns.reduce((sum, col) => sum + (col.items?.length ?? 0), 0);
              return {
                title: title || "Untitled",
                subtitle: `Dropdown · ${columns.length} column${columns.length === 1 ? "" : "s"} · ${links} link${links === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
    }),
    // CTA Button
    defineField({
      name: "ctaButton",
      title: "CTA Button",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", initialValue: "Book møte" }),
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
          initialValue: "/kontakt",
          description: "Used when no page is selected, or for external URLs.",
        }),
      ],
    }),

    // ----------------------------------------------------------------------
    // Superseded by `menu`. Kept so existing documents keep their content and
    // nothing is silently dropped from the dataset; no longer read by the site.
    // ----------------------------------------------------------------------
    defineField({
      name: "servicesMenu",
      title: "Services Menu (legacy)",
      type: "object",
      group: "legacy",
      readOnly: true,
      description: "Replaced by Main Menu. Shown read-only so the old content is still visible.",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string" }),
        defineField({
          name: "items",
          title: "Menu Items",
          type: "array",
          of: [defineArrayMember({ type: "object", fields: linkFields })],
        }),
      ],
    }),
    defineField({
      name: "shopifyMenu",
      title: "Shopify Menu (legacy)",
      type: "object",
      group: "legacy",
      readOnly: true,
      description: "Replaced by Main Menu. Shown read-only so the old content is still visible.",
      fields: [
        defineField({ name: "label", title: "Menu Label", type: "string" }),
        defineField({
          name: "items",
          title: "Menu Items",
          type: "array",
          of: [defineArrayMember({ type: "object", fields: linkFields })],
        }),
      ],
    }),
    defineField({
      name: "mainNavLinks",
      title: "Main Navigation Links (legacy)",
      type: "array",
      group: "legacy",
      readOnly: true,
      description: "Replaced by Main Menu. Shown read-only so the old content is still visible.",
      of: [defineArrayMember({ type: "object", fields: linkFields })],
    }),
  ],
  preview: {
    select: { title: "settingsTitle", language: "language", menu: "menu" },
    prepare({ title, language, menu }: { title?: string; language?: string; menu?: unknown[] }) {
      const count = menu?.length ?? 0;
      return {
        title: title || "Header Settings",
        subtitle: count
          ? `${language ?? "–"} · ${count} menu item${count === 1 ? "" : "s"}`
          : `${language ?? "–"} · using built-in menu`,
      };
    },
  },
});
