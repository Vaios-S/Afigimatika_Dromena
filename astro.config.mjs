// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { contact } from "./src/data/contact.ts";
import { postMarkdown } from "./src/lib/post-markdown.ts";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical URLs, Open Graph URLs and the sitemap are built from this.
  site: contact.siteUrl,
  output: "static",
  // CSS goes into each page's <head> (about 17 KB gzipped): no render-blocking
  // stylesheet requests, at the cost of no CSS caching between pages.
  build: { inlineStylesheets: "always" },
  integrations: [sitemap()],
  // Post bodies: drop cap, figures with captions, quotes with attribution.
  markdown: { processor: satteri({ hastPlugins: [postMarkdown] }) },
});
