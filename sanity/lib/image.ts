import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/** Resolved image from GROQ (e.g. asset->) - builder accepts this at runtime */
type ResolvedImage = { asset?: { _id?: string; url?: string }; crop?: unknown; hotspot?: unknown };

export function urlFor(source: Image | ResolvedImage) {
  return builder.image(source as Image);
}
