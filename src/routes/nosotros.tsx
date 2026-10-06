import { createFileRoute } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { catalogBrands, catalogProducts } from "@/lib/brand-catalog";
import { families } from "@/lib/catalog";
import { equipment } from "@/lib/equipment";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros · Handel" },
      {
        name: "description",
        content:
          "Handel es una empresa especializada en la distribución de reactivos, materiales y equipos para diagnóstico clínico y laboratorio.",
      },
      { property: "og:title", content: "Nosotros · Handel" },
      {
        property: "og:description",
        content: "Especialización y acompañamiento técnico en diagnóstico y laboratorio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nosotros,
});

const stats = [
  { value: `${catalogBrands.length}`, label: "Marcas representadas" },
  { value: `${catalogProducts.length}`, label: "Productos en catálogo" },
  { value: `${families.length}`, label: "Familias de solución" },
  { value: `${equipment.length}`, label: "Equipos de hematología" },
];

const services = [
  {
    title: "Reactivos y controles",
    text: "Química clínica, inmunoensayo, microbiología, control de calidad y medios de cultivo de las marcas líderes del sector.",
  },
  {
    title: "Materiales y consumibles",
    text: "Vidriería, plásticos, toma de muestra y material desechable para el trabajo diario del laboratorio.",
  },
  {
    title: "Equipos y soluciones",
    text: "Equipos de hematología Nihon Kohden y PATCHES, nuestra marca propia, con instalación y soporte técnico.",
  },
];

const principles = [
  {
    title: "Portafolio seleccionado",
    text: "Cada marca y producto del catálogo se elige por su calidad, trazabilidad y desempeño en el trabajo clínico real.",
  },
  {
    title: "Asesoría técnica cercana",
    text: "Acompañamos la elección, instalación y operación de reactivos y equipos, con respuesta directa de nuestro equipo.",
  },
  {
    title: "Suministro confiable",
    text: "Planeamos la disponibilidad y los tiempos de entrega para que el laboratorio nunca detenga su operación.",
  },
];

const audiences = [
  "Laboratorios clínicos",
  "Hospitales y redes de salud",
  "Instituciones públicas",
  "Laboratorios de investigación y industria",
];

function Nosotros() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Nosotros</p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Especialistas en diagnóstico y laboratorio.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Handel distribuye reactivos, materiales y equipos de diagnóstico clínico en México,
          representando marcas internacionales y acompañando a cada laboratorio con asesoría
          técnica de cerca.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8 sm:pb-12 sm:pt-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-10 text-center">
              <dd className="text-4xl font-semibold tracking-tight sm:text-5xl">{s.value}</dd>
              <dt className="mt-3 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-12">
        <img
          src="/hero-nosotros-wide-v2.webp"
          alt="Analizador de laboratorio con reactivos, materiales y consumibles completos sobre una mesa amplia"
          loading="lazy"
          width={1672}
          height={941}
          className="block h-auto w-full rounded-3xl"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-12">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Quiénes somos
            </h2>
            <p className="mt-5 text-xl leading-relaxed">
              Somos una empresa mexicana dedicada a la distribución de productos para diagnóstico
              in vitro. Trabajamos de la mano de laboratorios clínicos, hospitales e instituciones
              públicas, llevando marcas de reconocimiento internacional con respaldo y servicio
              local.
            </p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              A quién atendemos
            </h2>
            <ul className="mt-5 space-y-4 text-xl leading-relaxed">
              {audiences.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Qué hacemos
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Un solo proveedor para el suministro completo del laboratorio: del reactivo al equipo,
            y del pedido a la asesoría de uso.
          </p>
          <div className="mt-8 grid sm:mt-10 gap-6 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border border-border/60 bg-muted/50 px-8 py-10"
              >
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Cómo trabajamos
          </h2>
          <div className="mt-8 grid sm:mt-10 gap-10 md:grid-cols-3">
            {principles.map((p, i) => (
              <div key={p.title}>
                <span className="text-sm font-medium text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Socios comerciales · {catalogBrands.length} marcas
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {catalogBrands.slice(0, 18).map((b) => (
              <span
                key={b.name}
                className="text-lg font-medium tracking-tight text-muted-foreground"
              >
                {b.name}
              </span>
            ))}
          </div>
          <a
            href="/marcas"
            className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Ver todas las marcas
          </a>
        </div>
      </section>

      <CtaBand title="Hablemos de tu laboratorio." action="Contactar a un asesor" />
    </Page>
  );
}
