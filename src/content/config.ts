// This is a special file that Astro will automatically load and use to configure your content collections.
// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Define your collection(s)

const releaseNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    version: z.string().optional(),
    version_mobile: z.string().optional(),
  }).passthrough(),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'release-notes': releaseNotes,
};