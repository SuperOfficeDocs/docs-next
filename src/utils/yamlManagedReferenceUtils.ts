import type {
  YamlManagedReferenceItem,
  YamlManagedReferenceReference,
  YamlNamespaceData,
} from "~/types/YamlManagedReferenceTypes";

/**
 * Build grouped namespace data from ManagedReference items and references.
 *
 * Groups children of the root item (items[0]) by their `type`.
 */
export function buildNamespaceData(
  items: YamlManagedReferenceItem[],
  references: YamlManagedReferenceReference[] = []
): YamlNamespaceData {
  const namespaceData: YamlNamespaceData = {};

  const childrenUids = items[0]?.children || [];
  for (const uid of childrenUids) {
    const childRef = references.find((ref) => ref.uid === uid);
    if (!childRef) continue;

    const group = childRef.type || "Other";
    if (!namespaceData[group]) namespaceData[group] = [];

    namespaceData[group].push({
      uid: childRef.uid,
      name: childRef.name ?? "",
      summary: childRef.summary ?? null,
      type: group,
    });
  }

  return namespaceData;
}

/**
 * Extracts the inner code block from an HTML string if it contains <code> tags.
 *
 * DocFX-managed reference YAML examples often embed code snippets as raw HTML:
 * "<pre><code>Date d;\nDate next = Date(d);\nprintLine(next.toString());</code></pre>"
 *
 * This helper:
 * - Searches for the first `<code>`…`</code>` pair.
 * - Returns the inner text (trimmed) if found.
 * - Returns `null` if no `<code>` tags are present (so the caller can render prose/HTML as-is).
 *
 * @param htmlString - Raw example string from YAML (may contain code or prose).
 * @returns The extracted code string, or `null` if no `<code>` block is found.
 */
export function extractCodeIfPresent(htmlString: string): string | null {
  const codeMatch = htmlString.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  return codeMatch ? codeMatch[1].trim() : null;
}

/**
 * Decode HTML entities in YAML strings (for example, &quot; -> ").
 * Use with `set:html` to preserved markup.
 */
export function renderHtmlOrText(input?: string | null): string {
  if (!input) return "";

  return input
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
