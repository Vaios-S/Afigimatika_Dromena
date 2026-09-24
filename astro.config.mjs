// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { contact } from "./src/data/contact.ts";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical URLs, Open Graph URLs and the sitemap are built from this.
  site: contact.siteUrl,
  output: "static",
  integrations: [sitemap()],
});
