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

const WORK_INDEX: Record<string, string> = { no: "kundecaser", en: "work", sv: "work", da: "work", de: "work" };

/** Case studies live under the work index of their language. */
const caseStudyLocations = defineLocations({
  select: { title: "title", slug: "slug.current", language: "language" },
  resolve: (doc) => {
    if (!doc?.slug) return { message: "Publish a slug to preview this case study." };
    const lang = doc.language ?? "no";
    const last = String(doc.slug).replace(/^\/+|\/+$/g, "").split("/").pop();
    const index = WORK_INDEX[lang] ?? "work";
    return {
      locations: [
        { title: doc.title ?? "Case study", href: pathFor(`${index}/${last}`, lang) as string },
        { title: "All case studies", href: pathFor(index, lang) as string },
      ],
    };
  },
});

export const presentationLocations: DocumentLocationResolvers = {
  workPage: slugLocations("work page"),
  caseStudy: caseStudyLocations,
  pillarPage: slugLocations("pillar page"),
  integrationCategory: slugLocations("integration category"),
  integrationPage: slugLocations("integration page"),
  migrationPage: slugLocations("migration page"),
};
