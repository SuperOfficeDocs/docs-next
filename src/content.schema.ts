import { z } from "astro:content";

const TocItemSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        name: z.string(),
        uid: z.string().optional(),
        href: z.string().optional(),
        topicHref: z.string().optional(),
        items: z.array(TocItemSchema).optional(),
    })
);

const MandatoryDocsSchema = z.object({
    author: z.string().nullable(),
    date: z.coerce.string().nullable(),
    uid: z.string().nullable(),
}).partial() // .partial() is used to make every property optional due to current frontmatter mismatch in some markdown files. Needs to be removed once frontmatter fixed

const OptionalDocsSchema = z.object({
    title: z.string().nullable(),
    description: z.string()
        .nullable(),
    audience: z.string().nullable(),
    audience_tooltip: z.string().nullable(),
    category: z.string().nullable(),
    content_type: z.string().nullable(),
    updated: z.coerce.string().nullable(),
    version: z.coerce.string().nullable(),
    version_sofo: z.coerce.string().nullable(),
    version_devportal: z.coerce.string().nullable(),
    version_mobile: z.coerce.string().nullable(),
    translation_type: z.string().nullable(),
    deployment: z.union([z.string(), z.array(z.string())]).nullable(),
    license: z.union([z.string(), z.array(z.string())]).nullable(),
    generated: z.coerce.string().nullable(),
    keywords: z.union([z.string(), z.array(z.string())]).nullable(),
    functional_right: z.union([z.string(), z.array(z.string())]).nullable(),
    index: z.boolean().nullable(),
    language: z.string().max(2).nullable(),
    pilot: z.string().nullable(),
    platform: z.string().nullable(),
    redirect_url: z.string().nullable(),
    topic: z.string().nullable(),
    redirect_from: z.union([z.string(), z.array(z.string())]).nullable(),
}).partial()



export const DocsSchema = MandatoryDocsSchema.merge(OptionalDocsSchema).passthrough();

export const SimplifiedYamlSchema = z.object({
    yamlMime: z.enum(["Category", "SubCategory"]),
    title: z.string(),
    metadata: z.any(),
}).passthrough(); // Allow all other fields like landingContent, conceptualContent, tools, etc.

export const TocYamlSchema = z.object({
    items: z.array(TocItemSchema),
});