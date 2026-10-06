import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { productDisplayInfo, normalizeSearch } from "@/lib/format-product";
import { Search } from "lucide-react";
import { Page, CtaBand } from "@/components/site/Page";
import { families } from "@/lib/catalog";
import { searchCatalog, siteBrands, productBrandName, siteProducts } from "@/lib/site-catalog";
import { productImage } from "@/lib/product-images";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/catalogo/")({
  head: () => {
    const seo = pageSeo("/catalogo");
    return {
      meta: [
        { title: "Catálogo · Handel" },
        {
          name: "description",
          content:
            "Biblioteca de soluciones Handel: seis familias de diagnóstico clínico, microbiología, control de calidad, muestras, consumibles y bioseguridad.",
        },
        { property: "og:title", content: "Catálogo · Handel" },
        {
          property: "og:description",
          content: "Explora el catálogo Handel por familia, subfamilia o marca.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...seo.meta,
      ],
      links: seo.links,
    };
  },
  component: Catalogo,
});

function Catalogo() {
  const [q, setQ] = useState("");
  const term = normalizeSearch(q);
  const results = term ? searchCatalog(q) : [];

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Catálogo</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Una biblioteca de soluciones organizada por necesidad clínica y de laboratorio.
        </p>

        <label htmlFor="catalog-search" className="sr-only">
          Buscar en el catálogo por producto, marca o clave
        </label>
        <div className="mt-10 flex max-w-xl items-center gap-3 rounded-full border border-border bg-muted/40 px-5 py-3 focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto, marca o clave"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {term
            ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"} de ${siteProducts.length} productos`
            : `${siteProducts.length} productos en catálogo`}
        </p>

        {term && (
          <div className="mt-6 max-w-3xl divide-y divide-border border-t border-border">
            {results.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                Sin resultados para «{q}». Escribe a un asesor y te ayudamos a encontrarlo.
              </p>
            )}
            {results.slice(0, 60).map((p) => {
              const info = productDisplayInfo(p);
              return (
                <Link
                  key={p.sku}
                  to="/marca/$marca/producto/$producto"
                  params={{ marca: p.brandSlug, producto: p.slug }}
                  className="flex items-center gap-5 py-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src={productImage(p)}
                      alt={info.title}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Clave {p.sku} · {productBrandName(p)}
                    </p>
                    <p className="text-base font-medium tracking-tight">{info.title}</p>
                    <p className="text-sm text-muted-foreground">Presentación: {info.presentation}</p>
                  </div>
                </Link>
              );
            })}
            {results.length > 60 && (
              <p className="py-5 text-sm text-muted-foreground">
                Mostrando 60 de {results.length}. Precisa tu búsqueda para ver más.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {families.map((f) => (
            <Link
              key={f.slug}
              to="/catalogo/$familia"
              params={{ familia: f.slug }}
              className="group"
            >
              <div className="overflow-hidden rounded-3xl bg-muted/50">
                <img
                  src={f.image}
                  alt={f.name}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight">{f.name}</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{f.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Explorar por marca</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {siteBrands.map((b) => (
              <Link
                key={b.slug}
                to={b.slug.toLowerCase() === "patches" ? "/patches" : "/marca/$marca"}
                params={{ marca: b.slug }}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="¿No encuentras lo que buscas?" action="Solicitar información" />
    </Page>
  );
}
