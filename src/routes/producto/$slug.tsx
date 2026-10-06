import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { legacyProductFamilies } from "@/lib/site-catalog";

// Legacy example URLs: redirect to their family instead of showing invented SKUs.
export const Route = createFileRoute("/producto/$slug")({
  beforeLoad: ({ params }) => {
    const familia = legacyProductFamilies[params.slug];
    if (!familia) throw notFound();
    throw redirect({ to: "/catalogo/$familia", params: { familia }, statusCode: 301 });
  },
});
