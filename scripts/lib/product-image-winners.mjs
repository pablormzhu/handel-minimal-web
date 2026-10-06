// Resolves the photo each published SKU shows today by running the real
// productImage() cascade through Vite's SSR loader. Shared by the variant
// generator and the build guard so neither re-implements the cascade.
import path from "node:path";
import { createServer } from "vite";

export async function loadProductImageWinners(root) {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: { "@": path.join(root, "src") } },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { productImage } = await server.ssrLoadModule("/src/lib/product-images.ts");
    const { siteProducts } = await server.ssrLoadModule("/src/lib/site-catalog.ts");
    return siteProducts.map((product) => {
      const url = productImage(product);
      return { sku: product.sku, url, file: fileForImageUrl(root, url) };
    });
  } finally {
    await server.close();
  }
}

/** Maps an image URL (dev-server form) to its file on disk, or null if it is not local. */
export function fileForImageUrl(root, url) {
  const clean = decodeURIComponent(url.split("?")[0]);
  if (/^[a-z]+:\/\//i.test(clean) || clean.startsWith("/__l5e/")) return null;
  if (clean.startsWith("/src/")) return path.join(root, clean);
  return path.join(root, "public", clean);
}
