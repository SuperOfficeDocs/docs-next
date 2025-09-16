import type { z } from "astro:content";
import { DocsSchema } from "~/content.schema";

/**
 * Represents the validated frontmatter for all Markdown files using DocsSchema.
 */
export type DocsFrontmatter = z.infer<typeof DocsSchema>;
