import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { TocData } from "../types/TableOfContentTypes";

function isYamlFile(filePath: string): boolean {
  return filePath.endsWith(".yml") || filePath.endsWith(".yaml");
}

function loadYamlFile(filePath: string): TocData | null {
  if (!fs.existsSync(filePath)) {
    // console.warn(`Warning: ToC file not found: ${filePath}`);
    return null;
  }
  const file = fs.readFileSync(filePath, "utf8");

  return YAML.parse(file) as TocData;
}

export function getTableOfContents(
  collection: string,
  pathName: string,
): TocData | null {
  const filePath = path.join("src/content/", `${collection + pathName}.yml`);

  //Check if yml exists
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const YAMLData = loadYamlFile(filePath);
  if (!YAMLData) {
    throw new Error(`Failed to load ToC file: ${filePath}`);
  }

  function recursivelyLoadSubItems(items: any[]): void {
    for (const item of items) {
      if (item.href && isYamlFile(item.href)) {
        const subFilePath = path.join(`src/content/${collection}/`, item.href);
        const subData = loadYamlFile(subFilePath);
        if (subData && subData.items) {
          item.items = subData.items;
          recursivelyLoadSubItems(item.items);
        }
      }
    }
  }

  if (YAMLData.items) {
    recursivelyLoadSubItems(YAMLData.items);
  }

  return YAMLData;
}
