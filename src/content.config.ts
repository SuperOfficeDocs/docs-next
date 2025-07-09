// Astro will automatically load the exported collections constant defined in this file and use it to configure content collections.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema } from "~/content.schema"

// apiOnly variable is used in the split build to isolate docs/en/api folder content
const apiOnly = process.env.API_ONLY === 'true';


const releaseNotes = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : ["*.md", "**/!(*includes*)/*.md"], base: "external-content/superoffice-docs/release-notes" }),
  schema: DocsSchema,
});

const enDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/!(**includes**)/*.md",
      "!api/**/*.md",
    ],
    base: "external-content/superoffice-docs/docs/en",
  }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : "**/!(**includes**)/*.md", base: "external-content/superoffice-docs/docs/de" }),
  schema: DocsSchema,
});

const WebAPI = defineCollection({
  loader: glob({ pattern: apiOnly ? ["**/!(*toc).yml"] : [""], base: "external-content/superoffice-docs/docs/en/api/reference/webapi" }),
});

const tocFiles = defineCollection({
  loader: glob({
    pattern: apiOnly ? ["superoffice-docs/docs/en/api/**/toc.yml"] : [
      "superoffice-docs/docs/en/!(api)/**/toc.yml",
      "superoffice-docs/docs/**/toc.yml",
      "superoffice-docs/release-notes/**/toc.yml",
      "contribution/**/toc.yml",
    ],
    base: "./external-content",
  }),
  schema: TocYamlSchema,
});

const externalLandingPages = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "contribution/**/*.yml",
      "!**/toc.yml",
      // Add in ext superoffice-docs later
    ],
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

const contribution = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
      "!CODE_OF_CONDUCT.md"],
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

//  Export a single `collections` object to register collections
export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
  webapi: WebAPI,
  contribute: contribution,
  external: externalLandingPages,
  toc: tocFiles,
};