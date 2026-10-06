// Prepared for sending contact requests by email. Not wired into /api/contacto yet:
// the provider and the recipient are pending confirmation. Everything here runs on
// the server only; the API key and recipient come from server environment variables
// and never reach the browser bundle.

export type ContactPayload = Record<string, string>;

export type ContactEmailConfig = {
  /** Provider API key: HANDEL_CONTACT_EMAIL_API_KEY. */
  apiKey: string;
  /** Fixed recipient set on the server: HANDEL_CONTACT_EMAIL_TO. */
  to: string;
  /** Verified sender on the client's domain: HANDEL_CONTACT_EMAIL_FROM. */
  from: string;
};

export type ContactEmail = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
};

/** Reads the email config; undefined until all three variables are set. */
export function contactEmailConfig(
  env: Record<string, string | undefined> = process.env,
): ContactEmailConfig | undefined {
  const apiKey = env["HANDEL_CONTACT_EMAIL_API_KEY"];
  const to = env["HANDEL_CONTACT_EMAIL_TO"];
  const from = env["HANDEL_CONTACT_EMAIL_FROM"];
  return apiKey && to && from ? { apiKey, to, from } : undefined;
}

// Header values must stay on one line so user input cannot add headers.
const oneLine = (value: string, max = 200) =>
  value
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, max);

const labels: Array<[key: string, label: string]> = [
  ["name", "Nombre"],
  ["company", "Empresa o institución"],
  ["email", "Correo"],
  ["phone", "Teléfono"],
  ["state", "Estado"],
  ["family", "Familia"],
  ["product", "Producto"],
  ["sku", "Clave"],
  ["presentation", "Presentación"],
  ["message", "Mensaje"],
];

/**
 * Builds a plain-text email (no HTML, so user input cannot inject markup).
 * Expects the payload already validated by handleContactRequest().
 */
export function buildContactEmail(
  payload: ContactPayload,
  config: ContactEmailConfig,
): ContactEmail {
  const company = oneLine(payload["company"] ?? "", 120);
  const product = oneLine(payload["product"] ?? "", 120);
  return {
    to: config.to,
    from: config.from,
    replyTo: oneLine(payload["email"] ?? "", 254),
    subject: oneLine(`Solicitud web · ${company}${product ? ` · ${product}` : ""}`),
    text: labels
      .filter(([key]) => payload[key])
      .map(([key, label]) => `${label}: ${payload[key]}`)
      .join("\n"),
  };
}
