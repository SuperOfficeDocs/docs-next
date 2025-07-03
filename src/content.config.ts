// Astro automatically loads this file and uses it to configure content collections.


import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema } from "./content.schema";

const apiOnly = process.env.API_ONLY === 'true';

const releaseNotes = defineCollection({
  loader: glob({
    // pattern: ["**/!(*includes*)/*.md"],
    pattern: [""], //Temporary
    base: "external-content/superoffice-docs/release-notes"
  }),
  schema: DocsSchema,
});

const enDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/*.md",
      "!api/**/*.md",
      "!**/includes/**/*.md"
    ],
    base: "external-content/superoffice-docs/docs/en",
  }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({
    // pattern: "**/!(**includes**)/*.md",
    pattern: [""], //Temporary
    base: "external-content/superoffice-docs/docs/de"
  }),
  schema: DocsSchema,
});


const WebAPI = defineCollection({
  loader: glob({
    pattern: apiOnly ? ["**/!(*toc).yml"] : [""],
    base: "external-content/superoffice-docs/docs/en/api/reference/webapi"
  }),
});


const tocFilesExternal = defineCollection({
  loader: glob({
    pattern: [
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
    // pattern: [
    //   "contribution/**/*.yml",
    //   "!**/toc.yml",
    //   // Add in ext superoffice-docs later
    // ],
    pattern: [""], //Temporary
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

const contributionRepo = defineCollection({
  loader: glob({
    // pattern: [
    //   "**/*.md",
    //   "!**/includes/**",
    //   "!CODE_OF_CONDUCT.md"],
    pattern: [""], //Temporary
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
  webapi: WebAPI,
  contribute: contributionRepo,
  external: externalLandingPages,
  tocExternal: tocFilesExternal,
};
