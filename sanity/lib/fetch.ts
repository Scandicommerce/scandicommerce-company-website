import { draftMode } from "next/headers";
import { client } from "./client";
import type { QueryParams } from "next-sanity";

const token = process.env.SANITY_API_READ_TOKEN;

/** True when Next.js draft mode is active (inside the Presentation tool / preview). */
function isDraftModeEnabled(): boolean {
  try {
    return draftMode().isEnabled;
  } catch {
    // draftMode() throws outside a request scope (e.g. sitemap generation at build time)
    return false;
  }
}

/**
 * Draft-aware Sanity fetch (object signature).
 *
 * In normal mode: published content, cached.
 * In draft mode (visual editing): drafts perspective + stega encoding so the
 * Presentation tool can render click-to-edit overlays.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number;
}): Promise<T> {
  if (isDraftModeEnabled() && token) {
    return client.fetch<T>(query, params, {
      token,
      perspective: "previewDrafts",
      useCdn: false,
      stega: true,
      next: { revalidate: 0, tags },
    });
  }
  return client.fetch<T>(query, params, {
    next: {
      revalidate:
        revalidate ?? (process.env.NODE_ENV === "development" ? 30 : 3600),
      tags,
    },
  });
}

/**
 * Drop-in replacement for `client.fetch(query, params, { next: {...} })` used
 * by page components. Same positional signature, but draft-aware: inside the
 * Presentation tool it fetches drafts with stega overlays enabled.
 */
export async function sanityPageFetch<T = any>(
  query: string,
  params: QueryParams = {},
  options?: { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<T> {
  if (isDraftModeEnabled() && token) {
    return client.fetch<T>(query, params, {
      token,
      perspective: "previewDrafts",
      useCdn: false,
      stega: true,
      next: { revalidate: 0, tags: options?.next?.tags },
    });
  }
  return client.fetch<T>(query, params, { next: options?.next });
}
