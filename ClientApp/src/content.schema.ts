import { z } from "astro:content";

const ParameterSchema = z.object({
    id: z.string().nullable().optional(),   // null/optional allowed
    type: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
});

const ReturnSchema = z.object({
    type: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
});

const SyntaxSchema = z.object({
    content: z.string().nullable().optional(),
    parameters: z.array(ParameterSchema).nullable().optional(),
    return: ReturnSchema.nullable().optional(),
});

const ItemSchema = z.object({
    uid: z.string(),
    commentId: z.string().nullable().optional(),
    id: z.string().nullable().optional(),   // **was required, now optional**
    parent: z.string().nullable().optional(),
    children: z.array(z.string()).nullable().optional(),
    name: z.string().nullable().optional(),
    nameWithType: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    type: z.string(),
    summary: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),   // **null-safe**
    example: z.array(z.string()).nullable().optional(), // **null-safe**
    syntax: SyntaxSchema.nullable().optional(),
    implements: z.array(z.string()).nullable().optional(),
    inheritance: z.array(z.string()).nullable().optional(),
    derivedClasses: z.array(z.string()).nullable().optional(),
    assemblies: z.array(z.string()).nullable().optional(),
    namespace: z.string().nullable().optional(),
    langs: z.array(z.string()).nullable().optional(),
    so: z.record(z.string(), z.any()).optional(),   // catches `so.version`, `so.intellisense`
});

const ReferenceSchema = z.object({
    uid: z.string(),
    commentId: z.string().nullable().optional(),
    isExternal: z.boolean().nullable().optional(),
    name: z.string().nullable().optional(),
    nameWithType: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    href: z.string().nullable().optional(),
    spec: z.record(z.string(), z.any()).optional(),
});

export const YamlManagedReferenceSchema = z.object({
    // YAML frontmatter like `YamlMime: ManagedReference` is a comment, so omit it
    items: z.array(ItemSchema),
    references: z.array(ReferenceSchema).nullable().optional(),
});

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