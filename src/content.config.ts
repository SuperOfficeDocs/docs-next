// This is a special file that Astro will automatically load and use to configure your content collections.
// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// 2. Define your collection(s)

const releaseNotes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/release-notes" }),
  schema: z.object({}),
});

const enDocs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs/en" }),
  schema: z
    .object({
      uid: z.string().optional(),
    })
    .passthrough(),
});

const deDocs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs/de" }),
  schema: z
    .object({
      uid: z.string().optional(),
    })
    .passthrough(),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  "release-notes": releaseNotes,
  en: enDocs,
  de: deDocs,
};
