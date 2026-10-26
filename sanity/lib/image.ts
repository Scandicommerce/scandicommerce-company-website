import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

// Built from the project config rather than the Sanity client so client
// components using urlFor don't pull @sanity/client into the browser bundle.
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "",
});

/** Resolved image from GROQ (e.g. asset->) - builder accepts this at runtime */
type ResolvedImage = { asset?: { _id?: string; url?: string }; crop?: unknown; hotspot?: unknown };

export function urlFor(source: Image | ResolvedImage) {
  return builder.image(source as Image);
}
