import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { BackLink } from "@/components/site/BackLink";
import { Page } from "@/components/site/Page";
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
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-7 sm:px-8 sm:pb-14 sm:pt-10 lg:px-10 lg:pb-16">
          <BackLink to="/equipos">Regresar a equipos</BackLink>
          <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-8 w-auto max-w-full object-contain sm:h-10" />
              <div className="mt-9 border-l-2 border-accent pl-4">
                <p className="text-xs font-semibold uppercase text-accent">{item.model}</p>
                <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">{item.name}</h1>
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{item.category}</p>
            </div>
            <Button asChild size="lg" className="group w-fit rounded-none px-7">
              <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[72vw] min-h-[300px] max-h-[640px] w-full overflow-hidden bg-secondary sm:h-[50vw] lg:h-[34vw]">
          <img src={item.image} alt={`${item.name} ${item.model}`} width={1600} height={1000} className="h-full w-full object-cover object-center" />
          <div className="absolute bottom-7 left-5 text-foreground sm:bottom-10 sm:left-8 lg:left-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Equipo hematológico</p>
            <p className="mt-1 text-3xl font-semibold sm:text-4xl">{item.model}</p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-12 lg:gap-16 lg:px-10 lg:py-24">
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase text-accent">01 / Descripción</p>
            <h2 className="mt-7 text-3xl font-semibold leading-tight">Precisión en cada análisis.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.summary}</p>
          </div>

          <div className="md:col-span-5">
            <h2 className="text-xs font-semibold uppercase text-accent">02 / Tecnología</h2>
            <ol className="mt-7 space-y-7">
              {item.highlights.map((highlight, index) => (
                <li key={highlight} className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-border pb-5 text-sm leading-6 text-foreground">
                  <span className="font-semibold text-muted-foreground transition-colors group-hover:text-accent">0{index + 1}</span><span>{highlight}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase text-accent">03 / Datos técnicos</h2>
            <dl className="mt-7 space-y-6">
              {item.specifications.map((specification) => (
                <div key={specification.label}>
                  <dt className="text-xs font-semibold uppercase leading-5 text-muted-foreground">{specification.label}</dt>
                  <dd className="mt-1 text-lg font-semibold leading-6">{specification.value}</dd>
                </div>
              ))}
            </dl>
            <a href={item.source} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-accent">
              Información del fabricante <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-foreground px-5 py-16 text-center text-background sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase text-background/60">Nihon Kohden · {item.model}</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">Optimiza tu laboratorio con el {item.model}</h2>
          <Button asChild size="lg" variant="secondary" className="mt-9 rounded-none px-8">
            <Link to="/contacto">Hablar con un asesor <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>
    </Page>
  );
}