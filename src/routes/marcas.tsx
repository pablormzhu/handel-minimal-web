import { createFileRoute } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { brands } from "@/lib/catalog";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas · Handel" },
      {
        name: "description",
        content:
          "Handel representa marcas líderes en diagnóstico y laboratorio: BD, SNIBE Diagnostic, Bio-Rad, MCD Lab, QCA y más.",
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

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => (
            <div
              key={b}
              className="flex h-32 items-center justify-center bg-background px-4 text-center text-base font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="¿Buscas una marca en particular?" action="Hablar con un asesor" />
    </Page>
  );
}
