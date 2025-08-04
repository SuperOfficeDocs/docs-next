import fs from "fs/promises";
import path from "path";

export async function getMarkdownSlugs() {
  // Relative to the project root (process.cwd())
  const baseDir = path.join(
    process.cwd(),
    "external-content",
    "superoffice-docs",
    "docs",
    "en",
    "api",
    "reference"
  );

  const slugs: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const relativePath = path.relative(baseDir, fullPath);
        const slug = relativePath.replace(/\.md$/, "").split(path.sep).join("/");
        slugs.push(slug);
      }
    }
  }

  await walk(baseDir);
  return slugs;
}
