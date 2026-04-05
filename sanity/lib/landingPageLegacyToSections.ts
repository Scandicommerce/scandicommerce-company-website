/**
 * Copy legacy landing page top-level objects into page-builder blocks.
 * Used by Studio autofill (sections input) and the document action.
 */

export function randomSectionKey(): string {
  return [...Array(16)]
    .map(() => Math.random().toString(36).charAt(2))
    .join("");
}

export function sectionBlock(
  blockType: string,
  data: unknown
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const o = { ...(data as Record<string, unknown>) };
  delete o._type;
  delete o._key;
  return { _type: blockType, _key: randomSectionKey(), ...o };
}

export type LegacyLandingFields = {
  hero?: unknown;
  trustedBy?: unknown;
  painPoints?: unknown;
  servicesShowcase?: unknown;
  results?: unknown;
  process?: unknown;
  partners?: unknown;
  cta?: unknown;
};

export function buildSectionsFromLegacyDoc(
  doc: LegacyLandingFields
): Record<string, unknown>[] {
  return [
    sectionBlock("heroSection", doc.hero),
    sectionBlock("trustedBySection", doc.trustedBy),
    sectionBlock("painPointsSection", doc.painPoints),
    sectionBlock("servicesShowcaseSection", doc.servicesShowcase),
    sectionBlock("resultsSection", doc.results),
    sectionBlock("processSection", doc.process),
    sectionBlock("partnersSection", doc.partners),
    sectionBlock("ctaSection", doc.cta),
  ].filter(Boolean) as Record<string, unknown>[];
}
