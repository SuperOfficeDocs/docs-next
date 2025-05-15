import { defineConfig, sharpImageService } from "astro/config";
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

import node from "@astrojs/node";

import auth from "auth-astro";

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

  integrations: [tailwind({
    applyBaseStyles: false,
  }), icon({
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
  }), mdx(), // preact(),
  robots(), sitemap(), pagefind(), react(), auth()],

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
  
  output: 'static',
  adapter: node({
    mode: "standalone",
  }),
});