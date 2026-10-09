import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Page } from "@/components/site/Page";
import { families, getFamily } from "@/lib/catalog";
import { siteProducts } from "@/lib/site-catalog";
import { productDisplayInfo } from "@/lib/format-product";
import { pageSeo } from "@/lib/seo";
import { newSubmissionId } from "@/lib/submission-id";

type ContactSearch = {
  sku?: string | undefined;
  product?: string | undefined;
  presentation?: string | undefined;
  family?: string | undefined;
};
const text = (v: unknown, max = 300) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

export const Route = createFileRoute("/contacto")({
  validateSearch: (search: {
    sku?: unknown;
    product?: unknown;
    presentation?: unknown;
    family?: unknown;
  }): ContactSearch => ({
    sku: text(search.sku, 100),
    product: text(search.product),
    presentation: text(search.presentation),
    family: text(search.family, 100),
  }),
  head: () => ({
    links: pageSeo("/contacto").links,
    meta: [
      ...pageSeo("/contacto").meta,
      { title: "Contacto · Handel" },
      {
        name: "description",
        content:
          "Habla con un asesor Handel para solicitar información técnica o una cotización de productos de diagnóstico y laboratorio.",
      },
      { property: "og:title", content: "Contacto · Handel" },
      {
        property: "og:description",
        content: "Solicita información o cotización con un asesor especializado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

const field =
  "w-full border-b border-border bg-transparent py-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring";
const labelCls = "text-xs uppercase tracking-widest text-muted-foreground";

type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string | undefined };

function initialContext(search: ContactSearch) {
  const match = search.sku ? siteProducts.find((p) => p.sku === search.sku) : undefined;
  if (match) {
    const info = productDisplayInfo(match);
    return {
      sku: match.sku,
      product: info.title,
      presentation: info.presentation,
      family: getFamily(match.family)?.name ?? match.family,
    };
  }
  return {
    sku: search.sku ?? "",
    product: search.product ?? "",
    presentation: search.presentation ?? "",
    family: search.family ?? "",
  };
}

function Contacto() {
  const search = Route.useSearch();
  const ctx = initialContext(search);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";
  // The disabled button only applies after a re-render; this blocks a second
  // submit fired before that (double click, Enter + click).
  const inFlight = useRef(false);
  // One id per request, kept across retries so the server can drop a duplicate
  // whose first response never arrived; renewed only after a success.
  const submissionId = useRef<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (inFlight.current || !form.reportValidity()) return;
    inFlight.current = true;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      submissionId.current ??= newSubmissionId();
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submissionId: submissionId.current }),
      });
      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
      } | null;
      if (res.ok && payload?.ok) {
        submissionId.current = null;
        form.reset();
        setStatus({ kind: "success", message: payload.message });
      } else {
        setStatus({
          kind: "error",
          message:
            payload?.message ??
            "En este momento no pudimos enviar tu solicitud. Por favor inténtalo más tarde.",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        message: "No hay conexión con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      });
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Contacto</h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Cuéntanos qué necesitas y un asesor te responde con información técnica o una
              cotización.
            </p>

            <form
              className="mt-14 grid gap-8 sm:grid-cols-2"
              onSubmit={onSubmit}
              noValidate={false}
            >
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="c-website">Sitio web</label>
                <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="c-name" className={labelCls}>
                  Nombre *
                </label>
                <input
                  id="c-name"
                  name="name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-company" className={labelCls}>
                  Empresa o institución *
                </label>
                <input
                  id="c-company"
                  name="company"
                  required
                  maxLength={180}
                  autoComplete="organization"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-email" className={labelCls}>
                  Correo *
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-phone" className={labelCls}>
                  Teléfono
                </label>
                <input
                  id="c-phone"
                  name="phone"
                  type="tel"
                  maxLength={60}
                  autoComplete="tel"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-state" className={labelCls}>
                  Estado
                </label>
                <input
                  id="c-state"
                  name="state"
                  maxLength={120}
                  autoComplete="address-level1"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-product" className={labelCls}>
                  Producto o equipo de interés
                </label>
                <input
                  id="c-product"
                  name="product"
                  maxLength={300}
                  defaultValue={ctx.product}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-sku" className={labelCls}>
                  Clave (SKU)
                </label>
                <input
                  id="c-sku"
                  name="sku"
                  maxLength={100}
                  defaultValue={ctx.sku}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="c-presentation" className={labelCls}>
                  Presentación
                </label>
                <input
                  id="c-presentation"
                  name="presentation"
                  maxLength={300}
                  defaultValue={ctx.presentation}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-family" className={labelCls}>
                  Familia
                </label>
                <select id="c-family" name="family" defaultValue={ctx.family} className={field}>
                  <option value="">Selecciona una familia</option>
                  {ctx.family && !families.some((f) => f.name === ctx.family) && (
                    <option value={ctx.family}>{ctx.family}</option>
                  )}
                  {families.map((f) => (
                    <option key={f.slug} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className={labelCls}>
                  Mensaje
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={4}
                  maxLength={5000}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {sending
                    ? "Enviando…"
                    : status.kind === "error"
                      ? "Reintentar"
                      : "Solicitar información"}
                </button>
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-4 text-sm ${status.kind === "error" ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {status.kind === "success" || status.kind === "error" ? status.message : ""}
                </p>
              </div>
            </form>
          </div>

          <aside className="space-y-10 text-[15px]">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                Ventas y atención a clientes
              </h2>
              <p className="mt-4">Teléfono: 55 5425 3217</p>
              <p>Celular ventas: +52 55 2699 8553</p>
              <p>servicio.clientes01@handelmedical.com.mx</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Horario</h2>
              <p className="mt-4">Lunes a viernes, 9:00 – 18:00 h</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Ubicación</h2>
              <p className="mt-4">Ciudad de México, México</p>
            </div>
          </aside>
        </div>
      </section>
    </Page>
  );
}
