type splitType = "full" | "split1" | "split2";
type CollectionTypes = "release-notes" | "en" | "de" | "reference-docs" | "webapi" | "contribute" | "cats" | "toc";
type PatternMap = {
    [variant in splitType]: {
        [collection in CollectionTypes]?: string | string[];
    };
};


/* 
Current build split setup
    split 1 - en (excluding api), de, release-notes, contribute, cats and toc (relevent files)
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
            "!api/reference/**/*.md",          // Exclude api folder
            "!api/tutorials/minimal-csharp-app", // Temporary excluded until corrupted images problem is resolved
        ],
        "de": [
            "**/*.md",               // Include all .md files in de
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "reference-docs": [
            "**/*.md",               // Include all .md files in en/api
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
            "!soap",               // Exclude files in soap
            "!restful",            // Exclude files in restful
            "!netserver",          // Exclude files in netserver
        ],
        "webapi": [
            "**/!(*toc).yml"        // Include all .yml files in webapi
        ],
        "toc": [
            "superoffice-docs/docs/**/toc.yml",             // Include all toc.yml files in docs
            "superoffice-docs/release-notes/**/toc.yml",    // Include all toc.yml files in release-notes
            "contribution/**/toc.yml",                      // Include all toc.yml files in contribution
        ],
        "cats": [
            "contribution/**/*.yml",
            "superoffice-docs/docs/**/*.yml",
            "!**/toc.yml",
            "!**/reference/**",
        ],
        "contribute": [
            "**/*.md",
            "!**/includes/**",
            "!CODE_OF_CONDUCT.md",
            "!README.md",
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
            "!api/reference/**/*.md",          // Exclude api folder
            "!api/tutorials/minimal-csharp-app", // Temporary excluded until corrupted images problem is resolved
        ],
        "de": [
            "**/*.md",               // Include all .md files in de
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"
        ],
        "reference-docs": [""],
        "webapi": [""],
        "toc": [
            "superoffice-docs/docs/**/toc.yml",             // Include all toc.yml files in docs
            "superoffice-docs/release-notes/**/toc.yml",    // Include all toc.yml files in release-notes
            "contribution/**/toc.yml",                      // Include all toc.yml files in contribution
       ],
        "cats": [
            "contribution/**/*.yml",
            "superoffice-docs/docs/**/*.yml",
            "!**/toc.yml",
            "!**/reference/**",
        ],
        "contribute": [
            "**/*.md",
            "!**/includes/**",
            "!CODE_OF_CONDUCT.md",
            "!README.md",
        ],
    },
    split2: {
        "release-notes": [""],
        "en": [""],
        "de": [""],
        "reference-docs": [
            "**/*.md",               // Include all .md files in en/api
            "!**/includes/**",       // Exclude any path that includes a folder named "includes"

            "!soap",               // Exclude files in soap
            "!restful",            // Exclude files in restful
            "!netserver",          // Exclude files in netserver
        ],
        "webapi": ["**/!(*toc).yml"],
        "toc": [
            "superoffice-docs/docs/**/toc.yml",             // Include all toc.yml files in docs
            "superoffice-docs/release-notes/**/toc.yml",    // Include all toc.yml files in release-notes
            "contribution/**/toc.yml",                      // Include all toc.yml files in contribution
         ],
        "cats": [      
            "contribution/**/*.yml",
            "superoffice-docs/docs/**/*.yml",
            "!**/toc.yml",
            "!**/reference/**",
        ],
        "contribute": [
            "**/*.md",
            "!**/includes/**",
            "!CODE_OF_CONDUCT.md",
            "!README.md",
        ],
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