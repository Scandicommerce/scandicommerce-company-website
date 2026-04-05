import { defineArrayMember, defineField, defineType } from "sanity";
import { testimonialSectionInitialValue } from "@/sanity/lib/landingPageSectionInitialValues";

export const testimonialSectionType = defineType({
  name: "testimonialSection",
  title: "Testimonial Section",
  type: "object",
  initialValue: testimonialSectionInitialValue,
  fields: [
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              description: "The client testimonial text",
            }),
            defineField({ name: "authorName", title: "Author Name", type: "string" }),
            defineField({ name: "authorRole", title: "Role / Position", type: "string" }),
            defineField({ name: "companyName", title: "Company Name", type: "string" }),
            defineField({
              name: "companyLogo",
              title: "Company Logo",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { author: "authorName", company: "companyName" },
            prepare({ author, company }) {
              return {
                title: author || "Quote",
                subtitle: company || "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
          { title: "Teal", value: "teal" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    }),
  ],
  preview: {
    select: { testimonials: "testimonials" },
    prepare({ testimonials }) {
      const n = Array.isArray(testimonials) ? testimonials.length : 0;
      return {
        title: "Testimonials",
        subtitle: `${n} quote${n === 1 ? "" : "s"}`,
      };
    },
  },
});
