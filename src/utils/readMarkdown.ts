import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function readMarkdownFile(slug: string) {
  const baseDir = path.join(
    process.cwd(),
    "external-content",
    "superoffice-docs",
    "docs",
    "en",
    "api",
    "reference"
  );

  const filePath = path.join(baseDir, ...slug.split("/")) + ".md";

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    const rendered = await remark().use(html).process(content);
    return {
      frontmatter: data,
      content: rendered.toString(),
      slug,
    };
  } catch (err) {
    console.error(`Failed to read markdown file for slug "${slug}":`, err);
    return null;
  }
}
