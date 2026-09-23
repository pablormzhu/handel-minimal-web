import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { catalogProducts } from "@/lib/brand-catalog";
import { productImage } from "@/lib/product-images";
import { productDisplayInfo } from "@/lib/format-product";
import patchesLogo from "@/assets/patches-logo-corrected.png.asset.json";
import patchesCover from "@/assets/special-lines/patches-page-hero.jpg";

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
  const items = catalogProducts.filter((product) => product.brand === "PATCHES");

  return (
    <Page>
      <section className="bg-background">
        <div className="mx-auto grid min-h-[72vh] max-w-7xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex min-w-0 flex-col justify-center px-6 py-14 lg:px-12 lg:py-20">
            <BackLink to="/">Regresar al inicio</BackLink>
            <p className="mt-10 text-xs font-medium uppercase text-muted-foreground">Marca propia de Handel</p>
            <img src={patchesLogo.url} alt="Logotipo de PATCHES" width={350} height={56} className="mt-6 h-12 w-auto max-w-[250px] object-contain sm:h-14" />
            <h1 className="mt-9 max-w-2xl text-balance text-4xl font-semibold leading-[1.06] sm:text-6xl">Material confiable para el trabajo que no puede detenerse.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Consumibles para curación, protección y laboratorio con presentaciones pensadas para el uso clínico cotidiano.</p>
            <a href="#productos-patches" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold">Explorar la línea <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="min-h-[360px] overflow-hidden bg-secondary lg:min-h-full">
            <img src={patchesCover} alt="Selección de productos reales PATCHES" width={1920} height={1080} className="h-full w-full object-contain" />
          </div>
        </div>
      </section>

      <section id="productos-patches" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
        <div className="grid gap-6 border-b border-border pb-7 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 className="text-3xl font-semibold sm:text-5xl">Productos PATCHES</h2>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground md:justify-self-end">{items.length} soluciones con información clara, fotografía individual y presentaciones disponibles.</p>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => {
            const info = productDisplayInfo(product);
            return (
              <Link key={product.slug} to="/marca/$marca/producto/$producto" params={{ marca: "patches", producto: product.slug }} className="group">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted/50">
                   <img src={productImage(product)} alt={info.title} loading="eager" width={1024} height={1024} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
                <p className="mt-5 text-xs font-medium text-muted-foreground">Clave {product.sku}</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold leading-snug">{info.title}</h3>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                {info.detail && <p className="mt-2 text-sm text-muted-foreground">{info.detail}</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBand title="¿Quieres cotizar productos PATCHES?" action="Hablar con un asesor" />
    </Page>
  );
}
