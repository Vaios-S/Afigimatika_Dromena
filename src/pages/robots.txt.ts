/**
 * robots.txt, generated at build time from the LAUNCHED flag in site.ts.
 * Before launch everything is disallowed; after launch everything is allowed
 * and the sitemap is referenced.
 */
import type { APIRoute } from "astro";
import { LAUNCHED } from "../data/site";

export const GET: APIRoute = ({ site }) => {
  const body = LAUNCHED
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site).href}\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
