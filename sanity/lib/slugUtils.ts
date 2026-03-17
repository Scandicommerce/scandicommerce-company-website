import type { SlugIsUniqueValidator } from "sanity";

/**
 * Slug uniqueness scoped to (document type + language).
 * Allows the same slug across different languages — e.g. "/" for every
 * language variant of the homepage.
 */
export const isUniquePerLanguage: SlugIsUniqueValidator = async (
  slug,
  context
) => {
  const { document, getClient } = context;
  if (!document) return true;

  const client = getClient({ apiVersion: "2024-01-01" });
  const language = document.language ?? null;
  const id = document._id.replace(/^drafts\./, "");

  const count = await client.fetch<number>(
    `count(*[
      _type == $type &&
      slug.current == $slug &&
      (!defined(language) && !defined($language) || language == $language) &&
      !(_id in [$id, $draftId])
    ])`,
    {
      type: document._type,
      slug,
      language,
      id,
      draftId: `drafts.${id}`,
    }
  );

  return count === 0;
};
