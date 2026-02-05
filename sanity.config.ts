import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { assist } from "@sanity/assist";
import { schemaTypes } from "@/sanity/schemas";
import { deskStructure } from "@/sanity/lib/deskStructure";
import {
  supportedLanguages,
  TRANSLATABLE_SCHEMA_TYPES,
  getLanguagesForAIAssist,
} from "@/sanity/lib/languages";
// Studio UI Locale - Uncomment to change Studio interface language
// import { deDELocale } from "@sanity/locale-de-de";
// import { nbNOLocale } from "@sanity/locale-nb-no";
// import { svSELocale } from "@sanity/locale-sv-se";
// import { daDKLocale } from "@sanity/locale-da-dk";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "scandicommerce",
  title: "ScandiCommerce CMS",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: [...TRANSLATABLE_SCHEMA_TYPES],
    }),
    assist({
      translate: {
        // Document-level: "Translate document" creates a new document in another language
        document: {
          languageField: "language",
          documentTypes: [...TRANSLATABLE_SCHEMA_TYPES],
        },
        // Field-level: translate individual fields (e.g. when editing)
        field: {
          documentTypes: [...TRANSLATABLE_SCHEMA_TYPES],
          languages: getLanguagesForAIAssist(),
        },
      },
    }),
    // Studio UI Locale - Uncomment to change Studio interface language
    // deDELocale(), // German Studio UI
    // nbNOLocale(), // Norwegian Studio UI
    // svSELocale(), // Swedish Studio UI
    // daDKLocale(), // Danish Studio UI
  ],

  schema: {
    types: schemaTypes,
  },
});
