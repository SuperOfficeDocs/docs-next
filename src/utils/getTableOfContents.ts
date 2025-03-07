import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { TocData } from "../types/TableOfContentTypes";

// Read and parse YAML Data
export function getTableOfContents(release: string): TocData {
  const filePath = path.join("src/data/", `${release}.yml`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`ToC file not found: ${filePath}`);
  }
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file) as TocData;
}
