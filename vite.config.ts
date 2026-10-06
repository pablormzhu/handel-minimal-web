// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { UserConfig } from "vite";
// Type-only: adds Nitro's `nitro` key to Vite's UserConfig.
import type {} from "nitro/vite";
import { productImageVariants } from "./scripts/product-image-variants-plugin.ts";

const immutable = { "cache-control": "public, max-age=31536000, immutable" };

// Cache rules for Vercel deployments only, so Lovable's own build stays unchanged.
// HTML is served with ISR until the next deploy; query strings don't split the cache
// (/contacto reads them, so it stays dynamic) and error pages keep their own body.
const vercelNitro: UserConfig["nitro"] = {
  routeRules: {
    "/**": { isr: { expiration: false, allowQuery: [], exposeErrBody: true } },
    "/contacto": { isr: false },
    "/api/**": { isr: false, headers: { "cache-control": "no-store" } },
    "/img/v/**": { headers: immutable },
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [productImageVariants()],
  vite: process.env["VERCEL"] ? { nitro: vercelNitro } : {},
});
