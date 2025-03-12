import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import { remarkDirectiveNote } from "./remark-directive-note.mjs";
import codeImport from "remark-code-import";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
//import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveNote, codeImport],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "before",
        },
      ],
    ],
    // rehypeSanitize, rehypeSlug
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    icon({
      include: {
        tabler: ["*"],
        mdi: ["*"],
        fluent: ["*"],
        "material-symbols-light": ["*"],
        "flat-color-icons": [
          "template",
          "gallery",
          "approval",
          "document",
          "advertising",
          "currency-exchange",
          "voice-presentation",
          "business-contact",
          "database",
        ],
      },
    }),
    mdx(),
    // preact(),
    robots(),
    sitemap(),
    pagefind(),
    react(),
  ],
  build: {
    format: "preserve",
  },
  site: 'https://docs-next.github.io',
  base: '',
});
