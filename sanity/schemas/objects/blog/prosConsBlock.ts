import { defineField, defineType, defineArrayMember } from "sanity";

export const prosConsBlock = defineType({
  name: "prosConsBlock",
  title: "Pros & Cons",
  type: "object",
  fields: [
    defineField({
      name: "consTitle",
      title: "Cons / Avoid Title",
      type: "string",
      initialValue: "What to avoid",
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "prosTitle",
      title: "Pros / Do Title",
      type: "string",
      initialValue: "What to do",
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { cons: "cons", pros: "pros" },
    prepare({ cons, pros }) {
      const c = Array.isArray(cons) ? cons.length : 0;
      const p = Array.isArray(pros) ? pros.length : 0;
      return {
        title: "Pros & Cons",
        subtitle: `${p} pros, ${c} cons`,
      };
    },
  },
});
