declare module "virtual:product-image-variants" {
  /** SKU → [URL of the source photo, content hash, available widths]. */
  const variants: Record<string, readonly [src: string, hash: string, widths: readonly number[]]>;
  export default variants;
}
