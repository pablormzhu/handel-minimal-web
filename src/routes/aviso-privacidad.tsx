import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/aviso-privacidad")({
  head: () => ({
    links: pageSeo("/aviso-privacidad").links,
    meta: [
      ...pageSeo("/aviso-privacidad").meta,
      { title: "Aviso de privacidad · Handel" },
      {
        name: "description",
        content:
          "Aviso de privacidad de Handel sobre el tratamiento de datos personales recabados a través del sitio web.",
      },
      { property: "og:title", content: "Aviso de privacidad · Handel" },
      {
        property: "og:description",
        content: "Tratamiento de datos personales en el sitio de Handel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Aviso,
});

function Aviso() {
  return (
    <Page>
      <article className="mx-auto max-w-2xl px-6 pb-32 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight">Aviso de privacidad</h1>
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Handel es responsable del tratamiento de los datos personales que se recaban a través
            de este sitio web, con la finalidad de atender solicitudes de información técnica y
            comercial.
          </p>
          <p>
            Los datos proporcionados en el formulario de contacto se utilizan únicamente para dar
            seguimiento a la solicitud y no se transfieren a terceros sin consentimiento, salvo
            cuando la ley lo requiera.
          </p>
          <p>
            El titular puede ejercer sus derechos de acceso, rectificación, cancelación y oposición
            escribiendo a servicio.clientes01@handelmedical.com.mx.
          </p>
          <p>Última actualización: agosto de 2026.</p>
        </div>
      </article>
    </Page>
  );
}
