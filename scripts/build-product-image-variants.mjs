// Generates WebP width variants of the photo each SKU shows today.
// The source is whatever productImage() returns, so the cascade stays the only
// place that decides a SKU's photo. Re-run after changing any product photo:
//   node scripts/build-product-image-variants.mjs
// Estimate the total size without writing to the repo:
//   node scripts/build-product-image-variants.mjs --sample 20 --out /tmp/variants
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadProductImageWinners } from "./lib/product-image-winners.mjs";

export const VARIANT_WIDTHS = [160, 320, 640, 960, 1280];
const QUALITY = 80;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "src/lib/product-image-variants.json");

const args = process.argv.slice(2);
const sampleSize = args.includes("--sample") ? Number(args[args.indexOf("--sample") + 1]) : 0;
const outDir = args.includes("--out")
  ? path.resolve(args[args.indexOf("--out") + 1])
  : path.join(root, "public/img/v");

const winners = await loadProductImageWinners(root);
const missing = winners.filter((w) => !w.file || !existsSync(w.file));
if (missing.length) {
  console.error(
    `Sin archivo local para ${missing.length} SKU(s):`,
    missing.map((w) => w.sku).join(", "),
  );
  process.exit(1);
}

const bySource = new Map();
for (const winner of winners) {
  if (!bySource.has(winner.file)) bySource.set(winner.file, []);
  bySource.get(winner.file).push(winner.sku);
}
let sources = [...bySource.keys()].sort();
if (sampleSize) {
  const step = sources.length / sampleSize;
  sources = Array.from({ length: sampleSize }, (_, i) => sources[Math.floor(i * step)]);
}

mkdirSync(outDir, { recursive: true });
const manifest = {};
const written = new Set();
let generated = 0;
let sourceBytes = 0;
let variantBytes = 0;

for (const file of sources) {
  const buffer = readFileSync(file);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const hash = sha256.slice(0, 12);
  const meta = await sharp(buffer).metadata();
  // EXIF orientations 5–8 swap the displayed width and height.
  const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  const widths = VARIANT_WIDTHS.filter((w) => w <= width);
  sourceBytes += buffer.length;

  for (const w of widths) {
    const name = `${hash}-${w}.webp`;
    const target = path.join(outDir, name);
    written.add(name);
    if (!existsSync(target)) {
      await sharp(buffer)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(target);
      generated++;
    }
    variantBytes += statSync(target).size;
  }
  for (const sku of bySource.get(file)) {
    manifest[sku] = { file: path.relative(root, file), sha256, hash, widths };
  }
}

const mb = (n) => (n / 1e6).toFixed(1);
if (sampleSize) {
  const total = bySource.size;
  console.log(
    `Muestra de ${sources.length} fotos: originales ${mb(sourceBytes)} MB, variantes ${mb(variantBytes)} MB. ` +
      `Proyección para ${total} fotos: ${mb((variantBytes / sources.length) * total)} MB.`,
  );
  process.exit(0);
}

// Drop variants that no SKU uses any more (e.g. after a photo was replaced).
let removed = 0;
for (const name of readdirSync(outDir)) {
  if (name.endsWith(".webp") && !written.has(name)) {
    rmSync(path.join(outDir, name));
    removed++;
  }
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((sku) => [sku, manifest[sku]]),
);
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(
  `${Object.keys(sorted).length} SKUs, ${written.size} variantes (${generated} nuevas, ${removed} eliminadas), ` +
    `${mb(variantBytes)} MB frente a ${mb(sourceBytes)} MB de originales.`,
);
