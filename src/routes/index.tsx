import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site/Page";
import { ArrowUpRight } from "lucide-react";
import { families, brands } from "@/lib/catalog";
import hero from "@/assets/hero-home.jpg";
import patchesLogo from "@/assets/patches-logo-corrected.png.asset.json";
import nihonKohdenLogo from "@/assets/equipos/nihon-kohden-logo-transparent.png";
import nihonEquipment from "@/assets/special-lines/nihon-kohden-home-card-centered.jpg";
import patchesCover from "@/assets/special-lines/patches-home-card-centered.jpg";


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
  "PATCHES",
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
          alt="Analizador clínico moderno junto a una gradilla con tubos y una caja Petri sobre una mesa blanca en un laboratorio luminoso"
          width={1920}
          height={1088}
          className="h-[76vh] w-full object-cover object-[58%_center] sm:object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/70 sm:bg-transparent sm:bg-gradient-to-r sm:from-white/60 sm:via-white/30 sm:via-[50%] sm:to-transparent sm:to-[80%]"
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
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Especialistas en soluciones para el sector salud.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            En Handel nos dedicamos a la distribución de productos para diagnóstico clínico,
            laboratorio y atención médica. Reunimos soluciones y marcas especializadas para cubrir
            las distintas necesidades de nuestros clientes.
          </p>
          <Link
            to="/nosotros"
            className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Conoce Handel
          </Link>
        </div>
      </section>

      {/* Secciones especiales */}
      <section className="pb-16 pt-4">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Selección Handel</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Líneas especiales.</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-muted-foreground sm:block">Accede directamente a nuestra marca propia y a los equipos de hematología Nihon Kohden.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Link to="/patches" className="group grid overflow-hidden rounded-3xl border border-border bg-background">
               <div className="order-last flex min-w-0 flex-col p-7 sm:p-9">
                  <img src={patchesLogo.url} alt="PATCHES" width={350} height={56} className="h-8 w-auto max-w-full self-start object-contain" />
                   <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Nuestra línea de consumibles para curación, protección y trabajo de laboratorio.</p>
                 <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Conocer PATCHES <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </div>
                <div className="aspect-[8/5] overflow-hidden bg-background">
                  <img src={patchesCover} alt="Selección de productos PATCHES" loading="eager" width={1600} height={1000} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
               </div>
            </Link>
            <Link to="/equipos" className="group grid overflow-hidden rounded-3xl border border-border bg-background">
               <div className="order-last flex min-w-0 flex-col p-7 sm:p-9">
                 <img src={nihonKohdenLogo} alt="Nihon Kohden" width={499} height={66} className="h-7 w-auto max-w-full self-start object-contain" />
                  <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Analizadores hematológicos de alta precisión para distintos flujos de trabajo clínico.</p>
                 <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Explorar equipos <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </div>
                <div className="aspect-[8/5] overflow-hidden bg-background">
                  <img src={nihonEquipment} alt="Analizadores hematológicos Nihon Kohden" loading="eager" width={1600} height={1000} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
               </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-6xl border-t border-border/30" />


      {/* Qué hacemos */}
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/30 bg-background/50 p-7 shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
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
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Soluciones para cada área.
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f) => (
              <Link
                key={f.slug}
                to="/catalogo/$familia"
                params={{ familia: f.slug }}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl border border-border/30 bg-background/50 shadow-xl backdrop-blur-xl transition-shadow duration-300 group-hover:shadow-2xl">
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.subfamilies.slice(0, 5).join(" · ")}
                </p>
                <span className="mt-4 inline-block text-sm text-primary underline-offset-4 group-hover:underline">
                  Explorar
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trabajamos con marcas especializadas.
          </h2>
          <div className="mt-8 rounded-2xl border border-border/30 bg-background/50 px-8 py-8 shadow-xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-5">
              {featuredBrands.map((b) => (
                <span key={b} className="text-lg font-medium tracking-tight text-muted-foreground">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/marcas"
            className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Ver todas las marcas
          </Link>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-border/30 bg-background/50 px-8 py-12 shadow-xl backdrop-blur-2xl sm:px-14 sm:py-14">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Encuentra la solución que necesitas.
            </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Nuestro equipo puede ayudarte a identificar productos y soluciones de acuerdo con las
            necesidades de tu laboratorio o institución.
          </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
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
        </div>
      </section>
    </Page>
  );
}
