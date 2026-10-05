import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
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
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
          <BackLink to="/equipos">Regresar a equipos</BackLink>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-7 w-auto max-w-full object-contain sm:h-8" />
              <p className="mt-7 text-xs font-semibold text-accent">{item.model}</p>
              <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">{item.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{item.category}</p>
            </div>
            <Button asChild size="lg" className="w-fit rounded-lg px-6">
              <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[42vw] min-h-[300px] max-h-[620px] w-full overflow-hidden bg-secondary">
          <img src={item.image} alt={`${item.name} ${item.model}`} width={1600} height={1000} className="h-full w-full object-cover object-center" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase text-accent">Descripción general</p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight">Análisis confiable y eficiente.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{item.summary}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase text-accent">Características</h2>
            <ol className="mt-5 space-y-5">
              {item.highlights.map((highlight, index) => (
                <li key={highlight} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">0{index + 1}</span><span>{highlight}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase text-accent">Datos técnicos</h2>
            <dl className="mt-3">
              {item.specifications.map((specification) => (
                <div key={specification.label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5 border-b border-border py-3">
                  <dt className="text-xs leading-5 text-muted-foreground">{specification.label}</dt>
                  <dd className="text-right text-sm font-semibold leading-5">{specification.value}</dd>
                </div>
              ))}
            </dl>
            <a href={item.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              Información del fabricante <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <CtaBand title={`¿Quieres cotizar el ${item.model}?`} action="Hablar con un asesor" />
    </Page>
  );
}