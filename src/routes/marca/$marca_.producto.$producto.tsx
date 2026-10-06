import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { Button } from "@/components/ui/button";
import { brandBySlug, catalogProducts } from "@/lib/brand-catalog";
import { productDisplayInfo, brandDisplayName } from "@/lib/format-product";
import { productImage } from "@/lib/product-images";
import { productImageSources } from "@/lib/product-image-sources";
import { SiteImage } from "@/components/site/SiteImage";
import { productBrandName, siteProducts } from "@/lib/site-catalog";
import { getFamily } from "@/lib/catalog";
import { pageSeo } from "@/lib/seo";

function findProduct(brandSlug: string, productSlug: string) {
  const brand = brandBySlug(brandSlug);
  if (!brand) return undefined;
  return catalogProducts.find(
    (product) => product.brand === brand.name && product.slug === productSlug,
  );
}

export const Route = createFileRoute("/marca/$marca_/producto/$producto")({
  loader: ({ params }) => {
    const product = findProduct(params.marca, params.producto);
    if (!product) throw notFound();
    return { product: product.slug };
  },
  head: ({ params }) => {
    const product = findProduct(params.marca, params.producto);
    const info = product ? productDisplayInfo(product) : undefined;
    const title =
      info && product
        ? `${info.title} · ${productBrandName(product)} · Handel`
        : "Producto · Handel";
    const description =
      info?.description ?? "Información técnica de producto distribuido por Handel.";
    const seo = pageSeo(
      `/marca/${params.marca}/producto/${params.producto}`,
      product ? productImage(product) : undefined,
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...seo.meta,
      ],
      links: seo.links,
    };
  },
  component: BrandProductPage,
});

function BrandProductPage() {
  const params = Route.useParams();
  const brand = brandBySlug(params.marca);
  const product = findProduct(params.marca, params.producto);
  if (!brand || !product) return null;
  const info = productDisplayInfo(product);
  const rows = info.fields;
  const site = siteProducts.find((p) => p.sku === product.sku);
  const familyName = site ? (getFamily(site.family)?.name ?? site.family) : undefined;

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-24">
        {params.marca.toLocaleLowerCase() === "patches" ? (
          <BackLink to="/patches">Regresar a PATCHES</BackLink>
        ) : (
          <BackLink to="/marca/$marca" params={{ marca: brand.slug }}>
            Regresar a {brandDisplayName(brand.name)}
          </BackLink>
        )}

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
            <SiteImage
              {...productImageSources(product)}
              sizes="(min-width: 1152px) 546px, (min-width: 1024px) calc((100vw - 112px) * 0.525), calc(100vw - 48px)"
              priority
              alt={info.title}
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="pt-1 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase text-muted-foreground">
              <span>{productBrandName(product)}</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Clave {product.sku}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{info.title}</h1>
            {info.description && (
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                {info.description}
              </p>
            )}

            {rows.length > 0 && (
              <div className="mt-9 border-t border-border pt-6">
                <div className="mb-5 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
                  <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                    Ficha técnica
                  </h2>
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rows.map(({ label, value }, index) => (
                    <div
                      key={`${label}-${value}`}
                      className={`relative min-h-24 border border-border/70 bg-muted/30 p-4 ${index === 0 ? "sm:col-span-2 sm:pl-6" : ""}`}
                    >
                      {index === 0 && <span className="absolute inset-y-0 left-0 w-1 bg-accent" />}
                      <dt className="text-xs font-semibold uppercase text-muted-foreground">
                        {label || "Detalle"}
                      </dt>
                      <dd className="mt-2 text-base font-semibold leading-6">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <Button asChild size="lg" className="mt-8 rounded-full px-6">
              <Link
                to="/contacto"
                search={{
                  sku: product.sku,
                  product: info.title,
                  presentation: info.presentation,
                  family: familyName,
                }}
              >
                Solicitar información
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBand title="¿Necesitas confirmar esta presentación?" action="Hablar con un asesor" />
    </Page>
  );
}
