import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../objects/language";
import { seoExtendedField } from "../_shared/seoFields";
import { relatedPagesField } from "../_shared/relatedPagesField";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";
import { validatePublicSlug } from "@/sanity/lib/slugValidation";

const CONTENT_GROUPS = [
  { name: "content", title: "Content", default: true },
  { name: "cluster", title: "Cluster & links" },
  { name: "proof", title: "Proof" },
  { name: "settings", title: "Settings" },
];

/** Shared fields for the three SEO templates (SITE-SEO-ARCHITECTURE §7). */
function templateCoreFields(kind: "pillar" | "integration" | "migration") {
  return [
    languageField,
    defineField({
      name: "pageTitle",
      title: "H1",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL path)",
      type: "slug",
      group: "content",
      description:
        kind === "pillar"
          ? "Pillar at the root, e.g. `integrasjoner`, `agentisk-handel`, `headless-commerce`."
          : kind === "integration"
            ? "Cluster page under its pillar, e.g. `integrasjoner/vipps-hurtigkasse`."
            : "Cluster page under the migration pillar, e.g. `tjenester/shopify-migrering/woocommerce-til-shopify`.",
      options: { source: "pageTitle", maxLength: 120, isUnique: isUniquePerLanguage },
      validation: (r) => r.required().custom(validatePublicSlug),
    }),
    defineField({
      name: "definition",
      title: "Extractable definition (40–60 words)",
      type: "text",
      rows: 3,
      group: "content",
      description: "Opens the page. Answers the target query directly in plain language (AEO layer, §11).",
      validation: (r) =>
        r
          .required()
          .custom((value) => {
            const words = (value ?? "").trim().split(/\s+/).filter(Boolean).length;
            if (words < 35) return `Too short (${words} words) – aim for 40–60 words.`;
            if (words > 70) return `Too long (${words} words) – aim for 40–60 words.`;
            return true;
          }),
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
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
    }),
    defineField({
      name: "author",
      title: "Author (named person)",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
      validation: (r) => r.required().error("Every template page needs a named author (§7)."),
    }),
  ];
}

const sectionMember = defineArrayMember({
  type: "object",
  name: "templateSection",
  title: "Section",
  fields: [
    defineField({ name: "heading", title: "H2", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "anchor",
      title: "Anchor id",
      type: "string",
      description: "Optional. Lowercase, hyphens. Used for the table of contents.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", title: "Alt" })] }),
        defineArrayMember({ type: "tableBlock" }),
        defineArrayMember({ type: "statsRowBlock" }),
        defineArrayMember({ type: "calloutBlock" }),
        defineArrayMember({ type: "comparisonCardsBlock" }),
        defineArrayMember({ type: "codeBlock" }),
      ],
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "heading" } },
});

function templateBodyFields(opts: { minSections: number; maxSections?: number }) {
  return [
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: [sectionMember],
      validation: (r) =>
        opts.maxSections
          ? r.min(opts.minSections).max(opts.maxSections).error(`${opts.minSections}–${opts.maxSections} sections`)
          : r.min(opts.minSections).error(`At least ${opts.minSections} sections`),
    }),
    defineField({
      name: "faq",
      title: "FAQ (≥4, question-shaped headings from real queries)",
      type: "faqItems",
      group: "content",
      validation: (r) => r.min(4).error("At least four FAQ items – they feed FAQPage schema and AI answers."),
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
        defineField({ name: "buttonLabel", title: "Button label", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "buttonHref",
          title: "Button link (relative path)",
          type: "string",
          description: "Relative path within this domain, e.g. /kontakt.",
          validation: (r) =>
            r.required().custom((v) => (!v || v.startsWith("/") ? true : "Use a relative path starting with /")),
        }),
      ],
      validation: (r) => r.required(),
    }),
  ];
}

