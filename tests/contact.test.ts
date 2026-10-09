// Contact form → Gmail delivery. Runs with `bun test tests/`; no network: every call
// to Google goes through a mocked fetch. The RSA key is generated at run time and
// never written to disk.
import { afterEach, beforeAll, describe, expect, spyOn, test } from "bun:test";
import { createContactHandler } from "../src/lib/contact-delivery.server";
import { newSubmissionId } from "../src/lib/submission-id";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const SITE = "https://handel.example";
const FROM = "envios@handel.example";
const TO = "ventas@handel.example";
const SA_EMAIL = "contacto@proyecto-prueba.iam.gserviceaccount.com";
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

let publicKey: CryptoKey;
let pemBody: string;
let keyB64: string;

// Built in parts so nothing in this file looks like a stored private key.
const PEM_LABEL = ["PRIVATE", "KEY"].join(" ");
const pem = (body: string) => `-----BEGIN ${PEM_LABEL}-----\n${body}\n-----END ${PEM_LABEL}-----\n`;

const toB64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");
const fromB64Url = (value: string) => Buffer.from(value, "base64url");

beforeAll(async () => {
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  publicKey = pair.publicKey;
  pemBody = toB64(new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey)));
  const privateKey = pem(pemBody.match(/.{1,64}/g)!.join("\n"));
  keyB64 = toB64(
    new TextEncoder().encode(
      JSON.stringify({ type: "service_account", client_email: SA_EMAIL, private_key: privateKey }),
    ),
  );
});

// ---------- helpers ----------

type Call = { url: string; init: RequestInit };
type Route = (init: RequestInit) => Response | Promise<Response>;

const json = (status: number, body: unknown) => Response.json(body, { status });
const tokenOk: Route = () => json(200, { access_token: "ya29.token-de-prueba", expires_in: 3599 });
const sendOk: Route = () => json(200, { id: "18f0c0ffee123abc", threadId: "18f0c0ffee123abc" });

function mockFetch(routes: { token?: Route; send?: Route } = {}) {
  const calls: Call[] = [];
  const fn = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === TOKEN_URL) return (routes.token ?? tokenOk)(init);
    if (url === SEND_URL) return (routes.send ?? sendOk)(init);
    throw new Error(`fetch inesperado: ${url}`);
  };
  return {
    fetch: fn as unknown as typeof fetch,
    calls,
    count: (url: string) => calls.filter((c) => c.url === url).length,
  };
}

const baseEnv = () => ({
  HANDEL_GOOGLE_SA_KEY_B64: keyB64,
  HANDEL_CONTACT_EMAIL_FROM: FROM,
  HANDEL_CONTACT_EMAIL_TO: TO,
});

function handler(
  mock: ReturnType<typeof mockFetch>,
  env: Record<string, string | undefined> = baseEnv(),
  timeoutMs = 10_000,
) {
  return createContactHandler({ env: () => env, fetch: mock.fetch, timeoutMs });
}

let ipCounter = 0;
const validBody = (extra: Record<string, unknown> = {}) => ({
  website: "",
  name: "Ana Pérez",
  company: "Hospital Ángeles",
  email: "ana.perez@cliente.example",
  phone: "55 1234 5678",
  state: "CDMX",
  product: "Reactivo de glucosa",
  sku: "GLU-500",
  presentation: "Caja con 10",
  family: "Química clínica",
  message: "Hola",
  submissionId: crypto.randomUUID(),
  ...extra,
});

