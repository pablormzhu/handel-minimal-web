import { createFileRoute } from '@tanstack/react-router';
import { handleContactRequest } from '@/lib/contact-delivery.server';

export const Route = createFileRoute('/api/contacto')({
  server: {
    handlers: {
      POST: ({ request }) => handleContactRequest(request, {
        url: process.env['HANDEL_CONTACT_WEBHOOK_URL'],
        secret: process.env['HANDEL_CONTACT_WEBHOOK_SECRET'],
      }),
    },
  },
});
