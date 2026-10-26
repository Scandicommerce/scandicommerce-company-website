import { defineArrayMember, defineField, defineType } from "sanity";

/** Numbered process steps, or (numbered off) a grid of cards. Used in template sections. */
export const stepsBlock = defineType({
  name: "stepsBlock",
  title: "Steps / cards",
  type: "object",
  fields: [
    defineField({
      name: "numbered",
      title: "Numbered steps",
      type: "boolean",
      description: "On: a numbered process. Off: a grid of cards.",
      initialValue: true,
    }),
    defineField({
      name: "steps",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "meta", title: "Meta (optional)", type: "string", description: "Short label, e.g. '2 virkedager'." }),
          ],
          preview: { select: { title: "title", subtitle: "meta" } },
        }),
      ],
      validation: (r) => r.min(2).max(8),
    }),
  ],
  preview: {
    select: { steps: "steps", numbered: "numbered" },
    prepare({ steps, numbered }) {
      const n = Array.isArray(steps) ? steps.length : 0;
      return { title: numbered === false ? "Cards" : "Steps", subtitle: `${n} item${n === 1 ? "" : "s"}` };
    },
  },
});

/** A built-in animation (Remotion), localised automatically to the page language. */
export const animationBlock = defineType({
  name: "animationBlock",
  title: "Animation",
  type: "object",
  fields: [
    defineField({
      name: "animation",
      title: "Animation",
      type: "string",
      options: { list: [{ title: "How a UCP purchase works", value: "ucp-flow" }], layout: "radio" },
      initialValue: "ucp-flow",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: { select: { title: "animation", subtitle: "caption" }, prepare: ({ title, subtitle }) => ({ title: `Animation: ${title}`, subtitle }) },
});
