// Astro will automatically load the exported collections constant defined in this file and use it to configure content collections.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DocsSchema, SimplifiedYamlSchema, TocYamlSchema, YamlManagedReferenceSchema } from "~/content.schema"

// apiOnly variable is used in the split build to isolate docs/en/api folder content
const apiOnly = process.env.API_ONLY === 'true';

const DOCS_BASE = "external-content/superoffice-docs/docs";
const API_BASE = `${DOCS_BASE}/en/api`;

const enDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!index.md",
      "!**/includes/**",
      "!api/**/*.md",   // In apiDocs
      "!automation/netserver-scripting/reference/**",   // In NSScriptingRef
    ],
    base: `${DOCS_BASE}/en`,
  }),
  schema: DocsSchema,
});

const apiDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
      "!tutorials/minimal-csharp-app",   //Temporary excluded due to corrupted images
      "!reference/**/*.md",   // In referenceDocs
      "!nuget/**/*.md",   // Never published
      "!tooltip/**/*.md",   // Never published
      "!web-extensions/**/*.md",   // Never published
    ],
    base: API_BASE,
  }),
  schema: DocsSchema,
});

/**
 * API REFERENCES
 */

const CRMScript = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "**/!(*toc).yml",
      "!**/includes/**",
    ] : [],
    base: `${DOCS_BASE}/en/automation/crmscript/reference`,
  }),
  schema: YamlManagedReferenceSchema,
});

const NSScriptingRef = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",],
    base: `${DOCS_BASE}/en/automation/netserver-scripting/reference`,
  }),
  schema: DocsSchema,
});

const WebAPI = defineCollection({
  loader: glob({
    pattern: apiOnly ? ["**/!(*toc).yml"] : [],
    base: `${API_BASE}/reference/webapi`
  }),
});

const Web = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "SuperOffice.Cache.*.yml",
      "SuperOffice.Cache.yml"
    ] : [],
    base: `${API_BASE}/reference/web`
  }),
});

const NetserverCore = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "Microsoft.Extensions.DependencyInjection.*.yml",
    ] : [],
    base: `${API_BASE}/reference/netserver/core`
  }),
});

const NetserverServices = defineCollection({
  loader: glob({
    pattern: apiOnly ? [
      "SuperOffice.CRM.ArchiveLists.*.yml",
    ] : [],
    base: `${API_BASE}/reference/netserver/services`
  }),
});

/**
 * TRANSLATIONS
 */

const daDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: `${DOCS_BASE}/da`
  }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: `${DOCS_BASE}/de`
  }),
  schema: DocsSchema,
});

const nlDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: `${DOCS_BASE}/nl`
  }),
  schema: DocsSchema,
});

const noDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: `${DOCS_BASE}/no`
  }),
  schema: DocsSchema,
});

const svDocs = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
    ],
    base: `${DOCS_BASE}/sv`
  }),
  schema: DocsSchema,
});

/**
 * SPECIAL COLLECTIONS
 */

const contribution = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
      "**/*.md",
      "!**/includes/**",
      "!CODE_OF_CONDUCT.md",
      "!README.md",],
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

const releaseNotes = defineCollection({
  loader: glob({
    pattern: apiOnly ? [] : [
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
  "crmscript": CRMScript,
  "nsscripting": NSScriptingRef,
  "netserver-core": NetserverCore,
  "netserver-services": NetserverServices,
  webapi: WebAPI,
  web: Web,
  contribute: contribution,
  "release-notes": releaseNotes,
  cats: landingPages,
  toc: tocFiles,
};