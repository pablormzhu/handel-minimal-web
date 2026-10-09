// Builds the contact request email and reads its config. Everything here runs on the
// server only; the service account key, sender and recipient come from server
// environment variables and never reach the browser bundle.

export type ContactPayload = Record<string, string>;

export type ContactEmailConfig = {
  /** Service account email, from HANDEL_GOOGLE_SA_KEY_B64. */
  clientEmail: string;
  /** Service account PEM private key, from HANDEL_GOOGLE_SA_KEY_B64. */
  privateKey: string;
  /** Workspace mailbox that sends: HANDEL_CONTACT_EMAIL_FROM. */
  from: string;
  /** Fixed recipient set on the server: HANDEL_CONTACT_EMAIL_TO. */
  to: string;
};

export type ContactEmailConfigResult =
  { ok: true; config: ContactEmailConfig } | { ok: false; variable: string };

export const KEY_VARIABLE = "HANDEL_GOOGLE_SA_KEY_B64";
const FROM_VARIABLE = "HANDEL_CONTACT_EMAIL_FROM";
const TO_VARIABLE = "HANDEL_CONTACT_EMAIL_TO";

// A bare address only: no display name, quoting or list separators, so it is safe
// to place in a header as is.
const plainAddress = /^[^\s@,;:<>()"[\]\\]+@[^\s@,;:<>()"[\]\\]+\.[^\s@,;:<>()"[\]\\]+$/;
export const isPlainAddress = (value: string) => value.length <= 254 && plainAddress.test(value);

let lastConfig:
  { key: string; from: string; to: string; result: ContactEmailConfigResult } | undefined;

/**
 * Reads and validates the email config. The key is decoded once per distinct value.
 * On failure it names only the variable; parse errors are dropped because their
 * messages can quote the secret.
 */
export function contactEmailConfig(
  env: Record<string, string | undefined> = process.env,
): ContactEmailConfigResult {
  const key = env[KEY_VARIABLE] ?? "";
  const from = (env[FROM_VARIABLE] ?? "").trim();
  const to = (env[TO_VARIABLE] ?? "").trim();
  if (lastConfig && lastConfig.key === key && lastConfig.from === from && lastConfig.to === to)
    return lastConfig.result;
  const result = readConfig(key, from, to);
  lastConfig = { key, from, to, result };
  return result;
}

function readConfig(key: string, from: string, to: string): ContactEmailConfigResult {
  const account = decodeServiceAccount(key);
  if (!account) return { ok: false, variable: KEY_VARIABLE };
  if (!isPlainAddress(from)) return { ok: false, variable: FROM_VARIABLE };
  if (!isPlainAddress(to)) return { ok: false, variable: TO_VARIABLE };
  return { ok: true, config: { ...account, from, to } };
}

function decodeServiceAccount(value: string) {
  // Pasted values often carry line breaks or a trailing newline.
  const base64 = value.replace(/\s+/g, "");
  if (!base64 || base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64))
    return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(base64ToBytes(base64)));
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  const fields = parsed as Record<string, unknown>;
  const clientEmail = fields["client_email"];
  const privateKey = fields["private_key"];
  if (typeof clientEmail !== "string" || !clientEmail) return undefined;
  if (typeof privateKey !== "string" || !privateKey.includes("PRIVATE KEY")) return undefined;
  return { clientEmail, privateKey };
}

export function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export const bytesToBase64Url = (bytes: Uint8Array) =>
  bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const utf8 = (value: string) => new TextEncoder().encode(value);

const isControl = (code: number) => code < 0x20 || (code >= 0x7f && code <= 0x9f);

// Header values must stay on one line so user input cannot add headers: control
// characters (CR/LF included) become spaces, and the cut counts code points so a
// character is never split.
const oneLine = (value: string, max = 200) => {
  const clean = Array.from(value, (char) => (isControl(char.codePointAt(0) ?? 0) ? " " : char))
    .join("")
    .replace(/ {2,}/g, " ")
    .trim();
  return Array.from(clean).slice(0, max).join("").trim();
};

// RFC 2047 encoded-words of at most 39 bytes each (64 characters encoded), so the
// first line "Subject: =?UTF-8?B?…?=" stays within 76 characters. Words are split
// on character boundaries and folded with CRLF + space.
function encodeHeaderValue(value: string): string {
  const words: string[] = [];
  let chunk = "";
  for (const char of value) {
    if (chunk && utf8(chunk + char).length > 39) {
      words.push(chunk);
      chunk = "";
    }
    chunk += char;
  }
  if (chunk) words.push(chunk);
  return words.map((word) => `=?UTF-8?B?${bytesToBase64(utf8(word))}?=`).join("\r\n ");
}

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
 * Builds the full RFC 5322 message: plain text only (no HTML, so user input cannot
 * inject markup), UTF-8 body in base64. Expects the payload already validated by
 * the contact handler. Headers carry no personal data except Reply-To.
 */
export function buildContactEmail(payload: ContactPayload, config: ContactEmailConfig): string {
  const product = oneLine(payload["product"] ?? "", 80);
  const subject = product ? `Nueva Solicitud Web: ${product}` : "Nueva Solicitud Web";
  const text = labels
    .filter(([key]) => payload[key])
    .map(([key, label]) => {
      const value = payload[key] ?? "";
      return `${label}: ${key === "message" ? value.replace(/\r\n?|\n/g, "\r\n") : oneLine(value, 5000)}`;
    })
    .join("\r\n");
  const body = (bytesToBase64(utf8(text)).match(/.{1,76}/g) ?? []).join("\r\n");
  return [
    `From: ${oneLine(config.from, 254)}`,
    `To: ${oneLine(config.to, 254)}`,
    `Reply-To: ${oneLine(payload["email"] ?? "", 254)}`,
    `Subject: ${encodeHeaderValue(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ].join("\r\n");
}
