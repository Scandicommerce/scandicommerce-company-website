# Language Versioning in Sanity

This project now supports multi-language content management through Sanity CMS.

## Supported Languages

The following languages are configured:
- **English (en)** - Default language
- **Norwegian (no)** - Norsk
- **Swedish (sv)** - Svenska
- **Danish (da)** - Dansk
- **German (de)** - Deutsch

You can modify the supported languages in `sanity/lib/languages.ts`.

## How It Works

### 1. Language Field

All document types now include a `language` field that:
- Is required for all documents
- Defaults to "en" (English)
- Is grouped under "Settings" in the document editor
- Appears in document previews

### 2. Using Queries

All queries now support language filtering. When fetching content, you need to pass the `language` parameter:

```typescript
import { client } from "@/sanity/lib/client";
import { landingPageQuery } from "@/sanity/lib/queries";
import { getQueryParams } from "@/sanity/lib/queryHelpers";

// Fetch a landing page in English
const page = await client.fetch(
  landingPageQuery,
  getQueryParams({ slug: "home" }, "en")
);

// Fetch a landing page in Norwegian
const pageNo = await client.fetch(
  landingPageQuery,
  getQueryParams({ slug: "home" }, "no")
);

// Fetch a landing page in German
const pageDe = await client.fetch(
  landingPageQuery,
  getQueryParams({ slug: "home" }, "de")
);
```

### 3. Query Behavior

Queries will:
- Return documents matching the specified language
- Also return documents without a language set (for backward compatibility with existing content)
- Use the pattern: `(language == $language || !defined(language))`

### 4. Creating Language Versions

To create a language version of a page:

1. Open the existing page in Sanity Studio
2. Click "Duplicate" to create a copy
3. Change the `language` field to the target language
4. Update all content fields with translated content
5. Save the document

### 5. Language Filter Plugin (Optional)

To enable the language filter plugin in Sanity Studio:

1. Install the package:
   ```bash
   npm install @sanity/language-filter
   ```

2. Uncomment the plugin configuration in `sanity.config.ts`:
   ```typescript
   import { languageFilter } from "@sanity/language-filter";
   
   plugins: [
     // ... other plugins
     languageFilter({
       supportedLanguages: languages,
       defaultLanguages: [languages.find((lang) => lang.isDefault)?.id || "en"],
     }),
   ],
   ```

This plugin adds a "Filter Languages" button in the Studio that allows you to show/hide language-specific fields.

### 6. Studio UI Localization & AI Translation

For Studio UI localization and AI-powered content translation, see:
- **[TRANSLATION_SETUP.md](./TRANSLATION_SETUP.md)** - Complete guide for:
  - Changing Studio interface language (using locale plugins)
  - Setting up AI-powered content translation
  - Programmatic translation using Sanity AI Assist

## Best Practices

1. **Always set the language field** when creating new documents
2. **Use consistent slugs** across language versions (e.g., "home" for all languages)
3. **Keep language versions in sync** - when updating one language, consider updating others
4. **Use the default language** (English) as your fallback

## Query Examples

### Fetch homepage by language
```typescript
const homepage = await client.fetch(
  homepageQuery,
  getQueryParams({}, "en") // or "no", "sv", "da", "de"
);
```

### Fetch all landing pages for a language
```typescript
const pages = await client.fetch(
  allLandingPagesQuery,
  getQueryParams({}, "no")
);
```

### Fetch page by slug and language
```typescript
const page = await client.fetch(
  landingPageQuery,
  getQueryParams({ slug: "about-us" }, "sv")
);
```

## Migration Notes

- Existing documents without a language field will still be returned by queries (for backward compatibility)
- New documents should always have a language field set
- Consider migrating existing content to set the language field to "en" (or your default language)
