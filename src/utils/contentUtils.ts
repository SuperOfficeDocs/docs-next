import { getCollection, render, type CollectionEntry, type DataEntryMap } from 'astro:content';
import type { MarkdownHeading } from 'astro';

const contentRoot = 'superoffice-docs/docs';

/**
 * Fetches all non‐redirect entries in a language, or—if `folder` is provided—only those under that folder.
 * Special‐cased so that when `folder === "learn"`, it ignores path and instead returns only entries whose
 * `data.uid` starts with `"help-"`.
 *
 * @param language - The Astro collection key, such as "en", "de".
 * @param folder?  - Optional sub-folder name to include, for example "database".
 *                   When omitted, returns every non-redirect entry.
 * @returns A promise resolving to the filtered array of `CollectionEntry<language>`.
 */
export async function getDocEntries<L extends keyof DataEntryMap>(
  language: L,
  folder?: string
): Promise<CollectionEntry<L>[]> {
  return getCollection(language, ({ id, data }) =>
    !data.redirect_url &&
    (folder === "learn"
      ? Boolean(data.uid?.startsWith("help-"))
      : (!folder || id.includes(`/${folder}/`)))
  );
}

/**
 * Fetches all non-redirect entries in a language, omitting any that live under the named folders,
 * and always excluding any entries whose `data.uid` starts with "help-".
 * Assumes English learn is handled via getDocEntries.
 *
 * @param language      - The Astro collection key (normally "en")
 * @param excludeFolders - Array of sub-folder names to skip entirely,
 *                         for example, `["database", "onsite"]`.
 * @returns A promise resolving to the filtered array of `CollectionEntry<language>`.
 */
export async function getFilteredDocEntries<L extends keyof DataEntryMap>(
  language: L,
  excludeFolders: string[]
): Promise<CollectionEntry<L>[]> {
  const base = `${contentRoot}/${language}`;
  const skipRe = new RegExp(`^${base}(?:${excludeFolders.join("|")})(?:/|$)`);

  return getCollection(language, ({ id, data }) =>
    !data.redirect_url &&
    !data.uid?.startsWith("help-") &&
    (!skipRe || !skipRe.test(id))
  );
}


/**
 * Fetches all non‐redirect entries for any collection base path,
 * computing once at build-time. Handles special cases in en/api.
 *
 * @param collection - The Astro content collection key, such as "api-docs".
 * @param basePath - The full prefix, for example "superoffice-docs/docs/en/api".
 * @returns A promise resolving to the filtered array of `CollectionEntry<language>`.
 */
export async function getDocEntriesByPath<C extends keyof DataEntryMap>(
  collection: C,
  basePath: string
): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, ({ data, filePath }) =>
    !data.redirect_url &&
    filePath?.startsWith(basePath)
  );
}


/**
 * Renders a list of content entries and extracts their Markdown headings.
 *
 * Useful for generating an array of page‐specific TOC headings in `getStaticPaths` or similar data loaders.
 * The generic `<T extends keyof DataEntryMap>` preserves the concrete collection key (such as "en", "de") for full type safety.
 *
 * @param entries - An array of `CollectionEntry<T>` items from Astro's content collections.
 * @returns A promise that resolves to an array of `MarkdownHeading[]`, where each inner array corresponds to the headings of one entry.
 */
export async function getHeadings<T extends keyof DataEntryMap>(
  entries: CollectionEntry<T>[]
): Promise<MarkdownHeading[][]> {
  return Promise.all(
    entries.map(async (post) => {
      const { headings } = await render(post);
      return headings;
    })
  );
}