function templateLinkFields() {
  return [
    defineField({
      name: "pillar",
      title: "Parent pillar",
      type: "reference",
      to: [{ type: "pillarPage" }],
      group: "cluster",
      description: "Cluster pages link up to their pillar (§8).",
    }),
    defineField({
      name: "clusterLinks",
      title: "Cluster link block",
      type: "array",
      group: "cluster",
      description: "Pillar: every cluster page. Cluster page: 2–4 siblings.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "pillarPage" }, { type: "integrationPage" }, { type: "migrationPage" }, { type: "post" }],
        }),
      ],
    }),
    relatedPagesField({ required: true, group: "cluster" }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related case studies (named client proof)",
      type: "array",
      group: "proof",
      of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })],
    }),
    { ...seoExtendedField, group: "settings" },
  ];
}

/** Pillar page — one per topical cluster (P1–P5, G1–G4). */
export const pillarPage = defineType({
  name: "pillarPage",
  title: "Pillar page",
  type: "document",
  groups: CONTENT_GROUPS,
  fields: [
    ...templateCoreFields("pillar"),
    defineField({
      name: "schemaType",
      title: "Primary schema.org type",
      type: "string",
      group: "settings",
      options: { list: [{ title: "Article", value: "Article" }, { title: "Service", value: "Service" }], layout: "radio" },
      initialValue: "Article",
    }),
    ...templateBodyFields({ minSections: 4, maxSections: 8 }),
    ...templateLinkFields(),
  ],
  preview: {
    select: { title: "pageTitle", subtitle: "slug.current", media: "heroImage" },
  },
});

/** Integration page — one per integration (Vipps, 24SevenOffice, Tripletex …). */
export const integrationPage = defineType({
  name: "integrationPage",
  title: "Integration page",
  type: "document",
  groups: CONTENT_GROUPS,
  fields: [
    ...templateCoreFields("integration"),
    defineField({
      name: "integrationName",
      title: "Integration / vendor name",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "vendorUrl",
      title: "Vendor URL (e.g. login page for navigational queries)",
      type: "url",
      group: "content",
      description: "Rendered above the fold so navigational intent (e.g. “24sevenoffice login”) resolves instantly.",
    }),
    defineField({ name: "whatItIs", title: "What it is", type: "array", group: "content", of: [defineArrayMember({ type: "block" })], validation: (r) => r.required() }),
    defineField({ name: "whyItMatters", title: "Why it matters", type: "array", group: "content", of: [defineArrayMember({ type: "block" })], validation: (r) => r.required() }),
    defineField({
      name: "implementationSteps",
      title: "How we implement (steps – feeds HowTo schema)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Step", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Detail", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (r) => r.min(3),
    }),
    defineField({
      name: "dataFlow",
      title: "Data flow diagram",
      type: "image",
      group: "content",
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
    }),
    defineField({ name: "prerequisites", title: "Prerequisites", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(1) }),
    // --- Integrations pillar (hackathon 2026-10): card, badges and data flow ---
    defineField({
      name: "logo",
      title: "Vendor logo (SVG or PNG)",
      type: "image",
      group: "content",
      description: "Shown on cards and in the hero. Use the vendor's own asset, see public/images/integrations/logos/README.md.",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "integrationCategory" }],
      group: "content",
      validation: (r) => r.required(),
      options: {
        filter: ({ document }) =>
          (document as { language?: string })?.language
            ? { filter: "language == $language", params: { language: (document as { language?: string }).language } }
            : {},
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short description (card teaser)",
      type: "string",
      group: "content",
      description: "One sentence, max 140 characters, no exclamation marks.",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "integrationMethod",
      title: "Integration method",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Make.com", value: "make" },
          { title: "Egen kode", value: "code" },
          { title: "App (offisiell Shopify-app)", value: "app" },
          { title: "Connector (leverandørens kobling)", value: "connector" },
        ],
        layout: "radio",
      },
      initialValue: "make",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      options: { list: [{ title: "Live", value: "live" }, { title: "Pilot", value: "pilot" }], layout: "radio" },
      initialValue: "live",
    }),
    defineField({
      name: "syncDirection",
      title: "Sync direction",
      type: "string",
      group: "content",
      options: { list: [{ title: "Énveis", value: "one-way" }, { title: "Toveis", value: "two-way" }], layout: "radio" },
      initialValue: "one-way",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities (what flows)",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Ordre", value: "ordre" },
          { title: "Kunder", value: "kunder" },
          { title: "Faktura", value: "faktura" },
          { title: "Kreditnota", value: "kreditnota" },
          { title: "Bilagsjournal", value: "bilagsjournal" },
          { title: "Lager", value: "lager" },
          { title: "Produkter", value: "produkter" },
          { title: "Forsendelser", value: "forsendelser" },
          { title: "Betaling", value: "betaling" },
          { title: "EDI", value: "edi" },
          { title: "Sporing", value: "sporing" },
          { title: "Booking", value: "booking" },
        ],
      },
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "notIncluded",
      title: "Not included (say it plainly)",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      description: "e.g. “Lager. Shopify er fasit.” Rendered as greyed rows in the capability matrix.",
    }),
    defineField({
      name: "systems",
      title: "Systems in the data flow (animation nodes)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              options: { list: [{ title: "Source", value: "source" }, { title: "Middleware", value: "middleware" }, { title: "Target", value: "target" }], layout: "radio" },
              validation: (r) => r.required(),
            }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        }),
      ],
    }),
    defineField({
      name: "dataFlowSteps",
      title: "Data flow steps (animation edges and legend)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "from", title: "From", type: "string", validation: (r) => r.required() }),
            defineField({ name: "to", title: "To", type: "string", validation: (r) => r.required() }),
            defineField({ name: "payload", title: "Payload", type: "string", description: "e.g. “ordre + kunde”", validation: (r) => r.required() }),
            defineField({
              name: "trigger",
              title: "Trigger",
              type: "string",
              options: { list: [{ title: "Webhook (sanntid)", value: "webhook" }, { title: "Planlagt", value: "schedule" }, { title: "Manuell", value: "manual" }], layout: "radio" },
              initialValue: "webhook",
            }),
            defineField({ name: "frequency", title: "Frequency", type: "string", description: "e.g. “sanntid”, “hvert 15. min”, “månedlig”" }),
          ],
          preview: { select: { title: "payload", subtitle: "from" } },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured on hub",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    ...templateBodyFields({ minSections: 0 }),
    defineField({
      name: "namedClients",
      title: "Named clients using this integration",
      type: "array",
      group: "proof",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.min(1).error("Name at least one client – it is what makes the page rank (§9)."),
    }),
    ...templateLinkFields(),
  ],
  preview: { select: { title: "pageTitle", subtitle: "slug.current", media: "heroImage" } },
});

