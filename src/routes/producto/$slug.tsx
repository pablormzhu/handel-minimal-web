import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Page } from "@/components/site/Page";
import { BackLink } from "@/components/site/BackLink";
import { getProduct, getFamily, productsByFamily } from "@/lib/catalog";

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ params }) => {
    const p = getProduct(params.slug);
    const title = p ? `${p.name} · ${p.brand} · Handel` : "Producto · Handel";
    const desc = p?.description ?? "Ficha de producto Handel.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductoPage,
});

function ProductoPage() {
  const params = Route.useParams();
  const product = getProduct(params.slug)!;
  const family = getFamily(product.family)!;
  const related = productsByFamily(product.family)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <BackLink to="/catalogo/$familia" params={{ familia: family.slug }}>
          Regresar a {family.name}
        </BackLink>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-muted/50">
            <img
              src={family.image}
              alt={product.name}
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">{product.description}</p>
            <Link
              to="/contacto"
              className="mt-9 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Solicitar información
            </Link>
            <p className="mt-6 text-xs text-muted-foreground">Clave: {product.sku}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-14 border-t border-border pt-14 md:grid-cols-3">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Características
            </h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Presentaciones
            </h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {product.presentations.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Documentación
            </h2>
            {product.documents.length > 0 ? (
              <ul className="mt-5 space-y-3 text-[15px]">
                {product.documents.map((d) => (
                  <li key={d}>
                    <Link to="/contacto" className="text-primary underline-offset-4 hover:underline">
                      {d}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[15px] text-muted-foreground">
                Disponible a solicitud con un asesor.
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Productos relacionados</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} to="/producto/$slug" params={{ slug: p.slug }} className="group">
                  <div className="overflow-hidden rounded-2xl bg-muted/50">
                    <img
                      src={family.image}
                      alt={p.name}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 text-base font-medium tracking-tight">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.brand}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Page>
  );
}
