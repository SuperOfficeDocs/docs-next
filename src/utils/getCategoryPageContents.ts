import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { CategoryContentItem } from "../types/CategoryPageTypes";

function loadYamlFile(filePath: string): CategoryContentItem | null {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Category content file not found: ${filePath}`);
    return null;
  }
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file) as CategoryContentItem;
}

export function getCategoryPageContents(pathName: string): CategoryContentItem {
  const filePath = path.join("src/content/docs/", `${pathName}/index.yml`);
  const YAMLData = loadYamlFile(filePath);

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${filePath}`);
  }

  return YAMLData;
}
