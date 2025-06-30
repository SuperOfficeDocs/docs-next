import { defineConfig, sharpImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import codeImport from "remark-code-import";
import mdx from "@astrojs/mdx";
// import preact from "@astrojs/preact";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
//import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeSanitize from "rehype-sanitize";
import remarkIncludeDirective from "./src/plugins/AddIncludesToMarkdown.js";
import remarkRestyleDirective from "./src/plugins/RestyleDirectives.js";
import react from "@astrojs/react";
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, codeImport, remarkIncludeDirective, remarkRestyleDirective ],
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
  vite: {
    plugins: [yaml()]
  },
  content: {
    sources: [
      {
        prefix: 'external',
        include: ['./external-content/**/*.yml'],
      },
    ],
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
  image: {
    service: sharpImageService({ limitInputPixels: false }),
  },
  i18n: {
    locales: ["da", "de", "en", "nl", "no", "sv"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
    fallback: {
      de: "en",
    },
  },
  build: {
    format: "preserve",
  },
  site: "https://superofficedocs.github.io",
  base: "/docs-next",
  trailingSlash: "never",
});
