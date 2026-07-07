import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Reusable newsletter signup block (doc §3.1).
 *
 * Embed this object anywhere a newsletter form is wanted (article body,
 * footer, homepage section) instead of maintaining three separate
 * implementations. `variant` controls visual size only, not content.
 * The frontend renders it via <NewsletterForm /> (posts to /api/newsletter).
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
      description: "Controls visual size, not content.",
      options: {
        list: [
          { title: "Inline (in an article)", value: "inline" },
          { title: "Footer", value: "footer" },
          { title: "Section (full width)", value: "seksjon" },
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
  ],
  preview: {
    select: { title: "overskrift", subtitle: "variant" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Newsletter Signup",
        subtitle: subtitle ? `Variant: ${subtitle}` : "Newsletter",
      };
    },
  },
});
