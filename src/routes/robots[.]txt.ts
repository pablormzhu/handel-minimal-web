import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";

// Served from a route (not public/robots.txt) so the Sitemap line follows SITE_URL.
const rules = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Disallow: /api/
Allow: /
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(`${rules}\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
