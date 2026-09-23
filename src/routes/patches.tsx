import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { ownBrandProducts } from "@/lib/catalog";
import patchesLogo from "@/assets/patches-logo.png.asset.json";
import bioseguridad from "@/assets/fam-bioseguridad.jpg";

export const Route = createFileRoute("/patches")({
  head: () => ({
    meta: [
      { title: "PATCHES · Nuestra marca propia | Handel" },
      {
        name: "description",
        content:
          "PATCHES es la marca propia de Handel: banditas adhesivas, vendas, gasas y guantes de curación con calidad controlada.",
      },
      { property: "og:title", content: "PATCHES · Nuestra marca propia | Handel" },
      {
        property: "og:description",
        content: "Conoce PATCHES, la línea propia de curación y protección de Handel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PatchesPage,
});

function PatchesPage() {
  const items = ownBrandProducts();

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-24">
        <BackLink to="/">Regresar al inicio</BackLink>
        <p className="mt-5 text-sm uppercase tracking-widest text-muted-foreground">Nuestra marca</p>
        <img
          src={patchesLogo.url}
          alt="Logotipo de PATCHES"
          width={800}
          height={160}
          className="mt-6 h-16 w-auto object-contain"
        />
        <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Nuestra marca propia de curación y protección.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          PATCHES es la línea desarrollada por Handel: banditas, vendas, gasas y guantes con
          especificaciones controladas y disponibilidad constante para tu institución.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <img
          src={bioseguridad}
          alt="Material de curación y protección PATCHES"
          loading="lazy"
          width={1920}
          height={1088}
          className="aspect-[16/7] w-full rounded-3xl object-cover shadow-xl"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Productos PATCHES</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.slug}
              to="/producto/$slug"
              params={{ slug: p.slug }}
              className="rounded-2xl border border-border/30 bg-background/50 p-6 shadow-xl backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl"
            >
              <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <span className="mt-4 inline-block text-sm text-primary">Ver producto</span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title="¿Quieres cotizar productos PATCHES?" action="Hablar con un asesor" />
    </Page>
  );
}
