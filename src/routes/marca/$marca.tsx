import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { brandBySlug } from "@/lib/brand-catalog";
import { siteProductsByBrand, productBrandName, searchCatalog } from "@/lib/site-catalog";
import { pageSeo } from "@/lib/seo";
import { PRODUCT_GRID_SIZES, productImageSources } from "@/lib/product-image-sources";
import { SiteImage } from "@/components/site/SiteImage";
import { useProgressiveList } from "@/hooks/use-progressive-list";
import { productDisplayInfo, brandDisplayName, normalizeSearch } from "@/lib/format-product";

export const Route = createFileRoute("/marca/$marca")({
  loader: ({ params }) => {
    const brand = brandBySlug(params.marca);
    if (!brand) throw notFound();
    return { marca: brand.slug };
  },
  head: ({ params }) => {
    const brand = brandBySlug(params.marca);
    const name = brand ? brandDisplayName(brand.name) : "Marca";
    const title = `${name} · Marcas · Handel`;
    const seo = pageSeo(`/marca/${params.marca}`);
    const desc = `Catálogo de productos ${name} distribuidos por Handel: clave, descripción y características técnicas.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...seo.meta,
      ],
      links: seo.links,
    };
  },
  component: MarcaPage,
});

function MarcaPage() {
  const params = Route.useParams();
  const brand = brandBySlug(params.marca)!;
  const all = siteProductsByBrand(brand.name);
  const [q, setQ] = useState("");

  const term = normalizeSearch(q);
  const list = term ? searchCatalog(q, all) : all;
  const { visible, hasMore, sentinelRef } = useProgressiveList(list, `${brand.slug}|${term}`);

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-24">
        <BackLink to="/marcas">Todas las marcas</BackLink>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          {brandDisplayName(brand.name)}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {all.length} {all.length === 1 ? "producto" : "productos"} disponibles bajo esta marca.
        </p>
        <label htmlFor="brand-product-search" className="sr-only">
          Buscar por nombre o clave
        </label>
        <input
          id="brand-product-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o clave"
          className="mt-8 w-full max-w-md rounded-full border border-border/50 bg-background/60 px-5 py-3 text-sm shadow-sm backdrop-blur-xl outline-none placeholder:text-muted-foreground focus:border-foreground/40"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const info = productDisplayInfo(p);
            return (
              <Link
                key={p.sku}
                to="/marca/$marca/producto/$producto"
                params={{ marca: p.brandSlug, producto: p.slug }}
                className="flex flex-col overflow-hidden rounded-3xl border border-border/30 bg-background/50 shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl"
              >
                <div className="aspect-square w-full overflow-hidden bg-muted/30">
                  <SiteImage
                    {...productImageSources(p)}
                    sizes={PRODUCT_GRID_SIZES}
                    alt={info.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
                    Clave {p.sku} <span className="text-muted-foreground/60">·</span>{" "}
                    {productBrandName(p)}
                  </p>
                  <h2 className="mt-2 text-base font-semibold leading-snug tracking-tight">
                    {info.title}
                  </h2>
                  {info.detail && (
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {info.detail}
                    </p>
                  )}
                  <span className="mt-auto pt-5 text-sm font-medium text-foreground">
                    Ver información
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        {hasMore && <div ref={sentinelRef} aria-hidden="true" />}
        {list.length === 0 && (
          <p className="py-10 text-sm text-muted-foreground">
            No encontramos productos con ese término.
          </p>
        )}
      </section>

      <CtaBand title="¿Necesitas cotizar productos de esta marca?" action="Solicitar información" />
    </Page>
  );
}
