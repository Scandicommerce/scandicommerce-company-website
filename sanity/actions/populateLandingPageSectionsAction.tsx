import {
  type DocumentActionComponent,
  useDocumentOperation,
  set,
} from "sanity";
import { buildSectionsFromLegacyDoc } from "@/sanity/lib/landingPageLegacyToSections";

function sectionsIsEmpty(doc: Record<string, unknown> | null | undefined) {
  const s = doc?.sections;
  return !Array.isArray(s) || s.length === 0;
}

export const populateLandingPageSectionsAction: DocumentActionComponent = (
  props
) => {
  const { id, type, draft, published, onComplete } = props;
  const { patch } = useDocumentOperation(id, type);

  if (type !== "landingPage") {
    return null;
  }

  const doc = (draft ?? published) as Record<string, unknown> | null | undefined;
  const sections = doc
    ? buildSectionsFromLegacyDoc({
        hero: doc.hero,
        trustedBy: doc.trustedBy,
        painPoints: doc.painPoints,
        servicesShowcase: doc.servicesShowcase,
        results: doc.results,
        process: doc.process,
        partners: doc.partners,
        cta: doc.cta,
      })
    : [];
  const canFill = Boolean(doc && sectionsIsEmpty(doc) && sections.length > 0);

  return {
    label: "Fill Page Content from legacy fields",
    title:
      "Same as the automatic fill when Page Content is empty — copies hero, trusted by, etc. into the array. Publish when ready.",
    tone: "positive",
    disabled: !canFill,
    onHandle: () => {
      if (!canFill) return;
      patch.execute([set(sections, ["sections"])]);
      onComplete();
    },
  };
};
