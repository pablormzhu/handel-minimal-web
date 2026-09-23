import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Gauge, TestTube } from "lucide-react";
import { BackLink } from "@/components/site/BackLink";
import { CtaBand, Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { equipmentBySlug } from "@/lib/equipment";
import nihonKohdenLogo from "@/assets/nihon-kohden-logo.png.asset.json";

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
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-24">
        <BackLink to="/equipos">Regresar a equipos</BackLink>
        <div className="mt-8 overflow-hidden bg-muted">
          <img src={item.image} alt={`${item.name} ${item.model}`} width={1920} height={640} className="aspect-[3/2] w-full object-cover sm:aspect-[16/7]" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <img src={nihonKohdenLogo.url} alt="Nihon Kohden" width={617} height={316} className="h-9 w-auto object-contain" />
          <p className="mt-8 text-sm font-semibold text-accent">{item.model}</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-6xl">{item.name}</h1>
          <p className="mt-4 text-lg font-medium leading-7">{item.category}</p>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.summary}</p>
          <Button asChild size="lg" className="mt-8 rounded-full px-6">
            <Link to="/contacto">Solicitar información <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Gauge className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Características principales</h2>
          </div>
          <ul className="divide-y divide-border">
            {item.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 py-4 text-sm leading-6 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{highlight}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-2 border-b border-border pb-4">
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