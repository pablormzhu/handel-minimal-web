import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

type ManifestEntry = { file: string; sha256: string; hash: string; widths: number[] };

const VIRTUAL_ID = "virtual:product-image-variants";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Exposes `virtual:product-image-variants`: for each SKU, the URL of the photo the
 * variants were generated from plus their hash and widths. Entries whose source file
 * changed or whose variant files are missing are left out with a warning, so the
 * page falls back to the original photo instead of showing a stale variant.
 */
export function productImageVariants(): Plugin {
  let root = process.cwd();
  return {
    name: "handel:product-image-variants",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const manifestPath = path.join(root, "src/lib/product-image-variants.json");
      this.addWatchFile(manifestPath);
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
        string,
        ManifestEntry
      >;
      const shaByFile = new Map<string, string | null>();
      const sha = (file: string) => {
        if (!shaByFile.has(file)) {
          const abs = path.join(root, file);
          shaByFile.set(
            file,
            existsSync(abs) ? createHash("sha256").update(readFileSync(abs)).digest("hex") : null,
          );
        }
        return shaByFile.get(file);
      };

      const imports: string[] = [];
      const entries: string[] = [];
      const stale: string[] = [];
      for (const [sku, entry] of Object.entries(manifest)) {
        const variantsExist = entry.widths.every((w) =>
          existsSync(path.join(root, "public/img/v", `${entry.hash}-${w}.webp`)),
        );
        if (sha(entry.file) !== entry.sha256 || !variantsExist) {
          stale.push(sku);
          continue;
        }
        let src: string;
        if (entry.file.startsWith("public/")) {
          src = JSON.stringify(entry.file.slice("public".length));
        } else {
          src = `i${imports.length}`;
          imports.push(`import ${src} from ${JSON.stringify(`/${entry.file}`)};`);
        }
        entries.push(
          `${JSON.stringify(sku)}:[${src},${JSON.stringify(entry.hash)},${JSON.stringify(entry.widths)}]`,
        );
      }
      if (stale.length) {
        this.warn(
          `${stale.length} SKU(s) sin variantes vigentes; usarán su foto original. ` +
            `Regenera con "node scripts/build-product-image-variants.mjs". Ej.: ${stale.slice(0, 5).join(", ")}`,
        );
      }
      return `${imports.join("\n")}\nexport default {${entries.join(",")}};\n`;
    },
  };
}
