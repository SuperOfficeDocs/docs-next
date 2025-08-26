// detect-duplicate-frontmatter.js
// Usage: node detect-duplicate-frontmatter.js

import fs from "fs";
import path from "path";
import * as YAML from "yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.resolve("external-content/superoffice-docs/docs");
const outputFile = path.resolve(__dirname, "duplicate-frontmatter.txt");
const extensions = new Set([".md"]); // add ".mdx" if needed

function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

// Robust frontmatter extractor: supports BOM, \r\n, and ensures start-of-file.
function extractFrontmatter(raw) {
  // Match from the very beginning of the file:
  // ---<newline> ... <newline>---(newline|EOF)
  const re =
    /^\uFEFF?---\s*[\r\n]+([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/; // BOM-safe, CRLF-safe
  const m = raw.match(re);
  return m ? m[1] : null;
}

function findTopLevelDuplicateKeys(yamlText) {
  // Parse with uniqueKeys:false to preserve duplicates instead of throwing
  const doc = YAML.parseDocument(yamlText, { uniqueKeys: false });
  const map = doc.contents;
  if (!map || !map.items || !Array.isArray(map.items)) return [];

  const seen = new Set();
  const dups = new Set();

  for (const pair of map.items) {
    // Pair.key may be a Scalar or a Node; coerce to string safely
    const key =
      pair?.key && typeof pair.key.value !== "undefined"
        ? String(pair.key.value)
        : String(pair?.key?.toString?.() ?? "");

    if (!key) continue;
    if (seen.has(key)) dups.add(key);
    else seen.add(key);
  }
  return [...dups];
}

const files = fs.existsSync(contentDir) ? walk(contentDir) : [];
/** @type {{file:string, duplicates:string[]}[]} */
const problemFiles = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const fm = extractFrontmatter(raw);
  if (!fm) continue;

  const duplicates = findTopLevelDuplicateKeys(fm);
  if (duplicates.length > 0) {
    problemFiles.push({ file, duplicates });
  }
}

// Write results
if (problemFiles.length) {
  const lines = ["Duplicate frontmatter keys found:", ""];
  for (const { file, duplicates } of problemFiles) {
    lines.push(file);
    lines.push(`  -> ${duplicates.join(", ")}`);
  }
  fs.writeFileSync(outputFile, lines.join("\n") + "\n", "utf8");
  process.exitCode = 1;
  console.log(`Report written to ${outputFile} (${problemFiles.length} files)`);
} else {
  fs.writeFileSync(outputFile, "No duplicate frontmatter keys found.\n", "utf8");
  console.log(`No duplicates. Report written to ${outputFile}`);
}
