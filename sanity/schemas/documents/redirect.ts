import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

/**
 * URL redirects managed editorially in Sanity.
 *
 * The frontend (`next.config.js` `async redirects()`) should fetch all
 * enabled redirects at build time via GROQ:
 *
 *   *[_type == "redirect" && isEnabled == true] {
 *     "source": source,
 *     "destination": destination,
 *     "permanent": permanent
 *   }
 *
 * Vercel limit: 1024 redirects in next.config. For more, use middleware.
 */
export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: LinkIcon,
  description: "Manages URL redirects for the site.",
  fields: [
    defineField({
      name: "source",
      title: "From (source path)",
      type: "string",
      description:
        'Path that should redirect. Must start with /. Example: "/old-page"',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return "Required";
          if (!value.startsWith("/")) return "Must start with /";
          if (/\s/.test(value)) return "No spaces allowed";
          return true;
        }),
    }),
    defineField({
      name: "destination",
      title: "To (destination)",
      type: "string",
      description:
        "Where to redirect. Can be a path (/new-page) or full URL (https://example.com).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "permanent",
      title: "301 permanent redirect",
      type: "boolean",
      description:
        "On (301) = permanent, tells Google to transfer ranking. Off (302) = temporary.",
      initialValue: true,
    }),
    defineField({
      name: "isEnabled",
      title: "Active",
      type: "boolean",
      description: "Toggle off to disable without deleting.",
      initialValue: true,
    }),
    defineField({
      name: "note",
      title: "Internal note",
      type: "text",
      rows: 2,
      description: "Optional. Why was this redirect created?",
    }),
  ],
  preview: {
    select: {
      source: "source",
      destination: "destination",
      isEnabled: "isEnabled",
      permanent: "permanent",
    },
    prepare(selection) {
      const { source, destination, isEnabled, permanent } = selection;
      return {
        title: `${source} → ${destination}`,
        subtitle: `${permanent ? "301" : "302"}${
          isEnabled ? "" : " (disabled)"
        }`,
      };
    },
  },
});
