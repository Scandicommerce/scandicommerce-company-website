import { defineField, defineType } from "sanity";

const LANGUAGES = [
  { title: "JavaScript", value: "javascript" },
  { title: "TypeScript", value: "typescript" },
  { title: "HTML", value: "html" },
  { title: "CSS", value: "css" },
  { title: "JSON", value: "json" },
  { title: "Bash", value: "bash" },
  { title: "SQL", value: "sql" },
  { title: "Liquid", value: "liquid" },
];

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code Block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: LANGUAGES },
      initialValue: "javascript",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: "language", code: "code" },
    prepare({ language, code }) {
      const firstLine = (code || "").split("\n")[0]?.slice(0, 40) || "";
      return {
        title: language ? `Code (${language})` : "Code",
        subtitle: firstLine ? `${firstLine}…` : "",
      };
    },
  },
});
