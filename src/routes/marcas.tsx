import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, CtaBand } from "@/components/site/Page";
import { normalizeSearch } from "@/lib/format-product";
import { siteBrands } from "@/lib/site-catalog";
import { pageSeo } from "@/lib/seo";
import patchesLogo from "@/assets/patches-logo.png.asset.json";
import nihonKohdenLogo from "@/assets/equipos/nihon-kohden-logo-transparent.png";


export const Route = createFileRoute("/marcas")({
  head: () => {
    const seo = pageSeo("/marcas");
    return {
      meta: [
        { title: "Marcas · Handel" },
        {
          name: "description",
          content:
            "Handel representa marcas líderes en diagnóstico y laboratorio: SNIBE Diagnostic, MCD Lab, QCA, Nihon Kohden, Copan y más.",
        },
        { property: "og:title", content: "Marcas · Handel" },
        {
          property: "og:description",
          content: "Portafolio de socios comerciales en diagnóstico clínico y laboratorio.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...seo.meta,
      ],
      links: seo.links,
    };
  },
  component: Marcas,
});

function Marcas() {
  const [q, setQ] = useState("");
  const term = normalizeSearch(q);
  const visible = siteBrands.filter(
    (b) => b.name !== "PATCHES" && (!term || normalizeSearch(b.name).includes(term)),
  );
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Marcas</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Distribuimos {siteBrands.length} marcas de fabricantes especializados en diagnóstico
          clínico, microbiología, consumibles y material médico.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Link
          to="/patches"
          className="group flex flex-col items-center gap-6 rounded-3xl border border-border/30 bg-background/50 px-8 py-10 text-center shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <img
              src={patchesLogo.url}
              alt="PATCHES, marca propia de Handel"
              loading="lazy"
              width={600}
              height={120}
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Conoce nuestra marca
              </p>
              <p className="mt-2 text-lg font-medium tracking-tight">
                PATCHES, nuestra marca propia de curación y protección.
              </p>
            </div>
          </div>
          <span className="text-sm text-primary underline-offset-4 group-hover:underline">
            Descubrir PATCHES
          </span>
        </Link>

        <Link
          to="/equipos"
          className="group mt-6 flex flex-col items-center gap-6 rounded-3xl border border-border/30 bg-background/50 px-8 py-10 text-center shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <img
              src={nihonKohdenLogo}
              alt="Nihon Kohden"
              loading="lazy"
              width={499}
              height={66}
              className="h-9 w-auto object-contain sm:h-10"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Equipos de hematología
              </p>
              <p className="mt-2 text-lg font-medium tracking-tight">
                Nihon Kohden, analizadores Celltac para conteo celular completo y diferencial.
              </p>
            </div>
          </div>
          <span className="text-sm text-primary underline-offset-4 group-hover:underline">
            Descubrir Nihon Kohden
          </span>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <label htmlFor="brand-search" className="text-sm font-medium">
          Buscar marca
        </label>
        <input
          id="brand-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre de la marca"
          className="mb-3 mt-2 block w-full max-w-md rounded-full border border-border/50 bg-background/60 px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="mb-6 text-xs text-muted-foreground" aria-live="polite">
          {visible.length} de {siteBrands.length} marcas
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((b) => (
            <Link
              key={b.slug}
              to={b.slug.toLowerCase() === "patches" ? "/patches" : "/marca/$marca"}
              params={{ marca: b.slug }}
              className="flex h-32 flex-col items-center justify-center gap-1 bg-background px-4 text-center text-base font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {b.name}
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground/70">
                {b.count} {b.count === 1 ? "producto" : "productos"}
              </span>
            </Link>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="py-8 text-sm text-muted-foreground">No encontramos una marca con ese nombre.</p>
        )}
      </section>


      <CtaBand title="¿Buscas una marca en particular?" action="Hablar con un asesor" />
    </Page>
  );
}
