import { getCollection, type CollectionEntry, type DataEntryMap } from 'astro:content';
import type { DocsFrontmatter } from "~/types/DocsTypes";

const contentRoot = 'superoffice-docs/docs';

/**
 * Fetches all non‐redirect entries in a language, or—if `folder` is provided—only those under that folder.
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
  return getCollection(language, ({ id, data }) => {
    const doc = data as DocsFrontmatter;
    return !doc.redirect_url && (!folder || id.startsWith(`/${folder}/`));
  });
}

/**
 * Fetches all non-redirect entries in a language, omitting any that live under the named folders.
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

  return getCollection(language, ({ id, data }) => {
    const doc = data as DocsFrontmatter;
    return !doc.redirect_url && (!skipRe || !skipRe.test(id));
  });
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
  return getCollection(collection, ({ data, filePath }) => {
    const doc = data as DocsFrontmatter;
    return !doc.redirect_url && filePath?.startsWith(basePath);
  });
}

