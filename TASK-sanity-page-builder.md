# Scandicommerce — Sanity Page Builder Conversion

## Project Context
This is a Next.js + Sanity CMS website for a Shopify Plus agency (scandicommerce.no). 
The site has 5 language versions: NO, EN, DE, DA, SV.
Sanity schemas live in `sanity/schemas/`.
Section components are in `sanity/schemas/components/`.
The landing page schema is in `sanity/schemas/documents/landingPage.ts`.

## Tech Stack — Do Not Suggest Alternatives
- Next.js (App Router or Pages — check existing structure)
- Sanity CMS v3
- TypeScript
- Tailwind CSS (check if used)
- The site is deployed and in production — be careful with breaking changes

## Critical Rules
- ALWAYS create a git branch before making changes: `feature/page-builder`
- NEVER delete existing section component files — they are reused
- NEVER change the visual design or CSS — only structural/data changes
- ALWAYS preserve TypeScript types
- Test that Sanity Studio loads after schema changes before moving to frontend
- Keep all existing section field definitions intact — we are changing HOW they connect to the page, not WHAT they contain
- All 5 language versions must continue to work

## Task: Convert Fixed Sections to Page Builder Array

### Background
The `landingPage.ts` schema currently defines sections as fixed fields in a hardcoded order:
```
heroSection,
trustedBySection,
painPointsSection,
servicesShowcaseSection,
resultsSection,
processSection,
partnersSection,
ctaSection,
```
This means the content team cannot reorder, add, or remove sections without a code change. 
We need to convert this to Sanity's standard page builder pattern — an array of reorderable section blocks.

### Step-by-Step Plan

#### Step 1: Understand the current structure
- Read `sanity/schemas/documents/landingPage.ts` to understand the current schema
- Read each section component in `sanity/schemas/components/` to understand their structure
- Check if sections are defined as standalone types (using `defineType`) or inline field definitions
- Read the Next.js page component that renders the homepage to understand how sections are currently rendered
- Read the GROQ query that fetches homepage data

#### Step 2: Convert section schemas to standalone types
- Each section (heroSection, trustedBySection, painPointsSection, etc.) must be a standalone Sanity object type
- If they are already defined with `defineType` and exported, they may already work
- If they are defined as inline `defineField` objects, convert them to standalone object types
- Each type needs a `name`, `title`, `type: 'object'`, and its existing `fields`
- Add a `preview` configuration to each section type so editors can identify them in the array

#### Step 3: Update the landingPage schema
Replace the individual section fields with a single array field:

```typescript
defineField({
  name: 'sections',
  title: 'Page Content',
  type: 'array',
  of: [
    { type: 'heroSection' },
    { type: 'trustedBySection' },
    { type: 'painPointsSection' },
    { type: 'servicesShowcaseSection' },
    { type: 'resultsSection' },
    { type: 'processSection' },
    { type: 'partnersSection' },
    { type: 'ctaSection' },
    { type: 'technicalDepthSection' },
  ]
})
```

Keep the following fields as they are (NOT in the array):
- languageField
- pageTitle
- slug
- isHomepage
- seo

#### Step 4: Create the new technicalDepthSection schema
Create a new section type with these fields:

```typescript
{
  name: 'technicalDepthSection',
  title: 'Technical Depth Section',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
    {
      name: 'capabilities',
      title: 'Capability Cards',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Icon', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 3 },
          {
            name: 'tags',
            title: 'Tech Tags',
            type: 'array',
            of: [{ type: 'string' }]
          }
        ],
        preview: {
          select: { title: 'title', subtitle: 'icon' },
          prepare({ title, subtitle }) {
            return { title: title || 'Untitled', subtitle: subtitle || '' }
          }
        }
      }],
      validation: rule => rule.max(6)
    }
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Technical Depth Section', subtitle: 'Capabilities grid' }
    }
  }
}
```

#### Step 5: Register new types in Sanity schema index
Make sure all section types AND the new technicalDepthSection are registered in the main schema configuration file (often `sanity/schemas/index.ts` or `sanity.config.ts`).

#### Step 6: Build the SectionRenderer component on the frontend
Create a component that dynamically renders sections based on their `_type`:

```typescript
// components/SectionRenderer.tsx (or wherever components live)
const sectionComponents: Record<string, React.ComponentType<any>> = {
  heroSection: HeroSection,
  trustedBySection: TrustedBySection,
  painPointsSection: PainPointsSection,
  servicesShowcaseSection: ServicesShowcaseSection,
  resultsSection: ResultsSection,
  processSection: ProcessSection,
  partnersSection: PartnersSection,
  ctaSection: CtaSection,
  technicalDepthSection: TechnicalDepthSection,
}

export function SectionRenderer({ sections }: { sections: any[] }) {
  return (
    <>
      {sections?.map((section) => {
        const Component = sectionComponents[section._type]
        if (!Component) return null
        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
```

#### Step 7: Update the page component
Replace the hardcoded section rendering with the SectionRenderer:

```typescript
// BEFORE:
<HeroSection data={page.heroSection} />
<TrustedBySection data={page.trustedBySection} />
// ... etc

// AFTER:
<SectionRenderer sections={page.sections} />
```

Check how existing section components receive their data (via props, via a data prop, etc.) and make sure the SectionRenderer passes data in the same format.

#### Step 8: Update GROQ queries
Find the GROQ query that fetches the landing page data and update it:

```groq
// BEFORE:
*[_type == 'landingPage' && slug.current == $slug][0]{
  heroSection,
  trustedBySection,
  // ...
}

// AFTER:
*[_type == 'landingPage' && slug.current == $slug][0]{
  sections[]{
    _type,
    _key,
    ...
  }
}
```

If sections contain references or images, make sure to resolve them in the query.

#### Step 9: Build the TechnicalDepthSection frontend component
Create a new React component that renders the capability cards in a 3-column grid. 
Match the existing site's design language (teal accent color, dark cards or white cards, existing typography).
Look at an existing section component for styling reference.

#### Step 10: Write a data migration script
Create a one-time migration script that converts existing content from fixed fields to the sections array.
The script should:
1. Fetch all landingPage documents
2. For each document, read the existing section fields
3. Create a sections array with each section as an element (preserving all field data)
4. Patch the document with the new sections array
5. Handle all 5 language versions

Use Sanity's migration tools or a simple Node.js script with the Sanity client.

#### Step 11: Test
- Verify Sanity Studio loads and shows the sections as a reorderable array
- Verify sections can be dragged to reorder
- Verify new sections can be added
- Verify sections can be removed
- Verify the frontend renders correctly for all 5 language versions
- Verify mobile responsiveness is unchanged
- Run a build to check for any TypeScript errors
