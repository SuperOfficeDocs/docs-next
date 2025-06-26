import type { CollectionEntry } from "astro:content";
import type { TocData } from "~/types/TableOfContentTypes";
import { trimFileExtension } from "~/utils/slugUtils";

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
 * @param tocEntries Filtered `tocInternal` or `tocExternal` entries matching a specific collection.
 * @param rootCollectionName Path prefix to locate the root `toc.yml`, such as "release-notes".
 * @returns A complete nested `TocData` object representing the full Table of Contents.
 */

export async function getTableOfContentsFromCollection(
  tocEntries: CollectionEntry<"tocInternal" | "tocExternal">[],
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
    throw new Error(`No toc.yml found for collection: ${rootCollectionName}`);
  }

  const visited = new Set<string>();

  // Recursively resolve nested toc.yml references
  function resolveItems(items: any[]): any[] {
    for (const item of items) {
      const href = item.href;
      if (href && isNestedTocFile(href)) {
        const subId = normalizePath(`${rootCollectionName}/${href}`);
        if (tocMap.has(subId) && !visited.has(subId)) {
          visited.add(subId);
          const subData = tocMap.get(subId);
          if (subData?.items) {
            item.items = resolveItems(subData.items);
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
