import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
export type Role = "admin" | "staff" | "viewer";
export type Session = { role: Role; exp: number };
export function configured() {
  return (
    !!process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32 &&
    !!process.env.ADMIN_PASSWORD_HASH
  );
}
export function verifyPassword(password: string, encoded: string) {
  try {
    const [salt, hash] = encoded.split(":");
    if (!salt || !hash || hash.length !== 128) return false;
    return timingSafeEqual(
      scryptSync(password, salt, 64),
      Buffer.from(hash, "hex"),
    );
  } catch {
    return false;
  }
}
export function signSession(role: Role) {
  const payload = Buffer.from(
    JSON.stringify({ role, exp: Date.now() + 8 * 60 * 60 * 1000 }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url")}`;
}
export function readSession(token?: string): Session | null {
  if (!configured() || !token) return null;
  try {
    const [payload, sig] = token.split(".");
    const expected = createHmac("sha256", process.env.SESSION_SECRET!)
      .update(payload)
      .digest();
    const actual = Buffer.from(sig, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      !["admin", "staff", "viewer"].includes(data.role) ||
      data.exp < Date.now()
    )
      return null;
    return data;
  } catch {
    return null;
  }
}
export function sessionFromRequest(req: Request) {
  const cookie = req.headers
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("dk_session="))
    ?.slice(11);
  return readSession(cookie);
}
