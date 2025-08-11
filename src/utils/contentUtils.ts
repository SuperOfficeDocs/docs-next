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

import { marked } from "marked";
import GithubSlugger from "github-slugger";
import type { Tokens } from "marked";
import type { Heading } from "~/types/OnThisArticleTypes";

/**
 * Renders Markdown content to HTML, assigning unique IDs to heading elements and collecting heading metadata.
 *
 * @param content - The Markdown content to render.
 * @returns A promise that resolves to an object containing the rendered HTML and an array of heading metadata.
 *
 * @remarks
 * - Each heading in the Markdown is assigned a slugified ID for anchor linking.
 * - The returned `headings` array contains objects with `depth`, `text`, and `slug` for each heading.
 */
export async function renderMarkdownWithHeadingIds(content: string): Promise<{ html: string; headings: Heading[] }> {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  const renderer = new marked.Renderer();

  renderer.heading = (token: Tokens.Heading) => {
    const { text, depth } = token;
    const slug = slugger.slug(text);
    headings.push({ depth, text, slug });
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  };

  const html = await marked(content, { renderer });

  return { html, headings };
}




