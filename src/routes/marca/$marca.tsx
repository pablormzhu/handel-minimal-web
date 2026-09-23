import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { brandBySlug, productsByBrand } from "@/lib/brand-catalog";
import { productImage } from "@/lib/product-images";
import { productDisplayInfo } from "@/lib/format-product";



export const Route = createFileRoute("/marca/$marca")({
  loader: ({ params }) => {
    const brand = brandBySlug(params.marca);
    if (!brand) throw notFound();
    return { marca: brand.slug };
  },
  head: ({ params }) => {
    const brand = brandBySlug(params.marca);
    const name = brand?.name ?? "Marca";
    const title = `${name} · Marcas · Handel`;
    const desc = `Catálogo de productos ${name} distribuidos por Handel: clave, descripción y características técnicas.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MarcaPage,
});

function MarcaPage() {
  const params = Route.useParams();
  const brand = brandBySlug(params.marca)!;
  const all = productsByBrand(brand.name);
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const list = term
    ? all.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
    : all;

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-24">
        <BackLink to="/marcas">Todas las marcas</BackLink>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{brand.name}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {all.length} {all.length === 1 ? "producto" : "productos"} disponibles bajo esta marca.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o clave"
          className="mt-8 w-full max-w-md rounded-full border border-border/50 bg-background/60 px-5 py-3 text-sm shadow-sm backdrop-blur-xl outline-none placeholder:text-muted-foreground focus:border-foreground/40"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const info = productDisplayInfo(p);
            return (
            <Link
              key={p.slug}
              to="/marca/$marca/producto/$producto"
              params={{ marca: brand.slug, producto: p.slug }}
              className="flex flex-col overflow-hidden rounded-3xl border border-border/30 bg-background/50 shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="aspect-square w-full overflow-hidden bg-muted/30">
                <img
                  src={productImage(p)}
                  alt={info.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
                  Clave {p.sku} <span className="text-muted-foreground/60">·</span> {p.brand}
                </p>
                <h2 className="mt-2 text-base font-semibold leading-snug tracking-tight">
                  {info.title}
                </h2>
                {info.detail && <p className="mt-3 text-sm text-muted-foreground">{info.detail}</p>}
                <span className="mt-auto pt-5 text-sm font-medium text-foreground">Ver información</span>
              </div>

            </Link>
            );
          })}
        </div>
        {list.length === 0 && (
          <p className="py-10 text-sm text-muted-foreground">No encontramos productos con ese término.</p>
        )}
      </section>

      <CtaBand title="¿Necesitas cotizar productos de esta marca?" action="Solicitar información" />
    </Page>
  );
}
