const supportedExtensions = [".md", ".mdx", ".yml", ".yaml"];

/**
 * Strips the slug prefix and file extension from an entry.filePath.
 * For example: "src/content/release-notes/v11/index.md" -> "/v11/index"
 */
export function stripMarkdownSlug(filePath: string, collection: string, isExternal = false): string {
  const base = isExternal
  ? `external-content/${collection}/`
  : `src/content/${collection}/`;

  return filePath.replace(base, "").replace(/\.md$/, "");
}

/**
 * Removes a known file extension (.md, .mdx, .yml, .yaml, .html) from a path.
 * Logs a warning if an unknown or unsupported extension is detected.
 */
export function trimFileExtension(filename: string): string {
  const knownExtPattern = /\.(mdx?|ya?ml|html)$/i;

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
