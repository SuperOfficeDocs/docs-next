import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { CategoryContentItem } from "../types/CategoryPageTypes";
import type { SubCategoryContentItem } from "../types/SubCategoryPageTypes";

function loadYamlFile(
  pathName: string,
  type: string
): CategoryContentItem | SubCategoryContentItem | null {
  const filePath = path.join("src/content/docs/", `${pathName}/index.yml`);

  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Category content file not found: ${filePath}`);
    return null;
  }

  const file = fs.readFileSync(filePath, "utf8");

  if (type == "category") return YAML.parse(file) as CategoryContentItem;
  else return YAML.parse(file) as SubCategoryContentItem;
}

export function getCategoryPageContents(pathName: string): CategoryContentItem {
  const YAMLData = loadYamlFile(pathName, "category");

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${pathName}`);
  }

  return YAMLData as CategoryContentItem;
}

export function getSubCategoryPageContents(
  pathName: string
): SubCategoryContentItem {
  const YAMLData = loadYamlFile(pathName, "subcategory");

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${pathName}`);
  }

  return YAMLData as SubCategoryContentItem;
}