function request(
  body: unknown,
  opts: { origin?: string | null; url?: string; ip?: string } = {},
): Request {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-real-ip": opts.ip ?? `10.0.0.${++ipCounter}`,
  };
  if (opts.origin !== null) headers["origin"] = opts.origin ?? SITE;
  return new Request(opts.url ?? `${SITE}/api/contacto`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

let logs: string[] = [];
const spies = (["log", "info", "warn", "error"] as const).map((level) =>
  spyOn(console, level).mockImplementation((...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  }),
);
afterEach(() => {
  logs = [];
});
void spies;

const eventLogs = () =>
  logs.filter((l) => l.startsWith("{")).map((l) => JSON.parse(l) as Record<string, unknown>);

function sentMessage(call: Call) {
  const { raw } = JSON.parse(String(call.init.body)) as { raw: string };
  expect(raw).toMatch(/^[A-Za-z0-9_-]+$/); // base64url, no padding
  const text = fromB64Url(raw).toString("utf8");
  const [head = "", body = ""] = text.split("\r\n\r\n");
  return { text, head, body };
}

const decodeWords = (value: string) =>
  value
    .split(/\r\n /)
    .map((word) => {
      const m = /^=\?UTF-8\?B\?([A-Za-z0-9+/=]+)\?=$/.exec(word);
      if (!m) throw new Error(`no es encoded-word: ${word}`);
      return Buffer.from(m[1]!, "base64").toString("utf8");
    })
    .join("");

function subjectOf(head: string) {
  const m = /^Subject: (.*(?:\r\n .*)*)/m.exec(head);
  return decodeWords(m![1]!);
}

const bodyText = (body: string) =>
  Buffer.from(body.replace(/\r\n/g, ""), "base64").toString("utf8");

// ---------- cases ----------

describe("envío exitoso", () => {
  test("firma JWT válida, claims correctos y mensaje RFC 5322", async () => {
    const mock = mockFetch();
    const res = await handler(mock)(request(validBody()));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      message: "Gracias. Recibimos tu solicitud y un asesor te contactará.",
    });

    const tokenCall = mock.calls.find((c) => c.url === TOKEN_URL)!;
    expect(tokenCall.init.method).toBe("POST");
    expect(new Headers(tokenCall.init.headers).get("content-type")).toBe(
      "application/x-www-form-urlencoded",
    );
    const form = new URLSearchParams(String(tokenCall.init.body));
    expect(form.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:jwt-bearer");
    const [h, c, s] = form.get("assertion")!.split(".");
    expect(JSON.parse(fromB64Url(h!).toString())).toEqual({ alg: "RS256", typ: "JWT" });
    const claims = JSON.parse(fromB64Url(c!).toString());
    expect(claims).toMatchObject({
      iss: SA_EMAIL,
      sub: FROM,
      scope: "https://www.googleapis.com/auth/gmail.send",
      aud: TOKEN_URL,
    });
    expect(claims.exp - claims.iat).toBe(3600);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      fromB64Url(s!),
      new TextEncoder().encode(`${h}.${c}`),
    );
    expect(valid).toBe(true);

    const sendCall = mock.calls.find((c) => c.url === SEND_URL)!;
    expect(new Headers(sendCall.init.headers).get("authorization")).toBe(
      "Bearer ya29.token-de-prueba",
    );
    const { head, body } = sentMessage(sendCall);
    const headers = head.split("\r\n");
    expect(headers).toContain(`From: ${FROM}`);
    expect(headers).toContain(`To: ${TO}`);
    expect(headers).toContain("Reply-To: ana.perez@cliente.example");
    expect(headers).toContain("MIME-Version: 1.0");
    expect(headers).toContain("Content-Type: text/plain; charset=UTF-8");
    expect(headers).toContain("Content-Transfer-Encoding: base64");
    expect(subjectOf(head)).toBe("Nueva Solicitud Web: Reactivo de glucosa");
    // No personal data in headers apart from Reply-To.
    expect(head).not.toContain("Ana");
    expect(head).not.toContain("Hospital");
    expect(bodyText(body)).toContain("Nombre: Ana Pérez");

    const [entry] = eventLogs();
    expect(entry).toEqual({
      evt: "contacto",
      cid: expect.stringMatching(uuidV4),
      stage: "envío",
      status: 200,
      gmailId: "18f0c0ffee123abc",
    });
    const all = logs.join("\n");
    for (const secret of [
      "ana.perez",
      "Ana",
      "Hospital",
      "ya29",
      pemBody.slice(40, 80),
      keyB64.slice(0, 40),
    ])
      expect(all).not.toContain(secret);
  });

  test("el token se reutiliza en memoria entre envíos", async () => {
    const mock = mockFetch();
    const handle = handler(mock);
    expect((await handle(request(validBody()))).status).toBe(200);
    expect((await handle(request(validBody()))).status).toBe(200);
    expect(mock.count(TOKEN_URL)).toBe(1);
    expect(mock.count(SEND_URL)).toBe(2);
  });

  test("solicitudes concurrentes sin token comparten una sola petición de token", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const mock = mockFetch({
      token: async (init) => {
        await gate;
        return tokenOk(init);
      },
    });
    const handle = handler(mock);
    const pending = [
      handle(request(validBody())),
      handle(request(validBody())),
      handle(request(validBody())),
    ];
    await new Promise((r) => setTimeout(r, 20));
    release();
    const results = await Promise.all(pending);
    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(mock.count(TOKEN_URL)).toBe(1);
    expect(mock.count(SEND_URL)).toBe(3);
  });
});

