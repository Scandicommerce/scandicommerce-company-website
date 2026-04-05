import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";
import { LandingPageSectionsInput } from "@/sanity/components/LandingPageSectionsInput";
import { defaultLandingPageSectionsForNewDocument } from "@/sanity/lib/landingPageSectionInitialValues";

/** Same copy as Page Content until you unset legacy fields (migration script or API). */
const legacyMigrateHint =
  "Mirror of the old fixed-order fields. Prefer Page Content for editing; when Page Content is empty, it auto-fills from these. After migration, these keys can be removed.";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "legacy", title: "Legacy layout" },
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
      name: "isHomepage",
      title: "Is Homepage",
      type: "boolean",
      description: "Set this as the main homepage",
      initialValue: false,
    }),
    defineField({
      name: "sections",
      title: "Page Content",
      type: "array",
      group: "content",
      initialValue: defaultLandingPageSectionsForNewDocument,
      description:
        "New pages start with placeholder blocks you can edit and reorder. Existing pages: if empty, content is copied from Legacy layout when you open the document (or use ⋯ → Fill Page Content from legacy fields). Add “Technical depth” from the + menu — it also opens with sample cards.",
      components: {
        input: LandingPageSectionsInput,
      },
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "trustedBySection" }),
        defineArrayMember({ type: "painPointsSection" }),
        defineArrayMember({ type: "servicesShowcaseSection" }),
        defineArrayMember({ type: "resultsSection" }),
        defineArrayMember({ type: "processSection" }),
        defineArrayMember({ type: "partnersSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "technicalDepthSection" }),
        defineArrayMember({ type: "testimonialSection" }),
        defineArrayMember({ type: "latestInsightsSection" }),
      ],
    }),
    // Same data as before page builder; visible under Legacy layout for reference.
    defineField({
      name: "hero",
      title: "Hero",
      type: "heroSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "trustedBy",
      title: "Trusted By",
      type: "trustedBySection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "painPoints",
      title: "Pain Points",
      type: "painPointsSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "servicesShowcase",
      title: "Services Showcase",
      type: "servicesShowcaseSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "resultsSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "process",
      title: "Process",
      type: "processSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "partnersSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "ctaSection",
      group: "legacy",
      deprecated: { reason: legacyMigrateHint },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "settings",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
      isHomepage: "isHomepage",
      language: "language",
    },
    prepare({ title, isHomepage, language }) {
      return {
        title: title || "Untitled Landing Page",
        subtitle: `${isHomepage ? "🏠 Homepage" : "Landing Page"} • ${language || "en"}`,
      };
    },
  },
});
