import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Page, CtaBand } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { brandBySlug, catalogProducts } from "@/lib/brand-catalog";
import { formatFeature, productDisplayInfo } from "@/lib/format-product";
import { productImage } from "@/lib/product-images";

function findProduct(brandSlug: string, productSlug: string) {
  const brand = brandBySlug(brandSlug);
  if (!brand) return undefined;
  return catalogProducts.find((product) => product.brand === brand.name && product.slug === productSlug);
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
    const title = info && product ? `${info.title} · ${product.brand} · Handel` : "Producto · Handel";
    const description = info?.description ?? "Información técnica de producto distribuido por Handel.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
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
  const features = product.features
    .map(formatFeature)
    .filter((feature): feature is { label: string; value: string } => Boolean(feature));

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <BackLink to="/marca/$marca" params={{ marca: brand.slug }}>
          Regresar a {brand.name}
        </BackLink>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted/30">
            <img
              src={productImage(product)}
              alt={info.title}
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground">
              Clave {product.sku} <span className="text-muted-foreground/60">·</span> {product.brand}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{info.title}</h1>
            {info.detail && <p className="mt-4 text-lg text-muted-foreground">{info.detail}</p>}
            <p className="mt-8 text-sm leading-7 text-muted-foreground">{info.description}</p>
            <Link
              to="/contacto"
              className="mt-9 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      {(info.specifications.length > 0 || features.length > 0) && (
        <section className="border-t border-border/60 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
            {info.specifications.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Especificaciones técnicas</h2>
                <ul className="mt-5 divide-y divide-border/60 border-y border-border/60">
                  {info.specifications.map((specification) => (
                    <li key={specification} className="py-4 text-sm leading-6">{specification}</li>
                  ))}
                </ul>
              </div>
            )}
            {features.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Presentación</h2>
                <ul className="mt-5 divide-y divide-border/60 border-y border-border/60">
                  {features.map(({ label, value }) => (
                    <li key={`${label}-${value}`} className="flex justify-between gap-6 py-4 text-sm">
                      {label && <span className="text-muted-foreground">{label}</span>}
                      <span className="text-right font-medium">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <CtaBand title="¿Necesitas confirmar esta presentación?" action="Hablar con un asesor" />
    </Page>
  );
}