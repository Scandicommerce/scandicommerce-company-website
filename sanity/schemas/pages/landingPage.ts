import { defineField, defineType } from "sanity";
import { heroSection } from "../components/heroSection";
import { trustedBySection } from "../components/trustedBySection";
import { painPointsSection } from "../components/painPointsSection";
import { servicesShowcaseSection } from "../components/servicesShowcaseSection";
import { resultsSection } from "../components/resultsSection";
import { processSection } from "../components/processSection";
import { partnersSection } from "../components/partnersSection";
import { ctaSection } from "../components/ctaSection";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
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
    // Section Components
    heroSection,
    trustedBySection,
    painPointsSection,
    servicesShowcaseSection,
    resultsSection,
    processSection,
    partnersSection,
    ctaSection,
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
    },
    prepare({ title, isHomepage }) {
      return {
        title: title || "Untitled Landing Page",
        subtitle: isHomepage ? "🏠 Homepage" : "Landing Page",
      };
    },
  },
});
