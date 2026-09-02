import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { getFamily, productsByFamily, ownBrandFirst, OWN_BRAND } from "@/lib/catalog";

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
    return {
      meta: [
        { title: `${name} · Handel` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} · Handel` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FamiliaPage,
});

function FamiliaPage() {
  const params = Route.useParams();
  const family = getFamily(params.familia)!;
  const all = ownBrandFirst(productsByFamily(family.slug));
  const [sub, setSub] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  const brandOptions = Array.from(new Set(all.map((p) => p.brand)));

  const list = all.filter(
    (p) => (!sub || p.subfamily === sub) && (!brand || p.brand === brand),
  );

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
          <button
            onClick={() => setSub(null)}
            className={`whitespace-nowrap text-[13px] transition-colors ${!sub ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Todo
          </button>
          {family.subfamilies.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={`whitespace-nowrap text-[13px] transition-colors ${sub === s ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
            <button
              onClick={() => setBrand(null)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${!brand ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}
            >
              Todas
            </button>
            {brandOptions.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${brand === b ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <div className="divide-y divide-border border-y border-border">
          {list.map((p) => (
            <Link
              key={p.slug}
              to="/producto/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-10"
            >
              <div className="w-full shrink-0 overflow-hidden rounded-2xl bg-muted/50 sm:w-52">
                <img
                  src={family.image}
                  alt={p.name}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {p.brand}
                  {p.brand === OWN_BRAND && (
                    <span className="text-[10px] font-medium uppercase tracking-widest text-red-600">
                      Marca propia
                    </span>
                  )}
                </p>

                <h2 className="mt-2 text-2xl font-medium tracking-tight">{p.name}</h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">{p.description}</p>
              </div>
              <span className="text-sm text-primary">Ver producto</span>
            </Link>
          ))}
          {list.length === 0 && (
            <p className="py-10 text-sm text-muted-foreground">
              No hay productos publicados con estos filtros.
            </p>
          )}
        </div>
      </section>

      <CtaBand title="¿Necesitas asesoría técnica?" action="Solicitar información" />
    </Page>
  );
}
