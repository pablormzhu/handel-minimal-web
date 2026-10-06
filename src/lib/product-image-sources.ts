import variants from "virtual:product-image-variants";
import { productImage } from "@/lib/product-images";

type ProductImageInput = Parameters<typeof productImage>[0];

/** `sizes` for the 1/2/3-column product card grids inside the max-w-6xl px-6 container. */
export const PRODUCT_GRID_SIZES =
  "(min-width: 1152px) 352px, (min-width: 1024px) calc((100vw - 96px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 48px)";

/**
 * The photo productImage() picks for a SKU plus, when its pre-generated WebP
 * variants still match that exact file, a srcSet for them. Otherwise only the
 * original photo is returned.
 */
export function productImageSources(product: ProductImageInput): { src: string; srcSet?: string } {
  const src = productImage(product);
  const entry = product.sku ? variants[product.sku] : undefined;
  if (!entry || entry[0] !== src) return { src };
  const [, hash, widths] = entry;
  return { src, srcSet: widths.map((w) => `/img/v/${hash}-${w}.webp ${w}w`).join(", ") };
}