describe("errores de Google", () => {
  test("401 de Gmail invalida el token en caché sin reintentar el envío", async () => {
    let sends = 0;
    const mock = mockFetch({
      send: () =>
        ++sends === 1
          ? json(401, {
              error: { code: 401, message: "Invalid Credentials", status: "UNAUTHENTICATED" },
            })
          : sendOk({}),
    });
    const handle = handler(mock);
    const first = await handle(request(validBody()));
    expect(first.status).toBe(502);
    expect((await first.json()).message).toBe(
      "En este momento no pudimos enviar tu solicitud. Por favor inténtalo más tarde.",
    );
    expect(mock.count(SEND_URL)).toBe(1); // no automatic retry
    expect(eventLogs()[0]).toMatchObject({ stage: "envío", status: 401, error: "UNAUTHENTICATED" });
    const second = await handle(request(validBody()));
    expect(second.status).toBe(200);
    expect(mock.count(TOKEN_URL)).toBe(2); // cache was dropped
  });

  test("403 PERMISSION_DENIED: se loguea el status, no el mensaje", async () => {
    const mock = mockFetch({
      send: () =>
        json(403, {
          error: {
            code: 403,
            message: "Delegation denied for envios@handel.example",
            status: "PERMISSION_DENIED",
            errors: [{ reason: "forbidden", message: "Delegation denied" }],
          },
        }),
    });
    const res = await handler(mock)(request(validBody()));
    expect(res.status).toBe(502);
    const [entry] = eventLogs();
    expect(entry).toEqual({
      evt: "contacto",
      cid: expect.stringMatching(uuidV4),
      stage: "envío",
      status: 403,
      error: "PERMISSION_DENIED",
    });
    expect(logs.join("\n")).not.toContain("Delegation");
  });

  for (const code of ["unauthorized_client", "invalid_grant"]) {
    test(`token rechazado con ${code}`, async () => {
      const mock = mockFetch({
        token: () => json(400, { error: code, error_description: "detalle-secreto del servidor" }),
      });
      const res = await handler(mock)(request(validBody()));
      expect(res.status).toBe(502);
      expect(mock.count(SEND_URL)).toBe(0);
      expect(eventLogs()[0]).toEqual({
        evt: "contacto",
        cid: expect.stringMatching(uuidV4),
        stage: "token",
        status: 400,
        error: code,
      });
      expect(logs.join("\n")).not.toContain("detalle-secreto");
    });
  }

  test("5xx de Gmail sin status: se usa errors[0].reason", async () => {
    const mock = mockFetch({
      send: () =>
        json(503, {
          error: { code: 503, message: "Backend Error", errors: [{ reason: "backendError" }] },
        }),
    });
    const res = await handler(mock)(request(validBody()));
    expect(res.status).toBe(502);
    expect(eventLogs()[0]).toMatchObject({ stage: "envío", status: 503, error: "backendError" });
  });

  test("2xx sin id del mensaje no cuenta como éxito", async () => {
    const mock = mockFetch({ send: () => json(200, {}) });
    expect((await handler(mock)(request(validBody()))).status).toBe(502);
  });

  test("timeout: corta la llamada, no reintenta y libera el UUID", async () => {
    let sends = 0;
    const mock = mockFetch({
      send: (init) => {
        sends++;
        return new Promise<Response>((_, reject) =>
          init.signal!.addEventListener("abort", () => reject(init.signal!.reason)),
        );
      },
    });
    const handle = handler(mock, baseEnv(), 50);
    const body = validBody();
    const res = await handle(request(body));
    expect(res.status).toBe(502);
    expect(sends).toBe(1);
    expect(eventLogs()[0]).toMatchObject({ stage: "envío", status: "timeout" });
    await handle(request(body)); // same id again: it was freed, so it is attempted again
    expect(sends).toBe(2);
  });
});

