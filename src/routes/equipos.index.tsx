import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BackLink } from "@/components/site/BackLink";
import { CtaBand, Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { equipment } from "@/lib/equipment";
import nihonKohdenLogo from "@/assets/nihon-kohden-logo.png.asset.json";

export const Route = createFileRoute("/equipos/")({
  head: () => ({
    meta: [
      { title: "Equipos Nihon Kohden | Handel" },
      { name: "description", content: "Analizadores hematológicos Nihon Kohden para laboratorios clínicos, disponibles con asesoría especializada de Handel." },
      { property: "og:title", content: "Equipos Nihon Kohden | Handel" },
      { property: "og:description", content: "Conoce los analizadores hematológicos Nihon Kohden distribuidos por Handel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EquipmentPage,
});

function EquipmentPage() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-24">
        <BackLink to="/">Regresar al inicio</BackLink>
        <p className="mt-5 text-sm uppercase text-muted-foreground">Equipos de diagnóstico</p>
        <img src={nihonKohdenLogo.url} alt="Nihon Kohden" width={617} height={316} className="mt-7 h-14 w-auto object-contain sm:h-16" />
        <h1 className="mt-9 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] sm:text-6xl">
          Tecnología hematológica para decisiones clínicas confiables.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Soluciones automatizadas para laboratorios de distintos tamaños, desde análisis de rutina hasta diferenciales avanzados y reticulocitos.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {equipment.map((item) => (
            <article key={item.slug} className="group border-t border-border pt-5">
              <Link to="/equipos/$modelo" params={{ modelo: item.slug }} className="block">
                <div className="aspect-[3/2] overflow-hidden bg-muted">
                  <img src={item.image} alt={`${item.name} ${item.model}`} width={1920} height={640} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold text-accent">{item.model}</p>
                    <h2 className="mt-1 text-2xl font-semibold">{item.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.category}</p>
                  </div>
                  <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CtaBand title="¿Qué equipo necesita tu laboratorio?" action="Recibir asesoría" />
    </Page>
  );
}