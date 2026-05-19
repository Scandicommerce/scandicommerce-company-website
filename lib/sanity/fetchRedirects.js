// @ts-check
/**
 * Build-time helper for `next.config.js` async redirects().
 *
 * Reads enabled `redirect` documents from Sanity and shapes them into the
 * Next.js redirects format. Designed to be fail-safe: any error (missing env
 * vars, network failure, Sanity outage) returns an empty array so the build
 * still succeeds with the hardcoded redirects intact.
 *
 * This file is intentionally plain JavaScript so `next.config.js` can
 * `require()` it without transpilation.
 */

const { createClient } = require("next-sanity");
const { isNoSlugEnglishificationRedirect } = require("./redirectTranslate");

const REDIRECTS_QUERY = `*[_type == "redirect" && isEnabled == true] | order(_createdAt asc) {
  "source": source,
  "destination": destination,
  "permanent": coalesce(permanent, true)
}`;

/**
 * @returns {Promise<Array<{source: string, destination: string, permanent: boolean}>>}
 */
async function fetchRedirects() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) {
    console.warn(
      "[fetchRedirects] NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET not set \u2014 skipping Sanity-managed redirects"
    );
    return [];
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      // CDN is fine for build-time fetches; we revalidate on deploy.
      useCdn: true,
      perspective: "published",
    });
    const rows = await client.fetch(REDIRECTS_QUERY);
    if (!Array.isArray(rows)) return [];

    const valid = rows.filter(
      (r) =>
        r &&
        typeof r.source === "string" &&
        r.source.startsWith("/") &&
        typeof r.destination === "string" &&
        r.destination.length > 0 &&
        !/\s/.test(r.source)
    );

    const out = [];
    for (const r of valid) {
      if (await isNoSlugEnglishificationRedirect(r.source, r.destination)) {
        console.warn(
          `[fetchRedirects] skipping redirect that replaces a Norwegian slug with English: ${r.source} → ${r.destination}`
        );
        continue;
      }
      out.push({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent !== false,
      });
    }
    return out;
  } catch (err) {
    console.error(
      "[fetchRedirects] failed to fetch Sanity-managed redirects; falling back to hardcoded list",
      err && err.message ? err.message : err
    );
    return [];
  }
}

module.exports = { fetchRedirects };