describe("validaciones del formulario", () => {
  test("honeypot lleno: 200 sin llamar a Google", async () => {
    const mock = mockFetch();
    const res = await handler(mock)(request(validBody({ website: "https://spam.example" })));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(mock.calls.length).toBe(0);
  });

  test("submissionId ausente o que no es v4: 400", async () => {
    const mock = mockFetch();
    const handle = handler(mock);
    const { submissionId: _omit, ...withoutId } = validBody();
    expect((await handle(request(withoutId))).status).toBe(400);
    const v1 = "6fa459ea-ee8a-11ca-8b8f-0a0027000001";
    expect((await handle(request(validBody({ submissionId: v1 })))).status).toBe(400);
    expect(mock.calls.length).toBe(0);
  });

  test("correo con lista de direcciones o nombre visible: 400", async () => {
    const mock = mockFetch();
    const handle = handler(mock);
    for (const email of [
      "a@b.example,c@d.example",
      "Ana <ana@b.example>",
      "ana@b.example\r\nBcc: x@y.example",
    ]) {
      const res = await handle(request(validBody({ email })));
      expect(res.status).toBe(400);
      expect((await res.json()).message).toBe("Completa nombre, empresa y un correo válido.");
    }
    expect(mock.calls.length).toBe(0);
  });
});

describe("idempotencia por submissionId", () => {
  test("mismo UUID dos veces: un solo correo, ambas respuestas iguales a un éxito", async () => {
    const mock = mockFetch();
    const handle = handler(mock);
    const body = validBody();
    const a = await handle(request(body));
    const b = await handle(request(body));
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(await b.json()).toEqual(await a.json());
    expect(mock.count(SEND_URL)).toBe(1);
  });

  test("mismo UUID mientras el primero sigue en curso: no envía dos veces", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    let sendStarted!: () => void;
    const started = new Promise<void>((r) => (sendStarted = r));
    const mock = mockFetch({
      send: async (init) => {
        sendStarted();
        await gate;
        return sendOk(init);
      },
    });
    const handle = handler(mock);
    const body = validBody();
    const first = handle(request(body));
    await started;
    const second = await handle(request(body));
    expect(second.status).toBe(200);
    expect((await second.json()).ok).toBe(true);
    release();
    expect((await first).status).toBe(200);
    expect(mock.count(SEND_URL)).toBe(1);
  });

  test("si el envío falla, el UUID se libera y el reintento sí envía", async () => {
    let sends = 0;
    const mock = mockFetch({ send: (init) => (++sends === 1 ? json(500, {}) : sendOk(init)) });
    const handle = handler(mock);
    const body = validBody();
    expect((await handle(request(body))).status).toBe(502);
    expect((await handle(request(body))).status).toBe(200);
    expect(mock.count(SEND_URL)).toBe(2);
  });
});

