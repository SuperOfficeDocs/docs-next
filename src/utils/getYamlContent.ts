import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { CategoryContentItem } from "../types/CategoryPageTypes";
import type { SubCategoryContentItem } from "../types/SubCategoryPageTypes";
import type { ManagedReferenceType } from "../types/WebAPITypes";

function loadYamlFile(
  filePath: string,
  type: string
): CategoryContentItem | SubCategoryContentItem | ManagedReferenceType | null {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Category content file not found: ${filePath}`);
    return null;
  }

  const file = fs.readFileSync(filePath, "utf8");

  if (type == "category") return YAML.parse(file) as CategoryContentItem;
  else return YAML.parse(file) as SubCategoryContentItem;
}

export function getCategoryPageContents(pathName: string): CategoryContentItem {
  const filePath = path.join("src/content/docs/", `${pathName}/index.yml`);
  const YAMLData = loadYamlFile(filePath, "category");

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${pathName}`);
  }

  return YAMLData as CategoryContentItem;
}

export function getSubCategoryPageContents(
  pathName: string
): SubCategoryContentItem {
  const filePath = path.join("src/content/docs/", `${pathName}/index.yml`);
  const YAMLData = loadYamlFile(filePath, "subcategory");

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${pathName}`);
  }

  return YAMLData as SubCategoryContentItem;
}

export function getWebApiContent(pathName: string): ManagedReferenceType {
  const filePath = path.join("src/content/docs/en/api/reference/webapi/", `${pathName}.yml`);
  const YAMLData = loadYamlFile(filePath, "webApi");

  if (!YAMLData) {
    throw new Error(`Failed to load Category index file: ${pathName}`);
  }

  return YAMLData as ManagedReferenceType;
}
