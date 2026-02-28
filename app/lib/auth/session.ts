export type SessionPayload = {
  u: string;
  exp: number; // unix seconds
};

const COOKIE_NAME = "schs_session";
const ONE_WEEK_S = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || "";
  // نفس القيمة الافتراضية اللي حاططها بـ .env.local
  return secret || "dev-secret-change-me";
}

function base64urlEncodeBytes(bytes: Uint8Array): string {
  // Works in Node + Edge
  let b64 = "";
  if (typeof Buffer !== "undefined") {
    b64 = Buffer.from(bytes).toString("base64");
  } else {
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    b64 = btoa(bin);
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecodeToBytes(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSHA256(message: string, secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

export async function signValue(value: string): Promise<string> {
  const secret = getSecret();
  const sig = await hmacSHA256(value, secret);
  return base64urlEncodeBytes(sig);
}

export async function verifySignedValue(value: string, signature: string): Promise<boolean> {
  const expected = await signValue(value);
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionCookie(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + ONE_WEEK_S,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64urlEncodeBytes(new TextEncoder().encode(payloadJson));
  const sig = await signValue(payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function readSessionCookie(cookieValue: string | undefined | null): Promise<SessionPayload | null> {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const ok = await verifySignedValue(payloadB64, sig);
  if (!ok) return null;
  try {
    const bytes = base64urlDecodeToBytes(payloadB64);
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as SessionPayload;
    if (!payload?.u || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}
