import { defineConfig, sharpImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import codeImport from "remark-code-import";
import mdx from "@astrojs/mdx";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkIncludeDirective from "./src/plugins/AddIncludesToMarkdown.js";
import remarkRestyleDirective from "./src/plugins/RestyleDirectives.js";
import react from "@astrojs/react";
import yaml from '@rollup/plugin-yaml';
import redirectFrom from "astro-redirect-from";
import { getRedirectFromSlug } from './src/utils/slugUtils.ts';


export default defineConfig({
  pages: [
    'src/pages/**/*'
  ],

  markdown: {
    remarkPlugins: [remarkDirective, codeImport, remarkIncludeDirective, remarkRestyleDirective],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "before",
        },
      ],
    ],
    shikiConfig: {
      theme: "houston",
      wrap: true,
      langAlias: {
        // Map our special cases
        crmscript: "javascript",
        dotnetcli: "console",
        http_: "http",
        https: "http",
        serilog: "log",
        vbnet: "vb",
        // Casing aliases
        C: "c",
        Javascript: "javascript",
        JSON: "json",
        SQL: "sql",
        XML: "xml",
      },
    },
  },

  vite: {
    plugins: [yaml()],
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
    tailwind({ applyBaseStyles: false }),
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
    pagefind(),
    react(),
    // redirectFrom({
    //   contentDir: './external-content',
    //   getSlug: getRedirectFromSlug, // Function to get the slug for redirect_from
    // }),
    robots(),
    sitemap(),
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
      da: "en",
      de: "en",
      nl: "en",
      no: "en",
      sv: "en",
    },
  },

  build: {
    format: "preserve",
  },
  logLevel: process.env.CI ? 'error' : 'info',
  site: "https://superofficedocs.github.io",
  // base: "/",
  trailingSlash: "never",
});
