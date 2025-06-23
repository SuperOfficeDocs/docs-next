// This is a special file that Astro will automatically load and use to configure your content collections.
import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const DocsSchema = z.object({
  
  //Mandatory Properties
  author : z.union([
    z.string(), 
    z.object({ "github-id" : z.string().nullable()}),
  ]).nullable(),
  date : z.coerce.string().nullable(),
  title : z.string().nullable(),
  uid : z.string().nullable(),
  topic : z.string().nullable(),
  

  //Optional Properties
  description : z.string().optional().nullable(),
  audience : z.string().optional().nullable(),
  audience_tooltip : z.string().optional().nullable(),
  category : z.string().optional().nullable(),
  updated : z.date().optional().nullable(),
  version : z.coerce.string().optional().nullable(),
  version_sofo : z.coerce.string().optional().nullable(),
  version_devportal : z.coerce.string().optional().nullable(),
  version_mobile : z.coerce.string().optional().nullable(),
  translation_type : z.number().optional().nullable(),
  envir : z.union([z.string(), z.array(z.string())]).optional().nullable(),
  generated : z.boolean().optional().nullable(),
  keywords : z.union([z.string(), z.array(z.string())]).optional().nullable(),
  language : z.string().max(2).optional().nullable(),
  pilot : z.string().optional().nullable(),
  redirect_url : z.string().optional().nullable(),
})
.passthrough().partial()
// .partial() is used to make every property optional due to current frontmatter mismatch in some markdown files. Needs to be removed once frontmatter fixed

const SimplifiedYamlSchema = z.object({
  YamlMime: z.enum(["Category", "SubCategory"]), //- can't use as-is since it's a comment in our code
  title: z.string(),
  metadata: z.any(),
}).passthrough(); // Allow all other fields like landingContent, conceptualContent, tools, etc.

const TocItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    uid: z.string().optional(),
    href: z.string().optional(),
    topicHref: z.string().optional(),
    items: z.array(TocItemSchema).optional(),
  })
);

const TocYamlSchema = z.object({
  items: z.array(TocItemSchema),
});

// Collections in src/content
const releaseNotes = defineCollection({
  loader: glob({ pattern: ["*.md", "**/!(*includes*)/*.md"], base: "./src/content/release-notes" }),
  schema: DocsSchema,
});

const enDocs = defineCollection({
  loader: glob({ pattern: "**/!(**includes**)/*.md",  base: "./src/content/docs/en" }),
  schema: DocsSchema,
});

const deDocs = defineCollection({
  loader: glob({ pattern: "**/!(**includes**)/*.md", base: "./src/content/docs/de" }),
  schema: DocsSchema,
});


const WebAPI = defineCollection({
  loader: glob({ pattern:["**/!(*toc).yml",], base:"./src/content/docs/en/api/reference/webapi"}),
});

const tocFilesInternal = defineCollection({
  loader: glob({
    pattern: ["**/toc.yml"],
    base: "./src/content",
  }),
  schema: TocYamlSchema,
});

// Collections in external-content (cloned from another GitHub repo)

const tocFilesExternal = defineCollection({
  loader: glob({
    pattern: ["contribution/**/toc.yml"], // Add in ext superoffice-docs later
    base: "./external-content",
  }),
  schema: TocYamlSchema,
});

const externalLandingPages = defineCollection({
  loader: glob({
    pattern: [
      "contribution/**/*.yml",
      "!**/toc.yml",
      // Add in ext superoffice-docs later
    ],
    base: "./external-content",
  }),
  schema: SimplifiedYamlSchema,
});

const contributionRepo = defineCollection({
  loader: glob({
    pattern: [
      "**/*.md",
      "!**/includes/**",
      "!CODE_OF_CONDUCT.md"],
    base: "./external-content/contribution",
  }),
  schema: DocsSchema,
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
  webapi: WebAPI,
  contribute: contributionRepo,
  external: externalLandingPages,
  tocInternal: tocFilesInternal,
  tocExternal: tocFilesExternal,
};
