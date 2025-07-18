// Astro will automatically load the exported collections constant defined in this file and use it to configure content collections.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema } from "~/content.schema"

// apiOnly variable is used in the split build to isolate docs/en/api folder content
const apiOnly = process.env.API_ONLY === 'true';


const enDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/*.md",               // Include all .md files recursively
      "!*.md",                 // Exclude .md files in the root (docs/en/*.md)
      "!**/includes/**",       // Exclude any path that includes a folder named "includes"
      "!api/reference/**/*.md",               // Exclude api folder
      "!api/tutorials/minimal-csharp-app", //Temporary excluded until corrupted images problem is resolved
      "!automation/**/reference/**",
    ],
    base: "external-content/superoffice-docs/docs/en",
  }),
  schema: DocsSchema,
});

const referenceDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "**/*.md",               // Include all .md files recursively
      "!**/includes/**",       // Exclude any path that includes a folder named "includes"
      
      
      "!soap",   // Exclude .md files in the root (external-content/*.md)
      "!restful",   // Exclude files 
      "!netserver",   // Exclude files
    ] : [""],
    base: "external-content/superoffice-docs/docs/en/api/reference",
  }),
  schema: DocsSchema,
})

const WebAPI = defineCollection({
  loader: glob({ pattern: apiOnly ? ["**/!(*toc).yml"] : [""], base: "external-content/superoffice-docs/docs/en/api/reference/webapi" }),
});

const deDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",               // Include all .md files recursively
      "!*.md",                 // Exclude .md files in the root (external-content/*.md)
      "!**/includes/**",       // Exclude any path that includes a folder named "includes"
    ], 
    base: "external-content/superoffice-docs/docs/de" 
  }),
  schema: DocsSchema,
});

const contribution = defineCollection({
  loader: glob({
    pattern: [
      "**/*.md",
      "!**/includes/**",
      "!CODE_OF_CONDUCT.md",
      "!README.md",],
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

const releaseNotes = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",               // Include all .md files recursively
      "!**/includes/**",       // Exclude any path that includes a folder named "includes"
    ], 
    base: "external-content/superoffice-docs/release-notes" 
  }),
  schema: DocsSchema,
});

const tocFiles = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "superoffice-docs/docs/en/api/**/toc.yml",
      "superoffice-docs/docs/en/api/toc.yml",
    ] : [
      "superoffice-docs/docs/en/!(api)/**/toc.yml",
      "superoffice-docs/docs/**/toc.yml",
      "superoffice-docs/release-notes/**/toc.yml",
      "contribution/**/toc.yml",
    ],
    base: "./external-content",
  }),
  schema: TocYamlSchema,
});

const landingPages = defineCollection({
  loader: glob({
    pattern: [
      "contribution/**/*.yml",
      "superoffice-docs/docs/**/*.yml",
      "!**/toc.yml",
      "!**/reference/**",
    ],
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

// Export a single `collections` object to register collections
export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
  "reference-docs" : referenceDocs,
  webapi: WebAPI,
  contribute: contribution,
  cats: landingPages,
  toc: tocFiles,
};