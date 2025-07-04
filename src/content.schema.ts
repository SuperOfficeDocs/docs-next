import { z } from "astro:content";

export const DocsSchema = z.object({
    //Mandatory Properties
    author: z.string().nullable(),
    date: z.coerce.string().nullable(),
    uid: z.string().nullable(),

    //Optional Properties
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    audience: z.string().optional().nullable(),
    audience_tooltip: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    updated: z.coerce.string().optional().nullable(),
    version: z.coerce.string().optional().nullable(),
    version_sofo: z.coerce.string().optional().nullable(),
    version_devportal: z.coerce.string().optional().nullable(),
    version_mobile: z.coerce.string().optional().nullable(),
    translation_type: z.union([z.number(), z.string()]).optional().nullable(),
    deployment: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    generated: z.coerce.string().optional().nullable(),
    keywords: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    language: z.string().max(2).optional().nullable(),
    pilot: z.string().optional().nullable(),
    redirect_url: z.string().optional().nullable(),
})
    .passthrough().partial()
// .partial() is used to make every property optional due to current frontmatter mismatch in some markdown files. Needs to be removed once frontmatter fixed

export const SimplifiedYamlSchema = z.object({
    yamlMime: z.enum(["Category", "SubCategory"]), //- can't use as-is since it's a comment in our code
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

export const TocYamlSchema = z.object({
    items: z.array(TocItemSchema),
});