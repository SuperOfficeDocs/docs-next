// Astro will automatically load the exported collections constant defined in this file and use it to configure content collections.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema } from "~/content.schema"

// apiOnly variable is used in the split build to isolate docs/en/api folder content
const apiOnly = process.env.API_ONLY === 'true';


const enDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/*.md",
      "!index.md",
      "!**/includes/**",
      "!api/**/*.md",   // In apiDocs
      "api/authentication/**/*.md",   // Routed as en/authentication
      "!automation/**/reference/**",   // Currently not handled anywhere. TODO
    ],
    base: "external-content/superoffice-docs/docs/en",
  }),
  schema: DocsSchema,
});

const apiDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
      "!tutorials/minimal-csharp-app",   //Temporary excluded due to corrupted images
      "!reference/**/*.md",   // In referenceDocs
      "!authentication/**/*.md",   // Routed as en/authentication
      "!nuget/**/*.md",   // Never published
      "!tooltip/**/*.md",   // Never published
      "!web-extensions/**/*.md",   // Never published
    ],
    base: "external-content/superoffice-docs/docs/en/api",
  }),
  schema: DocsSchema,
});

/**
 * API REFERENCES
 */

const referenceDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "**/*.md",
      "!**/includes/**",
      "!soap",   // Exclude files
      "!restful",   // Exclude files 
      "!netserver",   // Exclude files
    ] : [""],
    base: "external-content/superoffice-docs/docs/en/api/reference",
  }),
  schema: DocsSchema,
})

const WebAPI = defineCollection({
  loader: glob({
    pattern: apiOnly ? ["**/!(*toc).yml"] : [""],
    base: "external-content/superoffice-docs/docs/en/api/reference/webapi"
  }),
});

/**
 * TRANSLATIONS
 */

const daDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: "external-content/superoffice-docs/docs/da" 
  }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: "external-content/superoffice-docs/docs/de" 
  }),
  schema: DocsSchema,
});

const nlDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: "external-content/superoffice-docs/docs/nl" 
  }),
  schema: DocsSchema,
});

const noDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: "external-content/superoffice-docs/docs/no" 
  }),
  schema: DocsSchema,
});

const svDocs = defineCollection({
  loader: glob({ pattern: apiOnly ? [""] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: "external-content/superoffice-docs/docs/sv" 
  }),
  schema: DocsSchema,
});

/**
 * SPECIAL COLLECTIONS
 */

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
      "**/*.md",
      "!**/includes/**",
    ], 
    base: "external-content/superoffice-docs/release-notes" 
  }),
  schema: DocsSchema,
});

const tocFiles = defineCollection({
  loader: glob({
    pattern: [
      "contribution/**/toc.yml",
      "superoffice-docs/docs/**/toc.yml",
      "superoffice-docs/release-notes/**/toc.yml",
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
      "!**/reference/**",   // Because CRMScript.Event.Trigger.yml isn't a valid landing page
    ],
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

// Export a single `collections` object to register collections
export const collections = {
  en: enDocs,
  da: daDocs,
  de: deDocs,
  nl: nlDocs,
  no: noDocs,
  sv: svDocs,
  "api-docs": apiDocs,
  "reference-docs" : referenceDocs,
  webapi: WebAPI,
  contribute: contribution,
  "release-notes": releaseNotes,
  cats: landingPages,
  toc: tocFiles,
};