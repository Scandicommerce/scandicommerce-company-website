export { client } from "./client";
export { urlFor } from "./image";
// NOTE: ./fetch is intentionally NOT re-exported here — it imports next/headers
// (draft mode) and this barrel is consumed by client components. Import
// sanityFetch/sanityPageFetch directly from "@/sanity/lib/fetch" in server code.
export * from "./queries";
