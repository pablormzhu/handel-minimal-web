import { createFileRoute } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { brands } from "@/lib/catalog";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros · Handel" },
      {
        name: "description",
        content:
          "Handel es una empresa especializada en la distribución de reactivos, materiales y equipos para diagnóstico clínico y laboratorio.",
      },
      { property: "og:title", content: "Nosotros · Handel" },
      {
        property: "og:description",
        content: "Especialización y acompañamiento técnico en diagnóstico y laboratorio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nosotros,
});

function Nosotros() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-28">
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Especialistas en diagnóstico y laboratorio.
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <img
          src={hero}
          alt="Laboratorio de diagnóstico"
          loading="lazy"
          width={1920}
          height={1088}
          className="aspect-[16/7] w-full rounded-3xl object-cover"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Quiénes somos
            </h2>
            <p className="mt-5 text-xl leading-relaxed">
              Acompañamos a laboratorios clínicos, hospitales e instituciones con un portafolio
              seleccionado y asesoría técnica cercana.
            </p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Qué hacemos</h2>
            <ul className="mt-5 space-y-3 text-xl leading-relaxed">
              <li>Reactivos</li>
              <li>Materiales</li>
              <li>Equipos y soluciones</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">Socios comerciales</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.slice(0, 10).map((b) => (
              <span key={b} className="text-lg font-medium tracking-tight text-muted-foreground">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Hablemos de tu laboratorio." action="Contactar a un asesor" />
    </Page>
  );
}
