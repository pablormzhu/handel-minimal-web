import type { ImgHTMLAttributes } from "react";

type SiteImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** The page's main image (LCP): loads eagerly with high fetch priority. */
  priority?: boolean;
};

/** Plain <img> with responsive sources and priority handled in one place. */
export function SiteImage({ priority, loading, srcSet, sizes, alt, ...props }: SiteImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={priority ? "eager" : loading}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
