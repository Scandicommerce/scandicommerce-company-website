# Translation and Localization Setup

This document explains how to set up Studio UI localization and AI-powered content translation.

## 1. Studio UI Language (Interface Localization)

To change the Sanity Studio interface language, install and configure locale plugins:

### Installation

```bash
# Install locale plugins for the languages you want to support
npm install @sanity/locale-de-de    # German Studio UI
npm install @sanity/locale-nb-no   # Norwegian Studio UI
npm install @sanity/locale-sv-se    # Swedish Studio UI
npm install @sanity/locale-da-dk    # Danish Studio UI
```

### Configuration

In `sanity.config.ts`, uncomment and add the locale plugin you want:

```typescript
import { deDELocale } from "@sanity/locale-de-de";
// or
import { nbNOLocale } from "@sanity/locale-nb-no";
// or
import { svSELocale } from "@sanity/locale-sv-se";
// or
import { daDKLocale } from "@sanity/locale-da-dk";

export default defineConfig({
  // ...
  plugins: [
    // ... other plugins
    deDELocale(), // This changes the Studio UI to German
  ],
});
```

**Note:** This only changes the Studio interface language, not your content.

## 2. AI-Powered Content Translation

To enable AI-powered translation of your content using Sanity AI Assist:

### Installation

```bash
npm install @sanity/assist
```

### Configuration

In `sanity.config.ts`, the AI Assist plugin is configured with both document-level and field-level translation:

```typescript
import { assist } from "@sanity/assist";
import { getLanguagesForAIAssist } from "@/sanity/lib/languages";
import { TRANSLATABLE_SCHEMA_TYPES } from "@/sanity/lib/languages";

assist({
  translate: {
    // Document-level: "Translate document" creates a new document in another language
    document: {
      languageField: "language",
      documentTypes: [...TRANSLATABLE_SCHEMA_TYPES],
    },
    // Field-level: translate individual fields when editing
    field: {
      documentTypes: [...TRANSLATABLE_SCHEMA_TYPES],
      languages: getLanguagesForAIAssist(),
    },
  },
});
```

### Using AI Translation in Studio

Once configured, you can:

1. **Translate an entire document (recommended for new language versions):**
   - Open a document (e.g. a page in English) in Sanity Studio
   - Open the AI Assist panel (or use the document actions menu)
   - Use **"Translate document"** and choose the target language (e.g. Norwegian, German)
   - AI Assist will create a new document with the same structure and all string/Portable Text fields translated. Set the new document’s `language` field to the target language and link it via Document Internationalization if you use that plugin.

2. **Translate fields directly in Studio:**
   - Open any document in Sanity Studio
   - Click on a text field
   - Use the AI Assist "Translate" action to translate the field content
   - Select source and target languages from the dropdown

3. **Translate entire documents programmatically:**

```typescript
import { client } from "@/sanity/lib/client";

// Translate a document from English to German
await client.agent.action.translate({
  schemaId: "landingPage",
  documentId: "<your-document-id>",
  targetDocument: { operation: "create" },
  languageFieldPath: "language", // The field path where language is stored
  fromLanguage: { id: "en-US", title: "English" },
  toLanguage: { id: "de-DE", title: "German" },
});
```

### Language Mapping

The `getLanguagesForAIAssist()` function maps your language codes to proper locale formats:
- `en` → `en-US`
- `no` → `nb-NO` (Norwegian Bokmål)
- `sv` → `sv-SE` (Swedish)
- `da` → `da-DK` (Danish)
- `de` → `de-DE` (German)

## 3. Dynamic Language Loading (Advanced)

You can also load languages dynamically from your Sanity dataset:

```typescript
assist({
  translate: {
    field: {
      languages: async (client) => {
        return client.fetch(`*[_type == "language"]{ id, title }`);
      },
    },
  },
});
```

This requires creating a `language` document type in your schema.

## Summary

- **Studio UI Language**: Use `@sanity/locale-*` packages to change the Studio interface
- **Content Translation**: Use `@sanity/assist` with translation configuration to translate content
- **Language Field**: Your documents already have a `language` field that can be used with `languageFieldPath` in translation actions

## Next Steps

1. Install the locale plugin(s) for Studio UI languages you want
2. Install `@sanity/assist` for AI translation
3. Uncomment the relevant plugin configurations in `sanity.config.ts`
4. Start using AI translation in Studio or programmatically
