import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // Published reads go through the API CDN. Uncached API calls on every
  // request used up the plan's API quota and took pages down (Oct 2026).
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    // Disabled by default; enabled per-request in draft mode (see lib/fetch.ts)
    // so click-to-edit overlays work inside the Presentation tool.
    enabled: false,
    studioUrl: "/studio",
  },
});

// For draft preview (optional)
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.SANITY_API_READ_TOKEN,
});
