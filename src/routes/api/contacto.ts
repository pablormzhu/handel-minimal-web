import { createFileRoute } from "@tanstack/react-router";
import { handleContactRequest } from "@/lib/contact-delivery.server";

export const Route = createFileRoute("/api/contacto")({
  server: {
    handlers: {
      POST: ({ request }) => handleContactRequest(request),
    },
  },
});
