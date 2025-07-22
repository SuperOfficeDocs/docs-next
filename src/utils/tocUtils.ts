import { getCollection, type CollectionEntry } from 'astro:content';
import type { TocData } from "~/types/TableOfContentTypes";
import { trimFileExtension } from "@utils/slugUtils";
import path from "path";

const root = 'superoffice-docs/docs';

function isNestedTocFile(href: string): boolean {
  const fileName = href.split("/").pop()?.toLowerCase();
  return fileName === "toc.yml";
}

function normalizePath(path: string): string {
  return trimFileExtension(path).replace(/\./g, "");
}

/**
 * Recursively resolves a Table of Contents from a list of `toc.yml` entries,
 * based on the root collection name (fex, "release-notes" or "docs/de").
 *
 * It builds a Map of all toc entries, finds the root toc file (fex, "release-notes/toc.yml"),
 * and then walks through the nested structure, resolving any `href` fields
 * that point to other `toc.yml` files in the collection.
 *
 * This enables a multi-file ToC to be constructed from modular parts, using content collections.
 *
 * @param tocEntries Filtered `toc` entries matching a specific collection.
 * @param rootCollectionName Path prefix to locate the root `toc.yml`, such as "release-notes".
 * @returns A complete nested `TocData` object representing the full Table of Contents.
 */

export async function getTableOfContentsFromCollection(
  tocEntries: CollectionEntry<"toc">[],
  rootCollectionName: string
): Promise<TocData> {

    
  // Store all (filtered) tocEntries in a map so we can quickly look them up by their ID later
  const tocMap = new Map<string, TocData>();
  for (const entry of tocEntries) {
    tocMap.set(entry.id, entry.data as TocData);
  }

  const rootId = trimFileExtension(`${rootCollectionName}/toc.yml`);
  const root = tocMap.get(rootId);
  if (!root) {
    return { items: [] };
  }

  const visited = new Set<string>();

  // Recursively resolve nested toc.yml references
  function resolveItems(items: any[], currentDir = rootCollectionName): any[] {
    for (const item of items) {
      const href = item.href;
      if (href && isNestedTocFile(href)) {
        const resolved = path.posix.normalize(path.posix.join(currentDir, href));
        const subId = normalizePath(resolved);
        if (tocMap.has(subId) && !visited.has(subId)) {
          visited.add(subId);
          const subData = tocMap.get(subId);
          if (subData?.items) {
            item.items = resolveItems(subData.items, path.posix.dirname(resolved));
          }
        }
      }
    }
    return items;
  }

  visited.add(rootId);
  root.items = resolveItems(root.items ?? []);
  return root;
}

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
    const tocScope = segment === 'api/authentication' ? 'api' : segment;
    const base = `${root}/${language}/${tocScope}`;
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
    const base = `${root}/${language}`;
    const tocEntries = await getCollection('toc', (e) => e.id.startsWith(base));
    return getTableOfContentsFromCollection(tocEntries, `${base}/learn`);
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
