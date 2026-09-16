import { defineArrayMember, defineField, defineType } from "sanity";

/** Reusable FAQ list feeding `FAQPage` JSON-LD. Use real search queries as questions (AEO). */
export const faqItems = defineType({
  name: "faqItems",
  title: "FAQ",
  type: "array",
  of: [
    defineArrayMember({
      type: "object",
      name: "faqItem",
      fields: [
        defineField({
          name: "question",
          title: "Question",
          type: "string",
          description: "Question-shaped heading. Use real queries verbatim, e.g. “Hvordan kan jeg bytte nettbutikkplattform?”",
          validation: (r) => r.required().max(160),
        }),
        defineField({
          name: "answer",
          title: "Answer",
          type: "text",
          rows: 4,
          description: "40–90 words, answers the question directly in the first sentence.",
          validation: (r) => r.required().min(40),
        }),
      ],
      preview: {
        select: { title: "question" },
        prepare({ title }) {
          return { title: title || "FAQ item" };
        },
      },
    }),
  ],
});
