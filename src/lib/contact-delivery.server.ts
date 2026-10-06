type DeliveryConfig = { url?: string | undefined; secret?: string | undefined };
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
const hitsByIp = new Map<string, number[]>();
let globalHits: number[] = [];

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Records the attempt and returns true when this IP or the whole form is over its limit. */
function isRateLimited(ip: string, now = Date.now()): boolean {
  const since = now - WINDOW_MS;
  globalHits = globalHits.filter((t) => t > since);
  const ipHits = (hitsByIp.get(ip) ?? []).filter((t) => t > since);
  if (ipHits.length >= PER_IP_LIMIT || globalHits.length >= GLOBAL_LIMIT) return true;
  ipHits.push(now);
  globalHits.push(now);
  hitsByIp.set(ip, ipHits);
  if (hitsByIp.size > 5000) {
    for (const [key, times] of hitsByIp) if (!times.some((t) => t > since)) hitsByIp.delete(key);
  }
  return false;
}

// A successful response means the configured receiver accepted the request.
// No database, external account or invented recipient is provisioned here.
export async function handleContactRequest(
  request: Request,
  config: DeliveryConfig,
): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return respond(403, "No se pudo enviar la solicitud.");
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
  if (
    !payload["name"] ||
    !payload["company"] ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload["email"] ?? "")
  ) {
    return respond(400, "Completa nombre, empresa y un correo válido.");
  }
  if (!config.url) return respond(503, messageUnavailable);
  let destination: URL;
  try {
    destination = new URL(config.url);
  } catch {
    return respond(503, messageUnavailable);
  }
  if (destination.protocol !== "https:") return respond(503, messageUnavailable);
  try {
    const result = await fetch(destination, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.secret ? { Authorization: `Bearer ${config.secret}` } : {}),
      },
      body: JSON.stringify({
        ...payload,
        source: "HANDEL website",
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!result.ok) return respond(502, messageUnavailable);
    return respond(200, messageReceived);
  } catch {
    return respond(502, messageUnavailable);
  }
}
