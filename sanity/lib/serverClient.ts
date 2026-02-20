import { createClient } from "next-sanity";

/**
 * Server-only Sanity client with write access.
 * Use ONLY in API routes / server code (e.g. Calendly webhook).
 * Never expose SANITY_API_WRITE_TOKEN to the frontend.
 */
export function getServerClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN is required for server-side writes (e.g. Calendly webhook). Create a token in Sanity Manage with Editor permissions, and set it in .env (not the Calendly key)."
    );
  }
  if (!projectId || !dataset) {
    throw new Error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set. They must match the Sanity project where your token was created (e.g. the project shown in Manage → API → Tokens)."
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}
