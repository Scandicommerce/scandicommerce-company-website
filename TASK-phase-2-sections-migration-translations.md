# Scandicommerce — Phase 2: New Sections, Migration, Translations & Blog Workflow

## Context
Phase 1 (page builder conversion) is complete. The homepage now uses a `sections` array 
in Sanity that supports drag-and-drop reordering. This task covers the next set of improvements.

## Critical Rules (same as Phase 1)
- Work on branch `feature/phase-2-sections`
- NEVER change existing visual design or CSS
- NEVER delete existing data — always create, never destroy
- Preserve TypeScript types
- Test Sanity Studio + frontend after each major change
- All 5 language versions (NO, EN, DE, DA, SV) must continue to work

---

# PART 1: New Page Builder Section Blocks

## 1.1 Testimonial / Quote Section

### Purpose
Display client testimonials on any landing page. Currently there are zero client quotes 
anywhere on the homepage — this is the biggest content gap.

### Sanity Schema

Create a new section type `testimonialSection` with these fields:

```
name: 'testimonialSection'
title: 'Testimonial Section'
type: 'object'
fields:
  - name: 'testimonials'
    title: 'Testimonials'
    type: 'array'
    of:
      - type: 'object'
        fields:
          - name: 'quote'
            title: 'Quote'
            type: 'text'
            rows: 4
            description: 'The client testimonial text'
          - name: 'authorName'
            title: 'Author Name'
            type: 'string'
          - name: 'authorRole'
            title: 'Role / Position'
            type: 'string'
          - name: 'companyName'
            title: 'Company Name'
            type: 'string'
          - name: 'companyLogo'
            title: 'Company Logo'
            type: 'image'
            optional: true
    validation: max 3
  - name: 'theme'
    title: 'Theme'
    type: 'string'
    options:
      list: ['dark', 'light', 'teal']
    initialValue: 'dark'
preview:
  prepare: return { title: 'Testimonials', subtitle: `${testimonials?.length || 0} quotes` }
```

