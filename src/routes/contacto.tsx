import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/site/Page";
import { families } from "@/lib/catalog";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/contacto")({
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
  "w-full border-b border-border bg-transparent py-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

function Contacto() {
  const [sent, setSent] = useState(false);

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
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                toast.success("Gracias, un asesor te contactará pronto.");
              }}
            >
              <input required placeholder="Nombre" className={field} />
              <input required placeholder="Empresa o institución" className={field} />
              <input required type="email" placeholder="Correo" className={field} />
              <input placeholder="Teléfono" className={field} />
              <input placeholder="Estado" className={field} />
              <input placeholder="¿Qué estás buscando?" className={field} />
              <select defaultValue="" className={`${field} sm:col-span-2`}>
                <option value="">Familia o producto de interés</option>
                {families.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.name}
                  </option>
                ))}
              </select>
              <textarea rows={4} placeholder="Mensaje" className={`${field} sm:col-span-2`} />
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
                >
                  {sent ? "Enviado" : "Solicitar información"}
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-10 text-[15px]">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                Ventas y atención a clientes
              </h2>
              <p className="mt-4">ventas@handel.com.mx</p>
              <p>+52 55 0000 0000</p>
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
