import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

// ─── Section: Intro ────────────────────────────────────────────────────────────
export const caseStudyIntroSection = defineType({
  name: "caseStudyIntroSection",
  title: "Intro Section",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Intro Text",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Opening paragraph(s) before the key metrics.",
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      description: "Bullet-point stats shown beneath the intro (e.g. 32% growth in sales).",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "text", title: "Metric Text", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "text" },
            prepare({ title }) { return { title: title || "Metric" }; },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: "Intro Section" }; },
  },
});

// ─── Section: Content Block ────────────────────────────────────────────────────
export const caseStudyContentSection = defineType({
  name: "caseStudyContentSection",
  title: "Content Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "The challenge: Fragmented platforms made for inconsistent experiences"',
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Main content paragraphs.",
    }),
    defineField({
      name: "bullets",
      title: "Bullet Items",
      type: "array",
      description: "Checked bullet list items with bold lead text (like the Solution section).",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "lead", title: "Bold Lead", type: "string", description: "Bold opening phrase" }),
            defineField({ name: "text", title: "Description", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "lead", subtitle: "text" },
            prepare({ title, subtitle }) { return { title: title || "Bullet", subtitle }; },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) { return { title: title || "Content Section" }; },
  },
});

// ─── Section: Testimonial ──────────────────────────────────────────────────────
export const caseStudyTestimonialSection = defineType({
  name: "caseStudyTestimonialSection",
  title: "Testimonial / Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "company",
      title: "Company Name",
      type: "string",
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
    }),
    defineField({
      name: "authorRole",
      title: "Author Role",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "authorRole" },
    prepare({ title, subtitle }) { return { title: title || "Testimonial", subtitle }; },
  },
});

// ─── Section: Stats ────────────────────────────────────────────────────────────
export const caseStudyStatsSection = defineType({
  name: "caseStudyStatsSection",
  title: "Stats Section",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: 'e.g. "With Shopify, [Client] saw results fast."',
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: 'e.g. "32%"', validation: (r) => r.required() }),
            defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "growth in sales"', validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
            prepare({ title, subtitle }) { return { title: title || "—", subtitle }; },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "headline", stats: "stats" },
    prepare({ title, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return { title: title || "Stats Section", subtitle: `${count} stat${count !== 1 ? "s" : ""}` };
    },
  },
});

// ─── Section: Related (CTA + logos) ───────────────────────────────────────────
export const caseStudyRelatedSection = defineType({
  name: "caseStudyRelatedSection",
  title: "Related Brands / CTA",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: 'e.g. "Join the ranks of brands changing health & beauty every day."',
    }),
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Brand Name", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
            prepare({ title, media }) { return { title: title || "Brand", media }; },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) { return { title: title || "Related Brands" }; },
  },
});

// ─── Document: Case Study ──────────────────────────────────────────────────────
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
    { name: "sections", title: "Sections" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,

    // ── Core content ──
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description:
        "URL path after /resources/. E.g. for /en/resources/groupe-marcelle enter: groupe-marcelle.",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
      description: "Short description used in cards and SEO.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "clientLogo",
      title: "Client Logo",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Displayed above the hero title.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
    }),

    // ── Sidebar metadata ──
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      group: "metadata",
      description: 'e.g. "Health & beauty"',
    }),
    defineField({
      name: "partner",
      title: "Partner",
      type: "string",
      group: "metadata",
      description: 'e.g. "Molsoft"',
    }),
    defineField({
      name: "previousPlatform",
      title: "Previous Platform",
      type: "string",
      group: "metadata",
      description: 'e.g. "Adobe Commerce / Magento"',
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "string",
      group: "metadata",
      description: 'e.g. "Shopify Plus"',
    }),

    // ── Sinuous section array ──
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      group: "sections",
      description: "Drag to reorder. Add or remove sections per case study.",
      of: [
        defineArrayMember({ type: "caseStudyIntroSection" }),
        defineArrayMember({ type: "caseStudyContentSection" }),
        defineArrayMember({ type: "caseStudyTestimonialSection" }),
        defineArrayMember({ type: "caseStudyStatsSection" }),
        defineArrayMember({ type: "caseStudyRelatedSection" }),
      ],
    }),

    // ── SEO ──
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "settings",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "partner",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Case Study",
        subtitle: subtitle ? `Partner: ${subtitle}` : "Case Study",
        media,
      };
    },
  },
});
