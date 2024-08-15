import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import { remarkDirectiveNote } from "./remark-directive-note.mjs";
import codeImport from "remark-code-import";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveNote, codeImport]
  },
  integrations: [tailwind({
    applyBaseStyles: false
  }), icon({
    include: {
      tabler: ["*"],
      mdi: ["*"],
      fluent: ["*"],
      "material-symbols-light": ["*"],
      "flat-color-icons": ["template", "gallery", "approval", "document", "advertising", "currency-exchange", "voice-presentation", "business-contact", "database"]
    }
  }), mdx(), preact()]
});