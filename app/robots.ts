import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { siteSettingsRobotsQuery } from "@/sanity/lib/queries";
import { getBaseUrl } from "@/lib/hreflang";

export const revalidate = 3600;

type RobotsRow = {
  language?: string;
  noIndexEntireSite?: boolean;
};

async function isSiteWideNoIndex(): Promise<boolean> {
  try {
    const rows = await client.fetch<RobotsRow[]>(
      siteSettingsRobotsQuery,
      {},
      { next: { revalidate: 60, tags: ["site-settings"] } }
    );
    // Treat as a global kill switch: if ANY language doc has it flipped on,
    // the whole site goes dark. Editors can flip any single doc to deindex.
    return Array.isArray(rows) && rows.some((r) => r.noIndexEntireSite === true);
  } catch (err) {
    console.error("[robots] failed to read siteSettings robots flag", err);
    return false;
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = getBaseUrl();
  const killSwitch = await isSiteWideNoIndex();

  if (killSwitch) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      ...(baseUrl && { host: baseUrl }),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api/", "/_next/", "/admin"],
      },
    ],
    ...(baseUrl && {
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl,
    }),
  };
}
