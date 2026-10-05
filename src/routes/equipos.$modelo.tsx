import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ExternalLink, Gauge, TestTube } from "lucide-react";
import { BackLink } from "@/components/site/BackLink";
import { CtaBand, Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { equipmentBySlug } from "@/lib/equipment";
import nihonKohdenLogo from "@/assets/equipos/nihon-kohden-logo-transparent.png";

export const Route = createFileRoute("/equipos/$modelo")({
  loader: ({ params }) => {
    const item = equipmentBySlug(params.modelo);
    if (!item) throw notFound();
    return { model: item.model };
  },
  head: ({ params }) => {
    const item = equipmentBySlug(params.modelo);
    const title = item ? `${item.name} ${item.model} | Handel` : "Equipo Nihon Kohden | Handel";
    const description = item?.summary ?? "Información de equipos Nihon Kohden distribuidos por Handel.";
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: EquipmentDetailPage,
});

function EquipmentDetailPage() {
  const { modelo } = Route.useParams();
  const item = equipmentBySlug(modelo);
  if (!item) return null;

  return (
    <Page>
      <section className="bg-secondary/60 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          <div className="grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
            <div className="flex min-w-0 flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
              <BackLink to="/equipos">Regresar a equipos</BackLink>
              <div className="mt-12 lg:mt-20">
                <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-8 w-auto max-w-full object-contain sm:h-9" />
                <p className="mt-7 inline-flex rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">{item.model}</p>
                <h1 className="mt-4 text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">{item.name}</h1>
                <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">{item.category}</p>
              </div>
              <Button asChild size="lg" className="mt-10 w-fit rounded-lg px-6 lg:mt-auto">
                <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-t border-border bg-secondary p-5 sm:min-h-[480px] sm:p-8 lg:min-h-[620px] lg:border-l lg:border-t-0 lg:p-10">
              <img src={item.image} alt={`${item.name} ${item.model}`} width={1600} height={1000} className="relative z-10 h-full max-h-[560px] w-full object-contain transition-transform duration-700 ease-out hover:scale-[1.015]" />
              <div className="absolute bottom-5 right-5 z-20 rounded-lg border border-border bg-background/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:bottom-8 sm:right-8">
                <p className="text-xs text-muted-foreground">Equipo</p>
                <p className="mt-0.5 text-sm font-semibold">{item.model}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 border-t border-border bg-secondary/35 px-6 py-10 sm:px-10 lg:grid-cols-3 lg:gap-12 lg:px-14 lg:py-14">
            <div>
              <p className="text-xs font-semibold uppercase text-accent">Descripción general</p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight">Análisis confiable y eficiente.</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{item.summary}</p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="text-xs font-semibold uppercase text-accent">Características</h2>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 py-3 first:pt-0 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="text-xs font-semibold uppercase text-accent">Datos técnicos</h2>
              </div>
              <dl className="mt-4 overflow-hidden rounded-lg border border-border bg-background px-4">
                {item.specifications.map((specification) => (
                  <div key={specification.label} className="grid gap-1 border-b border-border py-3 last:border-b-0">
                    <dt className="text-xs text-muted-foreground">{specification.label}</dt>
                    <dd className="text-sm font-semibold leading-5">{specification.value}</dd>
                  </div>
                ))}
              </dl>
              <a href={item.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                Información del fabricante <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title={`¿Quieres cotizar el ${item.model}?`} action="Hablar con un asesor" />
    </Page>
  );
}