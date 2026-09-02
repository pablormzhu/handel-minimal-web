import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { brands } from "@/lib/catalog";
import patchesLogo from "@/assets/patches-logo.png.asset.json";


export const Route = createFileRoute("/marcas")({
  head: () => ({
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
    ],
  }),
  component: Marcas,
});

function Marcas() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Marcas</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Trabajamos con fabricantes especializados. La navegación principal sigue siendo por
          familia; las marcas son una segunda ruta de descubrimiento.
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
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {catalogBrands
            .filter((b) => b.name !== "PATCHES")
            .map((b) => (
              <Link
                key={b.slug}
                to="/marca/$marca"
                params={{ marca: b.slug }}
                className="flex h-32 flex-col items-center justify-center gap-1 bg-background px-4 text-center text-base font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              >
                {b.name}
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground/70">
                  {b.count} productos
                </span>
              </Link>
            ))}
        </div>
      </section>


      <CtaBand title="¿Buscas una marca en particular?" action="Hablar con un asesor" />
    </Page>
  );
}
