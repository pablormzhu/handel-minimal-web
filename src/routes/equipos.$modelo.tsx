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
      {/* Escenario: la foto completa se funde con un fondo de su mismo tono */}
      <section className="bg-stage">
        <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 sm:pt-10 lg:px-10">
          <BackLink to="/equipos">Regresar a equipos</BackLink>
        </div>
        <div className="mx-auto grid max-w-7xl items-end gap-4 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:px-10">
          <div className="pt-10 sm:pt-14 lg:self-center lg:pb-16 lg:pt-8">
            <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-7 w-auto max-w-full object-contain sm:h-8" />
            <p className="mt-10 text-sm font-semibold uppercase text-accent">{item.model}</p>
            <h1 className="mt-3 text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">{item.name}</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">{item.category}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <a href={item.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                Ficha del fabricante <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="-mx-5 sm:-mx-8 lg:mx-0">
            <img
              src={item.image}
              alt={`${item.name} ${item.model}`}
              width={1264}
              height={848}
              className="photo-stage-blend block h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Cifras clave */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase text-muted-foreground">En cifras</p>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {item.specifications.slice(0, 4).map((specification) => (
              <div key={specification.label}>
                <dd className="text-3xl font-semibold leading-tight sm:text-4xl">{specification.value}</dd>
                <dt className="mt-3 text-sm leading-6 text-muted-foreground">{specification.label}</dt>
              </div>
            ))}
          </dl>
          {item.specifications.length > 4 && (
            <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {item.specifications.slice(4).map((specification) => (
                <div key={specification.label}>
                  <dd className="text-3xl font-semibold leading-tight sm:text-4xl">{specification.value}</dd>
                  <dt className="mt-3 text-sm leading-6 text-muted-foreground">{specification.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Descripción y tecnología */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">Descripción</p>
            <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">{item.summary}</h2>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-accent">Tecnología</p>
            <ul className="mt-6 space-y-6">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-4 text-lg leading-8 text-foreground">
                  <span aria-hidden="true" className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-foreground px-5 py-16 text-center text-background sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase text-background/60">Nihon Kohden · {item.model}</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">Optimiza tu laboratorio con el {item.model}</h2>
          <Button asChild size="lg" variant="secondary" className="mt-9 rounded-full px-8">
            <Link to="/contacto">Hablar con un asesor <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>
    </Page>
  );
}
