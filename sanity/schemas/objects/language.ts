import { defineField, defineType } from "sanity";
import { languages, defaultLanguage } from "@/sanity/lib/languages";

export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  options: {
    list: languages.map((lang) => ({
      title: lang.title,
      value: lang.id,
    })),
    layout: "radio",
  },
  initialValue: defaultLanguage,
  validation: (rule) => rule.required(),
  group: "settings",
});