### Frontend Component
- Dark theme (default): dark background matching the results section (#0d1117)
- Single quote displayed large and centered (like the reference design in scandicommerce-homepage-v2.html)
- If multiple quotes, show navigation dots or auto-rotate
- Author name, role, company below the quote
- Company logo if provided (grayscale, small)
- Keep it simple — one strong quote is better than a carousel of weak ones

### Register in page builder
Add `{ type: 'testimonialSection' }` to the sections array in landingPage schema.

---

## 1.2 Latest Insights / Blog Section

### Purpose
Show 2-3 recent blog posts on the homepage to signal activity and expertise.
Pull content automatically from existing blog posts.

### Sanity Schema

```
name: 'latestInsightsSection'
title: 'Latest Insights Section'
type: 'object'
fields:
  - name: 'title'
    title: 'Section Title'
    type: 'string'
    initialValue: 'Innsikt & ekspertise'
  - name: 'subtitle'
    title: 'Subtitle'
    type: 'string'
    optional: true
  - name: 'maxPosts'
    title: 'Number of posts to show'
    type: 'number'
    initialValue: 3
    validation: min 1, max 6
  - name: 'filterByTag'
    title: 'Filter by tag (optional)'
    type: 'string'
    description: 'Only show posts with this tag. Leave empty to show all.'
    optional: true
  - name: 'ctaText'
    title: 'CTA Button Text'
    type: 'string'
    initialValue: 'Se alle artikler'
  - name: 'ctaLink'
    title: 'CTA Link'
    type: 'string'
    initialValue: '/blogg'
preview:
  prepare: return { title: 'Latest Insights', subtitle: 'Blog post feed' }
```

### Frontend Component
- Fetch latest N blog posts via GROQ query (sorted by publishedAt desc)
- Filter by language matching the current page language
- Display as cards in a row: featured image, tag pill, title, excerpt, read time, date
- Match existing card styling from the results section
- "Se alle artikler" CTA button at the bottom linking to /blogg
- GROQ query for this component:
  ```groq
  *[_type == "post" && language == $lang] | order(publishedAt desc) [0...$maxPosts] {
    title, slug, excerpt, publishedAt, tags, cardImage, 
    "readTime": round(length(pt::text(content)) / 5 / 200)
  }
  ```
  (Adjust field names to match actual blog post schema)

### Register in page builder
Add `{ type: 'latestInsightsSection' }` to the sections array in landingPage schema.

---

# PART 2: Migrate All Pages to New Structure

## 2.1 Audit all page types

Before migrating, check which page types exist and how they're structured:
- Landing pages (already migrated for homepage)
- Service pages
- Shopify info pages  
- About page
- Contact page
- Work/Projects page
- Blog page
- Partners page

For each: determine if it uses fixed section fields (like landingPage did before) 
or if it already uses a flexible structure.

## 2.2 Migration approach

For each page type that uses fixed section fields:
1. Convert the schema to use a `sections` array (same pattern as landingPage)
2. Create/update the SectionRenderer to handle any new section types specific to that page
3. Write a migration script to move existing content into the sections array
4. Test in Sanity Studio and on frontend

### Migration script pattern
```javascript
// For each page type, create a migration like:
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'fk1tt27l',
  dataset: 'production', // USE DEV DATASET FIRST
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function migrate() {
  // Fetch all documents of this type
  const docs = await client.fetch(`*[_type == "landingPage"]`)
  
  for (const doc of docs) {
    // Build sections array from existing fixed fields
    const sections = []
    
    if (doc.heroSection) {
      sections.push({ _type: 'heroSection', _key: generateKey(), ...doc.heroSection })
    }
    if (doc.trustedBySection) {
      sections.push({ _type: 'trustedBySection', _key: generateKey(), ...doc.trustedBySection })
    }
    // ... repeat for all section types
    
    // Patch the document
    await client.patch(doc._id).set({ sections }).commit()
    console.log(`Migrated: ${doc.pageTitle} (${doc.language})`)
  }
}
```

### Important
- Run on dev/staging dataset first
- Verify each language version after migration
- Keep old fields in schema temporarily until migration is verified
- Only remove old fields after confirming everything works

---

# PART 3: Blog Post Translation

## 3.1 Task
Translate all existing Norwegian blog posts to their respective language versions.
Currently there are 7 Norwegian posts that need English, Swedish, Danish, and German versions.

## 3.2 Approach

For each Norwegian blog post:
1. Read the full content from Sanity (all blocks, sections, metadata)
2. Translate the content to each target language
3. Create new blog post documents in Sanity for each language version
4. Preserve the block structure (Rich Text, Gradient Title, TL;DR, Tables, etc.)
5. Translate all fields: title, excerpt, tags, key takeaways, TL;DR summaries, body text
6. DO NOT translate: brand names, technical terms (Shopify, Liquid, API, etc.), URLs, code snippets
7. Adjust market-specific references where appropriate (e.g., Norwegian payment methods → local equivalents)

## 3.3 Quality guidelines
- Swedish and Danish: be careful with false friends and colloquialisms
- German: use formal "Sie" form, proper compound nouns
- English: use international English, not specifically British or American
- All: maintain the same confident, direct tone as the Norwegian originals
- Flag any content that is heavily Norway-specific and may need adaptation rather than direct translation

## 3.4 Implementation
- Create a script that reads posts from Sanity, translates via AI, and writes back
- Use the Anthropic API or the translation model available in Cursor for translations
- Output translated content to a review folder or draft status in Sanity
- Set `language` field correctly for each translated version
- Generate appropriate slugs for each language version

## 3.5 Posts to translate (Norwegian → EN, SV, DA, DE)
1. "Level Up – fra hobby til utfordrer" (5 Oct 2025)
2. "Headed vs Headless Commerce" (11 Jul 2025) — may already have English version
3. "Slik jobber vi med Shopify Plus-kunder" (3 Mar 2025)
4. "5 Checkout Optimization Tricks" (9 Jul 2025) — may already be in English
5. "Shopify Functions vs Apps" (9 Jul 2025) — may already be in English
6. "Shopify Plus vs Standard" (9 Jul 2025) — may already be in English
7. "Fra 24Nettbutikk til effektiv B2B-drift på Shopify" (3 Oct 2025)

Check which posts already have translations before creating duplicates.

---

# PART 4: Blog Creation Workflow Improvement

## 4.1 Problem
Creating a blog post currently takes ~60 minutes because employees must manually add 
each section block (Rich Text, Gradient Title, TL;DR, Table, Key Takeaways) one at a time.

## 4.2 Solution A: Blog Post Template in Sanity

Create a Sanity document action or initial value template that pre-populates a new blog post
with the standard block structure:

```
Standard blog post template:
1. Key Takeaways block (empty, ready to fill)
2. TL;DR block (empty)
3. Rich Text block (introduction)
4. Gradient Title block (Section 1 heading)
5. TL;DR block (section summary)
6. Rich Text block (section body)
7. Gradient Title block (Section 2 heading)
8. TL;DR block (section summary)  
9. Rich Text block (section body)
10. Gradient Title block (Section 3 heading)
11. TL;DR block (section summary)
12. Rich Text block (section body)
```

Implementation: Use Sanity's `initialValue` templates feature:
```typescript
// In sanity.config.ts or schema definition
templates: [
  {
    id: 'blog-post-standard',
    title: 'Standard Blog Post',
    schemaType: 'post',
    value: {
      language: 'no',
      content: [
        { _type: 'keyTakeaways', _key: 'kt1', title: 'TL;DR - Bottom Line Up Front', items: [] },
        { _type: 'richText', _key: 'rt1', body: [] },
        { _type: 'gradientTitle', _key: 'gt1', title: '' },
        { _type: 'tldr', _key: 'tldr1', text: '' },
        { _type: 'richText', _key: 'rt2', body: [] },
        { _type: 'gradientTitle', _key: 'gt2', title: '' },
        { _type: 'tldr', _key: 'tldr2', text: '' },
        { _type: 'richText', _key: 'rt3', body: [] },
        { _type: 'gradientTitle', _key: 'gt3', title: '' },
        { _type: 'tldr', _key: 'tldr3', text: '' },
        { _type: 'richText', _key: 'rt4', body: [] },
      ]
    }
  },
  {
    id: 'blog-post-case-study',
    title: 'Case Study Post',
    schemaType: 'post',
    value: {
      language: 'no',
      tags: ['Case Study'],
      content: [
        { _type: 'keyTakeaways', _key: 'kt1', title: 'TL;DR - Bottom Line Up Front', items: [] },
        { _type: 'richText', _key: 'rt1', body: [] },
        { _type: 'gradientTitle', _key: 'gt1', title: 'Utgangspunktet' },
        { _type: 'tldr', _key: 'tldr1', text: '' },
        { _type: 'richText', _key: 'rt2', body: [] },
        { _type: 'gradientTitle', _key: 'gt2', title: 'Løsningen' },
        { _type: 'tldr', _key: 'tldr2', text: '' },
        { _type: 'richText', _key: 'rt3', body: [] },
        { _type: 'gradientTitle', _key: 'gt3', title: 'Resultater' },
        { _type: 'tldr', _key: 'tldr3', text: '' },
        { _type: 'richText', _key: 'rt4', body: [] },
        { _type: 'table', _key: 'tbl1', rows: [] },
      ]
    }
  }
]
```

This way, when someone creates a new post, they choose "Standard Blog Post" or "Case Study Post"
and the structure is already there. They just fill in the content. Cuts creation time from 60 to ~20 minutes.

## 4.3 Solution B: AI Blog Post Generator (Future Enhancement)

Build a custom Sanity Studio tool (plugin) or a standalone page that:
1. Takes a topic/outline as input
2. Calls an AI API to generate structured content
3. Outputs content in the exact block format the blog schema expects
4. Allows review/editing before publishing

This is a more complex project — estimate 8-16 hours. Do Solution A first as it's 
quick and solves most of the pain immediately.

---

# PART 5: Fix Blog Index Page

## 5.1 Problem
The blog page at /blogg only shows 1 post even though there are 7 Norwegian posts in Sanity.

## 5.2 Investigation
- Check the GROQ query powering the /blogg page
- Look for filters that might be hiding posts (e.g., featured flag, date filter, language filter)
- Check if posts are in "draft" vs "published" status
- Check if the "Load More Articles" button works or if there's a pagination bug

## 5.3 Fix
- Ensure all published posts appear in the blog listing
- Verify language filtering works correctly (show Norwegian posts on /no/ routes, etc.)
- Verify sorting by publishedAt descending
- Test pagination if it exists

---

# Implementation Order

Execute these in order, testing after each:

1. **Fix blog index page** (Part 5) — quick win, high visibility
2. **Testimonial section block** (Part 1.1) — new page builder block
3. **Latest insights section block** (Part 1.2) — new page builder block  
4. **Blog post templates** (Part 4.2, Solution A) — workflow improvement
5. **Page migration audit** (Part 2.1) — understand scope before migrating
6. **Page migrations** (Part 2.2) — convert remaining pages
7. **Blog translations** (Part 3) — create translated versions of posts
8. **AI blog generator** (Part 4.3) — future enhancement, only if time permits

Total estimated effort: 15-25 hours across all parts.
Parts 1-4 are the highest priority and can be done in ~10-15 hours.

---

## Repo delivery status (Phase 2 — implemented in codebase)

| Part | Status | Notes |
|------|--------|--------|
| 1.1 Testimonial section | Done | `testimonialSection` + `TestimonialSection.tsx` |
| 1.2 Latest insights | Done | `latestInsightsSection` + GROQ + `LatestInsightsSection.tsx` |
| 2.1 Page audit | Done | See table below (no schema migrations beyond landing). |
| 2.2 Migrate all pages to `sections[]` | Deferred | Only `landingPage` uses the page builder; other pages still use fixed fields (intentional scope). |
| 3 Translations (7 NO → EN/SV/DA/DE) | Tooling | Run `npm run report:translations` for coverage; use Sanity Assist “Translate document” or external workflow — no auto-write script (needs review). |
| 4.2 Blog templates | Done | Studio **New** → choose template: Standard / Case study (`post`) or Classic article (`blogPost`). See `sanity/lib/postDocumentTemplates.ts`. |
| 4.3 AI generator | Skipped | Future. |
| 5 Blog index | Done | `articlesListing` GROQ + `ArticlesGrid` prefers full locale list. |

### Part 2.1 — Page types vs flexible `sections`

| Document type | Structure | Notes |
|---------------|-----------|--------|
| `landingPage` | `sections[]` page builder + legacy fields | Migrated via `migrate:landing-sections`. |
| `post` | `content[]` block array | Page-builder blog. |
| `blogPost` | Fixed hero, `sections[]` article sections | Classic long-form. |
| `blogPage` | References + hero | Listing page. |
| `servicesPage` | hero embed + intro + services array + CTA | Not converted to `sections[]`. |
| `aboutPage`, `contactPage`, `workPage`, `partnersPage`, package/shopify/*, `merchPage`, … | Fixed object/array fields | Each has bespoke frontend; migrating all to one renderer is a separate project. |
