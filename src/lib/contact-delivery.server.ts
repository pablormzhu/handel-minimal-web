import {
  buildContactEmail,
  contactEmailConfig,
  isPlainAddress,
  KEY_VARIABLE,
} from "./contact-email.server";
import { createGmailClient } from "./gmail.server";

type Env = Record<string, string | undefined>;
type HandlerDeps = {
  env?: () => Env;
  fetch?: typeof fetch;
  now?: () => number;
  /** Per call to Google (token and send); no automatic retries. */
  timeoutMs?: number;
};

const messageUnavailable =
  "En este momento no pudimos enviar tu solicitud. Por favor inténtalo más tarde.";
const messageReceived = "Gracias. Recibimos tu solicitud y un asesor te contactará.";
const respond = (status: number, message: string, headers: Record<string, string> = {}) =>
  Response.json(
    { ok: status === 200, message },
    {
      status,
      headers: { "Cache-Control": "no-store", ...headers },
    },
  );

// Best-effort limits kept in memory: they hold within one server instance only.
// Blocking across all Vercel instances needs a WAF rate-limit rule.
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP_LIMIT = 5;
const GLOBAL_LIMIT = 60;
const SUBMISSION_TTL_MS = 24 * 60 * 60 * 1000;
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Same-origin requests pass everywhere, as before. On a Vercel Preview the
 * deployment's own URLs (system variables) also pass, so the check does not depend
 * on how the runtime rebuilds request.url. Any other origin is rejected.
 */
function originRule(request: Request, env: Env) {
  const origin = request.headers.get("origin");
  if (!origin) return "absent";
  if (origin === new URL(request.url).origin) return "same-origin";
  if (
    env["VERCEL_ENV"] === "preview" &&
    [env["VERCEL_URL"], env["VERCEL_BRANCH_URL"]].some(
      (host) => host && origin === `https://${host}`,
    )
  )
    return "preview";
  return undefined;
}

// One JSON line per outcome. Never personal data, tokens, the key or Google's body.
const log = (level: "info" | "error", entry: Record<string, unknown>) =>
  console[level](JSON.stringify({ evt: "contacto", ...entry }));

const safeId = (value: string) => (/^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : undefined);

export function createContactHandler(deps: HandlerDeps = {}) {
  const env = deps.env ?? (() => process.env);
  const now = deps.now ?? Date.now;
  const gmail = createGmailClient({
    fetch: deps.fetch ?? ((input, init) => globalThis.fetch(input, init)),
    now,
    timeoutMs: deps.timeoutMs ?? 10_000,
  });
  const hitsByIp = new Map<string, number[]>();
  let globalHits: number[] = [];
  // Idempotency per submissionId, in memory: it holds within one server instance only.
  const submissions = new Map<string, { state: "pending" | "sent"; at: number }>();

  /** Records the attempt and returns true when this IP or the whole form is over its limit. */
  function isRateLimited(ip: string, at = now()): boolean {
    const since = at - WINDOW_MS;
    globalHits = globalHits.filter((t) => t > since);
    const ipHits = (hitsByIp.get(ip) ?? []).filter((t) => t > since);
    if (ipHits.length >= PER_IP_LIMIT || globalHits.length >= GLOBAL_LIMIT) return true;
    ipHits.push(at);
    globalHits.push(at);
    hitsByIp.set(ip, ipHits);
    if (hitsByIp.size > 5000) {
      for (const [key, times] of hitsByIp) if (!times.some((t) => t > since)) hitsByIp.delete(key);
    }
    return false;
  }

  // A successful response means Gmail accepted the message for the fixed recipient.
  return async function handleContactRequest(request: Request): Promise<Response> {
    const cid = crypto.randomUUID();
    const currentEnv = env();
    const rule = originRule(request, currentEnv);
    if (!rule) {
      log("error", { cid, stage: "origin", status: 403 });
      return respond(403, "No se pudo enviar la solicitud.");
    }
    if (isRateLimited(clientIp(request)))
      return respond(429, messageUnavailable, { "Retry-After": String(WINDOW_MS / 1000) });
    if (!request.headers.get("content-type")?.includes("application/json"))
      return respond(415, "Formato de solicitud no válido.");
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 20000) return respond(413, "La solicitud es demasiado larga.");
    let body: Record<string, unknown>;
    try {
      const raw = await request.text();
      if (raw.length > 20000) return respond(413, "La solicitud es demasiado larga.");
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("Invalid body");
      body = value as Record<string, unknown>;
    } catch {
      return respond(400, "Revisa los datos de tu solicitud.");
    }
    // Honeypot filled: answer like a success so bots get no signal, and send nothing.
    if (body["website"]) return respond(200, messageReceived);
    const limits: Record<string, number> = {
      name: 120,
      company: 180,
      email: 254,
      phone: 60,
      state: 120,
      product: 300,
      sku: 100,
      presentation: 300,
      family: 100,
      message: 5000,
    };
    const payload: Record<string, string> = {};
    for (const [key, max] of Object.entries(limits)) {
      const value = body[key] ?? "";
      if (typeof value !== "string" || value.length > max)
        return respond(400, "Revisa los datos de tu solicitud.");
      payload[key] = value.trim();
    }
    const submissionId =
      typeof body["submissionId"] === "string" ? body["submissionId"].toLowerCase() : "";
    if (!uuidV4.test(submissionId)) return respond(400, "Revisa los datos de tu solicitud.");
    // The email becomes the Reply-To header, so it must be a bare address.
    if (!payload["name"] || !payload["company"] || !isPlainAddress(payload["email"] ?? "")) {
      return respond(400, "Completa nombre, empresa y un correo válido.");
    }
    const config = contactEmailConfig(currentEnv);
    if (!config.ok) {
      console.error(`config inválida: ${config.variable}`);
      return respond(503, messageUnavailable);
    }

    const startedAt = now();
    for (const [id, entry] of submissions)
      if (entry.at < startedAt - SUBMISSION_TTL_MS) submissions.delete(id);
    // Same id already in flight or sent: answer like a success and send nothing.
    if (submissions.has(submissionId)) return respond(200, messageReceived);
    submissions.set(submissionId, { state: "pending", at: startedAt });

    const result = await gmail
      .send(config.config, buildContactEmail(payload, config.config))
      .catch(() => ({ ok: false as const, stage: "envío" as const, status: "red" as const }));
    const originNote = rule === "preview" ? { originRule: "preview" } : {};
    if (result.ok) {
      submissions.set(submissionId, { state: "sent", at: now() });
      log("info", {
        cid,
        stage: result.stage,
        status: result.status,
        gmailId: safeId(result.gmailId),
        ...originNote,
      });
      return respond(200, messageReceived);
    }
    // Failed: free the id so the visitor can retry.
    submissions.delete(submissionId);
    if ("invalidKey" in result && result.invalidKey) {
      console.error(`config inválida: ${KEY_VARIABLE}`);
      return respond(503, messageUnavailable);
    }
    log("error", {
      cid,
      stage: result.stage,
      status: result.status,
      error: "googleError" in result ? result.googleError : undefined,
      ...originNote,
    });
    return respond(502, messageUnavailable);
  };
}

export const handleContactRequest = createContactHandler();
