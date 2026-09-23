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
  const specificationRows = info.specifications
    .map(formatFeature)
    .filter((feature): feature is { label: string; value: string } => Boolean(feature));
  const rows = [
    ...(info.type ? [{ label: "Tipo", value: info.type.replace(/^tipo\s+/i, "") }] : []),
    ...(info.presentation ? [{ label: "Presentación", value: info.presentation.replace(/^(?:presentación|contenido|cantidad)\s*:\s*/i, "") }] : []),
    ...features,
    ...specificationRows,
  ].filter(
    (row, index, allRows) =>
      allRows.findIndex(
        (candidate) =>
          candidate.value.toLocaleLowerCase() === row.value.toLocaleLowerCase() ||
          `${candidate.label} ${candidate.value}`.toLocaleLowerCase() ===
            `${row.label} ${row.value}`.toLocaleLowerCase(),
      ) === index,
  );

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <BackLink to="/marca/$marca" params={{ marca: brand.slug }}>
          Regresar a {brand.name}
        </BackLink>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-14">
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted/30">
            <img
              src={productImage(product)}
              alt={info.title}
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="pt-2 lg:sticky lg:top-24">
            <p className="text-xs font-medium text-muted-foreground">
              Clave {product.sku} <span className="text-muted-foreground/60">·</span> {product.brand}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{info.title}</h1>
            {info.description && (
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{info.description}</p>
            )}

            {rows.length > 0 && (
              <dl className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                {rows.map(({ label, value }, index) => (
                  <div
                    key={`${label}-${value}`}
                    className={`grid grid-cols-[minmax(7rem,0.42fr)_1fr] gap-5 px-5 py-4 text-sm ${index > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <dt className="text-muted-foreground">{label || "Detalle"}</dt>
                    <dd className="text-right font-medium leading-6">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link
              to="/contacto"
              className="mt-9 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      <CtaBand title="¿Necesitas confirmar esta presentación?" action="Hablar con un asesor" />
    </Page>
  );
}