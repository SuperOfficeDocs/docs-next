type splitType = "full" | "split1" | "split2";
type CollectionTypes = "release-notes" | "en" | "de" | "api-docs" | "webapi" | "contribute" | "external" | "toc";
type PatternMap = {
    [variant in splitType]: {
        [collection in CollectionTypes]?: string | string[];
    };
};


/* 
Current build split setup
    split 1 - en (excluding api), de, release-notes, contribute, external and toc (relevent files)
    split 2 - api-docs, webapi and relevent files from toc 
*/


export const patternMap: PatternMap = {
    full: {
        "release-notes": [
            "**/*.md",               // Include all .md files in release-notes
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "en": [
            "**/*.md",               // Include all .md files in en
            "!*.md",                 // Exclude .md files in the root (docs/en/*.md)
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
            "!api/**/*.md",          // Exclude api folder
        ],
        "de": [
            "**/*.md",               // Include all .md files in de
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "api-docs": [
            "**/*.md",               // Include all .md files in en/api
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"

            "!tutorials/minimal-csharp-app", // Temporary excluded until corrupted images problem is resolved
            "!reference/soap",               // Exclude files in soap
            "!reference/restful",            // Exclude files in restful
            "!reference/netserver",          // Exclude files in netserver
        ],
        "webapi": [
            "**/!(*toc).yml"        // Include all .yml files in webapi
        ],
        "toc": [
            "superoffice-docs/docs/**/toc.yml",             // Include all toc.yml files in docs
            "superoffice-docs/release-notes/**/toc.yml",    // Include all toc.yml files in release-notes
            "contribution/**/toc.yml",                      // Include all toc.yml files in contribution
        ],
        "external": [
            "contribution/**/*.yml",
            "!**/toc.yml",
            // Add in ext superoffice-docs later
        ],
        "contribute": [
            "**/*.md",
            "!**/includes/**",
            "!CODE_OF_CONDUCT.md"
        ],
    },
    split1: {
        "release-notes": [
            "**/*.md",               // Include all .md files in release-notes
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "en": [
            "**/*.md",               // Include all .md files in en
            "!*.md",                 // Exclude .md files in the root (docs/en/*.md)
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
            "!api/**/*.md",          // Exclude api folder
        ],
        "de": [
            "**/*.md",               // Include all .md files in de
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "api-docs": [""],
        "webapi": [""],
        "toc": [
            "!superoffice-docs/docs/en/api",
            "superoffice-docs/docs/**/toc.yml",
            "superoffice-docs/release-notes/**/toc.yml",
            "contribution/**/toc.yml",
        ],
        "external": [
            "contribution/**/*.yml",
            "!**/toc.yml",
            // Add in ext superoffice-docs later
        ],
        "contribute": [
            "**/*.md",
            "!**/includes/**",
            "!CODE_OF_CONDUCT.md"
        ],
    },
    split2: {
        "release-notes": [""],
        "en": [""],
        "de": [""],
        "api-docs": [
            "**/*.md",               // Include all .md files in en/api
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"

            "!tutorials/minimal-csharp-app", // Temporary excluded until corrupted images problem is resolved
            "!reference/soap",               // Exclude files in soap
            "!reference/restful",            // Exclude files in restful
            "!reference/netserver",          // Exclude files in netserver
        ],
        "webapi": ["**/!(*toc).yml"],
        "toc": [
            "superoffice-docs/docs/en/api/**/toc.yml",
            "superoffice-docs/docs/en/api/toc.yml",
        ],
        "external": [""],
        "contribute": [""],
    }
}


export function getPattern(
    split: string,
    collection: CollectionTypes
): string | string[] {
    const splitMap = patternMap[split as splitType];
    if (!splitMap) return "";

    return splitMap[collection as CollectionTypes] ?? "";
}