import { defineLocations, type DocumentLocationResolvers } from "sanity/presentation";

/**
 * Presentation tool: where each document is rendered, so editors get
 * "Open preview" links and click-to-edit overlays on the right page.
 * Slugs are the full public path (no locale prefix); Norwegian is the root
 * site, every other language is prefixed with its code.
 */
const pathFor = (slug: string | undefined, language: string | undefined) => {
  if (!slug) return null;
  const clean = slug.replace(/^\/+|\/+$/g, "");
  const lang = language ?? "no";
  return lang === "no" ? `/${clean}` : `/${lang}/${clean}`;
};

const slugLocations = (label: string) =>
  defineLocations({
    select: { title: "pageTitle", altTitle: "title", slug: "slug.current", language: "language" },
    resolve: (doc) => {
      const href = pathFor(doc?.slug, doc?.language);
      if (!href) return { message: `Publish a slug to preview this ${label}.` };
      return { locations: [{ title: doc?.title ?? doc?.altTitle ?? label, href }] };
    },
  });

export const presentationLocations: DocumentLocationResolvers = {
  pillarPage: slugLocations("pillar page"),
  integrationCategory: slugLocations("integration category"),
  integrationPage: slugLocations("integration page"),
  migrationPage: slugLocations("migration page"),
};
