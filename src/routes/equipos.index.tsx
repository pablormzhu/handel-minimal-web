import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BackLink } from "@/components/site/BackLink";
import { CtaBand, Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { equipment } from "@/lib/equipment";
import nihonKohdenLogo from "@/assets/equipos/nihon-kohden-logo-transparent.png";

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
  const featuredEquipment = equipment[0];
  if (!featuredEquipment) return null;

  return (
    <Page>
      <section className="relative min-h-[72vh] overflow-hidden bg-primary">
        <img src={featuredEquipment.image} alt="Analizador Celltac G+ MEK-9200" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/10" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-6 py-20 text-primary-foreground">
          <BackLink to="/">Regresar al inicio</BackLink>
          <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="mt-10 h-9 w-auto max-w-[220px] object-contain brightness-0 invert sm:h-10" />
          <p className="mt-8 text-xs font-medium uppercase text-primary-foreground/60">Analizadores hematológicos</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.06] sm:text-6xl">Precisión que acompaña cada decisión clínica.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/75">Tecnología de Nihon Kohden para laboratorios que buscan resultados confiables y flujos de trabajo eficientes.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 grid gap-5 border-b border-border pb-7 md:grid-cols-2 md:items-end">
          <h2 className="text-3xl font-semibold sm:text-5xl">Familia Celltac</h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground md:justify-self-end">Cuatro plataformas para diferentes necesidades de rendimiento y complejidad analítica.</p>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {equipment.map((item) => (
            <article key={item.slug} className="group">
              <Link to="/equipos/$modelo" params={{ modelo: item.slug }} className="block">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-primary">
                  <img src={item.image} alt={`${item.name} ${item.model}`} width={1920} height={640} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
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