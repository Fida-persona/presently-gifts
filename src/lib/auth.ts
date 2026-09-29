import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SESSION_SECRET || "gifts-dev-secret-change-me";
export const ADMIN_COOKIE = "gifts_admin_session";
export const CUSTOMER_COOKIE = "gifts_customer_session";
const ADMIN_MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours
export const CUSTOMER_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

function createToken(payload: Record<string, unknown>, maxAgeMs: number): string {
  const body = JSON.stringify({ ...payload, exp: Date.now() + maxAgeMs });
  const b64 = Buffer.from(body).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

function verifyToken<T extends Record<string, unknown>>(
  token: string | undefined | null
): (T & { exp: number }) | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expectedSig = sign(b64);
  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    return payload as T & { exp: number };
  } catch {
    return null;
  }
}

// ---------- Admin ----------
export function createSessionToken(): string {
  return createToken({}, ADMIN_MAX_AGE_MS);
}

export function verifySessionToken(token: string | undefined | null): boolean {
  return verifyToken(token) !== null;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  return password === expected;
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

// ---------- Customer ----------
export function createCustomerToken(userId: number): string {
  return createToken({ userId }, CUSTOMER_MAX_AGE_MS);
}

export async function getCurrentUserId(): Promise<number | null> {
  const store = await cookies();
  const payload = verifyToken<{ userId: number }>(store.get(CUSTOMER_COOKIE)?.value);
  return payload ? payload.userId : null;
}
