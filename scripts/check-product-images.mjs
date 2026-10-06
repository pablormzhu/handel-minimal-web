// Build guard. Fails when a Lovable-hosted /__l5e/ asset is still referenced or when
// a SKU's photo file does not exist. Missing or outdated WebP variants only warn:
// those SKUs fall back to their original photo at runtime.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadProductImageWinners } from "./lib/product-image-winners.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXT_FILE = /\.(?:[cm]?[jt]sx?|json|css|html|txt|xml|md)$/;
const errors = [];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

for (const dir of ["src", "public"]) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file);
    if (file.endsWith(".asset.json")) errors.push(`Asset de Lovable sin migrar: ${rel}`);
    else if (TEXT_FILE.test(file) && readFileSync(file, "utf8").includes("/__l5e/")) {
      errors.push(`Referencia a /__l5e/ en ${rel}`);
    }
  }
}

const winners = await loadProductImageWinners(root);
for (const { sku, url, file } of winners) {
  if (!file || !existsSync(file)) errors.push(`SKU ${sku} apunta a un archivo inexistente: ${url}`);
}

const manifest = JSON.parse(
  readFileSync(path.join(root, "src/lib/product-image-variants.json"), "utf8"),
);
const stale = [];
for (const { sku, file } of winners) {
  const entry = manifest[sku];
  const current =
    file && existsSync(file) ? createHash("sha256").update(readFileSync(file)).digest("hex") : null;
  const variantsExist = entry?.widths.every((w) =>
    existsSync(path.join(root, "public/img/v", `${entry.hash}-${w}.webp`)),
  );
  if (
    !entry ||
    entry.file !== path.relative(root, file) ||
    entry.sha256 !== current ||
    !variantsExist
  )
    stale.push(sku);
}
if (stale.length) {
  console.warn(
    `Aviso: ${stale.length} SKU(s) sin variantes vigentes; usarán su foto original. ` +
      `Regenera con "node scripts/build-product-image-variants.mjs". Ej.: ${stale.slice(0, 10).join(", ")}`,
  );
}

if (errors.length) {
  console.error(`Guard de imágenes: ${errors.length} error(es)\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Guard de imágenes: ${winners.length} SKUs con archivo, sin /__l5e/.`);
