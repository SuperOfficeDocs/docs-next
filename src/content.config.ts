// Astro will automatically load the exported collections constant defined in this file and use it to configure content collections.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema } from "~/content.schema"
import { getPattern } from "~/buildSplitPattern"

const buildSplit = process.env.BUILD_SPLIT ?? "full";

const enDocs = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "en"),
    base: "external-content/superoffice-docs/docs/en",
  }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "de"),
    base: "external-content/superoffice-docs/docs/de"
  }),
  schema: DocsSchema,
});

const referenceDocs = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "reference-docs"),
    base: "external-content/superoffice-docs/docs/en/api/reference",

  }),
  schema: DocsSchema,
})

const WebAPI = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "webapi"),
    base: "external-content/superoffice-docs/docs/en/api/reference/webapi"
  }),
});

const tocFiles = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "toc"),
    base: "./external-content",
  }),
  schema: TocYamlSchema,
});

const landingPages = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "cats"),
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

const contribute = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "contribute"),
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

const releaseNotes = defineCollection({
  loader: glob({
    pattern: getPattern(buildSplit, "release-notes"),
    base: "external-content/superoffice-docs/release-notes"
  }),
  schema: DocsSchema,
});


// Export a single `collections` object to register collections
export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
  "reference-docs": referenceDocs,
  webapi: WebAPI,
  contribute: contribute,
  cats: landingPages,
  toc: tocFiles,
};