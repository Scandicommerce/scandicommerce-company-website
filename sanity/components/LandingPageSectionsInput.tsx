"use client";

import { useEffect, useRef } from "react";
import {
  type ArrayOfObjectsInputProps,
  useFormBuilder,
  useFormValue,
  PatchEvent,
  set,
} from "sanity";
import { buildSectionsFromLegacyDoc } from "@/sanity/lib/landingPageLegacyToSections";

/** Avoid patching on the first tick when only part of the document is hydrated (would strand a single block). */
function legacyLooksHydrated(hero: unknown, trustedBy: unknown): boolean {
  const heroOk =
    hero !== null &&
    hero !== undefined &&
    typeof hero === "object" &&
    Object.keys(hero as object).length > 0;
  const trustedOk =
    trustedBy !== null &&
    trustedBy !== undefined &&
    typeof trustedBy === "object";
  return heroOk && trustedOk;
}

/**
 * When Page Content (`sections`) is empty but legacy fields still hold data,
 * copy them into `sections` once (until sections is non-empty again).
 */
export function LandingPageSectionsInput(props: ArrayOfObjectsInputProps) {
  const { renderDefault, onChange, readOnly, value: sections } = props;
  const { schemaType } = useFormBuilder();
  const docType = schemaType.name;
  const hero = useFormValue(["hero"]);
  const trustedBy = useFormValue(["trustedBy"]);
  const painPoints = useFormValue(["painPoints"]);
  const servicesShowcase = useFormValue(["servicesShowcase"]);
  const results = useFormValue(["results"]);
  const process = useFormValue(["process"]);
  const partners = useFormValue(["partners"]);
  const cta = useFormValue(["cta"]);

  /** Prevents double autofill; reset when `sections` becomes non-empty so clearing the array can re-run once. */
  const autofillDispatched = useRef(false);

  useEffect(() => {
    if (docType !== "landingPage") return;
    if (readOnly) return;

    if (Array.isArray(sections) && sections.length > 0) {
      autofillDispatched.current = false;
      return;
    }

    if (autofillDispatched.current) return;
    if (!legacyLooksHydrated(hero, trustedBy)) return;

    const built = buildSectionsFromLegacyDoc({
      hero,
      trustedBy,
      painPoints,
      servicesShowcase,
      results,
      process,
      partners,
      cta,
    });
    if (built.length === 0) return;

    autofillDispatched.current = true;
    onChange(PatchEvent.from(set(built)));
  }, [
    docType,
    readOnly,
    onChange,
    sections,
    hero,
    trustedBy,
    painPoints,
    servicesShowcase,
    results,
    process,
    partners,
    cta,
  ]);

  return renderDefault(props);
}