/** Migration page — one per source platform (WooCommerce, PrestaShop, 24Nettbutikk …). */
export const migrationPage = defineType({
  name: "migrationPage",
  title: "Migration page",
  type: "document",
  groups: CONTENT_GROUPS,
  fields: [
    ...templateCoreFields("migration"),
    defineField({ name: "sourcePlatform", title: "Source platform", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "whatTransfers", title: "What transfers", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(3) }),
    defineField({ name: "whatDoesNot", title: "What does not transfer", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(1) }),
    defineField({ name: "timeline", title: "Typical timeline", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "risks", title: "Risks and how we handle them", type: "array", group: "content", of: [defineArrayMember({ type: "block" })], validation: (r) => r.required() }),
    defineField({ name: "costBand", title: "Cost band", type: "string", group: "content", description: "e.g. “45 000–120 000 kr avhengig av SKU-antall”.", validation: (r) => r.required() }),
    ...templateBodyFields({ minSections: 0 }),
    defineField({
      name: "namedCase",
      title: "Named case (client + SKU count)",
      type: "reference",
      to: [{ type: "caseStudy" }, { type: "post" }],
      group: "proof",
      validation: (r) => r.required().error("Reference the real migration this page is built on (§7)."),
    }),
    ...templateLinkFields(),
  ],
  preview: { select: { title: "pageTitle", subtitle: "sourcePlatform", media: "heroImage" } },
});
