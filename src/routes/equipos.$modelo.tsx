import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Gauge, TestTube } from "lucide-react";
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
      <section className="bg-background">
        <div className="mx-auto grid min-h-[68vh] max-w-7xl lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div className="flex min-w-0 flex-col justify-between px-6 py-12 lg:px-12">
            <BackLink to="/equipos">Regresar a equipos</BackLink>
            <div className="pb-5 pt-16 lg:pt-10">
              <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-8 w-auto max-w-full object-contain" />
              <p className="mt-8 text-sm font-semibold text-accent">{item.model}</p>
              <h1 className="mt-2 text-5xl font-semibold leading-none sm:text-7xl">{item.name}</h1>
              <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">{item.category}</p>
            </div>
          </div>
          <div className="min-h-[360px] overflow-hidden bg-secondary lg:min-h-full">
            <img src={item.image} alt={`${item.name} ${item.model}`} width={1600} height={1000} className="h-full w-full object-contain" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-medium uppercase text-muted-foreground">Descripción general</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">Diseñado para un análisis confiable y eficiente.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.summary}</p>
          <Button asChild size="lg" className="mt-8 rounded-full px-6">
            <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>

        <div className="border-t border-border">
          <div className="flex items-center gap-2 py-6">
            <Gauge className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Características principales</h2>
          </div>
          <ul className="divide-y divide-border">
            {item.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-4 py-5 text-base leading-7 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{highlight}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex items-center gap-2 border-b border-border pb-5">
            <TestTube className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Datos técnicos</h2>
          </div>
          <dl className="divide-y divide-border">
            {item.specifications.map((specification) => (
              <div key={specification.label} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-6">
                <dt className="text-sm text-muted-foreground">{specification.label}</dt>
                <dd className="text-sm font-semibold">{specification.value}</dd>
              </div>
            ))}
          </dl>
          <a href={item.source} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
            Consultar información del fabricante <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <CtaBand title={`¿Quieres cotizar el ${item.model}?`} action="Hablar con un asesor" />
    </Page>
  );
}