// Signs/verifies the login-gate cookie using Web Crypto (crypto.subtle),
// which is available in both the Node and Edge runtimes — unlike node:crypto,
// so this same code works whichever runtime the proxy ends up running in.

export const SESSION_COOKIE_NAME = "cs_session";
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionCookieValue(): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return hmacSha256Hex(secret, "authenticated");
}

export async function isValidSessionCookie(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const expected = await createSessionCookieValue();
  if (value.length !== expected.length) return false;
  // Constant-time comparison to avoid leaking the expected value via timing.
  let mismatch = 0;
  for (let i = 0; i < value.length; i++) {
    mismatch |= value.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
