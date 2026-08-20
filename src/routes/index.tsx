import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site/Page";
import { families, brands } from "@/lib/catalog";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Handel · Soluciones para diagnóstico y laboratorio" },
      {
        name: "description",
        content:
          "Handel distribuye reactivos, materiales y equipos para diagnóstico clínico, laboratorio y atención médica. Explora el catálogo o habla con un asesor.",
      },
      { property: "og:title", content: "Handel · Soluciones para diagnóstico y laboratorio" },
      {
        property: "og:description",
        content:
          "Distribución especializada en diagnóstico clínico, microbiología, control de calidad y consumibles de laboratorio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    title: "Diagnóstico",
    text: "Reactivos, controles y soluciones para las principales áreas del diagnóstico clínico.",
    to: "/catalogo/$familia",
    familia: "diagnostico-clinico",
  },
  {
    title: "Laboratorio",
    text: "Productos para microbiología, procesamiento, toma de muestras y trabajo cotidiano de laboratorio.",
    to: "/catalogo/$familia",
    familia: "microbiologia",
  },
  {
    title: "Material médico",
    text: "Consumibles y materiales para profesionales e instituciones de salud.",
    to: "/catalogo/$familia",
    familia: "material-medico-bioseguridad",
  },
];

const featuredBrands = [
  "BD",
  "Bio-Rad",
  "SNIBE Diagnostic",
  "QCA",
  "Nihon Kohden",
  "MCD Lab",
  "Dibico",
  "Copan",
].filter((b) => brands.includes(b));

function Index() {
  return (
    <Page>
      {/* Hero */}
      <section className="relative">
        <img
          src={hero}
          alt="Personal de laboratorio trabajando con material de diagnóstico"
          width={1920}
          height={1088}
          className="h-[76vh] w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Soluciones para diagnóstico y laboratorio.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Productos especializados para laboratorios, instituciones y profesionales de la salud.
            </p>
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

      {/* Quiénes somos */}
      <section className="py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Especialistas en soluciones para el sector salud.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            En Handel nos dedicamos a la distribución de productos para diagnóstico clínico,
            laboratorio y atención médica. Reunimos soluciones y marcas especializadas para cubrir
            las distintas necesidades de nuestros clientes.
          </p>
          <Link
            to="/nosotros"
            className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Conoce Handel
          </Link>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="border-t border-border/60 py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title}>
              <h3 className="text-2xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
              <Link
                to={p.to}
                params={{ familia: p.familia }}
                className="mt-5 inline-block text-sm text-primary underline-offset-4 hover:underline"
              >
                Conocer soluciones
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Familias */}
      <section className="border-t border-border/60 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Soluciones para cada área.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {f.subfamilies.slice(0, 5).join(" · ")}
                </p>
                <span className="mt-3 inline-block text-sm text-primary underline-offset-4 group-hover:underline">
                  Explorar
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="border-t border-border/60 py-28">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trabajamos con marcas especializadas.
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {featuredBrands.map((b) => (
              <span key={b} className="text-lg font-medium tracking-tight text-muted-foreground">
                {b}
              </span>
            ))}
          </div>
          <Link
            to="/marcas"
            className="mt-12 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Ver todas las marcas
          </Link>
        </div>
      </section>

      {/* Cierre */}
      <section className="border-t border-border/60 py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Encuentra la solución que necesitas.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Nuestro equipo puede ayudarte a identificar productos y soluciones de acuerdo con las
            necesidades de tu laboratorio o institución.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/contacto"
              className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Hablar con un asesor
            </Link>
            <Link
              to="/catalogo"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
