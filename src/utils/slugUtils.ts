const supportedExtensions = [".md", ".mdx", ".yml", ".yaml"];
const contentDir = "external-content"; // external content directory
const contentRepo = "superoffice-docs"; // primary content repository

/**
 * Strips the content directory prefix, collection path, and file extension from an entry.filePath.
 * For example: "external-content/superoffice-docs/docs/en/project/learn/index.md" -> "/project/learn/index"
 */
export function stripFilePathAndExtension(filePath: string, collection: string, isExternal: boolean = false): string {
  const base = isExternal
  ? `${contentDir}/`
  : `src/content/`;

  return filePath.replace(base, "").replace(`${collection}/`, "").replace(/\.(md|ya?ml)$/, "");
}

/**
 * Removes a known file extension (.md, .mdx, .yml, .yaml, .html) from a path.
 * Logs a warning if an unknown or unsupported extension is detected.
 * If there's no extension at all, just return as-is.
 */
export function trimFileExtension(filename: string): string {
  const extPattern = /\.[^.]+$/;
  const knownExtPattern = /\.(mdx?|ya?ml|html)$/i;

  if (!extPattern.test(filename)) {
    return filename;
  }

  if (!knownExtPattern.test(filename)) {
    console.warn(`[trimFileExtension] Unknown or missing file extension in: "${filename}"`);
    return filename;
  }

  return filename.replace(knownExtPattern, "");
}

/**
 * Resolves a Markdown file link to a proper path.
 *
 * @param url - The original link from our data, for example 'learn/foo.md' or '../bar.md'.
 * @param baseSlug - Optional prefix to prepend, such as 'document' or 'onsite'.
 * @returns Resolved URL with no file extension and correct prefix.
 */
export function resolveHref(url: string, baseSlug?: string): string {
  //console.warn(`[resolveHref] 🔹 url: "${url}", baseSlug: "${baseSlug}"`);
  if (url.startsWith("http")) return url; // external, leave unchanged

  const isSupported = supportedExtensions.some(ext => url.endsWith(ext));
  if (!isSupported) return url;

  const trimmed = trimFileExtension(url);

  if (baseSlug === "contribute") { // special case for this repo
    return trimmed;
  }

  if (baseSlug && url.startsWith(baseSlug + "/")) {
    return trimmed;
  }

  return baseSlug ? `${baseSlug}/${trimmed}` : trimmed;
}

/**
 * Extracts the clean slug from a full file ID by removing the base path and file extension.
 *
 * Useful for generating route parameters for category and subcategory pages from landing entry IDs, such as converting
 * 'learn/administration.yml' to 'administration', or returning 'index' if the file matches the base path.
 *
 * @param id - The full landing entry ID, for example, 'en/learn/index.yml'.
 * @param basePath - The root collection or folder prefix to remove from the ID.
 * @returns A clean slug string, such as 'foo' or 'index'.
 */
export function extractCategorySlug(id: string, basePath: string): string {
  const rawSlug = id === basePath ? "" : id.replace(`${basePath}/`, "");
  return rawSlug ? trimFileExtension(rawSlug) : "index";
}

/**
 * Used by the `astro-redirect-from` package to generate a redirect slug from a file path.
 * It determines the collection based on the file path and returns a clean slug.
 */
export function getRedirectFromSlug(filePath: string) {
  let collection = "superoffice-docs/docs/en"; // default

  if (filePath.startsWith(`${contentRepo}/docs/`)) {
    collection = `${contentRepo}/docs/${filePath.split("/")[2]}`;
  } else if (filePath.startsWith(`${contentRepo}/release-notes/`)) {
    collection = `${contentRepo}/release-notes`;
  } else {
    // For any other repo (contribution, etc.), use the first part of the path
    collection = filePath.split('/')[0];
  }

  const slug = stripFilePathAndExtension(filePath!, collection, true);
  //console.warn(`[getRedirectFromSlug] 🔹 filePath: "${filePath}", collection: "${collection}", slug: "${slug}"`);
  return slug;
}
