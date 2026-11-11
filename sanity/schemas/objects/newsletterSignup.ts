import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Reusable newsletter signup block.
 *
 * Add it to a landing page's sections, to an article's content, or set it in
 * footerSettings. Every placement posts to /api/newsletter, which submits to
 * the HubSpot form "Nyhetsbrevnettsiden" with the page URL. `variant` sets the layout.
 */
export const newsletterSignup = defineType({
  name: "newsletterSignup",
  title: "Newsletter Signup",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      description: "Layout of the block.",
      options: {
        list: [
          { title: "Inline (in an article)", value: "inline" },
          { title: "Section (full width on landing pages)", value: "section" },
          { title: "Footer", value: "footer" },
        ],
        layout: "radio",
      },
      initialValue: "inline",
    }),
    defineField({
      name: "overskrift",
      title: "Heading",
      type: "string",
      initialValue: "Meld deg på vårt nyhetsbrev",
    }),
    defineField({
      name: "undertekst",
      title: "Subtext",
      type: "string",
      description: 'e.g. "Shopify-nytt og kundecaser, rett i innboksen"',
    }),
    defineField({
      name: "buttonText",
      title: "Button text",
      type: "string",
      description: 'Optional. Defaults to "Meld meg på" / "Subscribe".',
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "string",
      description: "Optional. Shown after a successful signup. Defaults to a standard thank-you.",
    }),
  ],
  preview: {
    select: { title: "overskrift", subtitle: "variant" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Newsletter Signup",
        subtitle: subtitle ? `Newsletter · ${subtitle}` : "Newsletter",
      };
    },
  },
});