describe("codificación", () => {
  test("saltos de línea y acentos: asunto RFC 2047 y cuerpo base64 en líneas de 76", async () => {
    const mock = mockFetch();
    const product = "Reactivo\r\nBcc: intruso@evil.example\tGlucosa — ñandú";
    const message = "Primera línea con acentos: áéíóú ñ\r\nSegunda línea\nTercera\rCuarta";
    await handler(mock)(request(validBody({ product, message, name: "José\r\nX-Inyectado: sí" })));
    const { head, body } = sentMessage(mock.calls.find((c) => c.url === SEND_URL)!);
    const headerNames = head
      .split("\r\n")
      .filter((l) => !l.startsWith(" "))
      .map((l) => l.split(":")[0]);
    expect(headerNames).toEqual([
      "From",
      "To",
      "Reply-To",
      "Subject",
      "MIME-Version",
      "Content-Type",
      "Content-Transfer-Encoding",
    ]);
    for (const line of head.split("\r\n")) expect(line.length).toBeLessThanOrEqual(76);
    expect(subjectOf(head)).toBe(
      "Nueva Solicitud Web: Reactivo Bcc: intruso@evil.example Glucosa — ñandú",
    );

    const lines = body.split("\r\n");
    for (const line of lines.slice(0, -1)) expect(line.length).toBe(76);
    expect(lines.at(-1)!.length).toBeLessThanOrEqual(76);
    const text = bodyText(body);
    expect(text).toContain("Nombre: José X-Inyectado: sí");
    expect(text).toContain(
      "Mensaje: Primera línea con acentos: áéíóú ñ\r\nSegunda línea\r\nTercera\r\nCuarta",
    );
    expect(text).toContain("Producto: Reactivo Bcc: intruso@evil.example Glucosa — ñandú");
  });

  test("producto vacío y producto de más de 80 caracteres", async () => {
    const mock = mockFetch();
    const handle = handler(mock);
    await handle(request(validBody({ product: "" })));
    const long = "Ñ".repeat(50) + "x".repeat(60);
    await handle(request(validBody({ product: long })));
    const [empty, longCall] = mock.calls.filter((c) => c.url === SEND_URL);
    expect(subjectOf(sentMessage(empty!).head)).toBe("Nueva Solicitud Web");
    expect(subjectOf(sentMessage(longCall!).head)).toBe(
      `Nueva Solicitud Web: ${"Ñ".repeat(50)}${"x".repeat(30)}`,
    );
  });
});

describe("configuración", () => {
  for (const variable of [
    "HANDEL_GOOGLE_SA_KEY_B64",
    "HANDEL_CONTACT_EMAIL_FROM",
    "HANDEL_CONTACT_EMAIL_TO",
  ] as const) {
    test(`falta ${variable}: 503 y sólo el nombre en el log`, async () => {
      const mock = mockFetch();
      const env: Record<string, string | undefined> = baseEnv();
      delete env[variable];
      const res = await handler(mock, env)(request(validBody()));
      expect(res.status).toBe(503);
      expect(logs).toEqual([`config inválida: ${variable}`]);
      expect(mock.calls.length).toBe(0);
    });
  }

  test("FROM o TO con formato inválido", async () => {
    const mock = mockFetch();
    const res = await handler(mock, {
      ...baseEnv(),
      HANDEL_CONTACT_EMAIL_TO: "Ventas <v@x.example>",
    })(request(validBody()));
    expect(res.status).toBe(503);
    expect(logs).toEqual(["config inválida: HANDEL_CONTACT_EMAIL_TO"]);
  });

  test("base64 roto: 503 sin fragmentos en el log", async () => {
    const broken = "eyJjbGllbnRfZW1haWwiOiJzZWNyZXRv%%%LLAVE-PRIVADA";
    const res = await handler(mockFetch(), { ...baseEnv(), HANDEL_GOOGLE_SA_KEY_B64: broken })(
      request(validBody()),
    );
    expect(res.status).toBe(503);
    expect(logs).toEqual(["config inválida: HANDEL_GOOGLE_SA_KEY_B64"]);
  });

  test("JSON roto: 503 sin fragmentos en el log", async () => {
    const brokenJson = `{"client_email": "fuga@x.example", "private_key": "${pem("SECRETO")}`;
    const value = Buffer.from(brokenJson).toString("base64");
    const res = await handler(mockFetch(), { ...baseEnv(), HANDEL_GOOGLE_SA_KEY_B64: value })(
      request(validBody()),
    );
    expect(res.status).toBe(503);
    expect(logs).toEqual(["config inválida: HANDEL_GOOGLE_SA_KEY_B64"]);
    expect(logs.join("")).not.toContain("SECRETO");
    expect(logs.join("")).not.toContain("fuga");
  });

  test("llave con PEM inválido dentro de un JSON válido: 503 sin llamar a Google", async () => {
    const value = Buffer.from(
      JSON.stringify({
        client_email: SA_EMAIL,
        private_key: pem("AAAA"),
      }),
    ).toString("base64");
    const mock = mockFetch();
    const res = await handler(mock, { ...baseEnv(), HANDEL_GOOGLE_SA_KEY_B64: value })(
      request(validBody()),
    );
    expect(res.status).toBe(503);
    expect(logs).toEqual(["config inválida: HANDEL_GOOGLE_SA_KEY_B64"]);
    expect(mock.calls.length).toBe(0);
  });

  test("llave pegada con saltos de línea y salto final: se acepta", async () => {
    const wrapped = `${keyB64.match(/.{1,76}/g)!.join("\n")}\n`;
    const res = await handler(mockFetch(), { ...baseEnv(), HANDEL_GOOGLE_SA_KEY_B64: wrapped })(
      request(validBody()),
    );
    expect(res.status).toBe(200);
  });
});

