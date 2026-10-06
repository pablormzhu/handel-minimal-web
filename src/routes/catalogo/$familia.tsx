import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { productDisplayInfo } from "@/lib/format-product";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { getFamily, ownBrandFirst, OWN_BRAND } from "@/lib/catalog";
import { siteProductsByFamily, productBrandName } from "@/lib/site-catalog";
import { productImageSources } from "@/lib/product-image-sources";
import { SiteImage } from "@/components/site/SiteImage";
import { useProgressiveList } from "@/hooks/use-progressive-list";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/catalogo/$familia")({
  loader: ({ params }) => {
    const family = getFamily(params.familia);
    if (!family) throw notFound();
    return { familia: family.slug };
  },
  head: ({ params }) => {
    const family = getFamily(params.familia);
    const name = family?.name ?? "Catálogo";
    const desc = family?.intro ?? "Catálogo Handel.";
    const seo = pageSeo(`/catalogo/${params.familia}`);
    return {
      meta: [
        { title: `${name} · Handel` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} · Handel` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...seo.meta,
      ],
      links: seo.links,
    };
  },
  component: FamiliaPage,
});

function FamiliaPage() {
  const params = Route.useParams();
  const family = getFamily(params.familia)!;
  const all = ownBrandFirst(siteProductsByFamily(family.slug));
  const [sub, setSub] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  // Only subfamilies that actually contain products; known order first.
  const present = new Set(all.map((p) => p.subfamily));
  const subfamilies = [
    ...family.subfamilies.filter((s) => present.has(s)),
    ...[...present].filter((s) => !family.subfamilies.includes(s)),
  ];
  const brandOptions = Array.from(new Set(all.map((p) => productBrandName(p)))).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );

  const list = all.filter(
    (p) => (!sub || p.subfamily === sub) && (!brand || productBrandName(p) === brand),
  );
  const { visible, hasMore, sentinelRef } = useProgressiveList(
    list,
    `${family.slug}|${sub ?? ""}|${brand ?? ""}`,
  );

  const pill = (active: boolean) =>
    `whitespace-nowrap rounded-sm text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`;

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-24">
        <BackLink to="/catalogo">Regresar al catálogo</BackLink>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {family.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{family.intro}</p>
      </section>

      <div className="sticky top-12 z-40 border-y border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 py-3">
          <button onClick={() => setSub(null)} aria-pressed={!sub} className={pill(!sub)}>
            Todo
          </button>
          {subfamilies.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              aria-pressed={sub === s}
              className={pill(sub === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-4 pt-12">
        {brandOptions.length > 1 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs uppercase tracking-widest text-muted-foreground">
              Marca
            </span>
            <button onClick={() => setBrand(null)} aria-pressed={!brand} className={chip(!brand)}>
              Todas
            </button>
            {brandOptions.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                aria-pressed={brand === b}
                className={chip(brand === b)}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <p className="mb-4 text-xs text-muted-foreground" aria-live="polite">
          {list.length} {list.length === 1 ? "producto" : "productos"}
        </p>

        <div className="divide-y divide-border border-y border-border">
          {visible.map((p) => {
            const info = productDisplayInfo(p);
            return (
              <Link
                key={p.sku}
                to="/marca/$marca/producto/$producto"
                params={{ marca: p.brandSlug, producto: p.slug }}
                className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-10"
              >
                <div className="aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-muted/30 sm:w-40">
                  <SiteImage
                    {...productImageSources(p)}
                    sizes="(min-width: 640px) 160px, calc(100vw - 48px)"
                    alt={info.title}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {productBrandName(p)}
                    {p.brand === OWN_BRAND && (
                      <span className="text-[10px] font-medium uppercase tracking-widest text-red-600">
                        Marca propia
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Clave {p.sku}</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight">{info.title}</h2>
                  <p className="mt-2 max-w-lg whitespace-pre-line text-sm text-muted-foreground">
                    {info.detail}
                  </p>
                </div>
                <span className="text-sm text-primary">Ver producto</span>
              </Link>
            );
          })}
          {list.length === 0 && (
            <p className="py-10 text-sm text-muted-foreground">
              No hay productos publicados con estos filtros.
            </p>
          )}
        </div>
        {hasMore && <div ref={sentinelRef} aria-hidden="true" />}
      </section>

      <CtaBand title="¿Necesitas asesoría técnica?" action="Solicitar información" />
    </Page>
  );
}
