import { getCollection, type CollectionEntry } from "astro:content";

export async function getLocalizedToc(language: string): Promise<CollectionEntry<"toc">[]> {
  const tocEntries = await getCollection("toc", ({ id }) =>
    id.startsWith(`superoffice-docs/docs/${language}`)
  );
  return tocEntries;
}
