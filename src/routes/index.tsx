import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { families, brands } from "@/lib/catalog";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Handel · Soluciones para diagnóstico y laboratorio" },
      {
        name: "description",
        content:
          "Handel distribuye reactivos, materiales y equipos para diagnóstico clínico y laboratorio. Explora el catálogo por familia o habla con un asesor.",
      },
      { property: "og:title", content: "Handel · Soluciones para diagnóstico y laboratorio" },
      {
        property: "og:description",
        content:
          "Catálogo especializado en diagnóstico clínico, microbiología, control de calidad y consumibles de laboratorio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const destacadas = families.filter((f) =>
  ["diagnostico-clinico", "microbiologia", "toma-muestras"].includes(f.slug),
);

function Index() {
  return (
    <Page>
      <section className="relative">
        <img
          src={hero}
          alt="Tubos de ensayo en un laboratorio de diagnóstico"
          width={1920}
          height={1088}
          className="h-[72vh] w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Soluciones para diagnóstico y laboratorio.
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/catalogo"
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
              >
                Explorar catálogo
              </Link>
              <Link
                to="/contacto"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Contactar a un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-6 md:grid-cols-3">
          {destacadas.map((f) => (
            <Link
              key={f.slug}
              to="/catalogo/$familia"
              params={{ familia: f.slug }}
              className="group block overflow-hidden rounded-3xl bg-muted/50"
            >
              <img
                src={f.image}
                alt={f.name}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="px-7 pb-9 pt-7">
                <h3 className="text-xl font-semibold tracking-tight">{f.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.tagline}</p>
                <span className="mt-5 inline-block text-sm text-primary">Conocer más</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Explora nuestras familias
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f) => (
              <Link
                key={f.slug}
                to="/catalogo/$familia"
                params={{ familia: f.slug }}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl bg-muted/50">
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight">{f.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">Socios comerciales</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.slice(0, 8).map((b) => (
              <span key={b} className="text-lg font-medium tracking-tight text-muted-foreground">
                {b}
              </span>
            ))}
          </div>
          <Link
            to="/marcas"
            className="mt-10 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Ver todas las marcas
          </Link>
        </div>
      </section>

      <CtaBand />
    </Page>
  );
}
