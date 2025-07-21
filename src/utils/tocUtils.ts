import { getCollection } from 'astro:content';
import { getTableOfContentsFromCollection } from '~/utils/getTableOfContentsFromCollection';

const root = 'superoffice-docs/docs';

/**
 * Builds a table-of-contents data structure for all pages under a given
 * language/segment, computing once at build-time.
 *
 * @param language - The Astro content collection key, such as "en".
 * @param segment  - The sub-folder name under `superoffice-docs/docs/{language}`, for example "database".
 * @returns A promise resolving to the ToC data array for `/…/{segment}`.
 */
export async function getSegmentToc(
    language: string,
    segment: string
) {
    const base = `${root}/${language}/${segment}`;
    const tocEntries = await getCollection('toc', (e) => e.id.startsWith(base));
    return getTableOfContentsFromCollection(tocEntries, base);
}

/**
 * Builds a table-of-contents data structure for the **fixed** "learn" segment
 * under a given language, computing once at build-time.
 *
 * @param language - The Astro content collection key, such as "en".
 * @returns A promise resolving to the ToC data array for `/{language}/learn`.
 */
export async function getLocalizedToc(language: string) {
    const base = `${root}/${language}/learn`;
    const tocEntries = await getCollection('toc', (e) => e.id.startsWith(base));
    return getTableOfContentsFromCollection(tocEntries, base);
}

/**
 * Builds a table‐of‐contents data array for any collection base path,
 * computing once at build-time. Handles special cases.
 *
 * @param basePath - The full prefix, for example "superoffice-docs/release-notes", or "contribution".
 * @returns A Promise resolving to the ToC data array for that path.
 */
export async function getTocByPath(path: string) {
  const tocEntries = await getCollection('toc', (e) =>
    e.id.startsWith(path)
  );
  return getTableOfContentsFromCollection(tocEntries, path);
}