describe("origin", () => {
  const previewEnv = () => ({
    ...baseEnv(),
    VERCEL_ENV: "preview",
    VERCEL_URL: "handel-minimal-web-abc123.vercel.app",
    VERCEL_BRANCH_URL: "handel-minimal-web-git-feat-x.vercel.app",
  });
  // The runtime may rebuild request.url with another scheme or host.
  const internalUrl = "http://localhost/api/contacto";

  test("preview: acepta el origen del propio deployment y lo marca en el log", async () => {
    for (const origin of [
      "https://handel-minimal-web-abc123.vercel.app",
      "https://handel-minimal-web-git-feat-x.vercel.app",
    ]) {
      const res = await handler(
        mockFetch(),
        previewEnv(),
      )(request(validBody(), { origin, url: internalUrl }));
      expect(res.status).toBe(200);
    }
    const entries = eventLogs();
    expect(entries.length).toBe(2);
    expect(entries.every((e) => e["originRule"] === "preview")).toBe(true);
  });

  test("preview: rechaza un origen ajeno sin loguear su valor", async () => {
    const mock = mockFetch();
    const res = await handler(
      mock,
      previewEnv(),
    )(request(validBody(), { origin: "https://evil-handel.vercel.app", url: internalUrl }));
    expect(res.status).toBe(403);
    expect(mock.calls.length).toBe(0);
    expect(eventLogs()).toEqual([
      { evt: "contacto", cid: expect.stringMatching(uuidV4), stage: "origin", status: 403 },
    ]);
    expect(logs.join("")).not.toContain("evil");
  });

  test("production: la regla de preview no aplica; sigue sólo el mismo origen", async () => {
    const env = { ...previewEnv(), VERCEL_ENV: "production" };
    const foreign = await handler(
      mockFetch(),
      env,
    )(
      request(validBody(), {
        origin: "https://handel-minimal-web-abc123.vercel.app",
        url: internalUrl,
      }),
    );
    expect(foreign.status).toBe(403);
    const same = await handler(mockFetch(), env)(request(validBody()));
    expect(same.status).toBe(200);
    expect(eventLogs().at(-1)!["originRule"]).toBeUndefined();
  });

  test("origen ajeno sin variables de Vercel (Lovable, dev): 403", async () => {
    const res = await handler(mockFetch())(
      request(validBody(), { origin: "https://otro.example" }),
    );
    expect(res.status).toBe(403);
  });
});

describe("submissionId en el cliente", () => {
  test("usa crypto.randomUUID cuando existe", () => {
    expect(newSubmissionId()).toMatch(uuidV4);
  });

  test("fallback con getRandomValues genera un v4 válido", () => {
    const legacy = { getRandomValues: crypto.getRandomValues.bind(crypto) } as unknown as Crypto;
    const ids = new Set(Array.from({ length: 200 }, () => newSubmissionId(legacy)));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id).toMatch(uuidV4);
  });
});
