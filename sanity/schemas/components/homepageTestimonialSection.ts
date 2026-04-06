import { defineField, defineType } from "sanity";

export const homepageTestimonialSection = defineType({
  name: "homepageTestimonialSection",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "testimonialRating",
      title: "Star Rating",
      type: "number",
      description: "Number of stars (1-5)",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "testimonialQuote",
      title: "Quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "testimonialAuthorName",
      title: "Author Name",
      type: "string",
    }),
    defineField({
      name: "testimonialAuthorTitle",
      title: "Author Title",
      type: "string",
      description: "e.g., 'E-commerce Director, Nordic Lifestyle AS'",
    }),
    defineField({
      name: "testimonialButtonText",
      title: "Button Text",
      type: "string",
    }),
    defineField({
      name: "testimonialButtonLink",
      title: "Button Link",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Testimonial" }) },
});
