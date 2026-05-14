import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

/**
 * Site-wide settings, one document per language.
 *
 * Used for:
 * - Favicon, logo, default OG image (editorial control over branding)
 * - Organization schema.org data (Org JSON-LD on every page)
 * - Social profile URLs (for sameAs in Organization markup)
 * - Search engine verification (Google Search Console, Bing Webmaster)
 * - Site-wide kill switch for noindex (staging/maintenance)
 *
 * Suggested document IDs: `siteSettings-no`, `siteSettings-en`, etc.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  description:
    "Global site configuration per language. One document per language.",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Norwegian (Norsk)", value: "no" },
          { title: "Swedish (Svenska)", value: "sv" },
          { title: "Danish (Dansk)", value: "da" },
          { title: "German (Deutsch)", value: "de" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      description: 'Example: "scandicommerce"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleTemplate",
      title: "Title template",
      type: "string",
      description:
        'Pattern for page titles. Use %s as placeholder. Example: "%s | scandicommerce"',
      initialValue: "%s | scandicommerce",
    }),
    defineField({
      name: "defaultMetaDescription",
      title: "Default meta description",
      type: "text",
      rows: 3,
      description:
        "Fallback used when a page has no specific meta description.",
      validation: (Rule) =>
        Rule.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description:
        "Square image, ideally 512×512 px or larger. SVG works best if available.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Used in Organization schema markup.",
      options: { hotspot: true },
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default social sharing image",
      type: "image",
      description: "1200×630 px recommended.",
      options: { hotspot: true },
    }),
    defineField({
      name: "defaultOgImageAlt",
      title: "Default OG image alt text",
      type: "string",
    }),
    defineField({
      name: "organization",
      title: "Organization (schema.org)",
      type: "object",
      description: "Used to generate Organization JSON-LD on every page.",
      fields: [
        defineField({
          name: "legalName",
          title: "Legal company name",
          type: "string",
          description: 'Example: "Scandicommerce AS"',
        }),
        defineField({
          name: "organizationNumber",
          title: "Organization number",
          type: "string",
          description: 'Example: "933434346"',
        }),
        defineField({
          name: "foundingYear",
          title: "Founding year",
          type: "number",
        }),
        defineField({
          name: "description",
          title: "Short description",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "email",
          title: "Contact email",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: "phone",
          title: "Contact phone",
          type: "string",
          description: 'Example: "+47 333 94 000"',
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "object",
          fields: [
            defineField({
              name: "streetAddress",
              title: "Street address",
              type: "string",
            }),
            defineField({
              name: "postalCode",
              title: "Postal code",
              type: "string",
            }),
            defineField({ name: "locality", title: "City", type: "string" }),
            defineField({
              name: "country",
              title: "Country code",
              type: "string",
              description: 'ISO 3166-1 alpha-2. Example: "NO"',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "socialProfiles",
      title: "Social profiles",
      type: "object",
      description: "Used in Organization sameAs schema markup.",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "twitter", title: "Twitter / X URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
        defineField({ name: "github", title: "GitHub URL", type: "url" }),
      ],
    }),
    defineField({
      name: "verification",
      title: "Search engine verification",
      type: "object",
      description: "Verification meta tag content values.",
      fields: [
        defineField({
          name: "google",
          title: "Google Search Console",
          type: "string",
        }),
        defineField({ name: "bing", title: "Bing Webmaster", type: "string" }),
      ],
    }),
    defineField({
      name: "robots",
      title: "Robots & indexing",
      type: "object",
      fields: [
        defineField({
          name: "noIndexEntireSite",
          title: "Hide entire site from search engines",
          type: "boolean",
          description:
            "Emergency toggle. Use only for staging or maintenance.",
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      subtitle: "language",
      media: "favicon",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Site settings",
        subtitle: subtitle
          ? `Language: ${subtitle.toUpperCase()}`
          : "No language set",
        media,
      };
    },
  },
});
