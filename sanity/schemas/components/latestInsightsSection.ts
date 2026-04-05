import { defineField, defineType } from "sanity";
import { latestInsightsSectionInitialValue } from "@/sanity/lib/landingPageSectionInitialValues";

export const latestInsightsSectionType = defineType({
  name: "latestInsightsSection",
  title: "Latest Insights Section",
  type: "object",
  initialValue: latestInsightsSectionInitialValue,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "maxPosts",
      title: "Number of posts to show",
      type: "number",
      validation: (rule) => rule.min(1).max(6).integer(),
    }),
    defineField({
      name: "filterByTag",
      title: "Filter by tag (optional)",
      type: "string",
      description:
        "Only posts with this tag (exact label for page-builder posts; exact string for classic blog posts). Leave empty for all.",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      description: "Path such as /blogg or full URL. Relative paths get the current locale prefix.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Latest Insights",
        subtitle: "Blog post feed",
      };
    },
  },
});
