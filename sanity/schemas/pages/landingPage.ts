import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";
import { isUniquePerLanguage } from "@/sanity/lib/slugUtils";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
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
      name: "isHomepage",
      title: "Is Homepage",
      type: "boolean",
      description: "Set this as the main homepage",
      initialValue: false,
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description: "Drag to reorder. Add or remove sections per page.",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "trustedBySection" }),
        defineArrayMember({ type: "painPointsSection" }),
        defineArrayMember({ type: "servicesShowcaseSection" }),
        defineArrayMember({ type: "resultsSection" }),
        defineArrayMember({ type: "homepageTestimonialSection" }),
        defineArrayMember({ type: "processSection" }),
        defineArrayMember({ type: "partnersSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "technicalDepthSection" }),
      ],
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
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
