// Current public domain. Replace only when the client supplies its own domain.
export const SITE_URL = "https://handel-minimal-web.lovable.app";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-nosotros-wide-v2.webp`;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Canonical, og:url and absolute og/twitter image for a public route. */
export function pageSeo(path: string, image: string = DEFAULT_OG_IMAGE) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  return {
    meta: [
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
