import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Page, CtaBand } from "@/components/site/Page";
import { families, products, brands } from "@/lib/catalog";

export const Route = createFileRoute("/catalogo/")({
  head: () => ({
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
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter((p) =>
        [p.name, p.brand, p.sku, p.subfamily, p.description]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : [];

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Catálogo</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Una biblioteca de soluciones organizada por necesidad clínica y de laboratorio.
        </p>

        <div className="glass mt-10 flex max-w-xl items-center gap-3 rounded-full px-5 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto, marca o aplicación"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {term && (
          <div className="mt-8 max-w-2xl divide-y divide-border border-t border-border">
            {results.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                Sin resultados. Escribe a un asesor y te ayudamos a encontrarlo.
              </p>
            )}
            {results.map((p) => (
              <Link
                key={p.slug}
                to="/producto/$slug"
                params={{ slug: p.slug }}
                className="block py-5"
              >
                <p className="text-base font-medium tracking-tight">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {p.brand} · {p.subfamily}
                </p>
              </Link>
            ))}
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
            {brands.map((b) => (
              <Link
                key={b}
                to="/marcas"
                className="glass rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="¿No encuentras lo que buscas?" action="Solicitar información" />
    </Page>
  );
}
