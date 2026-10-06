import { createFileRoute } from "@tanstack/react-router";
import { families } from "@/lib/catalog";
import { equipment } from "@/lib/equipment";
import { siteBrands, siteProducts, catalogProductPath } from "@/lib/site-catalog";
import { catalogBrands } from "@/lib/brand-catalog";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const brandSlugs = new Set(catalogBrands.map((b) => b.slug));
        const paths = [
          "/", "/catalogo", "/marcas", "/nosotros", "/contacto", "/equipos", "/patches", "/aviso-privacidad",
          ...families.map((f) => `/catalogo/${f.slug}`),
          ...siteBrands.filter((b) => brandSlugs.has(b.slug)).map((b) => `/marca/${b.slug}`),
          ...equipment.map((e) => `/equipos/${e.slug}`),
          ...siteProducts.map((p) => catalogProductPath(p)),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)]
          .map((p) => `  <url><loc>${absoluteUrl(encodeURI(p)).replace(/&/g, "&amp;")}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
