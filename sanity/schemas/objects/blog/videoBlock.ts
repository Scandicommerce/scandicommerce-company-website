import { defineField, defineType } from "sanity";

/**
 * Video block for the Post (Page Builder). Renders a self-hosted (or CDN) video
 * — used for the agent-demo hero. Point `url` at a file in /public or a CDN URL.
 */
export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "string",
      description: "Path in /public (e.g. /videos/ucp-agent-demo.mp4) or a full https URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
      description: "Shown before play (and while loading).",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay (muted, looped)",
      type: "boolean",
      initialValue: false,
      description: "If on, plays muted on loop with no controls. If off, shows controls and a play button.",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare({ title, subtitle }) {
      return { title: title || "Video", subtitle };
    },
  },
});
