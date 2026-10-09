// Sends mail through the Gmail API as a Workspace user, using a service account with
// domain-wide delegation. WebCrypto only (no node:crypto), so it runs both on
// Vercel's Node runtime and in Lovable's Cloudflare build.
import { base64ToBytes, bytesToBase64Url, type ContactEmailConfig } from "./contact-email.server";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

export type GmailStage = "token" | "envío";
export type GmailResult =
  | { ok: true; stage: "envío"; status: number; gmailId: string }
  | {
      ok: false;
      stage: GmailStage;
      /** HTTP status, or why no response arrived. */
      status: number | "timeout" | "red";
      /** Google's error code ("invalid_grant", "PERMISSION_DENIED"…), never its message. */
      googleError?: string | undefined;
      /** The private key could not be imported: a config problem, not a Google one. */
      invalidKey?: boolean;
    };

type Deps = { fetch: typeof fetch; now: () => number; timeoutMs: number };
type TokenResult = { ok: true; token: string } | Extract<GmailResult, { ok: false }>;

// Only short codes are logged; anything else Google returns may quote request data.
const safeCode = (value: unknown) =>
  typeof value === "string" && /^[A-Za-z_]{1,64}$/.test(value) ? value : undefined;

function gmailErrorCode(data: unknown) {
  const error = (data as { error?: { status?: unknown; errors?: Array<{ reason?: unknown }> } })
    ?.error;
  return safeCode(error?.status) ?? safeCode(error?.errors?.[0]?.reason);
}

const failureStatus = (error: unknown) =>
  error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
    ? "timeout"
    : "red";

const jsonPart = (value: object) =>
  bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));

export function createGmailClient(deps: Deps) {
  let cached: { key: string; token: string; expiresAt: number } | undefined;
  let pending: { key: string; promise: Promise<TokenResult> } | undefined;
  let signingKey: { pem: string; key: Promise<CryptoKey> } | undefined;

  function importKey(pem: string) {
    if (signingKey?.pem !== pem) {
      const der = base64ToBytes(pem.replace(/-----(BEGIN|END) PRIVATE KEY-----|\s+/g, ""));
      const key = crypto.subtle.importKey(
        "pkcs8",
        der,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"],
      );
      signingKey = { pem, key };
    }
    return signingKey.key;
  }

  async function requestToken(config: ContactEmailConfig): Promise<TokenResult> {
    const iat = Math.floor(deps.now() / 1000);
    const unsigned = `${jsonPart({ alg: "RS256", typ: "JWT" })}.${jsonPart({
      iss: config.clientEmail,
      sub: config.from,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat,
      exp: iat + 3600,
    })}`;
    let assertion: string;
    try {
      const key = await importKey(config.privateKey);
      const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(unsigned),
      );
      assertion = `${unsigned}.${bytesToBase64Url(new Uint8Array(signature))}`;
    } catch {
      signingKey = undefined;
      return { ok: false, stage: "token", status: 0, invalidKey: true };
    }
    try {
      const response = await deps.fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion,
        }),
        signal: AbortSignal.timeout(deps.timeoutMs),
        redirect: "error",
      });
      const data = (await response.json().catch(() => null)) as {
        access_token?: unknown;
        expires_in?: unknown;
        error?: unknown;
      } | null;
      if (response.ok && typeof data?.access_token === "string" && data.access_token) {
        const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 3600;
        cached = {
          key: `${config.clientEmail}\n${config.from}`,
          token: data.access_token,
          // Renew 60 s before Google's expiry.
          expiresAt: deps.now() + (expiresIn - 60) * 1000,
        };
        return { ok: true, token: data.access_token };
      }
      return {
        ok: false,
        stage: "token",
        status: response.status,
        googleError: safeCode(data?.error),
      };
    } catch (error) {
      return { ok: false, stage: "token", status: failureStatus(error) };
    }
  }

  /** Cached token, or one shared request when several sends need a new token at once. */
  function getToken(config: ContactEmailConfig): Promise<TokenResult> {
    const key = `${config.clientEmail}\n${config.from}`;
    if (cached?.key === key && deps.now() < cached.expiresAt)
      return Promise.resolve({ ok: true, token: cached.token });
    if (pending?.key === key) return pending.promise;
    const promise = requestToken(config).finally(() => {
      if (pending?.promise === promise) pending = undefined;
    });
    pending = { key, promise };
    return promise;
  }

  /** Sends one RFC 5322 message. No automatic retries. */
  async function send(config: ContactEmailConfig, message: string): Promise<GmailResult> {
    const token = await getToken(config);
    if (!token.ok) return token;
    try {
      const response = await deps.fetch(SEND_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw: bytesToBase64Url(new TextEncoder().encode(message)) }),
        signal: AbortSignal.timeout(deps.timeoutMs),
        redirect: "error",
      });
      // Google rejected the token: drop it so the next request asks for a new one.
      if (response.status === 401 && cached?.token === token.token) cached = undefined;
      const data = (await response.json().catch(() => null)) as { id?: unknown } | null;
      if (response.ok && typeof data?.id === "string" && data.id)
        return { ok: true, stage: "envío", status: response.status, gmailId: data.id };
      return {
        ok: false,
        stage: "envío",
        status: response.status,
        googleError: gmailErrorCode(data),
      };
    } catch (error) {
      return { ok: false, stage: "envío", status: failureStatus(error) };
    }
  }

  return { send };
}
